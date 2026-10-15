import type { CSSProperties, ReactNode } from "react";
import { highlights } from "@/content/studio";
import { site } from "@/content/site";
import { Artwork } from "@/components/art/Artwork";
import { C, hand, mono } from "@/components/art/palette";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";
import { cn } from "@/lib/utils";
import { useInViewPlay } from "@/hooks/useInViewPlay";

export function About({ index = "01", headingAs = "h1" }: { index?: string; headingAs?: "h1" | "h2" }) {
  const [ref, playing] = useInViewPlay<HTMLDivElement>(0.2);

  return (
    <section id="about" aria-labelledby="about-title" className="border-b border-ink/10 bg-paper pb-24 pt-8 md:pb-32 md:pt-14">
      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-6">
          <SectionLabel index={index}>About the studio</SectionLabel>
          <SplitReveal
            as={headingAs}
            immediate={headingAs === "h1"}
            id="about-title"
            className="display mt-6 text-display-lg"
            parts={[
              { text: "Small Details.", breakAfter: true },
              { text: "Big Ideas.", breakAfter: true },
              { text: "Meaningful Motion.", className: "serif-accent text-orange" },
            ]}
          />
          <Reveal className="mt-10 max-w-xl space-y-5 text-lg leading-relaxed text-ink-soft md:text-xl" delay={0.1}>
            <p>
              <span className="font-semibold text-ink">{site.name}</span> is an independent studio where design,
              illustration, motion and storytelling meet.
            </p>
            <p>
              In animation, the in-betweens are the frames that turn two key poses into movement — careful, unglamorous
              work that makes something feel alive. It’s where we like to spend our time.
            </p>
            <p>
              We help brands explain what they do, launch what they’ve made and be remembered for it — with work that’s
              considered from the first sketch and crafted frame by frame.
            </p>
          </Reveal>

          <dl className="mt-14 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {highlights.map((h, i) => (
              <Reveal key={h.label} delay={i * 0.06} className="border-t border-ink/20 pt-5">
                <dt className="label-mono flex gap-2 text-ink">
                  <span className="text-ink-faint">0{i + 1}</span>
                  {h.label}
                </dt>
                <dd className="mt-3 leading-relaxed text-ink-soft">{h.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>

        {/* Studio desk collage */}
        <div ref={ref} className="relative lg:col-span-6">
          <div className="grid grid-cols-2 gap-4 lg:sticky lg:top-28 lg:block lg:h-[min(44rem,82vh)]">
            <Pinned className="col-span-2 lg:absolute lg:left-0 lg:top-0 lg:w-[68%]" rotate={-2}>
              <Turnaround />
              <Caption>Character turnaround — v2</Caption>
            </Pinned>
            <Pinned className="lg:absolute lg:right-0 lg:top-[26%] lg:w-[46%]" rotate={3}>
              <div className="frame aspect-[4/5] overflow-hidden rounded-[3px]">
                <Artwork variant="illustration" play={playing} />
              </div>
              <Caption>Frame 0412 — final colour</Caption>
            </Pinned>
            <Pinned className="col-span-2 max-lg:order-4 lg:absolute lg:bottom-0 lg:left-0 lg:w-[66%]" rotate={1}>
              <Timeline playing={playing} />
              <Caption>Timeline — sc. 04, take 3</Caption>
            </Pinned>
            <Pinned className="max-lg:order-3 lg:absolute lg:bottom-[3%] lg:right-0 lg:w-[30%]" rotate={-4}>
              <Palette />
              <Caption>Palette 07</Caption>
            </Pinned>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pinned({ children, className, rotate }: { children: ReactNode; className?: string; rotate: number }) {
  return (
    <Reveal className={cn("relative", className)}>
      <figure
        className="relative rounded-sm bg-paper p-3 shadow-[0_1px_0_rgb(20_18_16/0.08),0_24px_44px_-28px_rgb(20_18_16/0.55)]"
        style={{ rotate: `${rotate}deg` }}
      >
        <span aria-hidden className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-orange shadow-[inset_-2px_-2px_0_rgb(0_0_0/0.18)]" />
        {children}
      </figure>
    </Reveal>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <figcaption className="mt-2 text-lg leading-none text-ink-soft" style={hand}>
      {children}
    </figcaption>
  );
}

function Turnaround() {
  const views = [
    { x: 70, w: 1, eyes: [-14, 14] },
    { x: 200, w: 0.82, eyes: [-2, 20] },
    { x: 330, w: 0.66, eyes: [16] },
  ];
  return (
    <svg viewBox="0 0 400 220" className="w-full rounded-[3px] bg-paper-2" aria-hidden>
      <g stroke={C.cobalt} strokeOpacity=".35" strokeWidth="1">
        {[60, 120, 190].map((y) => (
          <line key={y} x1="10" y1={y} x2="390" y2={y} strokeDasharray="4 5" />
        ))}
      </g>
      {views.map((v, i) => (
        <g key={i} transform={`translate(${v.x} 0)`}>
          <path
            d={`M${-44 * v.w} 190C${-56 * v.w} 120 ${-34 * v.w} 60 0 60S${56 * v.w} 120 ${44 * v.w} 190Z`}
            fill={i === 0 ? C.lavender : "none"}
            stroke={C.ink}
            strokeWidth="2"
          />
          {v.eyes.map((ex) => (
            <circle key={ex} cx={ex} cy="112" r="6" fill={C.ink} />
          ))}
          <text y="210" textAnchor="middle" fontSize="10" fill={C.ink} opacity=".6" style={mono}>
            {["FRONT", "3/4", "SIDE"][i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Palette() {
  const swatches = [C.ink, C.cobalt, C.orange, C.lavender, C.lime];
  return (
    <div className="overflow-hidden rounded-[3px]">
      {swatches.map((s) => (
        <div key={s} className="flex h-9 items-center justify-end px-2" style={{ background: s }}>
          <span className="text-[10px] uppercase" style={{ ...mono, color: s === C.ink || s === C.cobalt ? C.paper : C.ink }}>
            {s}
          </span>
        </div>
      ))}
    </div>
  );
}

function Timeline({ playing }: { playing: boolean }) {
  const layers = [
    { name: "ball", keys: [30, 90, 150, 210, 270], color: C.lime },
    { name: "shadow", keys: [30, 150, 270], color: C.lavender },
    { name: "title", keys: [110, 180], color: C.orange },
    { name: "camera", keys: [30, 270], color: C.paper },
  ];
  return (
    <svg viewBox="0 0 400 150" className="art w-full rounded-[3px]" data-play={playing} aria-hidden>
      <rect width="400" height="150" fill={C.ink} />
      <rect width="400" height="22" fill="#24211d" />
      {Array.from({ length: 13 }, (_, i) => (
        <g key={i}>
          <line x1={90 + i * 24} y1="14" x2={90 + i * 24} y2="22" stroke={C.paper} strokeOpacity=".4" />
          {i % 4 === 0 && (
            <text x={90 + i * 24} y="11" fontSize="8" fill={C.paper} opacity=".55" textAnchor="middle" style={mono}>
              {i * 6}f
            </text>
          )}
        </g>
      ))}
      {layers.map((l, i) => (
        <g key={l.name} transform={`translate(0 ${34 + i * 28})`}>
          <text x="10" y="4" fontSize="9" fill={C.paper} opacity=".7" style={mono}>
            {l.name.toUpperCase()}
          </text>
          <line x1="90" y1="0" x2="390" y2="0" stroke={C.paper} strokeOpacity=".12" />
          {l.keys.map((k) => (
            <rect key={k} x={90 + k - 5} y="-5" width="10" height="10" transform={`rotate(45 ${90 + k} 0)`} fill={l.color} />
          ))}
        </g>
      ))}
      <g
        className="anim a-ease"
        style={{ ["--travel" as string]: "2330%", animationDuration: "4s", animationTimingFunction: "linear" } as CSSProperties}
      >
        <line x1="96" y1="0" x2="96" y2="150" stroke={C.orange} strokeWidth="2" />
        <path d="M90 0h12v8l-6 6-6-6Z" fill={C.orange} />
      </g>
    </svg>
  );
}
