import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/20 hover:-translate-y-0.5 active:translate-y-0",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-950 text-white shadow-[0_14px_35px_rgba(15,23,42,0.18)] hover:bg-zinc-800 hover:shadow-[0_18px_45px_rgba(15,23,42,0.22)]",
        secondary:
          "bg-white/72 text-zinc-900 ring-1 ring-white/80 shadow-[0_10px_28px_rgba(15,23,42,0.06)] hover:bg-white hover:shadow-[0_16px_38px_rgba(15,23,42,0.1)]",
        ghost: "text-zinc-600 hover:bg-white/62 hover:text-zinc-950 hover:shadow-[0_12px_28px_rgba(15,23,42,0.06)]",
        outline:
          "bg-white/40 text-zinc-800 ring-1 ring-zinc-200/70 hover:bg-white/75 hover:shadow-[0_12px_28px_rgba(15,23,42,0.07)]",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4 text-xs",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
