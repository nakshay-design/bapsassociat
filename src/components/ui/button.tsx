import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg hover:shadow-accent/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border-2 border-primary/20 bg-transparent hover:bg-primary/5 text-primary",
        ghost: "hover:bg-accent/10 hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2 text-base",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg rounded-2xl",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
