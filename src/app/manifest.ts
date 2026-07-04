import type { MetadataRoute } from "next";

// /dictation'ı kurulabilir bir uygulama yapar: tarayıcıdan "Uygulamayı yükle"
// denince kendi penceresinde, adres çubuğu olmadan açılır. Model tarayıcı
// önbelleğinde kaldığı için kurulumdan sonra transkripsiyon çevrimdışı çalışır.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dikte — Yerel Whisper",
    short_name: "Dikte",
    description:
      "Tarayıcıda tamamen yerel çalışan, gizlilik odaklı Whisper dikte uygulaması. Ses hiçbir sunucuya gönderilmez.",
    id: "/dictation",
    start_url: "/dictation",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#000000",
    lang: "tr",
    icons: [
      {
        src: "/icons/dikte-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/dikte-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/dikte-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
