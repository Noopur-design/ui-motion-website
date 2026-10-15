import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { ArrowUpRight, Clapperboard, Play } from "lucide-react";
import { ReelPoster } from "@/components/art/ReelPoster";
import { Artwork } from "@/components/art/Artwork";
import { PreviewVideo } from "@/components/media/MediaFrame";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { AnimatedDialog, DialogCloseButton, DialogTitle } from "@/components/ui/dialog";
import { Button, ArrowNudge } from "@/components/ui/button";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { reelStyles, showreel } from "@/content/media";
import { cn, formatTime } from "@/lib/utils";
import { gsap, useGSAP } from "@/lib/gsap";
import { useInViewPlay } from "@/hooks/useInViewPlay";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { useStudioUI } from "@/hooks/useStudioUI";

/** Reads a video's real duration from its metadata (only once `enabled`), so the label never drifts from the file. */
function useVideoDuration(src: string, enabled: boolean) {
  const [duration, setDuration] = useState<number | null>(null);
  useEffect(() => {
    if (!src || !enabled || duration !== null) return;
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.muted = true;
    const onMeta = () => Number.isFinite(probe.duration) && setDuration(probe.duration);
    probe.addEventListener("loadedmetadata", onMeta);
    probe.src = src;
    return () => {
      probe.removeEventListener("loadedmetadata", onMeta);
      probe.removeAttribute("src");
      probe.load();
    };
  }, [src, enabled, duration]);
  return duration;
}

export function Showreel() {
  const { setReelOpen } = useStudioUI();
  const [frameRef, playing] = useInViewPlay<HTMLButtonElement>(0.3);
  const nearFrame = useInView(frameRef, { margin: "300px 0px" });
  const realDuration = useVideoDuration(showreel.video, nearFrame);
  const durationLabel = realDuration ? formatTime(realDuration) : showreel.durationLabel;
  const sectionRef = useRef<HTMLElement>(null);
  const { allowMotion } = useMotionPreference();

  // Gentle scale-up of the reel frame as it scrolls into place.
  useGSAP(
    () => {
      if (!allowMotion) return;
      gsap.fromTo(
        ".reel-frame",
        { scale: 0.92, borderRadius: "22px" },
        {
          scale: 1,
          borderRadius: "6px",
          ease: "none",
          scrollTrigger: { trigger: ".reel-frame", start: "top bottom", end: "center 60%", scrub: 0.6 },
        },
      );
    },
    { scope: sectionRef, dependencies: [allowMotion], revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} id="showreel" aria-labelledby="showreel-title" className="pb-20 pt-2 md:pb-28">
      <div className="container-x">
        <div className="flex items-center justify-between gap-4">
          <SectionLabel index="02">Showreel</SectionLabel>
          <p className="label-mono hidden text-ink-soft sm:block" aria-hidden>
            Sound on ↗
          </p>
        </div>

        <button
          ref={frameRef}
          type="button"
          onClick={() => setReelOpen(true)}
          className="reel-frame group relative mt-4 block aspect-[4/3] w-full overflow-hidden rounded-md bg-ink text-left text-paper will-change-transform sm:aspect-video"
          aria-label={`Play ${showreel.title}, ${durationLabel}`}
        >
          {showreel.poster ? (
            <img src={showreel.poster} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
          ) : (
            <ReelPoster play={playing} className="absolute inset-0 transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.03]" />
          )}
          {showreel.preview && <PreviewVideo src={showreel.preview} active={playing} />}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />

          <span aria-hidden className="absolute inset-0 grid place-items-center">
            <span className="relative grid size-24 place-items-center rounded-full bg-lime text-ink transition-transform duration-700 ease-out-expo group-hover:scale-110 sm:size-32 md:size-36">
              <span className="absolute inset-0 rounded-full border border-lime opacity-0 transition-all duration-700 ease-out-expo group-hover:scale-125 group-hover:opacity-100" />
              <Play className="ml-1.5 size-9 fill-current md:size-11" />
            </span>
          </span>

          <span aria-hidden className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 sm:p-6 md:p-8">
            <span>
              <span className="label-mono block text-paper/70">Now showing</span>
              <span className="display mt-2 block text-[clamp(1.6rem,3.6vw,3.25rem)]">{showreel.title}</span>
            </span>
            <span className="label-mono inline-flex items-center gap-2 rounded-full bg-paper px-3 py-2 text-ink">
              <span className="size-1.5 rounded-full bg-orange" />
              {durationLabel}
            </span>
          </span>
        </button>

        <div className="mt-12 grid gap-6 md:mt-16 lg:grid-cols-12 lg:items-end">
          <SplitReveal
            id="showreel-title"
            className="display text-display-lg lg:col-span-8"
            parts={[
              { text: "A Little Bit of Everything.", breakAfter: true },
              { text: "A Lot of Imagination.", className: "serif-accent text-cobalt" },
            ]}
          />
          <Reveal className="lg:col-span-4" delay={0.1}>
            <p className="max-w-sm text-lg leading-relaxed text-ink-soft">
              Characters, brand systems, explainers and experiments — a quick tour of the things we love making. Pick a style
              to jump straight to the work.
            </p>
          </Reveal>
        </div>

        <StyleStrip />
      </div>

    </section>
  );
}

