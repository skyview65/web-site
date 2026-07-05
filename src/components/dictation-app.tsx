"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Download,
  Keyboard,
  Loader2,
  Lock,
  LockOpen,
  Mic,
  ShieldCheck,
  Square,
  Trash2,
} from "lucide-react";

import { stripFillers } from "@/lib/dictation/fillers";
import type {
  WhisperLanguage,
  WorkerRequest,
  WorkerResponse,
} from "@/lib/dictation/protocol";
import {
  DictationKeyboard,
  type VirtualKeyAction,
} from "@/components/dictation-keyboard";
import { cn } from "@/lib/utils";

type ModelState = "idle" | "loading" | "ready";
type LockState = "checking" | "setup" | "locked" | "unlocked";

// transformers.js otomatik dil algılamayı desteklemediğinden dil açıkça seçilir.
const LANGUAGES: { value: WhisperLanguage; label: string }[] = [
  { value: "turkish", label: "Türkçe" },
  { value: "english", label: "English" },
];

const LOCK_KEY = "dictation.lock.v1";
const UNLOCK_KEY = "dictation.unlocked";

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function DictationApp({ plain = false }: { plain?: boolean } = {}) {
  const workerRef = useRef<Worker | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const languageRef = useRef<WhisperLanguage>("turkish");
  const cleanRef = useRef(true);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const vizAudioCtxRef = useRef<AudioContext | null>(null);
  const vizRafRef = useRef(0);

  const [lockState, setLockState] = useState<LockState>("checking");
  // Süslemeler (aurora, parıltı, nefes animasyonu) iOS Safari'de sekme
  // çökmesine yol açabildiğinden statik HTML'de kapalı başlar; hydration
  // sonrası yalnızca iOS DIŞI cihazlarda açılır.
  const [fancy, setFancy] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [lockError, setLockError] = useState<string | null>(null);

  const [modelState, setModelState] = useState<ModelState>("idle");
  const [device, setDevice] = useState<"webgpu" | "wasm" | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [language, setLanguage] = useState<WhisperLanguage>("turkish");
  const [cleanFillers, setCleanFillers] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);
  useEffect(() => {
    cleanRef.current = cleanFillers;
  }, [cleanFillers]);

  // ── Cihaz kilidi: parola karması yalnızca bu tarayıcıda saklanır ──
  useEffect(() => {
    const stored = localStorage.getItem(LOCK_KEY);
    const next: LockState = !stored
      ? "setup"
      : sessionStorage.getItem(UNLOCK_KEY) === "1"
        ? "unlocked"
        : "locked";
    const isIOS =
      /iP(hone|ad|od)/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    // Hydration sonrası tek seferlik depo senkronu (sync setState kaskadından kaçın)
    const frame = requestAnimationFrame(() => {
      setLockState(next);
      if (!isIOS) setFancy(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleLockSubmit = useCallback(async () => {
    const value = passphrase.trim();
    if (lockState === "setup") {
      if (value.length < 4) {
        setLockError("Parola en az 4 karakter olmalı.");
        return;
      }
      const salt = crypto.randomUUID();
      const hash = await sha256Hex(salt + value);
      localStorage.setItem(LOCK_KEY, JSON.stringify({ salt, hash }));
      sessionStorage.setItem(UNLOCK_KEY, "1");
      setPassphrase("");
      setLockError(null);
      setLockState("unlocked");
      return;
    }
    try {
      const { salt, hash } = JSON.parse(
        localStorage.getItem(LOCK_KEY) ?? "{}"
      ) as { salt?: string; hash?: string };
      if (salt && hash && (await sha256Hex(salt + value)) === hash) {
        sessionStorage.setItem(UNLOCK_KEY, "1");
        setPassphrase("");
        setLockError(null);
        setLockState("unlocked");
      } else {
        setLockError("Parola yanlış.");
      }
    } catch {
      setLockError("Kilit verisi okunamadı; kilidi sıfırlayıp yeniden kur.");
    }
  }, [lockState, passphrase]);

  const removeLock = useCallback(() => {
    localStorage.removeItem(LOCK_KEY);
    sessionStorage.removeItem(UNLOCK_KEY);
    setLockState("setup");
  }, []);

  // ── Kayıt süresi göstergesi (sıfırlama kayıt başlangıcındaki handler'da) ──
  useEffect(() => {
    if (!recording) return;
    const started = Date.now();
    const timer = setInterval(
      () => setElapsed(Math.floor((Date.now() - started) / 1000)),
      1000
    );
    return () => clearInterval(timer);
  }, [recording]);

  const post = useCallback((message: WorkerRequest) => {
    workerRef.current?.postMessage(message);
  }, []);

  // Worker tembel oluşturulur: transformers.js yığını ağırdır ve sayfa
  // açılışında yüklemek düşük bellekli cihazlarda (iOS Safari) sekmeyi
  // çökertebilir. "Modeli indir"e basılana kadar hiçbir şey yüklenmez.
  const ensureWorker = useCallback(() => {
    if (workerRef.current) return;
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
          setProgress({});
          setError(message.message);
          break;
      }
    });
    worker.addEventListener("error", (event) => {
      // Worker'ın kendisi başlatılamazsa (chunk yüklenemedi vb.) UI kilitli kalmasın.
      setTranscribing(false);
      setModelState((prev) => (prev === "loading" ? "idle" : prev));
      setProgress({});
      setError(event.message || "Arka plan işleyicisi başlatılamadı.");
    });
    workerRef.current = worker;
  }, []);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      cancelAnimationFrame(vizRafRef.current);
      void vizAudioCtxRef.current?.close().catch(() => undefined);
    };
  }, []);

  const loadModel = useCallback(() => {
    setError(null);
    setModelState("loading");
    ensureWorker();
    post({ type: "load" });
  }, [ensureWorker, post]);

  // ── Ses-reaktif dairesel görselleştirici ──────────────────────────
  const startVisualizer = useCallback((stream: MediaStream) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const audioCtx = new AudioContext();
    vizAudioCtxRef.current = audioCtx;
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.78;
    audioCtx.createMediaStreamSource(stream).connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const size = 288;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const center = size / 2;
    const inner = 68;
    const bars = 56;

    const draw = () => {
      analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, size, size);
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      for (let i = 0; i < bars; i++) {
        const value = data[Math.floor((i * data.length) / bars)] / 255;
        const length = 4 + value * 44;
        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        ctx.strokeStyle = `rgba(248, 113, 113, ${0.22 + value * 0.78})`;
        ctx.beginPath();
        ctx.moveTo(center + cos * inner, center + sin * inner);
        ctx.lineTo(center + cos * (inner + length), center + sin * (inner + length));
        ctx.stroke();
      }
      vizRafRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, []);

  const stopVisualizer = useCallback(() => {
    cancelAnimationFrame(vizRafRef.current);
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    void vizAudioCtxRef.current?.close().catch(() => undefined);
    vizAudioCtxRef.current = null;
  }, []);

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
        stopVisualizer();
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        // Kayıt kendiliğinden de durabilir (mikrofon izni geri çekildi vb.)
        setRecording(false);
        void transcribeBlob(new Blob(chunksRef.current));
      });
      recorder.start();
      recorderRef.current = recorder;
      startVisualizer(stream);
      setElapsed(0);
      setRecording(true);
    } catch {
      setError(
        "Mikrofona erişilemedi. Tarayıcı izinlerini kontrol edin (adres çubuğundaki kilit simgesi)."
      );
    }
  }, [transcribeBlob, startVisualizer, stopVisualizer]);

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

  // Sayfa içi kısayol: Ctrl+Shift+Space
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

  // ── Ekran klavyesi: imleç konumuna yazar ──────────────────────────
  const applyVirtualKey = useCallback((action: VirtualKeyAction) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    let caret = start;
    setText((prev) => {
      if (action.type === "backspace") {
        if (start !== end) {
          caret = start;
          return prev.slice(0, start) + prev.slice(end);
        }
        if (start === 0) return prev;
        caret = start - 1;
        return prev.slice(0, start - 1) + prev.slice(end);
      }
      const ch =
        action.type === "char" ? action.value : action.type === "enter" ? "\n" : " ";
      caret = start + ch.length;
      return prev.slice(0, start) + ch + prev.slice(end);
    });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }, []);

  const progressValues = Object.values(progress);
  const overallProgress =
    progressValues.length > 0
      ? Math.min(
          100,
          progressValues.reduce((sum, value) => sum + value, 0) /
            progressValues.length
        )
      : 0;
  const currentFile = Object.entries(progress)
    .filter(([, value]) => value < 100)
    .map(([file]) => file.split("/").pop())
    .at(0);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <main className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-black px-5 py-14 font-sans text-zinc-100 selection:bg-emerald-400/30">
      {/* Aurora zemin — yalnızca transform/opacity animasyonu; iOS ve plain modda hiç yok */}
      {!plain && fancy && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* filter: blur iOS Safari'de GPU belleğini tüketip sekmeyi çökertebiliyor;
              radial-gradient aynı yumuşak parıltıyı bedavaya verir */}
          <div className="dictation-aurora absolute -top-32 left-1/2 h-[28rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.17),transparent_72%)] [animation:dictation-aurora_14s_ease-in-out_infinite]" />
          <div className="dictation-aurora-alt absolute top-40 -left-40 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(20,184,166,0.12),transparent_72%)] [animation:dictation-aurora-alt_18s_ease-in-out_infinite]" />
          <div className="dictation-aurora-alt absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.12),transparent_72%)] [animation:dictation-aurora_22s_ease-in-out_infinite_reverse]" />
        </div>
      )}

      <div className="relative flex w-full max-w-xl flex-1 flex-col items-center gap-9">
        {/* Başlık */}
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300 backdrop-blur">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            %100 yerel — ses cihazından çıkmaz
          </span>
          <h1
            className={cn(
              "text-6xl font-normal tracking-wide font-[family-name:var(--font-italiana)]",
              !plain && fancy
                ? "dictation-shimmer bg-[linear-gradient(110deg,#fafafa_35%,#34d399_50%,#fafafa_65%)] bg-[length:200%_100%] bg-clip-text text-transparent [animation:dictation-shimmer_6s_linear_infinite]"
                : "text-zinc-50"
            )}
          >
            Dikte
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
            Konuş, yaz(ıl)sın. Whisper tarayıcında çalışır; hiçbir şey sunucuya
            gönderilmez.
          </p>
        </header>

        {lockState === "checking" ? (
          <div className="flex flex-1 items-center">
            <Loader2
              className="size-6 animate-spin text-zinc-600 motion-reduce:animate-none"
              aria-label="Yükleniyor"
            />
          </div>
        ) : lockState !== "unlocked" ? (
          /* ── Kilit kapısı: yalnızca parolayı bilen kullanır ── */
          <section
            aria-label="Kilit"
            className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 px-8 py-10 backdrop-blur"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <Lock className="size-5" aria-hidden />
            </span>
            <div className="flex flex-col items-center gap-1 text-center">
              <h2 className="text-lg font-medium">
                {lockState === "setup" ? "Kilidini kur" : "Kilitli"}
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400">
                {lockState === "setup"
                  ? "Bu sayfayı yalnızca sen kullanabil diye bir parola belirle."
                  : "Devam etmek için parolanı gir."}
              </p>
            </div>
            <form
              className="flex w-full flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void handleLockSubmit();
              }}
            >
              <label
                htmlFor="lock-pass"
                className="text-xs font-medium text-zinc-400"
              >
                Parola
              </label>
              <input
                id="lock-pass"
                type="password"
                autoComplete={
                  lockState === "setup" ? "new-password" : "current-password"
                }
                value={passphrase}
                onChange={(event) => setPassphrase(event.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 outline-none transition-colors duration-200 placeholder:text-zinc-600 focus:border-emerald-500/60 motion-reduce:transition-none"
                placeholder={lockState === "setup" ? "En az 4 karakter" : "••••••••"}
              />
              {lockError && (
                <p role="alert" className="text-xs text-red-400">
                  {lockError}
                </p>
              )}
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition duration-200 hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 active:scale-[0.98] motion-reduce:transition-none"
              >
                <ShieldCheck className="size-4" aria-hidden />
                {lockState === "setup" ? "Kilidi oluştur" : "Kilidi aç"}
              </button>
            </form>
            <p className="text-center text-[11px] leading-relaxed text-zinc-600">
              Parolan sunucuya gitmez; karması yalnızca bu tarayıcıda saklanır.
            </p>
          </section>
        ) : (
          <>
            {/* Model kapısı / mikrofon sahnesi */}
            {modelState !== "ready" ? (
              <section
                aria-label="Model kurulumu"
                className="flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 px-8 py-10 backdrop-blur"
              >
                {modelState === "loading" ? (
                  <>
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800"
                      role="progressbar"
                      aria-valuenow={Math.round(overallProgress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-[width] duration-300 ease-out"
                        style={{ width: `${overallProgress}%` }}
                      />
                    </div>
                    <p className="flex items-center gap-2 text-sm text-zinc-400">
                      <Loader2
                        className="size-4 animate-spin motion-reduce:animate-none"
                        aria-hidden
                      />
                      {currentFile
                        ? `${currentFile} · %${Math.round(overallProgress)}`
                        : (status ?? "Model hazırlanıyor…")}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-center text-sm leading-relaxed text-zinc-400">
                      Whisper modeli bir kez indirilir (~80 MB) ve cihazında
                      önbelleğe alınır — sonrası çevrimdışı.
                    </p>
                    <button
                      type="button"
                      onClick={loadModel}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition duration-200 hover:bg-emerald-400 hover:shadow-emerald-400/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 active:scale-[0.98] motion-reduce:transition-none"
                    >
                      <Download className="size-4" aria-hidden />
                      Modeli indir ve başla
                    </button>
                  </>
                )}
              </section>
            ) : (
              <section aria-label="Kayıt" className="flex flex-col items-center gap-5">
                {/* Sahne: görselleştirici halkası + mikrofon */}
                <div className="relative flex size-72 items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 size-full"
                  />
                  {recording && (
                    <span
                      aria-hidden
                      className="absolute size-32 animate-ping rounded-full bg-red-500/20 motion-reduce:animate-none"
                    />
                  )}
                  <button
                    type="button"
                    onClick={toggleRecording}
                    disabled={transcribing}
                    aria-label={recording ? "Kaydı durdur" : "Kayda başla"}
                    className={cn(
                      "relative flex size-28 cursor-pointer items-center justify-center rounded-full transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-95 disabled:cursor-wait motion-reduce:transition-none",
                      recording
                        ? "bg-red-500 text-white shadow-xl shadow-red-500/40 hover:bg-red-400 focus-visible:outline-red-400"
                        : cn(
                            "bg-emerald-500 text-emerald-950 hover:scale-105 hover:bg-emerald-400 focus-visible:outline-emerald-400",
                            !plain && fancy
                              ? "dictation-breathe [animation:dictation-breathe_4s_ease-in-out_infinite]"
                              : "shadow-xl shadow-emerald-500/25"
                          )
                    )}
                  >
                    {transcribing ? (
                      <Loader2
                        className="size-10 animate-spin motion-reduce:animate-none"
                        aria-hidden
                      />
                    ) : recording ? (
                      <Square className="size-9 fill-current" aria-hidden />
                    ) : (
                      <Mic className="size-10" aria-hidden />
                    )}
                  </button>
                </div>

                {/* Durum satırı — sabit yükseklik, zıplama yok */}
                <p
                  className="-mt-4 h-5 text-sm text-zinc-400 tabular-nums"
                  role="status"
                  aria-live="polite"
                >
                  {transcribing
                    ? "Yazıya dökülüyor…"
                    : recording
                      ? `Dinliyor · ${formatElapsed(elapsed)}`
                      : "Konuşmak için dokun"}
                </p>

                {/* İkincil kontroller */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div
                    role="group"
                    aria-label="Dil"
                    className="flex rounded-full border border-zinc-800 bg-zinc-900/60 p-1 backdrop-blur"
                  >
                    {LANGUAGES.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setLanguage(option.value)}
                        aria-pressed={language === option.value}
                        className={cn(
                          "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-emerald-400 motion-reduce:transition-none",
                          language === option.value
                            ? "bg-zinc-100 text-zinc-900"
                            : "text-zinc-400 hover:text-zinc-200"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur transition-colors duration-200 hover:text-zinc-200 has-checked:text-zinc-200">
                    <input
                      type="checkbox"
                      checked={cleanFillers}
                      onChange={(event) => setCleanFillers(event.target.checked)}
                      className="size-3.5 cursor-pointer accent-emerald-500"
                    />
                    Dolgu seslerini temizle
                  </label>
                  {device && (
                    <span className="rounded-full border border-zinc-800 px-3 py-1.5 text-[11px] uppercase tracking-wider text-zinc-500">
                      {device}
                    </span>
                  )}
                </div>
              </section>
            )}

            {error && (
              <p
                role="alert"
                className="w-full max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
              >
                {error}
              </p>
            )}

            {/* Transkript */}
            <section aria-label="Transkript" className="flex w-full flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-zinc-500 tabular-nums">
                  {wordCount > 0 ? `${wordCount} kelime` : "Transkript"}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setShowKeyboard((prev) => !prev)}
                    aria-pressed={showKeyboard}
                    aria-label="Ekran klavyesi"
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-emerald-400 motion-reduce:transition-none",
                      showKeyboard
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
                    )}
                  >
                    <Keyboard className="size-3.5" aria-hidden />
                    Klavye
                  </button>
                  <button
                    type="button"
                    onClick={() => setText("")}
                    disabled={!text}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-zinc-400 transition-colors duration-200 hover:bg-zinc-800/80 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Temizle
                  </button>
                  <button
                    type="button"
                    onClick={copyText}
                    disabled={!text}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-zinc-400 transition-colors duration-200 hover:bg-zinc-800/80 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-400" aria-hidden />
                    ) : (
                      <Copy className="size-3.5" aria-hidden />
                    )}
                    {copied ? "Kopyalandı" : "Kopyala"}
                  </button>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Dikte ettiğin metin burada birikir…"
                aria-label="Transkript metni"
                rows={6}
                className="w-full resize-y rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 text-[15px] leading-relaxed text-zinc-100 backdrop-blur outline-none transition-colors duration-200 placeholder:text-zinc-600 focus:border-emerald-500/50 motion-reduce:transition-none"
              />
              {showKeyboard && <DictationKeyboard onKey={applyVirtualKey} />}
            </section>
          </>
        )}

        {/* Alt bilgi */}
        <footer className="mt-auto flex flex-col items-center gap-2 text-center text-xs text-zinc-600">
          <p>
            Kısayol:{" "}
            <kbd className="rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">
              Shift
            </kbd>{" "}
            +{" "}
            <kbd className="rounded-md border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 font-mono text-[11px] text-zinc-400">
              Space
            </kbd>
          </p>
          <p className="flex items-center gap-3">
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/sohbet`}
              className="text-emerald-400/80 underline underline-offset-2 transition-colors duration-200 hover:text-emerald-300 motion-reduce:transition-none"
            >
              Fable 5 ile sohbet →
            </a>
            <span>
              Sistem geneli dikte için{" "}
              <code className="rounded bg-zinc-900 px-1 py-0.5 text-zinc-400">
                local-flow
              </code>{" "}
              masaüstü aracını kullan.
            </span>
            {lockState === "unlocked" && (
              <button
                type="button"
                onClick={removeLock}
                className="inline-flex cursor-pointer items-center gap-1 text-zinc-600 underline-offset-2 transition-colors duration-200 hover:text-zinc-400 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-400 motion-reduce:transition-none"
              >
                <LockOpen className="size-3" aria-hidden />
                Kilidi kaldır
              </button>
            )}
          </p>
        </footer>
      </div>
    </main>
  );
}
