import { useRef } from "react";
import { useInView } from "motion/react";
import type { ServiceArt as ServiceArtKind } from "@/content/studio";
import { ServiceArt } from "@/components/art/ServiceArt";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { Tilt } from "@/components/ui/tilt";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "@/hooks/useMotionPreference";

const steps: { title: string; text: string; art: ServiceArtKind; bg: string }[] = [
  {
    title: "You tell us the idea",
    text: "A few lines is enough — what it is, who it’s for and when you need it.",
    art: "explainer",
    bg: "bg-lime",
  },
  {
    title: "We shape a plan",
    text: "We come back with questions, a suggested approach, timeline and a clear quote.",
    art: "illustration",
    bg: "bg-lavender",
  },
  {
    title: "We make it move",
    text: "Script, boards, animation and delivery — with check-ins at every stage.",
    art: "animation",
    bg: "bg-orange-soft",
  },
];

export function NextSteps({ index = "02" }: { index?: string }) {
  return (
    <section aria-labelledby="next-title" className="border-t border-ink/10 bg-paper-2 py-24 md:py-28">
      <div className="container-x">
        <SectionLabel index={index}>What happens next</SectionLabel>
        <SplitReveal
          id="next-title"
          className="display mt-6 text-display-md"
          parts={[{ text: "From hello to" }, { text: "first frame.", className: "serif-accent text-orange" }]}
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08}>
              <StepCard {...s} n={i + 1} />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepCard({ title, text, art, bg, n }: (typeof steps)[number] & { n: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { amount: 0.4 });
  const { allowMotion } = useMotionPreference();
  return (
    <div ref={ref} className="h-full">
      <Tilt className="h-full">
        <div className="frame flex h-full flex-col overflow-hidden rounded-lg bg-paper">
          <div className={cn("relative grid aspect-[16/9] place-items-center", bg)}>
            <ServiceArt kind={art} play={onScreen && allowMotion} className="w-[34%]" />
            <span className="label-mono absolute left-3 top-3 text-ink/60">0{n}</span>
          </div>
          <div className="p-5">
            <h3 className="display text-[1.75rem] leading-none">{title}</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">{text}</p>
          </div>
        </div>
      </Tilt>
    </div>
  );
}
