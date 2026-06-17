import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[24px] border border-white/75 bg-white/58 shadow-[0_24px_80px_rgba(15,23,42,0.07)] backdrop-blur-2xl",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
