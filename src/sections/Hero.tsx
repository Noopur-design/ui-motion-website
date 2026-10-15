import type { CSSProperties } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { Button, ArrowNudge } from "@/components/ui/button";
import { HandArrow, RegMark, Sparkle } from "@/components/decor/Scribbles";
import { PreviewVideo } from "@/components/media/MediaFrame";
import { C, hand, mono } from "@/components/art/palette";
import { showreel } from "@/content/media";
import { site } from "@/content/site";
import { easeOutExpo } from "@/lib/motion";
import { useInViewPlay } from "@/hooks/useInViewPlay";
import { useStudioUI } from "@/hooks/useStudioUI";

const line = (i: number) => ({
  initial: { y: "105%" },
  animate: { y: "0%" },
  transition: { duration: 1, ease: easeOutExpo, delay: 0.1 + i * 0.09 },
});

export function Hero() {
  const [ref, playing] = useInViewPlay<HTMLElement>(0.2);
  const { setReelOpen, startProject } = useStudioUI();

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative overflow-x-clip pb-12 pt-5 md:pb-14 md:pt-8">
      <div className="container-x">
        <motion.div
          className="label-mono flex items-center justify-between gap-4 text-ink-soft"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p>
            ( {site.descriptor} )
          </p>
          <p className="hidden sm:block" aria-hidden>
            TC 00:00:00:01
          </p>
        </motion.div>

        <div className="relative mt-5 md:mt-6">
          <h1
            id="hero-title"
            className="display relative z-10 text-[clamp(3.7rem,11.6vw,11.25rem)] leading-[0.84] tracking-[-0.045em]"
          >
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span className="block" {...line(0)}>
                We Make
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span className="flex items-center gap-[0.12em]" {...line(1)}>
                Ideas
                <InlineClip playing={playing} />
              </motion.span>
            </span>
            <span className="block pl-[0.9em] sm:pl-[1.6em]">
              <MoveWord />
            </span>
          </h1>

          <Collage playing={playing} onPlayReel={() => setReelOpen(true)} />
        </div>

        <div className="mt-20 grid gap-8 sm:mt-14 md:mt-10 lg:grid-cols-12 lg:items-end">
          <motion.p
            className="max-w-[32rem] text-lg leading-relaxed text-ink-soft md:text-xl lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.55 }}
          >
            We turn ideas into compelling motion, expressive illustrations, and animated stories that make brands
            impossible to ignore.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center gap-3 lg:col-span-7 lg:justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.65 }}
          >
            <Button asChild size="lg">
              <Link to="/work">
                Explore Our Work <ArrowNudge />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => startProject()}>
              Start a Project
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** "Move." with onion-skin ghost frames that collapse into the word on load. */
function MoveWord() {
  const ghosts = [0.42, 0.28, 0.14];
  return (
    <span className="relative inline-block">
      {ghosts.map((offset, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="serif-accent absolute left-0 top-0 text-[1.12em] leading-[0.84] text-transparent [-webkit-text-stroke:1.5px_var(--color-orange)]"
          style={{ opacity: 0.18 + i * 0.16 }}
          initial={{ x: `-${offset * 3.2}em`, opacity: 0 }}
          animate={{ x: `-${offset * 0.32}em`, opacity: 0.18 + i * 0.16 }}
          transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.32 + i * 0.04 }}
        >
          Move.
        </motion.span>
      ))}
      <motion.span
        className="serif-accent relative inline-block text-[1.12em] leading-[0.84] text-orange"
        initial={{ x: "-0.6em", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.3 }}
      >
        Move.
      </motion.span>
    </span>
  );
}

/** Pill-shaped frame set into the headline. Plays the reel loop when one is supplied. */
function InlineClip({ playing }: { playing: boolean }) {
  return (
    <span
      aria-hidden
      className="relative inline-block h-[0.66em] w-[1.5em] shrink-0 translate-y-[0.04em] overflow-hidden rounded-full bg-cobalt shadow-[inset_0_0_0_2px_var(--color-ink)]"
    >
      <svg viewBox="0 0 300 132" preserveAspectRatio="xMidYMid slice" className="art absolute inset-0 h-full w-full" data-play={playing}>
        <rect width="300" height="132" fill={C.cobalt} />
        <line x1="40" y1="104" x2="260" y2="104" stroke={C.paper} strokeOpacity=".5" strokeWidth="3" />
        <circle
          cx="62"
          cy="78"
          r="24"
          fill={C.lime}
          className="anim a-ease"
          style={{ ["--travel" as string]: "360%", animationDuration: "1.6s" } as CSSProperties}
        />
        <circle cx="150" cy="40" r="10" fill={C.orange} className="anim a-float" />
        <rect x="214" y="22" width="26" height="26" rx="3" fill={C.paper} className="anim a-spin" style={{ animationDuration: "5s" }} />
      </svg>
      {showreel.preview && <PreviewVideo src={showreel.preview} active={playing} />}
    </span>
  );
}

