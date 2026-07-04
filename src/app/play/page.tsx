import type { Metadata, Viewport } from "next";
import { BrainrotBattle } from "@/components/game/brainrot-battle";

export const metadata: Metadata = {
  title: "Brainrot Battle — .io Arena",
  description:
    "Ye, büyü, hayatta kal. Tarayıcıda anında oynanan meme arena savaşı — arkadaşını linkle çağır, 3 dakikada arenanın kralı ol.",
  openGraph: {
    title: "🧠 Brainrot Battle",
    description: "Beni geçebilir misin? Linke tıkla, anında arenaya gir.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#070312",
};

export default function PlayPage() {
  return <BrainrotBattle />;
}
