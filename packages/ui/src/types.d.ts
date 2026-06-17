import type { Config } from 'tailwindcss'

declare global {
    namespace Tailwind {
        export type { Config }
    }
}
