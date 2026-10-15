import { useId, type CSSProperties, type ReactNode } from "react";
import type { ServiceArt as ServiceArtKind } from "@/content/studio";
import { cn } from "@/lib/utils";
import { C, mono } from "./palette";
import { sparkle } from "./Artwork";

/** Miniature looping illustrations, one per service (200×200 canvas). */
export function ServiceArt({ kind, play, className }: { kind: ServiceArtKind; play: boolean; className?: string }) {
  // Unique per instance so repeated loops on one page never share SVG ids.
  const uid = `svc-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <svg viewBox="0 0 200 200" className={cn("art", className)} data-play={play} aria-hidden focusable="false">
      {scenes(uid)[kind]}
    </svg>
  );
}

const dash = (n: number) => ({ ["--dash" as string]: n }) as CSSProperties;

const scenes = (uid: string): Record<ServiceArtKind, ReactNode> => ({
  motion: (
    <>
      <rect x="40" y="40" width="120" height="120" rx="10" fill="none" stroke={C.ink} strokeWidth="3" className="anim a-spin" />
      <rect x="60" y="60" width="80" height="80" rx="6" fill="none" stroke={C.cobalt} strokeWidth="3" className="anim a-spin-rev" />
      <rect x="78" y="78" width="44" height="44" rx="4" fill={C.orange} className="anim a-spin" style={{ animationDuration: "6s" }} />
      <g className="anim a-spin" style={{ animationDuration: "4s" }}>
        <circle cx="100" cy="100" r="86" fill="none" />
        <circle cx="100" cy="14" r="8" fill={C.ink} />
      </g>
    </>
  ),
  animation: (
    <>
      <line x1="30" y1="166" x2="170" y2="166" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="100" cy="164" rx="30" ry="6" fill={C.ink} className="anim a-shadow" />
      <circle cx="100" cy="58" r="22" fill={C.orange} className="anim a-bounce" style={{ ["--d" as string]: "192%" } as CSSProperties} />
    </>
  ),
  illustration: (
    <>
      <path
        d="M30 140C50 90 70 160 92 110S130 60 150 96 170 140 178 120"
        fill="none"
        stroke={C.cobalt}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="300"
        className="anim a-draw"
        style={dash(300)}
      />
      <path d={sparkle(150, 52, 20)} fill={C.orange} className="anim a-pop" />
      <g transform="rotate(35 60 60)">
        <rect x="52" y="20" width="16" height="66" rx="2" fill={C.ink} />
        <path d="M52 86h16l-8 16Z" fill={C.paper3} stroke={C.ink} strokeWidth="2" strokeLinejoin="round" />
        <rect x="52" y="20" width="16" height="10" fill={C.lavender} />
      </g>
    </>
  ),
  explainer: (
    <>
      <circle cx="100" cy="88" r="52" fill={C.lime} className="anim a-pulse" />
      <g stroke={C.ink} strokeWidth="4" strokeLinecap="round" className="anim a-pulse d-2">
        <line x1="100" y1="10" x2="100" y2="24" />
        <line x1="160" y1="40" x2="150" y2="50" />
        <line x1="40" y1="40" x2="50" y2="50" />
        <line x1="178" y1="96" x2="164" y2="96" />
        <line x1="22" y1="96" x2="36" y2="96" />
      </g>
      <path d="M100 52a36 36 0 0 0-20 66v14h40v-14a36 36 0 0 0-20-66Z" fill={C.paper} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
      <path d="M86 122v-22l14 10 14-10v22" fill="none" stroke={C.ink} strokeWidth="3" strokeLinejoin="round" />
      <rect x="82" y="140" width="36" height="10" rx="3" fill={C.ink} />
      <rect x="88" y="154" width="24" height="8" rx="3" fill={C.ink} />
    </>
  ),
  brand: (
    <>
      <defs>
        <path id={`${uid}-ring`} d="M100 100m-72 0a72 72 0 1 1 144 0a72 72 0 1 1-144 0" />
      </defs>
      <g className="anim a-spin" style={{ animationDuration: "16s" }}>
        <text fontSize="15" fill={C.ink} style={mono}>
          <textPath href={`#${uid}-ring`} textLength="452" lengthAdjust="spacing">
            BRAND • FILM • LAUNCH • IDENT • BRAND • FILM • LAUNCH • IDENT •
          </textPath>
        </text>
      </g>
      <circle cx="88" cy="92" r="26" fill={C.orange} className="anim a-float" />
      <rect x="94" y="96" width="34" height="34" rx="3" fill={C.cobalt} className="anim a-sway d-2" />
    </>
  ),
  social: (
    <>
      <defs>
        <clipPath id={`${uid}-phone`}>
          <rect x="62" y="22" width="76" height="156" rx="12" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-phone)`}>
        <rect x="62" y="22" width="76" height="156" fill={C.paper} />
        <g className="anim a-marquee-y">
          {/* bbox spans exactly two periods so the -50% loop is seamless */}
          <rect x="70" y="36" width="1" height="324" fill="none" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x="70"
              y={36 + i * 54}
              width="60"
              height="46"
              rx="5"
              fill={[C.cobalt, C.lavender, C.orange][i % 3]}
            />
          ))}
        </g>
      </g>
      <rect x="62" y="22" width="76" height="156" rx="12" fill="none" stroke={C.ink} strokeWidth="5" />
      <g fill={C.ink}>
        <rect x="70" y="28" width="18" height="3" rx="1.5" />
        <rect x="91" y="28" width="18" height="3" rx="1.5" opacity=".35" />
        <rect x="112" y="28" width="18" height="3" rx="1.5" opacity=".35" />
      </g>
      <path
        d="M160 92c-8-10-24-2-16 12l16 14 16-14c8-14-8-22-16-12Z"
        fill={C.orange}
        stroke={C.ink}
        strokeWidth="2.5"
        className="anim a-pop"
      />
    </>
  ),
  ugc: (
    <>
      <defs>
        <clipPath id={`${uid}-ugc`}>
          <rect x="58" y="18" width="84" height="164" rx="14" />
        </clipPath>
      </defs>
      <g className="anim a-sway" style={{ animationDuration: "4s" }}>
        <g clipPath={`url(#${uid}-ugc)`}>
          <rect x="58" y="18" width="84" height="164" fill={C.paper3} />
          <g className="anim a-squish o-bottom">
            <path d="M68 182C62 140 76 96 100 96S138 140 132 182Z" fill={C.cobalt} />
            <circle cx="92" cy="118" r="5" fill={C.paper} />
            <circle cx="108" cy="118" r="5" fill={C.paper} />
            <circle cx="93" cy="119" r="2.5" fill={C.ink} />
            <circle cx="109" cy="119" r="2.5" fill={C.ink} />
          </g>
          <g className="anim a-float d-2">
            <rect x="112" y="120" width="16" height="30" rx="4" fill={C.orange} stroke={C.ink} strokeWidth="2" />
          </g>
          <rect x="66" y="150" width="68" height="14" rx="3" fill={C.paper} className="anim a-fade" />
          <circle cx="70" cy="32" r="4" fill={C.orange} className="anim a-fade" style={{ animationDuration: "1.2s" }} />
        </g>
        <rect x="58" y="18" width="84" height="164" rx="14" fill="none" stroke={C.ink} strokeWidth="5" />
      </g>
      <path d={sparkle(160, 46, 12)} fill={C.lime} stroke={C.ink} strokeWidth="1.5" className="anim a-pop" />
    </>
  ),
});
