import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "min-h-32 w-full resize-y rounded-[20px] border border-white/75 bg-white/62 px-4 py-3.5 text-sm leading-6 text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_8px_22px_rgba(15,23,42,0.035)] outline-none transition placeholder:text-zinc-400 focus:border-teal-200/80 focus:bg-white/82 focus:ring-4 focus:ring-teal-700/[0.06]",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
