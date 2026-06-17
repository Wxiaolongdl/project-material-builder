import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "h-12 w-full rounded-[18px] border border-white/75 bg-white/62 px-4 text-sm text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_22px_rgba(15,23,42,0.035)] outline-none transition placeholder:text-zinc-400 focus:border-teal-200/80 focus:bg-white/82 focus:ring-4 focus:ring-teal-700/[0.06]",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
