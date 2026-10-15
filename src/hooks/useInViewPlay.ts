import { useRef } from "react";
import { useInView } from "motion/react";
import { useMotionPreference } from "./useMotionPreference";

/**
 * Returns a ref and whether decorative loops inside it should be running:
 * only while on screen, and only when the visitor allows motion.
 */
export function useInViewPlay<T extends Element = HTMLDivElement>(amount = 0.25) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const { allowMotion } = useMotionPreference();
  return [ref, inView && allowMotion] as const;
}
