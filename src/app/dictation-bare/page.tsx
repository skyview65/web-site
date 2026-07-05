import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Test 2 — Stil katmanı",
  robots: { index: false },
};

// Tanı sayfası: dikte bileşeni OLMADAN aynı layout, fontlar ve global CSS.
// Bu açılıyorsa çökme Dikte bileşeninden; bu da çöküyorsa layout/stilden.
export default function DictationBarePage() {
  return (
    <main className="flex min-h-dvh flex-col items-start gap-4 bg-black p-8 font-sans text-zinc-100">
      <h1 className="text-3xl text-emerald-400">Test 2 ✓</h1>
      <p className="max-w-md text-sm leading-relaxed text-zinc-400">
        Bu sayfa açıldıysa yazı tipleri, stil katmanı ve React çalışıyor
        demektir. Sıradaki test dikte uygulamasının sade (animasyonsuz)
        sürümü.
      </p>
      <Link className="text-emerald-400 underline underline-offset-4" href="/dictation-plain">
        Test 3&apos;e geç →
      </Link>
    </main>
  );
}
