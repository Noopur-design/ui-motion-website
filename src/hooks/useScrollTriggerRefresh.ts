import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Page height changes (filters, accordions, late fonts, route changes) shift
 * scroll-trigger positions. Refreshing restores the scroll position, which
 * would cancel a smooth scroll in progress, so wait until scrolling is idle.
 */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    let timer = 0;
    let lastScroll = 0;
    let lastHeight = document.body.scrollHeight;
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (performance.now() - lastScroll < 250) return schedule();
        ScrollTrigger.refresh();
      }, 250);
    };
    const onScroll = () => (lastScroll = performance.now());
    const ro = new ResizeObserver(() => {
      const height = document.body.scrollHeight;
      if (Math.abs(height - lastHeight) < 2) return;
      lastHeight = height;
      schedule();
    });
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.fonts?.ready.then(schedule);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);
}
