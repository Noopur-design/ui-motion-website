import { useRef } from "react";
import { Link } from "react-router";
import { useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/studio";
import { ServiceArt } from "@/components/art/ServiceArt";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { Tilt } from "@/components/ui/tilt";
import { Button, ArrowNudge } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { serviceTileBg } from "./ServicesList";

/** Home-page overview: one animated card per service, each linking into the Services page. */
export function ServicesTeaser({ index = "04" }: { index?: string }) {
  return (
    <section aria-labelledby="services-teaser-title" className="border-t border-ink/10 bg-paper-2 py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index={index}>Services</SectionLabel>
            <SplitReveal
              id="services-teaser-title"
              className="display mt-6 text-display-lg"
              parts={[
                { text: "From the First Sketch", breakAfter: true },
                { text: "to the" },
                { text: "Final Frame.", className: "serif-accent text-cobalt" },
              ]}
            />
          </div>
          <Reveal className="flex flex-col items-start gap-6 lg:col-span-4" delay={0.15}>
            <p className="max-w-sm text-lg leading-relaxed text-ink-soft">
              Seven ways we help ideas move — from a single logo sting to a full launch film and creator-style UGC.
            </p>
            <Button asChild variant="outline">
              <Link to="/services">
                All services <ArrowNudge />
              </Link>
            </Button>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} delay={(i % 4) * 0.06}>
              <ServiceCard id={service.id} index={i} />
            </Reveal>
          ))}
          <Reveal as="li" delay={0.18}>
            <Link
              to="/contact"
              className="group flex h-full min-h-56 flex-col justify-between rounded-lg bg-ink p-6 text-paper transition-colors hover:bg-cobalt"
            >
              <span className="label-mono text-paper/60">Not sure yet?</span>
              <span className="display text-[clamp(1.6rem,2.2vw,2.1rem)]">
                Tell us the idea — we’ll suggest the format.
              </span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-lime">
                Start a conversation <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

function ServiceCard({ id, index }: { id: string; index: number }) {
  const service = services.find((s) => s.id === id)!;
  const ref = useRef<HTMLAnchorElement>(null);
  const onScreen = useInView(ref, { amount: 0.4 });
  const { allowMotion } = useMotionPreference();

  return (
    <Link ref={ref} to={`/services#${service.id}`} className="group block h-full">
      <Tilt className="h-full">
        <div className="frame flex h-full flex-col overflow-hidden rounded-lg bg-paper transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-34px_rgb(20_18_16/0.6)]">
          <div className={cn("relative grid aspect-[16/11] place-items-center overflow-hidden", serviceTileBg[service.art])}>
            <ServiceArt
              kind={service.art}
              play={onScreen && allowMotion}
              className="w-[46%] transition-transform duration-700 ease-out-expo group-hover:scale-110"
            />
            <span className="label-mono absolute left-3 top-3 text-ink/60">0{index + 1}</span>
            {service.id === "ugc" && (
              <span className="label-mono absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-lime">New</span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <h3 className="display flex items-start justify-between gap-3 text-[1.6rem] leading-[0.95]">
              {service.title}
              <ArrowUpRight
                className="mt-1 size-5 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </h3>
            <p className="text-[0.95rem] leading-relaxed text-ink-soft">{service.summary}</p>
          </div>
        </div>
      </Tilt>
    </Link>
  );
}
