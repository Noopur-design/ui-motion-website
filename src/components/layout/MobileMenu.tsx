import { useRef, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { useReturnFocus } from "@/hooks/useReturnFocus";
import { Wordmark } from "./Wordmark";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

const links = [{ label: "Home", href: "/" }, ...site.nav, { label: "Let’s Talk", href: "/contact" }];

export function MobileMenu({ open, onOpenChange }: Props) {
  const navigateTo = useNavigate();
  const { pathname } = useLocation();
  // When a link was used, the new page takes focus — don't send it back to the menu button.
  const navigated = useRef(false);
  const restoreFocus = useReturnFocus(open);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigated.current = true;
    onOpenChange(false);
    if (href !== pathname) navigateTo(href);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Radix applies its page scroll lock through the overlay. */}
            <DialogPrimitive.Overlay forceMount className="fixed inset-0 z-[89]" />
            <DialogPrimitive.Content
              forceMount
              asChild
              aria-describedby={undefined}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                if (navigated.current) navigated.current = false;
                else restoreFocus();
              }}
            >
              <motion.div
                className="fixed inset-0 z-[90] flex flex-col bg-ink text-paper"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{ clipPath: "inset(0 0 0% 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
              >
                <DialogPrimitive.Title className="sr-only">Site menu</DialogPrimitive.Title>
                <div className="container-x flex h-16 items-center justify-between">
                  <Wordmark inverted className="text-[0.95rem]" />
                  <DialogPrimitive.Close className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-paper shadow-[inset_0_0_0_1.5px_var(--color-paper)] transition-colors hover:bg-paper hover:text-ink">
                    <X className="size-5" aria-hidden />
                    Close
                  </DialogPrimitive.Close>
                </div>

                <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center">
                  <ul className="flex flex-col gap-1">
                    {links.map((item, i) => {
                      const active = item.label !== "Let’s Talk" && isActive(item.href);
                      return (
                        <li key={item.label} className="overflow-hidden">
                          <motion.a
                            href={item.href}
                            onClick={(e) => go(e, item.href)}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "display flex items-baseline gap-4 py-1 text-[clamp(2.75rem,14vw,5.5rem)]",
                              item.label === "Let’s Talk" ? "text-lime" : "text-paper",
                            )}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%", transition: { duration: 0.25 } }}
                            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.12 + i * 0.05 }}
                          >
                            <span className="label-mono text-paper/50">0{i + 1}</span>
                            {item.label}
                            {active && <span aria-hidden className="size-3 self-center rounded-full bg-orange" />}
                          </motion.a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <motion.div
                  className="container-x flex flex-wrap items-end justify-between gap-6 pb-8 pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}
                  exit={{ opacity: 0 }}
                >
                  <a href={`mailto:${site.email}`} className="text-lg underline decoration-paper/30 underline-offset-4 hover:decoration-lime">
                    {site.email}
                  </a>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2">
                    {site.socials
                      .filter((s) => s.href)
                      .map((s) => (
                        <li key={s.label}>
                          <a href={s.href} target="_blank" rel="noreferrer" className="label-mono text-paper/70 hover:text-lime">
                            {s.label} ↗
                          </a>
                        </li>
                      ))}
                  </ul>
                </motion.div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
