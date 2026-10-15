import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Artwork, type ArtVariant } from "@/components/art/Artwork";
import { Reveal, SectionLabel, SplitReveal, type TextPart } from "@/components/decor/Reveal";
import { Tilt } from "@/components/ui/tilt";
import { easeOutExpo } from "@/lib/motion";
import { useInViewPlay } from "@/hooks/useInViewPlay";

type Props = {
  index: string;
  label: string;
  title: TextPart[];
  intro: string;
  /** Artwork shown as a fanned stack of animated cards beside the title. */
  cards?: ArtVariant[];
  children?: ReactNode;
};

/** Title block for inner pages: a big split heading, intro and a fan of animated cards. */
export function PageHeader({ index, label, title, intro, cards, children }: Props) {
  return (
    <header className="container-x grid gap-12 pb-16 pt-8 md:pb-24 md:pt-14 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className={cards ? "lg:col-span-7" : "lg:col-span-10"}>
        <SectionLabel index={index}>{label}</SectionLabel>
        <SplitReveal as="h1" immediate className="display mt-6 text-[clamp(3rem,8.2vw,8.25rem)]" parts={title} />
        <Reveal delay={0.25}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">{intro}</p>
        </Reveal>
        {children && (
          <Reveal delay={0.35} className="mt-8 flex flex-wrap gap-3">
            {children}
          </Reveal>
        )}
      </div>
      {cards && (
        <div className="lg:col-span-5">
          <CardFan cards={cards} />
        </div>
      )}
    </header>
  );
}

const fan = [
  { rotate: -9, x: "-18%", y: "6%", z: 1 },
  { rotate: 6, x: "16%", y: "-4%", z: 2 },
  { rotate: -2, x: "0%", y: "10%", z: 3 },
];

/** Three animated artwork cards, fanned like prints on a desk. They deal in on load and loop while visible. */
export function CardFan({ cards }: { cards: ArtVariant[] }) {
  const [ref, playing] = useInViewPlay<HTMLDivElement>(0.2);
  return (
    <div ref={ref} aria-hidden className="relative mx-auto aspect-[5/4] w-full max-w-[34rem]">
      {cards.slice(0, 3).map((art, i) => (
        <motion.div
          key={art}
          className="absolute inset-[12%]"
          style={{ zIndex: fan[i].z }}
          initial={{ opacity: 0, y: 80, rotate: 0, x: "0%" }}
          animate={{ opacity: 1, y: fan[i].y, rotate: fan[i].rotate, x: fan[i].x }}
          transition={{ duration: 1, ease: easeOutExpo, delay: 0.25 + i * 0.12 }}
        >
          <Tilt className="h-full">
            <div className="frame h-full overflow-hidden rounded-lg shadow-[0_30px_60px_-30px_rgb(20_18_16/0.55)]">
              <Artwork variant={art} play={playing} />
            </div>
          </Tilt>
        </motion.div>
      ))}
    </div>
  );
}
