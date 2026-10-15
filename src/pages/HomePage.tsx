import { Link } from "react-router";
import { Hero } from "@/sections/Hero";
import { Showreel } from "@/sections/Showreel";
import { FeaturedFilm } from "@/sections/FeaturedFilm";
import { WorkGrid } from "@/sections/WorkGrid";
import { ServicesTeaser } from "@/sections/ServicesTeaser";
import { Process } from "@/sections/Process";
import { CtaBand } from "@/sections/CtaBand";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { Button, ArrowNudge } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function HomePage() {
  usePageMeta(
    null,
    "An independent motion design and animation studio: motion graphics, 2D animation, illustration, explainer videos, brand films and UGC that make ideas move.",
  );

  return (
    <>
      <Hero />
      <Showreel />
      <FeaturedFilm index="03" />

      <section aria-labelledby="featured-title" className="py-24 md:py-32">
        <div className="container-x">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <SectionLabel index="04">Selected work</SectionLabel>
              <SplitReveal
                id="featured-title"
                className="display mt-6 text-display-lg"
                parts={[
                  { text: "Made to Move.", breakAfter: true },
                  { text: "Built to Connect.", className: "serif-accent text-orange" },
                ]}
              />
            </div>
            <Reveal className="flex flex-col items-start gap-6 lg:col-span-4" delay={0.15}>
              <p className="max-w-sm text-lg leading-relaxed text-ink-soft">
                Films, identities, UGC and experiments — each one designed and animated frame by frame.
              </p>
              <Button asChild variant="outline">
                <Link to="/work">
                  View all work <ArrowNudge />
                </Link>
              </Button>
            </Reveal>
          </div>
          <div className="mt-12 md:mt-16">
            <WorkGrid limit={6} />
          </div>
        </div>
      </section>

      <ServicesTeaser index="05" />
      <Process index="06" />
      <CtaBand />
    </>
  );
}
