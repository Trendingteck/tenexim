import type { Config } from "tailwindcss";
import sharedConfig from "@tenexim/tailwind-config";

const config: Config = {
    content: [
        "./src/**/*.{ts,tsx}",
        "../../packages/ui/**/*.{ts,tsx}",
    ],
    presets: [sharedConfig as Config],
};

export default config;
