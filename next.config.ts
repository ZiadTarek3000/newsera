import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // Cache optimized image variants for a week so news thumbnails aren't
    // re-fetched and re-encoded on every render.
    minimumCacheTTL: 604800,
  },
};

export default nextConfig;
