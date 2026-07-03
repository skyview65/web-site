"use client";

import { useState } from "react";
import { ArrowBigUp, CornerDownLeft, Delete } from "lucide-react";

import { cn } from "@/lib/utils";

export type VirtualKeyAction =
  | { type: "char"; value: string }
  | { type: "backspace" }
  | { type: "enter" }
  | { type: "space" };

const ROW_1 = ["q", "w", "e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"];
const ROW_2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"];
const ROW_3 = ["z", "x", "c", "v", "b", "n", "m", "ö", "ç"];

const KEY_BASE =
  "flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg border border-zinc-800/80 bg-zinc-900/70 text-sm text-zinc-200 transition-colors duration-150 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-emerald-400 active:bg-zinc-700 motion-reduce:transition-none";

/** Türkçe Q düzeninde ekran klavyesi — dokunmatik/kiosk kullanımına uygun. */
export function DictationKeyboard({
  onKey,
}: {
  onKey: (action: VirtualKeyAction) => void;
}) {
  const [shift, setShift] = useState(false);

  const pressChar = (key: string) => {
    onKey({ type: "char", value: shift ? key.toLocaleUpperCase("tr") : key });
    setShift(false); // mobil klavyeler gibi tek atımlık shift
  };

  const renderRow = (keys: string[]) =>
    keys.map((key) => (
      <button
        key={key}
        type="button"
        aria-label={shift ? key.toLocaleUpperCase("tr") : key}
        onMouseDown={(event) => event.preventDefault()} // odak transkriptte kalsın
        onClick={() => pressChar(key)}
        className={KEY_BASE}
      >
        {shift ? key.toLocaleUpperCase("tr") : key}
      </button>
    ));

  return (
    <div
      role="group"
      aria-label="Ekran klavyesi"
      className="flex w-full flex-col gap-1.5 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-2 backdrop-blur"
    >
      <div className="flex gap-1.5">{renderRow(ROW_1)}</div>
      <div className="flex gap-1.5 px-3">{renderRow(ROW_2)}</div>
      <div className="flex gap-1.5">
        <button
          type="button"
          aria-label="Büyük harf"
          aria-pressed={shift}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setShift((prev) => !prev)}
          className={cn(
            KEY_BASE,
            "max-w-14",
            shift && "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
          )}
        >
          <ArrowBigUp className="size-4" aria-hidden />
        </button>
        {renderRow(ROW_3)}
        <button
          type="button"
          aria-label="Sil"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onKey({ type: "backspace" })}
          className={cn(KEY_BASE, "max-w-14")}
        >
          <Delete className="size-4" aria-hidden />
        </button>
      </div>
      <div className="flex gap-1.5">
        <button
          type="button"
          aria-label="Virgül"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onKey({ type: "char", value: "," })}
          className={cn(KEY_BASE, "max-w-14")}
        >
          ,
        </button>
        <button
          type="button"
          aria-label="Boşluk"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onKey({ type: "space" })}
          className={cn(KEY_BASE, "flex-[4]")}
        >
          <span className="text-xs text-zinc-500">boşluk</span>
        </button>
        <button
          type="button"
          aria-label="Nokta"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onKey({ type: "char", value: "." })}
          className={cn(KEY_BASE, "max-w-14")}
        >
          .
        </button>
        <button
          type="button"
          aria-label="Yeni satır"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onKey({ type: "enter" })}
          className={cn(KEY_BASE, "max-w-14")}
        >
          <CornerDownLeft className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
