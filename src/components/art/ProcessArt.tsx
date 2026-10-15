import type { ReactNode } from "react";
import { C, display, mono } from "./palette";
import { sparkle } from "./Artwork";

/**
 * One illustration per process step (400×320). Parts carry `p{step}-*` class
 * names that the Process section animates with GSAP as the visitor scrolls;
 * without motion they simply render in their finished state.
 */
export function ProcessArt({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 400 320" className="art h-full w-full" data-play="false" aria-hidden focusable="false">
      {scenes[step]}
    </svg>
  );
}

const lines = (x: number, y: number, w: number, n: number, color: string) =>
  Array.from({ length: n }, (_, i) => (
    <line key={i} x1={x} y1={y + i * 12} x2={x + w * (i === n - 1 ? 0.6 : 1)} y2={y + i * 12} stroke={color} strokeWidth="4" strokeLinecap="round" />
  ));

const scenes: ReactNode[] = [
  /* 01 — Discover: notes on the wall, a magnifier sweeping across, questions popping up */
  <>
    <rect width="400" height="320" fill={C.lavender} />
    <g className="p1-note" style={{ transformOrigin: "120px 120px" }}>
      <rect x="62" y="64" width="116" height="104" rx="4" fill={C.lime} transform="rotate(-6 120 116)" />
      <g transform="rotate(-6 120 116)">{lines(78, 92, 80, 4, C.ink)}</g>
    </g>
    <g className="p1-note" style={{ transformOrigin: "260px 110px" }}>
      <rect x="206" y="52" width="116" height="104" rx="4" fill={C.paper} transform="rotate(5 264 104)" />
      <g transform="rotate(5 264 104)">{lines(222, 80, 80, 4, C.ink)}</g>
    </g>
    <g className="p1-note" style={{ transformOrigin: "200px 220px" }}>
      <rect x="134" y="176" width="124" height="96" rx="4" fill={C.orangeSoft} transform="rotate(3 196 224)" />
      <g transform="rotate(3 196 224)">{lines(150, 204, 86, 3, C.ink)}</g>
    </g>
    <g className="p1-q">
      <circle cx="334" cy="218" r="22" fill={C.ink} />
      <text x="334" y="228" textAnchor="middle" fontSize="28" fill={C.lime} style={display}>
        ?
      </text>
    </g>
    <g className="p1-q">
      <circle cx="54" cy="236" r="16" fill={C.ink} />
      <text x="54" y="244" textAnchor="middle" fontSize="20" fill={C.lime} style={display}>
        ?
      </text>
    </g>
    <g className="p1-lens">
      <circle cx="250" cy="196" r="44" fill={C.paper} fillOpacity=".35" stroke={C.ink} strokeWidth="10" />
      <line x1="282" y1="228" x2="330" y2="276" stroke={C.ink} strokeWidth="16" strokeLinecap="round" />
    </g>
  </>,

  /* 02 — Conceptualize: storyboard panels sketch themselves in, then the idea lights up */
  <>
    <rect width="400" height="320" fill={C.lime} />
    {[
      [48, 46],
      [196, 46],
      [48, 172],
      [196, 172],
    ].map(([x, y], i) => (
      <g key={i} className="p2-frame" style={{ transformOrigin: `${x + 66}px ${y + 50}px` }}>
        <rect x={x} y={y} width="132" height="100" rx="4" fill={C.paper} stroke={C.ink} strokeWidth="3" />
        <text x={x + 8} y={y + 16} fontSize="10" fill={C.ink} opacity=".55" style={mono}>
          {String(i + 1).padStart(2, "0")}
        </text>
      </g>
    ))}
    {/* sketch strokes, drawn on scroll */}
    <path className="p2-line" d="M62 128Q96 96 130 120T172 110" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path className="p2-line" d="M236 128C236 96 286 92 290 124" stroke={C.cobalt} strokeWidth="5" fill="none" strokeLinecap="round" />
    <path className="p2-line" d="M248 112L240 100M280 112L288 100" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path className="p2-line" d="M70 240C90 206 140 206 160 236" stroke={C.orange} strokeWidth="5" fill="none" strokeLinecap="round" />
    <path className="p2-line" d="M214 252H300M226 234L300 210" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
    <g className="p2-bulb" style={{ transformOrigin: "350px 160px" }}>
      <circle cx="350" cy="150" r="30" fill={C.paper} stroke={C.ink} strokeWidth="4" />
      <rect x="338" y="178" width="24" height="16" rx="3" fill={C.ink} />
      {[
        [350, 104, 350, 90],
        [388, 128, 400, 120],
        [312, 128, 300, 120],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} className="p2-ray" x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
      ))}
    </g>
  </>,

  /* 03 — Animate: onion-skinned bounce, keyframes landing on a timeline, playhead running */
  <>
    <rect width="400" height="320" fill={C.cobalt} />
    <line x1="30" y1="206" x2="370" y2="206" stroke={C.paper} strokeOpacity=".5" strokeWidth="2" />
    {[
      [60, 80],
      [110, 150],
      [160, 190],
      [210, 140],
      [260, 120],
      [310, 150],
    ].map(([x, y], i) => (
      <circle key={i} className="p3-ghost" cx={x} cy={y} r="16" fill="none" stroke={C.lime} strokeWidth="2" opacity={0.25 + i * 0.1} />
    ))}
    <ellipse className="p3-ball" cx="350" cy="190" rx="18" ry="16" fill={C.lime} />
    <rect x="30" y="244" width="340" height="44" rx="6" fill={C.ink} />
    <rect x="30" y="244" width="340" height="12" rx="6" fill="#26231f" />
    {[60, 110, 160, 210, 260, 310, 350].map((x, i) => (
      <rect
        key={x}
        className="p3-key"
        x={x - 6}
        y={268}
        width="12"
        height="12"
        transform={`rotate(45 ${x} 274)`}
        fill={i % 3 === 0 ? C.orange : C.lime}
        style={{ transformOrigin: `${x}px 274px` }}
      />
    ))}
    <g className="p3-head">
      <line x1="40" y1="238" x2="40" y2="292" stroke={C.orange} strokeWidth="3" />
      <path d="M33 236h14v8l-7 6-7-6Z" fill={C.orange} />
    </g>
    <text x="30" y="34" fontSize="12" fill={C.paper} opacity=".7" style={mono}>
      SC.03 — KEYS 1 → 7
    </text>
  </>,

  /* 04 — Deliver: every format lands, export completes */
  <>
    <rect width="400" height="320" fill={C.orangeSoft} />
    <g className="p4-f" style={{ transformOrigin: "150px 150px" }}>
      <rect x="40" y="70" width="200" height="112" rx="6" fill={C.ink} />
      <rect x="52" y="82" width="176" height="88" rx="2" fill={C.cobalt} />
      <circle cx="140" cy="126" r="20" fill={C.lime} />
      <text x="48" y="200" fontSize="12" fill={C.ink} style={mono}>
        16:9
      </text>
    </g>
    <g className="p4-f" style={{ transformOrigin: "300px 140px" }}>
      <rect x="258" y="40" width="88" height="156" rx="12" fill={C.ink} />
      <rect x="266" y="50" width="72" height="136" rx="6" fill={C.lavender} />
      <circle cx="302" cy="118" r="16" fill={C.orange} />
      <text x="262" y="214" fontSize="12" fill={C.ink} style={mono}>
        9:16
      </text>
    </g>
    <g className="p4-f" style={{ transformOrigin: "220px 240px" }}>
      <rect x="176" y="196" width="88" height="88" rx="6" fill={C.ink} />
      <rect x="184" y="204" width="72" height="72" rx="2" fill={C.lime} />
      <path d={sparkle(220, 240, 18)} fill={C.ink} />
      <text x="274" y="282" fontSize="12" fill={C.ink} style={mono}>
        1:1
      </text>
    </g>
    <rect x="30" y="296" width="340" height="8" rx="4" fill={C.ink} opacity=".15" />
    <rect className="p4-bar" x="30" y="296" width="340" height="8" rx="4" fill={C.ink} style={{ transformOrigin: "30px 300px" }} />
    <g className="p4-check" style={{ transformOrigin: "352px 248px" }}>
      <circle cx="352" cy="248" r="26" fill={C.lime} stroke={C.ink} strokeWidth="3" />
      <path d="M340 248l8 8 16-17" stroke={C.ink} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </>,
];
