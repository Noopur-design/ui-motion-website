import type { ComponentPropsWithoutRef, ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { useReturnFocus } from "@/hooks/useReturnFocus";

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;

type AnimatedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  /** "panel" slides up from below; "fade" scales in place (video overlays). */
  enter?: "panel" | "fade";
} & Pick<ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, "onOpenAutoFocus" | "onCloseAutoFocus">;

/**
 * Accessible dialog (Radix: focus trap, Escape, scroll lock, aria wiring)
 * with Motion enter/exit transitions. Children must include a <DialogTitle>.
 */
export function AnimatedDialog({
  open,
  onOpenChange,
  children,
  className,
  overlayClassName,
  enter = "panel",
  onOpenAutoFocus,
  onCloseAutoFocus,
}: AnimatedDialogProps) {
  const restoreFocus = useReturnFocus(open);
  const from = enter === "panel" ? { opacity: 0, y: 48 } : { opacity: 0, scale: 0.96 };
  const to = enter === "panel" ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className={cn("fixed inset-0 z-[80] bg-ink/70", overlayClassName)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              aria-describedby={undefined}
              onOpenAutoFocus={onOpenAutoFocus}
              onCloseAutoFocus={(e) => {
                onCloseAutoFocus?.(e);
                if (!e.defaultPrevented) {
                  e.preventDefault();
                  restoreFocus();
                }
              }}
            >
              <motion.div
                className={cn("fixed z-[90] outline-none", className)}
                initial={from}
                animate={to}
                exit={{ ...from, transition: { duration: 0.25, ease: "easeIn" } }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
              >
                {children}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

export function DialogCloseButton({ className, label = "Close" }: { className?: string; label?: string }) {
  return (
    <DialogPrimitive.Close
      className={cn(
        "group inline-flex h-11 items-center gap-2 rounded-full bg-paper pl-4 pr-3 text-sm font-semibold text-ink",
        "shadow-[inset_0_0_0_1px_rgb(20_18_16/0.15)] transition-colors hover:bg-lime",
        className,
      )}
    >
      {label}
      <X className="size-4 transition-transform duration-300 group-hover:rotate-90" aria-hidden />
    </DialogPrimitive.Close>
  );
}
