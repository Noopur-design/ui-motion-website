import { useRef } from "react";
import { processSteps } from "@/content/studio";
import { ProcessArt } from "@/components/art/ProcessArt";
import { SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { cn } from "@/lib/utils";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotionPreference } from "@/hooks/useMotionPreference";

const panelBg = ["bg-lavender", "bg-lime", "bg-cobalt", "bg-orange-soft"];

/** Scroll-scrubbed build for each step's illustration. Elements start hidden and assemble as you scroll. */
function stepTimeline(card: Element, step: number) {
  const q = gsap.utils.selector(card);
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  tl.from(q(".step-number"), { yPercent: 60, opacity: 0, duration: 0.4 }, 0).from(
    q(".step-copy > *"),
    { y: 24, opacity: 0, stagger: 0.08, duration: 0.4 },
    0.1,
  );

  if (step === 0) {
    tl.from(q(".p1-note"), { y: 60, rotate: (i) => [-14, 12, -8][i], opacity: 0, stagger: 0.12, duration: 0.5, transformOrigin: "50% 50%" }, 0)
      .from(q(".p1-lens"), { x: -220, y: -40, rotate: -30, duration: 0.8, transformOrigin: "50% 50%" }, 0.2)
      .from(q(".p1-q"), { scale: 0, rotate: -40, stagger: 0.12, duration: 0.35, ease: "back.out(3)", transformOrigin: "50% 50%" }, 0.6);
  } else if (step === 1) {
    tl.from(q(".p2-frame"), { scale: 0.6, opacity: 0, stagger: 0.08, duration: 0.35, ease: "back.out(2)", transformOrigin: "50% 50%" }, 0);
    q(".p2-line").forEach((el, i) => {
      const path = el as unknown as SVGPathElement;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len });
      tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.35, ease: "none" }, 0.3 + i * 0.1);
    });
    tl.from(q(".p2-bulb"), { scale: 0, rotate: -40, duration: 0.4, ease: "back.out(3)", transformOrigin: "50% 50%" }, 0.85).from(
      q(".p2-ray"),
      { scale: 0, stagger: 0.06, duration: 0.2, transformOrigin: "50% 100%" },
      1,
    );
  } else if (step === 2) {
    tl.from(q(".p3-key"), { scale: 0, stagger: 0.06, duration: 0.25, ease: "back.out(3)", transformOrigin: "50% 50%" }, 0)
      .from(q(".p3-ghost"), { opacity: 0, scale: 0.4, stagger: 0.08, duration: 0.25, transformOrigin: "50% 50%" }, 0.1)
      .set(q(".p3-ball"), { x: -290, y: -110 }, 0)
      .to(
        q(".p3-ball"),
        { keyframes: { x: [-240, -190, -140, -90, -40, 0], y: [-40, 0, -50, -70, -40, 0] }, duration: 0.9, ease: "none" },
        0.1,
      )
      .fromTo(q(".p3-head"), { x: 0 }, { x: 310, duration: 0.9, ease: "none" }, 0.1);
  } else {
    tl.from(q(".p4-f"), {
      x: (i) => [-200, 220, 0][i],
      y: (i) => [0, -160, 200][i],
      rotate: (i) => [-20, 25, -12][i],
      opacity: 0,
      stagger: 0.12,
      duration: 0.5,
      ease: "back.out(1.4)",
      transformOrigin: "50% 50%",
    }, 0)
      .from(q(".p4-bar"), { scaleX: 0, duration: 0.5, ease: "none", transformOrigin: "0% 50%" }, 0.4)
      .from(q(".p4-check"), { scale: 0, rotate: -90, duration: 0.35, ease: "back.out(3)", transformOrigin: "50% 50%" }, 0.85);
  }
  return tl;
}

