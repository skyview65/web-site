"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { KeyRound, Loader2, Mic, SendHorizontal, Square, Trash2 } from "lucide-react";

import type {
  WhisperLanguage,
  WorkerRequest,
  WorkerResponse,
} from "@/lib/dictation/protocol";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const API_KEY_STORAGE = "sohbet.apikey.v1";
const MODEL_STORAGE = "sohbet.model.v1";
const HISTORY_LIMIT = 20; // API'ye gönderilen geçmiş mesaj sayısı (maliyet kontrolü)

const MODELS = [
  { id: "claude-fable-5", label: "Fable 5" },
  { id: "claude-opus-4-8", label: "Opus 4.8" },
  { id: "claude-sonnet-5", label: "Sonnet 5" },
  { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5" },
] as const;

const SYSTEM_PROMPT =
  "Sen yardımsever, samimi bir Türkçe asistansın. Kullanıcı sesle dikte ederek yazıyor olabilir; küçük dikte hatalarını anlayışla karşıla. Kısa ve net yanıt ver.";

export function ChatApp() {
  const [apiKey, setApiKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [keyChecked, setKeyChecked] = useState(false);
  const [model, setModel] = useState<string>(MODELS[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sesle giriş (yerel Whisper) — isteğe bağlı, ilk mikrofon dokunuşunda kurulur
  const workerRef = useRef<Worker | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [voiceState, setVoiceState] = useState<
    "idle" | "loading" | "recording" | "transcribing"
  >("idle");
  const [voiceProgress, setVoiceProgress] = useState<string | null>(null);
  const language: WhisperLanguage = "turkish";

  const listRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE) ?? "";
    const storedModel = localStorage.getItem(MODEL_STORAGE);
    const frame = requestAnimationFrame(() => {
      setApiKey(stored);
      if (storedModel && MODELS.some((m) => m.id === storedModel)) {
        setModel(storedModel);
      }
      setKeyChecked(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const saveKey = useCallback(() => {
    const value = keyInput.trim();
    if (!value.startsWith("sk-ant-")) {
      setError('Anahtar "sk-ant-" ile başlamalı.');
      return;
    }
    localStorage.setItem(API_KEY_STORAGE, value);
    setApiKey(value);
    setKeyInput("");
    setError(null);
  }, [keyInput]);

  const forgetKey = useCallback(() => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey("");
    setMessages([]);
  }, []);

  const send = useCallback(async () => {
    const content = input.trim();
    if (!content || sending) return;
    setError(null);
    setInput("");
    setSending(true);
    const history: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        signal: controller.signal,
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model,
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: history.slice(-HISTORY_LIMIT),
          stream: true,
        }),
      });
      if (!response.ok || !response.body) {
        const detail = await response.text().catch(() => "");
        throw new Error(
          response.status === 401
            ? "API anahtarı geçersiz görünüyor. Alttaki bağlantıdan anahtarı yenileyebilirsin."
            : `API hatası (${response.status}): ${detail.slice(0, 160)}`
        );
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6)) as {
              type: string;
              delta?: { type: string; text?: string };
              error?: { message?: string };
            };
            if (event.type === "content_block_delta" && event.delta?.text) {
              const text = event.delta.text;
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                next[next.length - 1] = {
                  ...last,
                  content: last.content + text,
                };
                return next;
              });
            } else if (event.type === "error") {
              throw new Error(event.error?.message ?? "Akış hatası");
            }
          } catch (parseError) {
            if (parseError instanceof Error && parseError.message !== "") {
              // JSON.parse hataları sessizce atlanır; API hata olayları yükseltilir
              if (!(parseError instanceof SyntaxError)) throw parseError;
            }
          }
        }
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setError(err instanceof Error ? err.message : String(err));
        // Boş kalan asistan balonunu kaldır
        setMessages((prev) =>
          prev[prev.length - 1]?.role === "assistant" &&
          prev[prev.length - 1].content === ""
            ? prev.slice(0, -1)
            : prev
        );
      }
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }, [apiKey, input, messages, model, sending]);

  // ── Sesle giriş: yerel Whisper worker'ı (dikteyle aynı) ────────────
  const ensureVoiceWorker = useCallback(() => {
    if (workerRef.current) return;
    const worker = new Worker(
      new URL("../lib/dictation/dictation.worker.ts", import.meta.url),
      { type: "module" }
    );
    worker.addEventListener("message", (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      if (message.type === "progress") {
        setVoiceProgress(`model indiriliyor · %${Math.round(message.progress)}`);
      } else if (message.type === "status") {
        setVoiceProgress(message.message);
      } else if (message.type === "ready") {
        setVoiceProgress(null);
        setVoiceState("idle");
      } else if (message.type === "result") {
        setVoiceState("idle");
        setVoiceProgress(null);
        if (message.text.trim()) {
          setInput((prev) =>
            prev ? `${prev} ${message.text.trim()}` : message.text.trim()
          );
        }
      } else if (message.type === "error") {
        setVoiceState("idle");
        setVoiceProgress(null);
        setError(message.message);
      }
    });
    worker.addEventListener("error", (event) => {
      setVoiceState("idle");
      setVoiceProgress(null);
      setError(event.message || "Ses işleyicisi başlatılamadı.");
    });
    workerRef.current = worker;
    const request: WorkerRequest = { type: "load" };
    worker.postMessage(request);
  }, []);

  const toggleVoice = useCallback(async () => {
    if (voiceState === "recording") {
      recorderRef.current?.stop();
      recorderRef.current = null;
      return;
    }
    if (voiceState !== "idle") return;
    setError(null);
    if (!workerRef.current) {
      setVoiceState("loading");
      ensureVoiceWorker();
      return; // model hazır olunca kullanıcı tekrar dokunur
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      });
      recorder.addEventListener("stop", () => {
        stream.getTracks().forEach((track) => track.stop());
        setVoiceState("transcribing");
        void (async () => {
          try {
            const buffer = await new Blob(chunksRef.current).arrayBuffer();
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
            const request: WorkerRequest = { type: "transcribe", audio, language };
            workerRef.current?.postMessage(request);
          } catch {
            setVoiceState("idle");
            setError("Ses çözümlenemedi, lütfen tekrar deneyin.");
          }
        })();
      });
      recorder.start();
      recorderRef.current = recorder;
      setVoiceState("recording");
    } catch {
      setError("Mikrofona erişilemedi. Tarayıcı izinlerini kontrol edin.");
    }
  }, [ensureVoiceWorker, language, voiceState]);

  if (!keyChecked) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-black text-zinc-100">
        <Loader2 className="size-6 animate-spin text-zinc-600 motion-reduce:animate-none" aria-label="Yükleniyor" />
      </main>
    );
  }

  // ── API anahtarı kapısı ─────────────────────────────────────────────
  if (!apiKey) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-black px-5 py-14 font-sans text-zinc-100">
        <header className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-5xl font-normal tracking-wide text-zinc-50 font-[family-name:var(--font-italiana)]">
            Sohbet
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
            Fable 5 ile konuş: sesin cihazında yazıya dökülür, yanıtlar Claude
            API&apos;den gelir.
          </p>
        </header>
        <section
          aria-label="API anahtarı"
          className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 px-8 py-10"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
            <KeyRound className="size-5" aria-hidden />
          </span>
          <p className="text-center text-sm leading-relaxed text-zinc-400">
            Kendi Anthropic API anahtarını gir. Anahtar{" "}
            <strong className="text-zinc-200">yalnızca bu tarayıcıda</strong>{" "}
            saklanır; hiçbir sunucuya gönderilmez.
          </p>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              saveKey();
            }}
          >
            <input
              type="password"
              autoComplete="off"
              value={keyInput}
              onChange={(event) => setKeyInput(event.target.value)}
              placeholder="sk-ant-..."
              aria-label="Anthropic API anahtarı"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 outline-none transition-colors duration-200 placeholder:text-zinc-600 focus:border-emerald-500/60 motion-reduce:transition-none"
            />
            {error && (
              <p role="alert" className="text-xs text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 transition duration-200 hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 active:scale-[0.98] motion-reduce:transition-none"
            >
              Kaydet ve başla
            </button>
          </form>
          <p className="text-center text-[11px] leading-relaxed text-zinc-600">
            Anahtarın yoksa{" "}
            <a
              className="text-emerald-400/80 underline underline-offset-2"
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noreferrer"
            >
              console.anthropic.com
            </a>{" "}
            adresinden ücretsiz oluşturabilirsin (kullanım API bakiyenden düşer).
          </p>
        </section>
      </main>
    );
  }

  // ── Sohbet ekranı ───────────────────────────────────────────────────
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col bg-black px-4 py-6 font-sans text-zinc-100">
      <header className="flex items-center justify-between gap-3 pb-4">
        <h1 className="text-3xl font-normal tracking-wide text-zinc-50 font-[family-name:var(--font-italiana)]">
          Sohbet
        </h1>
        <div className="flex items-center gap-2">
          <select
            value={model}
            onChange={(event) => {
              setModel(event.target.value);
              localStorage.setItem(MODEL_STORAGE, event.target.value);
            }}
            aria-label="Model"
            className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 outline-none focus:border-emerald-500/60"
          >
            {MODELS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={forgetKey}
            className="cursor-pointer rounded-full border border-zinc-800 px-3 py-1.5 text-xs text-zinc-500 transition-colors duration-200 hover:text-zinc-200 motion-reduce:transition-none"
          >
            Anahtarı unut
          </button>
        </div>
      </header>

      <div
        ref={listRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-4"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <p className="m-auto max-w-xs text-center text-sm leading-relaxed text-zinc-600">
            Yaz ya da mikrofona dokunup konuş — Fable 5 yanıtlasın.
          </p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap",
              message.role === "user"
                ? "self-end bg-emerald-500/15 text-emerald-50"
                : "self-start bg-zinc-800/70 text-zinc-100"
            )}
          >
            {message.content ||
              (sending && index === messages.length - 1 ? (
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-label="Yanıt bekleniyor" />
              ) : (
                message.content
              ))}
          </div>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
        >
          {error}
        </p>
      )}
      {voiceProgress && (
        <p className="mt-3 text-center text-xs text-zinc-500">{voiceProgress}</p>
      )}

      <form
        className="mt-3 flex items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <button
          type="button"
          onClick={() => void toggleVoice()}
          disabled={voiceState === "transcribing" || voiceState === "loading"}
          aria-label={
            voiceState === "recording" ? "Kaydı durdur" : "Sesle yaz (yerel Whisper)"
          }
          className={cn(
            "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait motion-reduce:transition-none",
            voiceState === "recording"
              ? "bg-red-500 text-white hover:bg-red-400 focus-visible:outline-red-400"
              : "border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-emerald-300 focus-visible:outline-emerald-400"
          )}
        >
          {voiceState === "transcribing" || voiceState === "loading" ? (
            <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : voiceState === "recording" ? (
            <Square className="size-4 fill-current" aria-hidden />
          ) : (
            <Mic className="size-5" aria-hidden />
          )}
        </button>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send();
            }
          }}
          rows={1}
          placeholder="Mesajın…"
          aria-label="Mesaj"
          className="max-h-40 min-h-11 flex-1 resize-y rounded-2xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-[15px] leading-relaxed text-zinc-100 outline-none transition-colors duration-200 placeholder:text-zinc-600 focus:border-emerald-500/50 motion-reduce:transition-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          aria-label="Gönder"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-emerald-500 text-emerald-950 transition duration-200 hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
        >
          {sending ? (
            <Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden />
          ) : (
            <SendHorizontal className="size-5" aria-hidden />
          )}
        </button>
      </form>

      <footer className="mt-3 flex items-center justify-between text-[11px] text-zinc-600">
        <span>Ses cihazında işlenir · yanıtlar Claude API&apos;den</span>
        <button
          type="button"
          onClick={() => setMessages([])}
          disabled={messages.length === 0}
          className="inline-flex cursor-pointer items-center gap-1 text-zinc-600 transition-colors duration-200 hover:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
        >
          <Trash2 className="size-3" aria-hidden />
          Sohbeti temizle
        </button>
      </footer>
    </main>
  );
}