function StyleStrip() {
  const { showWork } = useStudioUI();
  const { allowMotion } = useMotionPreference();
  const [hovered, setHovered] = useState<string | null>(null);
  const [stripRef, inView] = useInViewPlay<HTMLUListElement>(0.4);

  return (
    <div className="mt-10 md:mt-12">
      <h3 className="sr-only">Animation styles in the reel</h3>
      <ul
        ref={stripRef}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-6"
      >
        {reelStyles.map((style, i) => {
          // Touch screens: run the loops while the strip is on screen. Desktop: on hover/focus.
          const active = inView || hovered === style.id;
          return (
            <Reveal as="li" key={style.id} delay={i * 0.05} className="w-[44vw] shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                onClick={() => showWork(style.filter)}
                onMouseEnter={() => setHovered(style.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(style.id)}
                onBlur={() => setHovered(null)}
                className="group relative block w-full text-left"
              >
                <span className="frame relative block aspect-[5/4] overflow-hidden rounded-md">
                  <Artwork variant={style.art} play={active && allowMotion} className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                  {style.preview && <PreviewVideo src={style.preview} active={active && allowMotion} />}
                  <span className="absolute right-2 top-2 grid size-8 scale-75 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </span>
                <span className="mt-3 flex items-start gap-2 text-[0.95rem] font-medium leading-snug">
                  <span className="label-mono pt-[0.2rem] text-ink-faint">0{i + 1}</span>
                  <span className="decoration-ink/30 underline-offset-4 group-hover:underline">{style.label}</span>
                </span>
                <span className="sr-only">— see related work</span>
              </button>
            </Reveal>
          );
        })}
      </ul>
    </div>
  );
}

/** Global reel overlay — rendered once in the app shell, opened from the hero sticker or the reel frame. */
export function ReelDialog() {
  const { reelOpen: open, setReelOpen: onOpenChange } = useStudioUI();
  return (
    <AnimatedDialog
      open={open}
      onOpenChange={onOpenChange}
      enter="fade"
      className="inset-0 flex flex-col items-center justify-center p-3 sm:p-6 md:p-10"
      overlayClassName="bg-ink/92"
    >
      <div className="flex w-full max-w-6xl items-center justify-between gap-4 pb-3 text-paper">
        <DialogTitle className="display text-xl sm:text-2xl">{showreel.title}</DialogTitle>
        <DialogCloseButton />
      </div>
      <div className="w-full max-w-6xl overflow-hidden rounded-md">
        {showreel.video ? (
          <VideoPlayer
            src={showreel.video}
            poster={showreel.poster}
            captions={showreel.captions}
            title={showreel.title}
            autoPlay
            className="aspect-video w-full"
          />
        ) : (
          <ReelComingSoon onClose={() => onOpenChange(false)} />
        )}
      </div>
    </AnimatedDialog>
  );
}

/** Shown in place of a player when no reel file is configured — no fake controls. */
function ReelComingSoon({ onClose }: { onClose: () => void }) {
  const { showWork } = useStudioUI();
  return (
    <div className="relative grid aspect-[4/5] w-full place-items-center bg-ink text-paper sm:aspect-video">
      <ReelPoster play className="absolute inset-0 opacity-35" />
      <div className="relative max-w-md px-6 text-center">
        <Clapperboard className="mx-auto size-8 text-lime" aria-hidden />
        <p className="display mt-4 text-3xl sm:text-4xl">The 2026 reel is in the edit.</p>
        <p className="mt-3 text-paper/75">
          Our new cut lands soon. In the meantime, our selected work shows what we’ve been making.
        </p>
        <Button
          variant="paper"
          className="mt-6"
          onClick={() => {
            onClose();
            showWork();
          }}
        >
          See selected work <ArrowNudge />
        </Button>
        {import.meta.env.DEV && (
          <p className={cn("label-mono mt-6 text-lime/80")}>Dev: set showreel.video in src/content/media.ts</p>
        )}
      </div>
    </div>
  );
}
