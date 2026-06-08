import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // News articles and OAuth avatars come from many domains, so allow any
    // https host (typical for a news aggregator).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
