import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    preloadEntriesOnStart: false,
  },
  serverExternalPackages: ['sharp'],
};

export default nextConfig;
