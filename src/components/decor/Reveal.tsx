import { Fragment, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { easeOutExpo, fadeUp, inView, stagger } from "@/lib/motion";

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "p" | "section" | "article";
}) {
  const Comp = motionTags[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      variants={{ hidden: fadeUp.hidden, show: { ...(fadeUp.show as object), transition: { duration: 0.8, ease: easeOutExpo, delay } } }}
    >
      {children}
    </Comp>
  );
}

const motionTags = {
  div: motion.div,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  article: motion.article,
};

export type TextPart = { text: string; className?: string; breakAfter?: boolean };

const headingTags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p };

/**
 * Heading whose words slide up from behind a mask, staggered.
 * Text stays real text, so it reads naturally for screen readers and search.
 */
export function SplitReveal({
  parts,
  as = "h2",
  className,
  delay = 0,
  immediate = false,
  id,
}: {
  parts: TextPart[];
  as?: keyof typeof headingTags;
  className?: string;
  delay?: number;
  /** Animate on mount instead of on scroll (used above the fold). */
  immediate?: boolean;
  id?: string;
}) {
  const Comp = headingTags[as];
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: inView };
  return (
    <Comp id={id} className={className} initial="hidden" variants={stagger(0.07, delay)} {...trigger}>
      {parts.map((part, pi) => {
        const words = part.text.split(" ").filter(Boolean);
        return (
          <Fragment key={pi}>
            {words.map((word, wi) => (
              <Fragment key={wi}>
                <span className="-mx-[0.08em] -mb-[0.12em] inline-block overflow-hidden px-[0.08em] pb-[0.12em] align-bottom">
                  <motion.span
                    className={cn("inline-block will-change-transform", part.className)}
                    variants={{
                      hidden: { y: "110%", rotate: 4 },
                      show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: easeOutExpo } },
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
                {wi < words.length - 1 && " "}
              </Fragment>
            ))}
            {part.breakAfter ? <br /> : pi < parts.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Comp>
  );
}

/** Small mono section marker, e.g. "(03) — Selected work". */
export function SectionLabel({ index, children, className }: { index: string; children: ReactNode; className?: string }) {
  return (
    <p className={cn("label-mono flex items-center gap-3 text-ink-soft", className)}>
      <span className="text-ink">({index})</span>
      <span aria-hidden className="h-px w-8 bg-ink/30" />
      {children}
    </p>
  );
}
