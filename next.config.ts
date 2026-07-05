import type { NextConfig } from "next";

// GITHUB_PAGES=true switches to a static export served from the repo
// subpath (https://<owner>.github.io/web-site); the default build stays a
// standalone server with the root redirect.
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/web-site" : "";

const nextConfig: NextConfig = {
  output: isPages ? "export" : "standalone",
  ...(isPages ? { basePath, trailingSlash: true } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(isPages
    ? {}
    : {
        async redirects() {
          return [
            {
              source: "/",
              destination: "/tr",
              permanent: false,
            },
          ];
        },
      }),
};

export default nextConfig;
