import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import { ScrollTrigger } from "@/lib/gsap";
import { useMotionPreference } from "@/hooks/useMotionPreference";

const wipe = [0.65, 0, 0.35, 1] as const;

/** Scroll positions per history entry, so Back/Forward land where the visitor left off. */
const positions = new Map<string, number>();
let firstRender = true;

export function rememberScroll(key: string) {
  positions.set(key, window.scrollY);
}

type Props = { children: ReactNode; locationKey: string; hash: string; isPop: boolean };

/**
 * Wraps each routed page. On navigation an ink curtain wipes up over the old
 * page, the route swaps underneath, then the curtain lifts off the new one.
 * Also restores scroll position, honours #hash targets and moves focus.
 */
export function PageShell({ children, locationKey, hash, isPop }: Props) {
  const { allowMotion } = useMotionPreference();
  const mounted = useRef(false);
  const lastKey = useRef<string | null>(null);

  useLayoutEffect(() => {
    const id = hash ? decodeURIComponent(hash.slice(1)) : "";
    const target = id ? document.getElementById(id) : null;
    let frame = 0;

    /** Scrolls to #id; pages load lazily, so wait briefly if it isn't rendered yet. */
    const follow = (behavior: ScrollBehavior) => {
      if (!id) return;
      const until = performance.now() + 3000;
      const look = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior });
        else if (performance.now() < until) frame = requestAnimationFrame(look);
      };
      look();
    };

    // React StrictMode (dev) runs this twice for the same history entry — treat that like the first run.
    const isRerun = lastKey.current === locationKey;
    lastKey.current = locationKey;

    if (mounted.current) {
      // Same page, new search/hash (a filter or an in-page link): only follow #targets.
      follow(isRerun || matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth");
    } else {
      mounted.current = true;
      const isFirst = firstRender;
      firstRender = false;
      const saved = positions.get(locationKey);

      if (isPop && saved !== undefined) window.scrollTo({ top: saved, behavior: "instant" });
      else if (id) follow("instant");
      else if (!isFirst) window.scrollTo({ top: 0, behavior: "instant" });

      // Screen-reader and keyboard users start at the new page's content.
      if (!isFirst && !target) document.getElementById("main")?.focus({ preventScroll: true });
    }
    return () => cancelAnimationFrame(frame);
  }, [locationKey, hash, isPop]);

  // New page, new trigger positions.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <motion.div>
      {allowMotion && (
        <>
          {/* Covers the outgoing page */}
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[60] origin-bottom bg-ink"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.45, ease: wipe }}
          />
          {/* Lifts off the incoming page */}
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[60] grid origin-top place-items-center bg-ink"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.55, ease: wipe, delay: 0.05 }}
          >
            <span className="size-4 rounded-full bg-lime" />
          </motion.div>
        </>
      )}
      {children}
    </motion.div>
  );
}
