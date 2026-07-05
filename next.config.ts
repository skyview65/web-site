import type { NextConfig } from "next";

// STATIC_EXPORT=1: GitHub Pages gibi statik barındırma için tam dışa aktarım.
// Pages depoyu bir alt yolda (/web-site) sunduğundan basePath da ayarlanır;
// normal (sunuculu) derlemeler etkilenmez.
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      basePath,
      images: { unoptimized: true },
    }
  : {
      output: "standalone",
    };

export default nextConfig;
