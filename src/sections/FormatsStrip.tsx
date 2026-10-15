import { useRef } from "react";
import { useInView } from "motion/react";
import { Artwork, type ArtVariant } from "@/components/art/Artwork";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { Tilt } from "@/components/ui/tilt";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "@/hooks/useMotionPreference";

const formats: { ratio: string; label: string; use: string; art: ArtVariant; aspect: string; width: string }[] = [
  { ratio: "16:9", label: "Film", use: "Websites, YouTube, events", art: "illustration", aspect: "aspect-video", width: "lg:col-span-5" },
  { ratio: "9:16", label: "Vertical", use: "Reels, TikTok, Shorts, Stories", art: "ugc", aspect: "aspect-[9/16]", width: "lg:col-span-2" },
  { ratio: "1:1", label: "Square", use: "Feeds and paid social", art: "brand", aspect: "aspect-square", width: "lg:col-span-3" },
  { ratio: "4:5", label: "Portrait", use: "Instagram and LinkedIn feeds", art: "campaign", aspect: "aspect-[4/5]", width: "lg:col-span-2" },
];

/** Every piece is mastered once and cut for each screen — shown as animated frames at true ratios. */
export function FormatsStrip({ index = "03" }: { index?: string }) {
  return (
    <section aria-labelledby="formats-title" className="border-t border-ink/10 bg-paper-2 py-24 md:py-32">
      <div className="container-x">
        <SectionLabel index={index}>Delivery</SectionLabel>
        <SplitReveal
          id="formats-title"
          className="display mt-6 max-w-4xl text-display-lg"
          parts={[{ text: "Made for" }, { text: "Every Screen.", className: "serif-accent text-cobalt" }]}
        />
        <ul className="mt-14 grid grid-cols-2 items-end gap-x-4 gap-y-10 md:mt-20 md:grid-cols-4 lg:grid-cols-12 lg:gap-6">
          {formats.map((f, i) => (
            <Reveal as="li" key={f.ratio} delay={i * 0.08} className={f.width}>
              <FormatCard {...f} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FormatCard({ ratio, label, use, art, aspect }: (typeof formats)[number]) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { amount: 0.4 });
  const { allowMotion } = useMotionPreference();
  return (
    <div ref={ref} className="group">
      <Tilt>
        <div className={cn("frame relative overflow-hidden rounded-lg", aspect)}>
          <Artwork variant={art} play={onScreen && allowMotion} className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105" />
          <span className="label-mono absolute left-2 top-2 rounded-full bg-paper/90 px-2 py-1 text-ink">{ratio}</span>
        </div>
      </Tilt>
      <p className="mt-3 font-semibold">{label}</p>
      <p className="text-sm text-ink-soft">{use}</p>
    </div>
  );
}
