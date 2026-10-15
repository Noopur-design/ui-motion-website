import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "font-sans font-semibold tracking-[-0.01em] [font-stretch:92%]",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out-quint",
    "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:bg-cobalt",
        lime: "bg-lime text-ink shadow-[inset_0_0_0_1px_rgb(20_18_16/0.9)] hover:bg-ink hover:text-lime",
        outline: "text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:bg-ink/6",
        paper: "bg-paper text-ink hover:bg-lime",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-7 text-base sm:h-16 sm:px-8 sm:text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

/** Arrow that nudges on hover of the parent button/link. */
export function ArrowNudge({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-flex overflow-hidden", className)}>
      <span className="transition-transform duration-500 ease-out-expo group-hover/button:translate-x-[120%]">
        →
      </span>
      <span className="absolute inset-0 -translate-x-[120%] transition-transform duration-500 ease-out-expo group-hover/button:translate-x-0">
        →
      </span>
    </span>
  );
}
