import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "accent" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg": variant === "default",
            "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg hover:shadow-accent/20": variant === "accent",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "border-2 border-primary/20 bg-transparent hover:bg-primary/5 text-primary": variant === "outline",
            "hover:bg-accent/10 hover:text-accent": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "h-11 px-6 py-2 text-base": size === "default",
            "h-9 px-4 text-sm": size === "sm",
            "h-14 px-8 text-lg rounded-2xl": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
