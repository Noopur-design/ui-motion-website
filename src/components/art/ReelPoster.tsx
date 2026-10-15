import { cn } from "@/lib/utils";
import { site } from "@/content/site";
import { C, display, mono, serif } from "./palette";
import { sparkle } from "./Artwork";

/** Cinematic 16:9 placeholder poster for the studio showreel. */
export function ReelPoster({ play = false, className }: { play?: boolean; className?: string }) {
  const holes = Array.from({ length: 54 }, (_, i) => i * 60 + 15);
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={cn("art h-full w-full", className)}
      data-play={play}
      aria-hidden
      focusable="false"
    >
      <rect width="1600" height="900" fill={C.ink} />
      {/* film perforations */}
      {[0, 836].map((y) => (
        <g key={y}>
          <rect y={y} width="1600" height="64" fill="#221f1b" />
          <g className="anim a-marquee" style={{ animationDuration: "14s" }}>
            <rect width="3240" height="1" fill="none" />
            {holes.map((x) => (
              <rect key={x} x={x} y={y + 22} width="30" height="20" rx="4" fill={C.paper} opacity=".8" />
            ))}
          </g>
        </g>
      ))}

      {/* bouncing ball with squash & stretch */}
      <ellipse cx="290" cy="492" rx="58" ry="10" fill={C.lime} className="anim a-shadow" />
      <circle cx="290" cy="250" r="54" fill={C.lime} className="anim a-bounce" />

      <rect x="1250" y="150" width="140" height="140" rx="8" fill={C.cobalt} className="anim a-sway" />
      <circle cx="470" cy="700" r="56" fill="none" stroke={C.lavender} strokeWidth="20" className="anim a-float d-2" />
      <path d="M1230 800V660A140 140 0 0 1 1370 800Z" fill={C.orange} className="anim a-pulse" style={{ transformOrigin: "0% 100%" }} />
      {[
        [1060, 180, 16],
        [640, 156, 10],
        [176, 640, 12],
        [1470, 420, 9],
      ].map(([x, y, s], i) => (
        <path key={i} d={sparkle(x, y, s)} fill={C.lime} className="anim a-fade" style={{ animationDelay: `${-i * 0.8}s` }} />
      ))}

      <text
        x="800"
        y="600"
        textAnchor="middle"
        fontSize="430"
        fill={C.paper}
        opacity=".16"
        letterSpacing="-8"
        style={display}
      >
        REEL
      </text>
      <text x="1178" y="652" fontSize="250" fill={C.lime} style={serif}>
        ’26
      </text>

      <text x="80" y="808" fontSize="20" fill={C.paper} opacity=".7" style={mono}>
        TC 00:00:00:00 — 25 FPS
      </text>
      <text x="1520" y="808" fontSize="20" fill={C.paper} opacity=".7" textAnchor="end" style={mono}>
        {site.name.toUpperCase()} — REEL 2026
      </text>
    </svg>
  );
}
