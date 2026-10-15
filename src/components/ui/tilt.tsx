import type { PointerEvent, ReactNode } from "react";
import { motion, useSpring } from "motion/react";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { useCanHover } from "@/hooks/useMediaQuery";

/**
 * Gently tilts its content toward the pointer (desktop only). Disabled on
 * touch screens, for reduced motion and when the visitor pauses motion.
 */
export function Tilt({ children, className, max = 3.5 }: { children: ReactNode; className?: string; max?: number }) {
  const { allowMotion } = useMotionPreference();
  const canHover = useCanHover();
  const rotateX = useSpring(0, { stiffness: 180, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 18 });

  if (!allowMotion || !canHover) return <div className={className}>{children}</div>;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
    rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
  };
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
