import type { Transition, Variants } from "motion/react";

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutQuint = [0.22, 1, 0.36, 1] as const;

export const reveal: Transition = { duration: 0.8, ease: easeOutQuint };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: reveal },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Shared viewport settings for scroll reveals: trigger once, slightly before fully in view. */
export const inView = { once: true, margin: "0px 0px -12% 0px" } as const;
