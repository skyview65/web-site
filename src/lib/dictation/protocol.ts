// Not: transformers.js Whisper için otomatik dil algılamayı desteklemiyor
// (boş dil sessizce İngilizce'ye düşer), bu yüzden dil her zaman açıkça seçilir.
export type WhisperLanguage = "turkish" | "english";

export type WorkerRequest =
  | { type: "load" }
  | { type: "transcribe"; audio: Float32Array; language: WhisperLanguage };

export type WorkerResponse =
  | { type: "status"; message: string }
  | { type: "progress"; file: string; progress: number }
  | { type: "ready"; device: "webgpu" | "wasm" }
  | { type: "result"; text: string }
  | { type: "error"; message: string };
