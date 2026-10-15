import { cn } from "@/lib/utils";
import { site } from "@/content/site";

/**
 * Typographic wordmark: the studio name with an onion-skinned ball —
 * three in-between frames of a bounce. The ball hops on hover.
 */
export function Wordmark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("group/wm inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 40 28" className="h-[1em] w-auto overflow-visible" aria-hidden>
        <circle cx="6" cy="20" r="4" className={inverted ? "fill-paper/30" : "fill-ink/20"} />
        <circle cx="15" cy="13" r="5" className={inverted ? "fill-paper/55" : "fill-ink/45"} />
        <circle
          cx="28"
          cy="10"
          r="8"
          className={cn(
            "origin-[28px_18px] transition-transform duration-500 ease-out-expo [transform-box:view-box] group-hover/wm:-translate-y-1 group-hover/wm:scale-x-110 group-hover/wm:scale-y-90 motion-reduce:transition-none",
            inverted ? "fill-lime" : "fill-ink",
          )}
        />
      </svg>
      <span className="display text-[1.55em] leading-none tracking-[-0.045em]">{site.name.toLowerCase()}</span>
    </span>
  );
}