function Collage({ playing, onPlayReel }: { playing: boolean; onPlayReel: () => void }) {
  // Spacing chart: ball positions eased in toward the floor.
  const ghosts = [0, 0.22, 0.42, 0.6, 0.76, 0.9].map((t) => 64 + t * t * 174);

  return (
    <div className="relative mt-12 grid grid-cols-12 gap-3 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:block lg:w-[40%]">
      {/* Frame A — squash & stretch with onion skins */}
      <motion.figure
        className="pointer-events-auto relative col-span-8 lg:absolute lg:right-[4%] lg:top-[2%] lg:w-[78%]"
        initial={{ opacity: 0, y: 40, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: 2.5 }}
        transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.35 }}
      >
        <div className="mb-2 flex justify-between label-mono text-ink-soft" aria-hidden>
          <span>SC.01 / Squash &amp; stretch</span>
          <span className="hidden sm:inline">24 fps</span>
        </div>
        <div className="frame overflow-hidden rounded-md shadow-[0_24px_60px_-30px_rgb(20_18_16/0.45)]">
          <svg viewBox="0 0 400 300" className="art block w-full" data-play={playing} aria-hidden>
            <rect width="400" height="300" fill={C.cobalt} />
            <line x1="40" y1="262" x2="360" y2="262" stroke={C.paper} strokeWidth="2" />
            <line x1="320" y1="40" x2="320" y2="262" stroke={C.paper} strokeOpacity=".45" strokeWidth="1.5" />
            {ghosts.map((cy, i) => (
              <g key={i}>
                <line x1="312" y1={cy + 24} x2="328" y2={cy + 24} stroke={C.paper} strokeOpacity=".7" strokeWidth="1.5" />
                <circle cx="190" cy={cy} r="24" fill="none" stroke={C.lime} strokeOpacity={0.2 + i * 0.08} strokeWidth="2" />
              </g>
            ))}
            <text x="336" y="70" fill={C.paper} fontSize="11" opacity=".7" style={mono}>
              1
            </text>
            <text x="336" y="268" fill={C.paper} fontSize="11" opacity=".7" style={mono}>
              9
            </text>
            <ellipse cx="190" cy="263" rx="30" ry="5" fill={C.ink} opacity=".4" className="anim a-shadow" />
            <circle
              cx="190"
              cy="64"
              r="24"
              fill={C.lime}
              className="anim a-bounce"
              style={{ ["--d" as string]: "362%", animationDuration: "1.3s" } as CSSProperties}
            />
            <text x="40" y="34" fill={C.paper} fontSize="11" opacity=".75" style={mono}>
              KEY 01 → 09
            </text>
          </svg>
        </div>
        <figcaption className="sr-only">An animation study of a bouncing ball, showing squash and stretch.</figcaption>
      </motion.figure>

      {/* Frame B — character test */}
      <motion.div
        aria-hidden
        className="relative col-span-4 mt-10 self-start lg:absolute lg:bottom-[2%] lg:left-[-6%] lg:mt-0 lg:w-[36%]"
        initial={{ opacity: 0, y: 40, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: -5 }}
        transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.5 }}
      >
        <div className="frame overflow-hidden rounded-md bg-lavender shadow-[0_24px_60px_-30px_rgb(20_18_16/0.45)]">
          <svg viewBox="0 0 200 200" className="art block w-full" data-play={playing}>
            <rect width="200" height="200" fill={C.lavender} />
            <g className="anim a-squish o-bottom">
              <path d="M52 168C40 120 64 66 104 64S164 116 150 168Z" fill={C.orange} />
              <g className="anim a-blink">
                <ellipse cx="88" cy="112" rx="10" ry="13" fill={C.paper} />
                <ellipse cx="122" cy="112" rx="10" ry="13" fill={C.paper} />
                <circle cx="91" cy="115" r="5" fill={C.ink} />
                <circle cx="125" cy="115" r="5" fill={C.ink} />
              </g>
              <path d="M94 138Q106 148 118 138" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
            <line x1="30" y1="168" x2="170" y2="168" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-2 hidden -rotate-2 text-xl text-cobalt lg:block" style={hand}>
          hold 12 frames
        </p>
      </motion.div>

      {/* Play-reel sticker */}
      <motion.div
        className="pointer-events-auto absolute -bottom-14 right-0 z-20 sm:-bottom-8 sm:right-2 lg:bottom-[6%] lg:right-[2%]"
        initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1, ease: easeOutExpo, delay: 0.8 }}
      >
        <ReelSticker onClick={onPlayReel} />
      </motion.div>

      <HandArrow
        className="absolute -bottom-2 right-28 hidden h-16 w-20 -scale-x-100 rotate-12 text-ink lg:bottom-[20%] lg:right-[22%] lg:block"
        delay={1.2}
      />
      <RegMark className="absolute -left-2 top-0 hidden size-5 text-ink/40 lg:block" />
      <Sparkle className="absolute right-[2%] top-[-4%] hidden size-7 text-orange lg:block" />
    </div>
  );
}

function ReelSticker({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative grid size-24 place-items-center rounded-full bg-lime text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink),0_18px_40px_-20px_rgb(20_18_16/0.6)] transition-transform duration-500 ease-out-expo hover:scale-105 sm:size-32"
      aria-label={`Play ${showreel.title}`}
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 transition-transform duration-[1.4s] ease-out-expo group-hover:rotate-[160deg] motion-reduce:transition-none" aria-hidden>
        <defs>
          <path id="sticker-ring" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
        </defs>
        <text fontSize="10.5" fill={C.ink} style={{ ...mono, letterSpacing: "0.2em" }}>
          {/* textLength = ring circumference (2π·44) so the phrase closes the loop exactly */}
          <textPath href="#sticker-ring" textLength="276" lengthAdjust="spacing">
            PLAY THE REEL • 2026 • PLAY THE REEL • 2026 •
          </textPath>
        </text>
      </svg>
      <span className="grid size-11 place-items-center rounded-full bg-ink text-lime transition-transform duration-500 group-hover:scale-110">
        <Play className="ml-0.5 size-4 fill-current" aria-hidden />
      </span>
    </button>
  );
}
