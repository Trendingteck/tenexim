import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@tenexim/ui",
    "@tenexim/tailwind-config",
    "@tenexim/database", // <--- Added to fix Turbopack TS resolution
    "recharts"           // <--- Added to ensure charts compile correctly
  ],
  serverExternalPackages: ["@prisma/client", "pg"],
};

export default nextConfig;