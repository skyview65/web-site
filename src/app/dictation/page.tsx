import type { Metadata } from "next";

import { DictationApp } from "@/components/dictation-app";

export const metadata: Metadata = {
  title: "Dikte — Yerel Whisper",
  description:
    "Tarayıcıda tamamen yerel çalışan, gizlilik odaklı Whisper dikte demosu. Ses hiçbir sunucuya gönderilmez.",
};

export default function DictationPage() {
  return <DictationApp />;
}
