import type { CSSProperties } from "react";
import { Link } from "react-router";
import { Button, ArrowNudge } from "@/components/ui/button";
import { C } from "@/components/art/palette";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useInViewPlay } from "@/hooks/useInViewPlay";

export default function NotFoundPage() {
  usePageMeta("Page not found");
  const [ref, playing] = useInViewPlay<HTMLElement>(0.1);

  return (
    <section ref={ref} aria-labelledby="nf-title" className="container-x flex min-h-[70svh] flex-col items-start justify-center py-20">
      <p className="label-mono text-ink-soft">Error 404 — frame missing</p>
      <h1 id="nf-title" className="display mt-6 flex items-end text-[clamp(7rem,26vw,22rem)] leading-[0.8]">
        <span>4</span>
        <svg viewBox="0 0 120 200" className="art mx-[0.04em] h-[0.95em] w-auto" data-play={playing} aria-hidden>
          <ellipse cx="60" cy="194" rx="34" ry="6" fill={C.ink} className="anim a-shadow" />
          <circle cx="60" cy="60" r="44" fill={C.orange} className="anim a-bounce" style={{ ["--d" as string]: "100%" } as CSSProperties} />
        </svg>
        <span>4</span>
        <span className="sr-only"> — page not found</span>
      </h1>
      <p className="mt-8 max-w-md text-xl leading-relaxed text-ink-soft">
        This frame didn’t make the final cut. Let’s get you back to the story.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/">
            Back to home <ArrowNudge />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/work">See the work</Link>
        </Button>
      </div>
    </section>
  );
}
