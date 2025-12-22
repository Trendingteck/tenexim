import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@tenexim/ui",
    "@tenexim/tailwind-config"
    
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
