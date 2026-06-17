import type { Config } from "tailwindcss";
import sharedConfig from "@tenexim/configs/tailwind";

const config: Config = {
    content: [
        "./src/**/*.{ts,tsx}",
        "../../packages/ui/**/*.{ts,tsx}",
    ],
    presets: [sharedConfig as Config],
};

export default config;
