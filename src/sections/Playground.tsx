import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Shuffle } from "lucide-react";
import { studies } from "@/components/art/Studies";
import { C, hand, mono } from "@/components/art/palette";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { cn } from "@/lib/utils";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { gsap, useGSAP } from "@/lib/gsap";
import { useInViewPlay } from "@/hooks/useInViewPlay";
import { useMotionPreference } from "@/hooks/useMotionPreference";

// Only this (lazy-loaded) section needs the drawing and morphing plugins.
gsap.registerPlugin(DrawSVGPlugin, MorphSVGPlugin);

export default function Playground({ index = "02" }: { index?: string }) {
  const { paused, togglePaused, systemReduced } = useMotionPreference();

  return (
    <section id="playground" aria-labelledby="playground-title" className="bg-dots relative overflow-x-clip py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionLabel index={index}>Playground</SectionLabel>
            <SplitReveal
              id="playground-title"
              className="display mt-6 text-display-lg"
              parts={[
                { text: "Curiosity Is Part", breakAfter: true },
                { text: "of the" },
                { text: "Process.", className: "serif-accent text-orange" },
              ]}
            />
          </div>
          <Reveal className="flex flex-col items-start gap-5 lg:col-span-4" delay={0.15}>
            <p className="max-w-sm text-lg leading-relaxed text-ink-soft">
              Pages from the studio sketchbook — warm-ups, tests and small experiments we make between projects. Poke
              around.
            </p>
            {!systemReduced && (
              <button
                type="button"
                onClick={togglePaused}
                aria-pressed={paused}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-paper px-4 text-sm font-semibold shadow-[inset_0_0_0_1px_rgb(20_18_16/0.2)] transition-colors hover:bg-ink hover:text-paper"
              >
                {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
                {paused ? "Play the sketches" : "Pause the sketches"}
              </button>
            )}
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <Card className="lg:col-span-4" tilt={-1.5} tape="left">
            <FollowCharacter />
          </Card>
          <Card className="lg:col-span-5" tilt={0.8} tape="center" lined>
            <LineDrawing />
          </Card>
          <Card className="md:col-span-2 lg:col-span-3" tilt={2} tape="right">
            <MorphShape />
          </Card>
          <Card className="md:col-span-2 lg:col-span-7" tilt={-0.6} tape="left">
            <Storyboard />
          </Card>
          <Card className="md:col-span-2 lg:col-span-5" tilt={1.2} tape="right">
            <KineticWord />
          </Card>
        </div>

        <StudiesStrip />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function Card({
  children,
  className,
  tilt = 0,
  tape,
  lined = false,
}: {
  children: ReactNode;
  className?: string;
  tilt?: number;
  tape?: "left" | "center" | "right";
  lined?: boolean;
}) {
  return (
    <Reveal className={cn("relative", className)}>
      <div
        className={cn(
          "relative h-full rounded-sm bg-paper p-5 shadow-[0_1px_0_rgb(20_18_16/0.08),0_22px_40px_-28px_rgb(20_18_16/0.5)] md:p-6",
          lined && "bg-lines",
        )}
        style={{ rotate: `${tilt}deg` }}
      >
        {tape && (
          <span
            aria-hidden
            className={cn(
              "absolute -top-3 h-6 w-20 bg-lavender/70 mix-blend-multiply",
              tape === "left" && "left-6 -rotate-6",
              tape === "center" && "left-1/2 -translate-x-1/2 rotate-2",
              tape === "right" && "right-6 rotate-6",
            )}
          />
        )}
        {children}
      </div>
    </Reveal>
  );
}

function CardHead({ title, note, action }: { title: string; note?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="label-mono text-ink">{title}</h3>
        {note && (
          <p className="mt-1 text-xl leading-none text-cobalt" style={hand}>
            {note}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function SmallButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold shadow-[inset_0_0_0_1px_rgb(20_18_16/0.25)] transition-colors hover:bg-ink hover:text-paper"
    >
      {children}
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* 1. A character whose eyes follow the pointer                        */
/* ------------------------------------------------------------------ */

function FollowCharacter() {
  const [ref, active] = useInViewPlay<HTMLDivElement>(0.3);
  const eyes = useRef<(SVGCircleElement | null)[]>([]);
  const pupils = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let px = 0;
    let py = 0;
    const update = () => {
      frame = 0;
      eyes.current.forEach((eye, i) => {
        const pupil = pupils.current[i];
        if (!eye || !pupil) return;
        const r = eye.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = px - cx;
        const dy = py - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(dist / 40, 1) * 9; // svg units
        pupil.setAttribute("transform", `translate(${((dx / dist) * reach).toFixed(2)} ${((dy / dist) * reach).toFixed(2)})`);
      });
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [active]);

  return (
    <div ref={ref}>
      <CardHead title="Fig. 11 — Attention span" note="it’s watching you" />
      <svg viewBox="0 0 240 200" className="art mx-auto w-full max-w-[18rem]" data-play={active} aria-hidden>
        <ellipse cx="120" cy="188" rx="64" ry="7" fill={C.ink} opacity=".12" />
        <g className="anim a-squish o-bottom" style={{ animationDuration: "3.2s" }}>
          <path d="M44 186C30 120 60 40 122 40S214 120 198 186Z" fill={C.cobalt} />
          <path d="M80 54L70 22L100 44M150 44L176 20L170 56" fill={C.cobalt} />
          {[96, 146].map((cx, i) => (
            <g key={cx}>
              <circle
                ref={(el) => {
                  eyes.current[i] = el;
                }}
                cx={cx}
                cy="104"
                r="20"
                fill={C.paper}
              />
              <g
                ref={(el) => {
                  pupils.current[i] = el;
                }}
              >
                <circle cx={cx} cy="104" r="9" fill={C.ink} />
                <circle cx={cx + 3} cy="100" r="3" fill={C.paper} />
              </g>
            </g>
          ))}
          <path d="M108 146Q121 156 134 146" stroke={C.paper} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. A one-line drawing that draws itself (GSAP DrawSVG)              */
/* ------------------------------------------------------------------ */

function LineDrawing() {
  const scope = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { allowMotion } = useMotionPreference();

  useGSAP(
    () => {
      if (!allowMotion) return; // paths simply render fully drawn
      tl.current = gsap
        .timeline({ paused: true })
        .fromTo(".doodle-main", { drawSVG: "0%" }, { drawSVG: "100%", duration: 2.6, ease: "power1.inOut" })
        .fromTo(".doodle-star", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, ease: "power2.out" }, "-=0.2")
        .fromTo(".doodle-dot", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, "-=0.2");
      gsap.set(".doodle-main, .doodle-star", { drawSVG: "0%" });
      gsap.set(".doodle-dot", { scale: 0, transformOrigin: "50% 50%" });
      ScrollTriggerOnce(scope.current, () => tl.current?.play());
    },
    { scope, dependencies: [allowMotion], revertOnUpdate: true },
  );

  return (
    <div ref={scope}>
      <CardHead
        title="Warm-up 03 — one line"
        note="don’t lift the pen"
        action={
          allowMotion && (
            <SmallButton label="Redraw" onClick={() => tl.current?.restart()}>
              <RotateCcw className="size-3.5" aria-hidden />
            </SmallButton>
          )
        }
      />
      <svg viewBox="0 0 400 200" className="w-full" fill="none" role="img" aria-label="A continuous hand-drawn line of loops ending in a spiral and a star">
        <path
          className="doodle-main"
          d="M18 132C34 62 84 58 72 112C62 154 30 132 50 100C70 70 112 72 104 118C98 158 66 140 84 108C100 80 142 80 136 122C132 158 100 150 116 116C130 88 172 88 176 122C182 156 214 148 230 112C250 62 330 52 352 100C366 140 312 162 290 130C276 106 300 80 322 94C338 106 322 126 308 118"
          stroke={C.ink}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="doodle-star"
          d="M364 36Q366 52 380 54Q366 56 364 72Q362 56 348 54Q362 52 364 36Z"
          stroke={C.orange}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle className="doodle-dot" cx="36" cy="170" r="6" fill={C.lime} stroke={C.ink} strokeWidth="2" />
      </svg>
    </div>
  );
}

/** Fires `cb` once when `el` scrolls into view. */
function ScrollTriggerOnce(el: Element | null, cb: () => void) {
  if (!el) return;
  gsap.timeline({ scrollTrigger: { trigger: el, start: "top 75%", once: true, onEnter: cb } });
}

/* ------------------------------------------------------------------ */
/* 3. Morphing shapes (GSAP MorphSVG)                                  */
/* ------------------------------------------------------------------ */

const shapes = [
  { d: "M100 20C140 20 178 52 176 98C174 146 138 180 96 178C52 176 22 142 24 100C26 56 60 20 100 20Z", fill: C.lime, name: "blob" },
  {
    d: "M100 18L121 74L180 76L134 112L150 170L100 136L50 170L66 112L20 76L79 74Z",
    fill: C.orange,
    name: "star",
  },
  {
    d: "M100 170C60 140 26 112 26 76C26 50 46 32 70 32C84 32 94 40 100 52C106 40 116 32 130 32C154 32 174 50 174 76C174 112 140 140 100 170Z",
    fill: C.lavender,
    name: "heart",
  },
  { d: "M100 26C160 26 174 40 174 100C174 160 160 174 100 174C40 174 26 160 26 100C26 40 40 26 100 26Z", fill: C.cobalt, name: "squircle" },
];

function MorphShape() {
  const scope = useRef<HTMLDivElement>(null);
  const [ref, active] = useInViewPlay<HTMLDivElement>(0.4);
  const { allowMotion } = useMotionPreference();
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const morphTo = (i: number) => {
    const shape = shapes[i];
    indexRef.current = i;
    setIndex(i);
    gsap.to(scope.current!.querySelector(".morph-path"), {
      morphSVG: shape.d,
      fill: shape.fill,
      duration: allowMotion ? 0.9 : 0,
      ease: "elastic.out(1, 0.6)",
      overwrite: true,
    });
  };

  // Auto-cycle while on screen and motion is allowed.
  useEffect(() => {
    if (!active || !allowMotion) return;
    const id = window.setInterval(() => morphTo((indexRef.current + 1) % shapes.length), 2400);
    return () => window.clearInterval(id);
  }, [active, allowMotion]);

  return (
    <div
      ref={(el) => {
        scope.current = el;
        ref.current = el;
      }}
    >
      <CardHead
        title="Shape study"
        note={`today: ${shapes[index].name}`}
        action={
          <SmallButton label="Morph" onClick={() => morphTo((indexRef.current + 1) % shapes.length)}>
            <Shuffle className="size-3.5" aria-hidden />
          </SmallButton>
        }
      />
      <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[13rem]" aria-hidden>
        <path className="morph-path" d={shapes[0].d} fill={shapes[0].fill} stroke={C.ink} strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <p className="sr-only" aria-live="polite">
        Shape: {shapes[index].name}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Storyboard thumbnails                                            */
/* ------------------------------------------------------------------ */

const boards: { note: string; art: ReactNode }[] = [
  {
    note: "wide — town wakes up",
    art: (
      <>
        <path d="M0 70Q40 52 80 64T160 58V100H0Z" fill={C.lavender} opacity=".7" />
        <path d="M6 72Q40 56 78 66T156 60" stroke={C.ink} strokeWidth="1.5" fill="none" />
        <circle cx="118" cy="30" r="12" fill="none" stroke={C.ink} strokeWidth="1.5" />
        <path d="M30 70v-14h12v14M50 68v-20h10v20" stroke={C.ink} strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  {
    note: "push in, hold 12f",
    art: (
      <>
        <path d="M50 100C44 64 60 36 82 36S118 64 112 100" fill={C.cobalt} opacity=".85" />
        <circle cx="74" cy="62" r="6" fill={C.paper} />
        <circle cx="92" cy="62" r="6" fill={C.paper} />
        <path d="M20 10L48 30M140 10L114 30M20 90L44 76M140 90L118 76" stroke={C.ink} strokeWidth="1" strokeDasharray="3 3" />
      </>
    ),
  },
  {
    note: "ECU — the blink",
    art: (
      <>
        <ellipse cx="80" cy="50" rx="56" ry="30" fill={C.paper} stroke={C.ink} strokeWidth="1.5" />
        <circle cx="80" cy="50" r="18" fill={C.ink} />
        <circle cx="86" cy="44" r="5" fill={C.paper} />
        <path d="M24 46Q80 6 136 46" stroke={C.ink} strokeWidth="2.5" fill="none" />
      </>
    ),
  },
  {
    note: "whoosh → match cut",
    art: (
      <>
        <path d="M10 40H70M20 52H80M14 64H64" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="108" cy="52" r="20" fill={C.orange} />
        <path d="M128 26l8-8M134 52h10M128 78l8 8" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
];

function Storyboard() {
  return (
    <div>
      <CardHead title="Board 02 — “Small Hours”" note="v3, after notes" />
      <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {boards.map((b, i) => (
          <li key={i}>
            <div className="frame relative overflow-hidden rounded-[3px] bg-paper-2">
              <span className="absolute left-1.5 top-1 text-[10px] text-ink-soft" style={mono}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <svg viewBox="0 0 160 100" className="w-full" aria-hidden>
                {b.art}
              </svg>
            </div>
            <p className="mt-2 text-lg leading-tight text-ink-soft" style={hand}>
              {b.note}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Kinetic type — letters that hop when touched                     */
/* ------------------------------------------------------------------ */

function KineticWord() {
  const word = "wobble";
  const colors = [C.cobalt, C.orange, C.ink, C.cobalt, C.orange, C.ink];
  return (
    <div className="flex h-full flex-col">
      <CardHead title="Type test — bounce" note="hover (or tap) the letters" />
      <p className="display flex flex-1 select-none items-center justify-center text-[clamp(4rem,9vw,7.5rem)]" aria-label={word}>
        {word.split("").map((ch, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="inline-block cursor-default"
            style={{ color: colors[i] }}
            initial={{ y: "40%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 400, damping: 14, delay: i * 0.06 }}
            whileHover={{ y: "-22%", rotate: i % 2 ? 8 : -8, scaleY: 1.12 }}
            whileTap={{ y: "-22%", rotate: i % 2 ? 8 : -8, scaleY: 1.12 }}
          >
            {ch}
          </motion.span>
        ))}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Horizontal strip of motion studies                                  */
/* ------------------------------------------------------------------ */

function StudiesStrip() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [ref, active] = useInViewPlay<HTMLDivElement>(0.3);

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    track.scrollBy({ left: dir * ((card?.clientWidth ?? 240) + 16), behavior: "smooth" });
  };

  return (
    <div ref={ref} className="mt-20 md:mt-28">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h3 className="display text-display-sm">Motion studies</h3>
          <p className="mt-2 max-w-md text-ink-soft">The principles of animation, practised daily — tiny loops we keep coming back to.</p>
        </div>
        <div className="flex gap-2">
          <ArrowButton label="Scroll studies left" onClick={() => scrollByCard(-1)}>
            <ChevronLeft className="size-5" />
          </ArrowButton>
          <ArrowButton label="Scroll studies right" onClick={() => scrollByCard(1)}>
            <ChevronRight className="size-5" />
          </ArrowButton>
        </div>
      </div>
      <ul
        ref={trackRef}
        className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-[clamp(1rem,4vw,3.5rem)] sm:scroll-px-[clamp(1rem,4vw,3.5rem)] sm:px-[clamp(1rem,4vw,3.5rem)]"
        tabIndex={0}
        aria-label="Motion studies (scrollable)"
      >
        {studies.map((study, i) => (
          <li key={study.id} className="w-[68vw] max-w-[17rem] shrink-0 snap-start sm:w-64">
            <div className="frame overflow-hidden rounded-md" style={{ background: study.bg }}>
              <svg viewBox="0 0 200 200" className="art w-full" data-play={active} aria-hidden>
                {study.art}
              </svg>
            </div>
            <p className="mt-3 flex gap-2 text-[0.95rem] font-medium">
              <span className="label-mono pt-0.5 text-ink-faint">{String(i + 1).padStart(2, "0")}</span>
              {study.title}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full bg-paper shadow-[inset_0_0_0_1px_rgb(20_18_16/0.25)] transition-colors hover:bg-ink hover:text-paper"
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}
