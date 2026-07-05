// Web Worker: Whisper transkripsiyonunu ana thread dışında çalıştırır.
// Model ilk yüklemede bir kez indirilir ve tarayıcı önbelleğinde kalır;
// ses verisi hiçbir zaman bu worker'ın dışına (ağa) çıkmaz.
import {
  pipeline,
  type AutomaticSpeechRecognitionPipeline,
} from "@huggingface/transformers";

import type { WorkerRequest, WorkerResponse } from "./protocol";

const MODEL_ID = "onnx-community/whisper-base";

const scope = self as unknown as {
  postMessage: (message: WorkerResponse) => void;
  addEventListener: (
    type: "message",
    listener: (event: MessageEvent<WorkerRequest>) => void
  ) => void;
};

let device: "webgpu" | "wasm" = "wasm";
let loading: Promise<AutomaticSpeechRecognitionPipeline> | null = null;

// WebGPU'yu pipeline kurmadan ÖNCE yokluyoruz: transformers.js, başarısız bir
// webgpu denemesinden sonra oturum kurulum zincirini (webInitChain) reddedilmiş
// bırakıyor ve sonraki wasm denemesi de aynı hatayı miras alıyor. Adaptörü
// baştan sorgulamak bu duruma hiç düşmemeyi sağlar.
async function detectDevice(): Promise<"webgpu" | "wasm"> {
  const nav = navigator as unknown as {
    gpu?: { requestAdapter: () => Promise<unknown | null> };
  };
  if (!nav.gpu) return "wasm";
  try {
    return (await nav.gpu.requestAdapter()) ? "webgpu" : "wasm";
  } catch {
    return "wasm";
  }
}

function reportProgress(item: unknown): void {
  if (typeof item !== "object" || item === null) return;
  const data = item as { status?: string; file?: string; progress?: number };
  if (
    data.status === "progress" &&
    typeof data.file === "string" &&
    typeof data.progress === "number"
  ) {
    scope.postMessage({ type: "progress", file: data.file, progress: data.progress });
  }
}

function createPipeline(
  targetDevice: "webgpu" | "wasm"
): Promise<AutomaticSpeechRecognitionPipeline> {
  return pipeline("automatic-speech-recognition", MODEL_ID, {
    device: targetDevice,
    // Not: q8 decoder, paketle gelen onnxruntime-web sürümünde oturum
    // oluşturmada başarısız oluyor (Missing required scale / MatMulNBits);
    // q4 her iki cihazda da sorunsuz.
    dtype:
      targetDevice === "webgpu"
        ? { encoder_model: "fp32", decoder_model_merged: "q4" }
        : { encoder_model: "q8", decoder_model_merged: "q4" },
    progress_callback: reportProgress,
  });
}

function load(): Promise<AutomaticSpeechRecognitionPipeline> {
  if (!loading) {
    loading = (async () => {
      device = await detectDevice();
      scope.postMessage({
        type: "status",
        message: `Whisper modeli yükleniyor (${device})…`,
      });
      let transcriber: AutomaticSpeechRecognitionPipeline;
      try {
        transcriber = await createPipeline(device);
      } catch (error) {
        if (device !== "webgpu") throw error;
        device = "wasm";
        scope.postMessage({
          type: "status",
          message: "WebGPU başlatılamadı, WASM'a geçiliyor…",
        });
        transcriber = await createPipeline("wasm");
      }
      scope.postMessage({ type: "ready", device });
      return transcriber;
    })().catch((error: unknown) => {
      loading = null; // bir sonraki denemede yeniden yüklenebilsin
      throw error;
    });
  }
  return loading;
}

async function handle(request: WorkerRequest): Promise<void> {
  try {
    if (request.type === "load") {
      await load();
      return;
    }
    const transcriber = await load();
    const output = await transcriber(request.audio, {
      language: request.language,
      task: "transcribe",
      chunk_length_s: 30,
    });
    const text = (Array.isArray(output) ? output : [output])
      .map((chunk) => chunk.text)
      .join(" ")
      .trim();
    scope.postMessage({ type: "result", text });
  } catch (error) {
    scope.postMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

scope.addEventListener("message", (event) => {
  void handle(event.data);
});
