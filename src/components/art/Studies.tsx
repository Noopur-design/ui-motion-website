import type { CSSProperties, ReactNode } from "react";
import { C } from "./palette";

/**
 * Motion studies — tiny loops built on the classic principles of animation.
 * Each renders on a 200×200 canvas; the parent .art element controls playback.
 */
export type Study = { id: string; title: string; bg: string; art: ReactNode };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const studies: Study[] = [
  {
    id: "squash",
    title: "Squash & stretch",
    bg: C.lavender,
    art: (
      <>
        <line x1="34" y1="168" x2="166" y2="168" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="100" cy="166" rx="30" ry="6" fill={C.ink} className="anim a-shadow" />
        <circle cx="100" cy="62" r="22" fill={C.lime} stroke={C.ink} strokeWidth="3" className="anim a-bounce" style={{ ["--d" as string]: "190%" } as CSSProperties} />
      </>
    ),
  },
  {
    id: "anticipation",
    title: "Anticipation",
    bg: C.lime,
    art: (
      <>
        <line x1="34" y1="166" x2="166" y2="166" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
        <g className="anim a-hop">
          <path d="M70 166C64 126 78 104 100 104S136 126 130 166Z" fill={C.cobalt} />
          <circle cx="90" cy="130" r="6" fill={C.paper} />
          <circle cx="110" cy="130" r="6" fill={C.paper} />
          <circle cx="91" cy="131" r="3" fill={C.ink} />
          <circle cx="111" cy="131" r="3" fill={C.ink} />
        </g>
      </>
    ),
  },
  {
    id: "ease",
    title: "Slow in, slow out",
    bg: C.paper,
    art: (
      <>
        <line x1="30" y1="100" x2="170" y2="100" stroke={C.ink} strokeWidth="2" />
        {Array.from({ length: 11 }, (_, i) => {
          const x = 30 + ease(i / 10) * 140;
          return <line key={i} x1={x} y1="88" x2={x} y2="112" stroke={C.ink} strokeWidth="2" opacity={0.25 + (i % 5 === 0 ? 0.6 : 0.2)} />;
        })}
        <circle
          cx="30"
          cy="100"
          r="14"
          fill={C.orange}
          stroke={C.ink}
          strokeWidth="3"
          className="anim a-ease"
          style={{ ["--travel" as string]: "500%" } as CSSProperties}
        />
        <text x="30" y="142" fontSize="11" fill={C.ink} opacity=".6" style={{ fontFamily: "var(--font-mono)" }}>
          1 · · · · 5 · · · · 9
        </text>
      </>
    ),
  },
  {
    id: "arcs",
    title: "Arcs",
    bg: C.orange,
    art: (
      <>
        <path d="M44 132A72 72 0 0 0 156 132" fill="none" stroke={C.ink} strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
        <circle cx="100" cy="30" r="5" fill={C.ink} />
        <g className="anim a-swing">
          <line x1="100" y1="30" x2="100" y2="144" stroke={C.ink} strokeWidth="3" />
          <circle cx="100" cy="150" r="16" fill={C.paper} stroke={C.ink} strokeWidth="3" />
        </g>
      </>
    ),
  },
  {
    id: "overlap",
    title: "Overlapping action",
    bg: C.cobalt,
    art: (
      <>
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={70}
            cy={44 + i * 28}
            r={16 - i * 2}
            fill={i === 0 ? C.lime : C.paper}
            className="anim a-slide"
            style={{ animationDelay: `${-i * 0.18}s`, animationDuration: "2s" }}
          />
        ))}
      </>
    ),
  },
  {
    id: "exaggeration",
    title: "Exaggeration",
    bg: C.paper3,
    art: (
      <>
        <circle cx="100" cy="104" r="62" fill={C.lime} stroke={C.ink} strokeWidth="3" />
        <g className="anim a-pop" style={{ animationDuration: "2.8s" }}>
          <circle cx="78" cy="94" r="18" fill={C.paper} stroke={C.ink} strokeWidth="3" />
          <circle cx="122" cy="94" r="18" fill={C.paper} stroke={C.ink} strokeWidth="3" />
          <circle cx="80" cy="96" r="8" fill={C.ink} />
          <circle cx="124" cy="96" r="8" fill={C.ink} />
        </g>
        <ellipse cx="100" cy="134" rx="12" ry="9" fill={C.ink} className="anim a-pulse" />
      </>
    ),
  },
];