export function Process({ index = "06" }: { index?: string }) {
  const scope = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const horizontal = useRef<ScrollTrigger | null>(null);
  const { allowMotion } = useMotionPreference();

  useGSAP(
    () => {
      if (!allowMotion) return; // every illustration simply renders finished
      const q = gsap.utils.selector(scope);
      const mm = gsap.matchMedia();

      // Desktop: pin the section and travel sideways through the steps.
      mm.add("(min-width: 1024px)", () => {
        const pin = q(".process-pin")[0];
        const track = q(".process-track")[0] as HTMLElement;
        const cards = q(".step-card");
        const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);

        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (fillRef.current) fillRef.current.style.transform = `scaleX(${self.progress})`;
              if (counterRef.current) counterRef.current.textContent = `0${Math.min(4, Math.floor(self.progress * 3.999) + 1)}`;
            },
          },
        });
        horizontal.current = travel.scrollTrigger ?? null;

        cards.forEach((card, i) => {
          const tl = stepTimeline(card, i);
          // The first card is already on screen, so it builds while the section scrolls into place.
          if (i === 0) ScrollTrigger.create({ trigger: pin, start: "top 75%", end: "top top", scrub: 0.5, animation: tl });
          else ScrollTrigger.create({ trigger: card, containerAnimation: travel, start: "left 85%", end: "center 55%", scrub: 0.5, animation: tl });
          // Cards ease up in scale as they reach the centre — you feel the sequence advance.
          if (i > 0)
            gsap.fromTo(
              card,
              { scale: 0.88, rotate: i % 2 ? 2 : -2, opacity: 0.55 },
              {
                scale: 1,
                rotate: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: { trigger: card, containerAnimation: travel, start: "left 100%", end: "left 35%", scrub: true },
              },
            );
        });
        return () => {
          horizontal.current = null;
        };
      });

      // Smaller screens: no pinning — each card builds as it scrolls through the viewport.
      mm.add("(max-width: 1023.98px)", () => {
        q(".step-card").forEach((card, i) => {
          ScrollTrigger.create({ trigger: card, start: "top 85%", end: "center 55%", scrub: 0.5, animation: stepTimeline(card, i) });
        });
        gsap.fromTo(
          q(".process-line-fill"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: q(".process-track")[0], start: "top 75%", end: "bottom 60%", scrub: true } },
        );
      });
    },
    { scope, dependencies: [allowMotion], revertOnUpdate: true },
  );

  /** Jump to a step from the progress labels (desktop). */
  const goTo = (i: number) => {
    const st = horizontal.current;
    if (!st) return;
    const y = st.start + ((st.end - st.start) * i) / (processSteps.length - 1);
    window.scrollTo({ top: y, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <section ref={scope} id="process" aria-labelledby="process-title" className="relative bg-ink text-paper">
      {/* With motion off the steps sit in a static grid instead of a pinned, sideways sequence. */}
      <div
        className={cn(
          "process-pin relative flex flex-col py-24",
          allowMotion && "lg:h-[100svh] lg:min-h-[640px] lg:overflow-hidden lg:pb-10 lg:pt-24",
        )}
      >
        <div className="container-x flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel index={index} className="text-paper/60 [&>span:first-child]:text-paper [&>span:nth-child(2)]:bg-paper/30">
              Process
            </SectionLabel>
            <SplitReveal
              id="process-title"
              className="display mt-5 text-[clamp(2.4rem,5vw,4.75rem)]"
              parts={[
                { text: "Good Work Starts", breakAfter: true },
                { text: "With a" },
                { text: "Good Idea.", className: "serif-accent text-lime" },
              ]}
            />
          </div>
          <p className={cn("hidden items-baseline gap-2", allowMotion && "lg:flex")} aria-hidden>
            <span ref={counterRef} className="display text-[5.5rem] leading-none text-lime">
              01
            </span>
            <span className="label-mono text-paper/50">/ 04</span>
          </p>
        </div>

        <div className="relative mt-12 min-h-0 flex-1 lg:mt-10">
          {/* Mobile progress line */}
          <span aria-hidden className="absolute bottom-0 left-[calc(clamp(1rem,4vw,3.5rem)+7px)] top-0 w-[2px] bg-paper/15 lg:hidden" />
          <span
            aria-hidden
            className="process-line-fill absolute bottom-0 left-[calc(clamp(1rem,4vw,3.5rem)+7px)] top-0 w-[2px] origin-top bg-lime lg:hidden"
          />

          <ol
            className={cn(
              "process-track flex h-full flex-col gap-6 pl-[calc(clamp(1rem,4vw,3.5rem)+2.25rem)] pr-[clamp(1rem,4vw,3.5rem)] lg:pl-[clamp(1rem,4vw,3.5rem)]",
              allowMotion ? "lg:flex-row lg:gap-8 lg:pr-[20vw] lg:will-change-transform" : "lg:grid lg:grid-cols-2 lg:gap-6",
            )}
          >
            {processSteps.map((step, i) => (
              <li
                key={step.n}
                className={cn(
                  // Not selectable: a drag or long-press while scrolling shouldn't paint the card with selection colour.
                  "step-card relative grid shrink-0 select-none overflow-hidden rounded-xl bg-paper text-ink lg:grid-cols-[1fr_1.1fr]",
                  allowMotion && "lg:h-[min(100%,26.5rem)] lg:w-[min(66vw,980px)] lg:self-center",
                )}
              >
                <span aria-hidden className="absolute -left-[2.3rem] top-5 size-4 rounded-full border-2 border-lime bg-ink lg:hidden" />
                <div className="flex flex-col justify-between gap-3 p-5 sm:gap-5 sm:p-7 lg:gap-6 lg:p-9">
                  <span
                    aria-hidden
                    className="step-number display block text-[clamp(3rem,7vw,6.5rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)] lg:[-webkit-text-stroke:2px_var(--color-ink)]"
                  >
                    {step.n}
                  </span>
                  <div className="step-copy">
                    <h3 className="display text-[clamp(1.75rem,3vw,2.75rem)]">
                      <span className="sr-only">Step {step.n}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-[0.98rem] leading-relaxed text-ink-soft lg:text-[1.02rem]">{step.text}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5 sm:gap-2" aria-label={`${step.title} outputs`}>
                      {step.outputs.map((o) => (
                        <li key={o} className="rounded-full px-2.5 py-1 text-xs font-medium shadow-[inset_0_0_0_1px_rgb(20_18_16/0.2)] sm:px-3 sm:py-1.5 sm:text-sm">
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={cn("relative h-44 overflow-hidden sm:h-60 lg:h-auto", panelBg[i])}>
                  <div className="absolute inset-0 p-3 sm:p-5 lg:p-7">
                    <ProcessArt step={i} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Desktop progress + step jump links */}
        <div className={cn("container-x mt-8 hidden", allowMotion && "lg:block")}>
          <div className="relative h-[2px] bg-paper/15">
            <span ref={fillRef} className="absolute inset-0 origin-left scale-x-0 bg-lime" />
          </div>
          <div className="mt-4 grid grid-cols-4">
            {processSteps.map((step, i) => (
              <button
                key={step.n}
                type="button"
                onClick={() => goTo(i)}
                className="label-mono justify-self-start text-paper/60 transition-colors hover:text-lime"
              >
                {step.n} — {step.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
