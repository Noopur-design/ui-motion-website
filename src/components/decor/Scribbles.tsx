import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { inView } from "@/lib/motion";

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: inView,
  transition: { pathLength: { duration: 0.9, delay, ease: [0.65, 0, 0.35, 1] as const }, opacity: { duration: 0.01, delay } },
});

/** Hand-drawn underline that draws itself in when scrolled into view. */
export function ScribbleUnderline({ className, color = "currentColor", delay = 0.4 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 300 24" preserveAspectRatio="none" className={cn("pointer-events-none absolute", className)} aria-hidden>
      <motion.path
        d="M4 16C60 6 132 4 200 8S286 16 296 12"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        {...draw(delay)}
      />
    </svg>
  );
}

/** Loose hand-drawn ellipse to circle a word. */
export function ScribbleCircle({ className, color = "currentColor", delay = 0.5 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 300 120" preserveAspectRatio="none" className={cn("pointer-events-none absolute", className)} aria-hidden>
      <motion.path
        d="M210 14C120 -2 18 20 8 58C-2 100 120 116 214 104S300 64 288 38C276 14 196 6 150 12"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        {...draw(delay)}
      />
    </svg>
  );
}

/** Curvy hand-drawn arrow. Points to the bottom-right by default; rotate/flip with classes. */
export function HandArrow({ className, color = "currentColor", delay = 0.6 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 120 90" className={cn("pointer-events-none", className)} fill="none" aria-hidden>
      <motion.path d="M6 10C40 2 78 18 86 52C88 62 88 70 86 78" stroke={color} strokeWidth="2.5" strokeLinecap="round" {...draw(delay)} />
      <motion.path d="M72 66L86 80L98 62" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...draw(delay + 0.7)} />
    </svg>
  );
}

/** Print/animation registration mark. */
export function RegMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("pointer-events-none", className)} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="6" />
      <path d="M12 0v24M0 12h24" />
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("pointer-events-none", className)} aria-hidden>
      <path d="M12 0Q12 12 24 12Q12 12 12 24Q12 12 0 12Q12 12 12 0Z" fill="currentColor" />
    </svg>
  );
}
