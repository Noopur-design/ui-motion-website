import { useState } from "react";
import { Check } from "lucide-react";
import { ugcVideos } from "@/content/media";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { Button, ArrowNudge } from "@/components/ui/button";
import { PhoneVideo, VerticalPlayerDialog, type VerticalClip } from "@/components/media/PhoneVideo";
import { cn } from "@/lib/utils";
import { useStudioUI } from "@/hooks/useStudioUI";

const points = [
  "A hook that lands in the first second",
  "Shot vertical first, recut for 4:5 and 1:1",
  "Burned-in captions for sound-off viewing",
  "Hook and ending variations for testing",
];

/** Vertical, creator-style product videos — the UGC service in action. */
export function UgcShowcase({ index = "02" }: { index?: string }) {
  const { startProject } = useStudioUI();
  const [open, setOpen] = useState<VerticalClip | null>(null);

  return (
    <section id="ugc-videos" aria-labelledby="ugc-title" className="overflow-hidden py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-5">
          <SectionLabel index={index}>UGC product videos</SectionLabel>
          <SplitReveal
            id="ugc-title"
            className="display mt-6 text-[clamp(2.6rem,5.6vw,5.5rem)]"
            parts={[
              { text: "UGC That Feels Real.", breakAfter: true },
              { text: "Product videos people", className: "serif-accent text-orange" },
              { text: "actually watch.", className: "serif-accent text-orange" },
            ]}
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              Creator-style unboxings, demos and first impressions — scripted for a strong hook, filmed vertical and
              captioned so they work with the sound off.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ul className="mt-8 space-y-3">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-lime">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <Button className="mt-10" size="lg" onClick={() => startProject("UGC product video")}>
              Start a UGC project <ArrowNudge />
            </Button>
          </Reveal>
        </div>

        <ul className="flex items-end justify-center gap-3 sm:gap-5 lg:col-span-7">
          {ugcVideos.map((v, i) => (
            <Reveal as="li" key={v.id} delay={0.1 + i * 0.1} className={cn("w-[31%] max-w-[15rem]", i === 1 && "-translate-y-6 sm:-translate-y-10")}>
              <PhoneVideo
                src={v.video}
                poster={v.poster}
                label={`Play UGC sample: ${v.label}`}
                onOpen={() => setOpen({ src: v.video, poster: v.poster, title: v.label })}
                paused={Boolean(open)}
              />
              <p className="mt-4 text-sm font-semibold sm:text-base">{v.label}</p>
              <p className="mt-1 hidden text-sm text-ink-soft sm:block">“{v.hook}”</p>
            </Reveal>
          ))}
        </ul>
      </div>

      <VerticalPlayerDialog clip={open} onClose={() => setOpen(null)} />
    </section>
  );
}
