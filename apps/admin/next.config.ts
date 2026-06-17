import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@tenexim/ui",
    "@tenexim/tailwind-config"
  ],
};

export default nextConfig;
