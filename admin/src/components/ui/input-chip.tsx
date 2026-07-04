import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

const inputVariants = cva(
  "flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border border-input bg-transparent px-3 py-1 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface InputChipProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputVariants> {
  onRemove?: () => void;
}

const InputChip = forwardRef<HTMLDivElement, InputChipProps>(
  ({ className, variant, children, onRemove, ...props }, ref) => (
    <div ref={ref} className={cn(inputVariants({ variant }), className)} {...props}>
      <span className="text-xs">{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
        >
          ✕
        </button>
      )}
    </div>
  ),
);
InputChip.displayName = "InputChip";

export { InputChip };
