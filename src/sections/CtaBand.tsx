import type { CSSProperties } from "react";
import { Link } from "react-router";
import { Button, ArrowNudge } from "@/components/ui/button";
import { Reveal } from "@/components/decor/Reveal";
import { C } from "@/components/art/palette";
import { sparkle } from "@/components/art/Artwork";
import { useInViewPlay } from "@/hooks/useInViewPlay";

/** Closing call to action used at the end of most pages. */
export function CtaBand() {
  const [ref, playing] = useInViewPlay<HTMLDivElement>(0.3);
  return (
    <section aria-labelledby="cta-title" className="container-x py-20 md:py-28">
      <Reveal>
        <div ref={ref} className="relative overflow-hidden rounded-xl bg-lime px-6 py-14 sm:px-10 md:px-14 md:py-20">
          <svg viewBox="0 0 240 240" className="art pointer-events-none absolute right-10 top-1/2 hidden w-60 -translate-y-1/2 lg:block xl:w-72" data-play={playing} aria-hidden>
            <line x1="40" y1="206" x2="200" y2="206" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="120" cy="204" rx="34" ry="7" fill={C.ink} className="anim a-shadow" />
            <circle
              cx="120"
              cy="70"
              r="30"
              fill={C.orange}
              stroke={C.ink}
              strokeWidth="4"
              className="anim a-bounce"
              style={{ ["--d" as string]: "190%" } as CSSProperties}
            />
            <path d={sparkle(196, 54, 16)} fill={C.ink} className="anim a-pop" />
          </svg>
          <p className="label-mono text-ink/70">(Next frame)</p>
          <h2 id="cta-title" className="display relative mt-5 max-w-4xl text-[clamp(2.6rem,7vw,6.75rem)] lg:max-w-[calc(100%-17rem)]">
            Got an Idea That Deserves to <span className="serif-accent">Move?</span>
          </h2>
          <p className="relative mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
            Tell us what you’re imagining. Let’s turn it into something worth watching.
          </p>
          <Button asChild size="lg" className="relative mt-10">
            <Link to="/contact">
              Let’s Make It Happen <ArrowNudge />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
