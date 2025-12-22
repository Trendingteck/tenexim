import * as React from "react"
import { cn } from "./lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200",
                    "placeholder:text-slate-400",
                    "focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
