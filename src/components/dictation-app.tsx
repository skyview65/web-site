"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Loader2, Mic, Square, Trash2 } from "lucide-react";

import { stripFillers } from "@/lib/dictation/fillers";
import type {
  WhisperLanguage,
  WorkerRequest,
  WorkerResponse,
} from "@/lib/dictation/protocol";
import { cn } from "@/lib/utils";

type ModelState = "idle" | "loading" | "ready";

const LANGUAGES: { value: WhisperLanguage; label: string }[] = [
  { value: "auto", label: "Otomatik algıla" },
  { value: "turkish", label: "Türkçe" },
  { value: "english", label: "English" },
];

export function DictationApp() {
  const workerRef = useRef<Worker | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const languageRef = useRef<WhisperLanguage>("auto");
  const cleanRef = useRef(true);

  const [modelState, setModelState] = useState<ModelState>("idle");
  const [device, setDevice] = useState<"webgpu" | "wasm" | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [language, setLanguage] = useState<WhisperLanguage>("auto");
  const [cleanFillers, setCleanFillers] = useState(true);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  useEffect(() => {
    cleanRef.current = cleanFillers;
  }, [cleanFillers]);

  const post = useCallback((message: WorkerRequest) => {
    workerRef.current?.postMessage(message);
  }, []);

  useEffect(() => {
    const worker = new Worker(
      new URL("../lib/dictation/dictation.worker.ts", import.meta.url),
      { type: "module" }
    );
    worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      switch (message.type) {
        case "status":
          setStatus(message.message);
          break;
        case "progress":
          setProgress((prev) => ({ ...prev, [message.file]: message.progress }));
          break;
        case "ready":
          setModelState("ready");
          setDevice(message.device);
          setStatus(null);
          setProgress({});
          break;
        case "result":
          setTranscribing(false);
          setText((prev) => {
            const cleaned = cleanRef.current
              ? stripFillers(message.text)
              : message.text.trim();
            if (!cleaned) return prev;
            return prev ? `${prev} ${cleaned}` : cleaned;
          });
          break;
        case "error":
          setTranscribing(false);
          setModelState((prev) => (prev === "loading" ? "idle" : prev));
          setError(message.message);
          break;
      }
    });
    workerRef.current = worker;
    return () => {
      worker.terminate();
      workerRef.current = null;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const loadModel = useCallback(() => {
    setError(null);
    setModelState("loading");
    post({ type: "load" });
  }, [post]);

  const transcribeBlob = useCallback(
    async (blob: Blob) => {
      setTranscribing(true);
      try {
        const buffer = await blob.arrayBuffer();
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const decoded = await audioContext.decodeAudioData(buffer);
        await audioContext.close();
        let audio = decoded.getChannelData(0);
        if (decoded.numberOfChannels > 1) {
          const second = decoded.getChannelData(1);
          const mixed = new Float32Array(audio.length);
          for (let i = 0; i < audio.length; i++) {
            mixed[i] = (audio[i] + second[i]) / 2;
          }
          audio = mixed;
        }
        post({ type: "transcribe", audio, language: languageRef.current });
      } catch {
        setTranscribing(false);
        setError("Ses çözümlenemedi, lütfen tekrar deneyin.");
      }
    },
    [post]
  );

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        void transcribeBlob(new Blob(chunksRef.current));
      });
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError(
        "Mikrofona erişilemedi. Tarayıcı izinlerini kontrol edin (adres çubuğundaki kilit simgesi)."
      );
    }
  }, [transcribeBlob]);

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }, []);

  const toggleRecording = useCallback(() => {
    if (modelState !== "ready" || transcribing) return;
    if (recording) {
      stopRecording();
    } else {
      void startRecording();
    }
  }, [modelState, transcribing, recording, startRecording, stopRecording]);

  // Sayfa içi kısayol — masaüstü araçla aynı: Ctrl+Shift+Space
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.code === "Space") {
        event.preventDefault();
        toggleRecording();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleRecording]);

  const copyText = useCallback(async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  const progressEntries = Object.entries(progress);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 font-sans text-zinc-100">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
            %100 yerel · ses tarayıcıdan çıkmaz
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Dikte — Yerel Whisper
          </h1>
          <p className="text-sm leading-relaxed text-zinc-400">
            Wispr Flow&apos;un tarayıcı içi, gizlilik odaklı sürümü. Whisper modeli
            ilk açılışta bir kez indirilir ve cihazında (WebGPU/WASM) çalışır;
            konuşman hiçbir sunucuya gönderilmez. Sistem geneli dikte için{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs">
              local-flow
            </code>{" "}
            masaüstü aracını kullan.
          </p>
        </header>

        <section className="flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          {modelState !== "ready" && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={loadModel}
                disabled={modelState === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {modelState === "loading" && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {modelState === "loading"
                  ? (status ?? "Model yükleniyor…")
                  : "Modeli yükle (~80 MB, bir kez)"}
              </button>
              {progressEntries.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {progressEntries.map(([file, value]) => (
                    <div key={file} className="flex items-center gap-2 text-xs">
                      <span className="w-40 truncate text-zinc-500">{file}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-[width]"
                          style={{ width: `${Math.min(100, value)}%` }}
                        />
                      </div>
                      <span className="w-10 text-right tabular-nums text-zinc-500">
                        {Math.round(Math.min(100, value))}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {modelState === "ready" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  Dil
                  <select
                    value={language}
                    onChange={(event) =>
                      setLanguage(event.target.value as WhisperLanguage)
                    }
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-100 outline-none focus:border-emerald-500"
                  >
                    {LANGUAGES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input
                    type="checkbox"
                    checked={cleanFillers}
                    onChange={(event) => setCleanFillers(event.target.checked)}
                    className="size-4 accent-emerald-500"
                  />
                  Dolgu seslerini temizle
                </label>
                <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs uppercase tracking-wide text-zinc-500">
                  {device}
                </span>
              </div>

              <div className="flex flex-col items-center gap-3 py-2">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={transcribing}
                  aria-label={recording ? "Kaydı durdur" : "Kayda başla"}
                  className={cn(
                    "flex size-20 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-60",
                    recording
                      ? "animate-pulse bg-red-500 text-white hover:bg-red-400"
                      : "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                  )}
                >
                  {transcribing ? (
                    <Loader2 className="size-8 animate-spin" />
                  ) : recording ? (
                    <Square className="size-7" />
                  ) : (
                    <Mic className="size-8" />
                  )}
                </button>
                <p className="text-sm text-zinc-500">
                  {transcribing
                    ? "Transkribe ediliyor…"
                    : recording
                      ? "Dinliyor — bitirmek için tekrar bas"
                      : "Konuşmak için bas veya Ctrl+Shift+Space"}
                </p>
              </div>
            </>
          )}

          {error && (
            <p className="rounded-lg border border-red-900 bg-red-950/50 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-400">Transkript</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setText("")}
                disabled={!text}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="size-3.5" />
                Temizle
              </button>
              <button
                type="button"
                onClick={copyText}
                disabled={!text}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Dikte ettiğin metin burada birikir…"
            rows={8}
            className="w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-emerald-600"
          />
        </section>
      </div>
    </main>
  );
}
