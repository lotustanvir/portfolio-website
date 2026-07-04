import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ElementRef } from "react";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-7",
      lead: "text-xl text-muted-foreground",
      muted: "text-sm text-muted-foreground",
      small: "text-sm font-medium leading-none",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

type HeadingElement = "h1" | "h2" | "h3" | "h4" | "p" | "span";

interface TypographyProps extends HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof typographyVariants> {
  asChild?: boolean;
  as?: HeadingElement;
}

const Typography = forwardRef<ElementRef<"p">, TypographyProps>(
  ({ className, variant, as, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : (as ?? "p");
    return <Comp className={cn(typographyVariants({ variant, className }))} ref={ref} {...props} />;
  },
);
Typography.displayName = "Typography";

export { Typography, typographyVariants };
