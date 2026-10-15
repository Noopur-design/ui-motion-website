import { useState } from "react";
import { Link } from "react-router";
import { Play, Volume2 } from "lucide-react";
import { featuredFilm } from "@/content/media";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { Sparkle } from "@/components/decor/Scribbles";
import { Button, ArrowNudge } from "@/components/ui/button";
import { PhoneVideo, VerticalPlayerDialog, type VerticalClip } from "@/components/media/PhoneVideo";
import { cn } from "@/lib/utils";
import { useInViewPlay } from "@/hooks/useInViewPlay";

/** Chapter cards that float around the phone (chapters as titled in the film). */
const chapters = [
  { label: "03 — Create", pos: "left-0 top-[12%] -rotate-6", delay: "-0.4s" },
  { label: "04 — Transform", pos: "right-0 top-[30%] rotate-[5deg]", delay: "-1.4s" },
  { label: "05 — Refine", pos: "left-[4%] bottom-[26%] rotate-3", delay: "-0.9s" },
  { label: "06 — Rise up", pos: "right-[2%] bottom-[10%] -rotate-[4deg]", delay: "-2s" },
];

/** Home-page feature for the studio's latest vertical film. */
export function FeaturedFilm({ index = "03" }: { index?: string }) {
  const [open, setOpen] = useState<VerticalClip | null>(null);
  const [ref, playing] = useInViewPlay<HTMLDivElement>(0.2);
  const play = () => setOpen({ src: featuredFilm.video, poster: featuredFilm.poster, title: featuredFilm.title });

  return (
    <section aria-labelledby="film-title" className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-6">
          <SectionLabel index={index} className="text-paper/60 [&>span:first-child]:text-paper [&>span:nth-child(2)]:bg-paper/30">
            Featured film
          </SectionLabel>
          <SplitReveal
            id="film-title"
            className="display mt-6 text-[clamp(3rem,7.4vw,7rem)]"
            parts={[
              { text: "Ideas Into", breakAfter: true },
              { text: "Impact.", className: "serif-accent text-lime" },
            ]}
          />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-paper/75 md:text-xl">
              A 35-second vertical brand film that takes an idea from the first pencil line to a finished identity and
              website — create, transform, refine, rise up.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Film details">
              {["Vertical 9:16", featuredFilm.durationLabel, "Sound on"].map((d) => (
                <li key={d} className="label-mono inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-paper/80 shadow-[inset_0_0_0_1px_rgb(243_238_228/0.25)]">
                  {d === "Sound on" && <Volume2 className="size-3.5" aria-hidden />}
                  {d}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button variant="lime" size="lg" onClick={play}>
                <Play className="size-4 fill-current" aria-hidden /> Watch with sound
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-paper shadow-[inset_0_0_0_1.5px_var(--color-paper)] hover:bg-paper hover:text-ink"
              >
                <Link to={`/work/${featuredFilm.slug}`}>
                  See the project <ArrowNudge />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>

        <div ref={ref} className="art relative lg:col-span-6" data-play={playing}>
          <Reveal delay={0.15} className="relative mx-auto w-[72%] max-w-[21rem] sm:w-[56%] lg:w-[58%]">
            <PhoneVideo
              size="lg"
              src={featuredFilm.loop}
              poster={featuredFilm.poster}
              label={`Play ${featuredFilm.title} with sound`}
              onOpen={play}
              paused={Boolean(open)}
            >
              <span className="label-mono absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1.5 text-paper">
                <span className="size-1.5 rounded-full bg-orange" /> Muted preview
              </span>
            </PhoneVideo>
          </Reveal>

          {/* Floating chapter cards (decorative; the copy above names the chapters) */}
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
            {chapters.map((c) => (
              <span key={c.label} className={cn("absolute", c.pos)}>
                <span
                  className="anim a-float label-mono block rounded-full bg-paper px-3.5 py-2 text-ink shadow-[0_18px_30px_-18px_rgb(0_0_0/0.8)]"
                  style={{ animationDelay: c.delay, animationDuration: "4s" }}
                >
                  {c.label}
                </span>
              </span>
            ))}
            <Sparkle className="absolute left-[18%] top-[2%] size-8 text-lime" />
            <Sparkle className="absolute bottom-[2%] right-[22%] size-6 text-orange" />
          </div>
        </div>
      </div>

      <VerticalPlayerDialog clip={open} onClose={() => setOpen(null)} />
    </section>
  );
}
