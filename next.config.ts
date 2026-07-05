import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/tr",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
