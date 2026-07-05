import type { MetadataRoute } from "next";

import { withBasePath } from "@/lib/base-path";

// Statik dışa aktarımda (output: "export") manifest rotası da statik üretilmeli.
export const dynamic = "force-static";

// /dictation'ı kurulabilir bir uygulama yapar: tarayıcıdan "Uygulamayı yükle"
// denince kendi penceresinde, adres çubuğu olmadan açılır. Model tarayıcı
// önbelleğinde kaldığı için kurulumdan sonra transkripsiyon çevrimdışı çalışır.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dikte — Yerel Whisper",
    short_name: "Dikte",
    description:
      "Tarayıcıda tamamen yerel çalışan, gizlilik odaklı Whisper dikte uygulaması. Ses hiçbir sunucuya gönderilmez.",
    id: withBasePath("/dictation"),
    start_url: withBasePath("/dictation"),
    scope: withBasePath("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "tr",
    icons: [
      {
        src: withBasePath("/icons/dikte-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/dikte-512.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: withBasePath("/icons/dikte-maskable-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
