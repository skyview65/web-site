import type { Metadata } from "next";

import { ChatApp } from "@/components/chat-app";

export const metadata: Metadata = {
  title: "Sohbet — Fable 5",
  description:
    "Sesle veya yazarak Claude (Fable 5) ile sohbet. Ses cihazında yazıya dökülür; API anahtarı yalnızca tarayıcıda saklanır.",
};

export default function SohbetPage() {
  return <ChatApp />;
}
