import type { Metadata } from "next";

import { DictationApp } from "@/components/dictation-app";

export const metadata: Metadata = {
  title: "Test 3 — Dikte (sade)",
  robots: { index: false },
};

// Tanı sayfası: dikte uygulamasının süslemesiz sürümü — aurora zemin ve
// animasyonlu başlık yok. Bu açılıp /dictation çökerse suçlu süslemelerdir.
export default function DictationPlainPage() {
  return <DictationApp plain />;
}
