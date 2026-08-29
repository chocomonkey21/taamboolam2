import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // This site is photography-first. Serve modern formats by default.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 768, 1024, 1280, 1440, 1920, 2560],
  },
  poweredByHeader: false,
};

export default nextConfig;
