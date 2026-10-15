import { useId, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { C, display, hand, mono, serif } from "./palette";

/**
 * Illustrated placeholder artwork.
 *
 * Each scene is drawn on an 800×500 canvas with `slice` scaling and keeps its
 * subject inside x 220–580 so it crops cleanly to 16:9, 1:1 and 4:5 frames.
 * Loops are CSS (see .anim in index.css) and only run when `play` is true.
 */
export type ArtVariant =
  | "brand"
  | "explainer"
  | "illustration"
  | "product"
  | "campaign"
  | "experimental"
  | "character"
  | "data"
  | "ugc";

type ArtworkProps = {
  variant: ArtVariant;
  play?: boolean;
  className?: string;
  /** Provide when the artwork carries meaning on its own; otherwise it is decorative. */
  label?: string;
};

export function Artwork({ variant, play = false, className, label }: ArtworkProps) {
  const Scene = scenes[variant];
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className={cn("art h-full w-full", className)}
      data-play={play}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <Scene />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

export const sparkle = (x: number, y: number, s: number) =>
  `M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`;

const wave = (y: number, amp: number, length = 1600, period = 200) => {
  let d = `M0 ${y}Q${period / 4} ${y - amp} ${period / 2} ${y}`;
  for (let x = period; x <= length; x += period / 2) d += `T${x} ${y}`;
  return d;
};

const Label = ({ x, y, children, fill = C.ink, anchor = "start", opacity = 0.72 }: {
  x: number;
  y: number;
  children: ReactNode;
  fill?: string;
  anchor?: "start" | "middle" | "end";
  opacity?: number;
}) => (
  <text x={x} y={y} fill={fill} opacity={opacity} fontSize="13" textAnchor={anchor} style={mono}>
    {children}
  </text>
);

const RegMark = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <g stroke={color} strokeWidth="1.5">
    <line x1={x - 9} y1={y} x2={x + 9} y2={y} />
    <line x1={x} y1={y - 9} x2={x} y2={y + 9} />
  </g>
);

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

function Brand() {
  return (
    <>
      <rect width="800" height="500" fill={C.cobalt} />
      <g stroke={C.paper} strokeOpacity=".28" strokeWidth="1.2" fill="none">
        <line x1="400" y1="0" x2="400" y2="500" />
        <line x1="0" y1="250" x2="800" y2="250" />
        <circle cx="400" cy="250" r="128" />
        <rect x="280" y="130" width="240" height="240" />
        <circle cx="400" cy="250" r="182" strokeDasharray="3 9" className="anim a-spin" />
      </g>
      {[
        [280, 130],
        [520, 130],
        [280, 370],
        [520, 370],
      ].map(([x, y]) => (
        <RegMark key={`${x}-${y}`} x={x} y={y} color={C.paper} />
      ))}
      <circle cx="340" cy="190" r="54" fill={C.lime} className="anim a-float" />
      <rect x="408" y="138" width="104" height="104" rx="6" fill={C.paper} className="anim a-sway d-2" />
      <path
        d="M290 362V258A104 104 0 0 1 394 362Z"
        fill={C.orange}
        className="anim a-pulse d-1"
        style={{ transformOrigin: "0% 100%" }}
      />
      <path d="M408 362V312A52 52 0 0 1 512 312V362Z" fill={C.lavender} className="anim a-squish o-bottom d-3" />
      <Label x={282} y={408} fill={C.paper}>
        FIG. 01 — MARK BUILD
      </Label>
      <Label x={518} y={116} fill={C.paper} anchor="end">
        3 SHAPES / 1 RULE
      </Label>
    </>
  );
}

function Explainer() {
  const nodes = [
    { x: 260, label: "01 COLLECT" },
    { x: 400, label: "02 FILTER" },
    { x: 540, label: "03 DELIVER" },
  ];
  return (
    <>
      <rect width="800" height="500" fill={C.lavender} />
      <path
        d="M260 168H540"
        stroke={C.cobalt}
        strokeWidth="4"
        strokeDasharray="10 10"
        strokeLinecap="round"
        fill="none"
        className="anim a-flow"
      />
      <circle cx="296" cy="168" r="7" fill={C.orange} className="anim a-travel" />
      {nodes.map((n) => (
        <g key={n.x}>
          <circle cx={n.x} cy="168" r="40" fill={C.paper} stroke={C.ink} strokeWidth="3" />
          <Label x={n.x} y={236} anchor="middle">
            {n.label}
          </Label>
        </g>
      ))}
      {/* node icons */}
      <path d="M260 148C260 148 276 166 276 176A16 16 0 0 1 244 176C244 166 260 148 260 148Z" fill={C.cobalt} />
      <g stroke={C.ink} strokeWidth="4" strokeLinecap="round">
        <line x1="382" y1="156" x2="418" y2="156" />
        <line x1="388" y1="168" x2="412" y2="168" />
        <line x1="394" y1="180" x2="406" y2="180" />
      </g>
      <circle cx="540" cy="168" r="20" fill={C.lime} />
      <path d="M530 168l7 7 13-14" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* the drop */}
      <ellipse cx="400" cy="446" rx="44" ry="7" fill={C.ink} opacity=".16" className="anim a-pulse d-2" />
      <g className="anim a-float d-2">
        <path d="M400 272C400 272 454 334 454 366A54 54 0 0 1 346 366C346 334 400 272 400 272Z" fill={C.cobalt} />
        <path d="M368 352Q366 334 380 316" stroke={C.paper} strokeWidth="5" strokeLinecap="round" fill="none" opacity=".5" />
        <g className="anim a-blink">
          <ellipse cx="384" cy="364" rx="8" ry="11" fill={C.paper} />
          <ellipse cx="416" cy="364" rx="8" ry="11" fill={C.paper} />
          <circle cx="386" cy="367" r="4" fill={C.ink} />
          <circle cx="418" cy="367" r="4" fill={C.ink} />
        </g>
        <path d="M389 390Q400 399 411 390" stroke={C.paper} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}

function Illustration() {
  const stars = [
    [246, 92, 9],
    [330, 58, 6],
    [560, 76, 8],
    [612, 176, 6],
    [212, 186, 5],
    [384, 140, 5],
    [520, 210, 4],
  ] as const;
  return (
    <>
      <rect width="800" height="500" fill={C.cobaltDeep} />
      <rect y="250" width="800" height="250" fill={C.cobalt} />
      {stars.map(([x, y, s], i) => (
        <path key={i} d={sparkle(x, y, s)} fill={C.lime} className="anim a-fade" style={delay(-i * 0.7)} />
      ))}
      <g className="anim a-float">
        <circle cx="470" cy="128" r="46" fill={C.paper} />
        <circle cx="455" cy="116" r="8" fill={C.lavender} />
        <circle cx="484" cy="144" r="11" fill={C.lavender} />
        <circle cx="488" cy="108" r="4" fill={C.lavender} />
      </g>
      <g className="anim a-slide d-3" opacity=".92">
        <path d="M228 236h92a20 20 0 0 0-26-26 28 28 0 0 0-50 6 16 16 0 0 0-16 20Z" fill={C.paper} />
      </g>
      <path d="M0 330Q150 258 300 318T600 296T800 310V500H0Z" fill={C.lavender} />
      <path d="M0 382Q200 334 400 370T800 356V500H0Z" fill={C.ink} />
      {/* houses */}
      <g fill={C.ink}>
        <rect x="272" y="320" width="54" height="56" />
        <path d="M266 322L299 292L332 322Z" />
        <rect x="338" y="296" width="42" height="80" />
        <path d="M333 298L359 268L385 298Z" />
        <rect x="392" y="326" width="64" height="50" />
        <path d="M386 328L424 300L462 328Z" />
        <rect x="470" y="312" width="46" height="62" />
        <path d="M464 314L493 284L522 314Z" />
        <rect x="438" y="304" width="8" height="18" />
      </g>
      <g fill={C.lime}>
        <rect x="286" y="336" width="11" height="14" />
        <rect x="304" y="336" width="11" height="14" className="anim a-fade d-4" />
        <rect x="353" y="310" width="12" height="16" />
        <rect x="353" y="336" width="12" height="16" className="anim a-fade d-2" />
        <rect x="408" y="340" width="13" height="13" className="anim a-fade d-5" />
        <rect x="486" y="328" width="13" height="15" />
      </g>
      <line x1="548" y1="334" x2="548" y2="378" stroke={C.ink} strokeWidth="4" />
      <circle cx="548" cy="330" r="7" fill={C.orange} className="anim a-pulse" />
      <Label x={240} y={470} fill={C.paper}>
        SC. 04 — 02:14 AM
      </Label>
    </>
  );
}

function Product() {
  return (
    <>
      <rect width="800" height="500" fill={C.lime} />
      <g fill="none" stroke={C.ink} strokeOpacity=".14" strokeWidth="1.4">
        <circle cx="400" cy="240" r="150" />
        <circle cx="400" cy="240" r="205" strokeDasharray="4 10" className="anim a-spin-rev" />
      </g>
      <circle cx="286" cy="138" r="16" fill={C.orange} className="anim a-float d-1" />
      <g className="anim a-float d-3">
        <rect x="496" y="112" width="52" height="20" rx="10" fill={C.cobalt} transform="rotate(-22 522 122)" />
      </g>
      <circle cx="534" cy="332" r="17" fill="none" stroke={C.ink} strokeWidth="6" className="anim a-float d-2" />
      <g className="anim a-sway">
        <rect x="250" y="320" width="24" height="24" fill={C.paper} transform="rotate(16 262 332)" />
      </g>
      <circle cx="560" cy="226" r="5" fill={C.ink} className="anim a-float d-4" />
      <circle cx="240" cy="246" r="4" fill={C.ink} className="anim a-float d-5" />
      <ellipse cx="400" cy="424" rx="92" ry="11" fill={C.ink} opacity=".16" className="anim a-pulse" />
      <g className="anim a-float">
        <path d="M318 276C318 148 482 148 482 276" stroke={C.ink} strokeWidth="22" strokeLinecap="round" fill="none" />
        <path d="M334 262C334 174 466 174 466 262" stroke={C.paper} strokeWidth="4" strokeLinecap="round" fill="none" opacity=".55" />
        <rect x="288" y="252" width="58" height="96" rx="27" fill={C.ink} />
        <rect x="330" y="266" width="20" height="68" rx="10" fill={C.orange} />
        <rect x="454" y="252" width="58" height="96" rx="27" fill={C.ink} />
        <rect x="450" y="266" width="20" height="68" rx="10" fill={C.orange} />
      </g>
      <Label x={282} y={472}>
        FIG. 02 — ZERO-G
      </Label>
    </>
  );
}

function Campaign() {
  const bars = [34, 58, 22, 70, 44, 62, 28, 52, 66, 30, 48, 38, 60, 26, 54, 42];
  return (
    <>
      <rect width="800" height="500" fill={C.orange} />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={250 + i * 19}
          y={128 - h}
          width="11"
          height={h}
          fill={C.ink}
          className="anim a-eq"
          style={{ ...delay(-i * 0.17), animationDuration: `${0.9 + (i % 4) * 0.2}s` }}
        />
      ))}
      <text x="400" y="300" textAnchor="middle" fontSize="178" fill={C.ink} letterSpacing="-4" style={display}>
        LOUD
      </text>
      <text
        x="400"
        y="446"
        textAnchor="middle"
        fontSize="178"
        fill={C.paper}
        letterSpacing="-4"
        style={display}
      >
        WEEK
      </text>
      <g transform="translate(536 332) rotate(-14)">
        <g className="anim a-pop">
          <path
            d={Array.from({ length: 24 }, (_, i) => {
              const r = i % 2 ? 46 : 60;
              const a = (i / 24) * Math.PI * 2;
              return `${i ? "L" : "M"}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
            }).join("") + "Z"}
            fill={C.lime}
            stroke={C.ink}
            strokeWidth="2.5"
          />
          <text textAnchor="middle" y="9" fontSize="25" fill={C.ink} style={display}>
            LIVE
          </text>
        </g>
      </g>
    </>
  );
}

function Experimental() {
  return (
    <>
      <rect width="800" height="500" fill={C.ink} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <g key={i} className="anim a-marquee" style={{ animationDuration: `${7 + i * 1.3}s` }}>
          <path
            d={wave(70 + i * 52, 10 + (i % 3) * 6)}
            stroke={i === 5 ? C.lime : C.paper}
            strokeOpacity={i === 5 ? 0.9 : 0.2}
            strokeWidth={i === 5 ? 3 : 1.6}
            fill="none"
          />
        </g>
      ))}
      <circle cx="534" cy="142" r="18" fill={C.orange} className="anim a-pulse" />
      <text
        x="400"
        y="336"
        textAnchor="middle"
        fontSize="250"
        fill={C.lime}
        className="anim a-sway"
        style={{ ...serif, animationDuration: "5s" }}
      >
        Aa
      </text>
      <Label x={250} y={462} fill={C.paper}>
        LOOP 08 — WIND
      </Label>
    </>
  );
}

function Character() {
  return (
    <>
      <rect width="800" height="500" fill={C.paper3} />
      <circle cx="292" cy="124" r="40" fill={C.orange} className="anim a-pulse" />
      <g className="anim a-slide d-2" fill={C.paper}>
        <ellipse cx="404" cy="96" rx="48" ry="16" />
        <ellipse cx="380" cy="86" rx="24" ry="18" />
      </g>
      <path d="M0 410Q300 394 800 414V500H0Z" fill="#d4c8ae" />
      <path d="M170 410Q300 398 420 410T640 404" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* kite + string */}
      <path d="M406 322Q478 296 520 214" stroke={C.ink} strokeWidth="1.6" fill="none" />
      <g className="anim a-sway" style={{ transformOrigin: "50% 100%", animationDuration: "3.4s" }}>
        <path d="M520 98L568 152L520 214L472 152Z" fill={C.orange} stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M520 98V214M472 152H568" stroke={C.ink} strokeWidth="1.6" opacity=".55" />
        <path d="M520 214Q502 248 528 278T514 340" stroke={C.ink} strokeWidth="1.6" fill="none" />
        <path d="M519 244l-12-6v13ZM519 244l12-6v13Z" fill={C.lime} stroke={C.ink} strokeWidth="1.2" />
        <path d="M522 300l-12-6v13ZM522 300l12-6v13Z" fill={C.lime} stroke={C.ink} strokeWidth="1.2" />
      </g>
      {/* the keeper */}
      <g className="anim a-squish o-bottom">
        <rect x="340" y="398" width="9" height="14" rx="4" fill={C.ink} />
        <rect x="370" y="398" width="9" height="14" rx="4" fill={C.ink} />
        <path
          d="M332 404C316 404 310 378 314 350C318 316 342 300 364 300C390 300 410 320 412 350C415 382 404 404 390 404Z"
          fill={C.cobalt}
        />
        <path d="M402 352Q414 336 406 322" stroke={C.cobalt} strokeWidth="9" strokeLinecap="round" fill="none" />
        <g className="anim a-blink">
          <ellipse cx="352" cy="338" rx="7" ry="9" fill={C.paper} />
          <ellipse cx="378" cy="338" rx="7" ry="9" fill={C.paper} />
          <circle cx="355" cy="335" r="3.5" fill={C.ink} />
          <circle cx="381" cy="335" r="3.5" fill={C.ink} />
        </g>
        <circle cx="342" cy="356" r="5" fill={C.orange} opacity=".8" />
        <circle cx="390" cy="356" r="5" fill={C.orange} opacity=".8" />
      </g>
      <Label x={236} y={466}>
        SHOT 12 — ON TWOS
      </Label>
    </>
  );
}

function Data() {
  const bars = [92, 150, 118, 232, 168];
  return (
    <>
      <rect width="800" height="500" fill={C.paper2} />
      <g stroke={C.ink} strokeOpacity=".07">
        {Array.from({ length: 21 }, (_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
        ))}
      </g>
      <text x="234" y="104" fontSize="64" fill={C.ink} style={display}>
        10s
      </text>
      <path d="M232 132V392H592" stroke={C.ink} strokeWidth="2.5" fill="none" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={262 + i * 62}
          y={392 - h}
          width="40"
          height={h}
          fill={i === 3 ? C.orange : C.cobalt}
          className={i === 3 ? undefined : "anim a-eq"}
          style={i === 3 ? undefined : { ...delay(-i * 0.25), animationDuration: "2.6s" }}
        />
      ))}
      <path
        d="M470 128C514 120 530 152 506 172C482 192 420 190 410 162C400 136 446 120 492 128"
        stroke={C.ink}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="300"
        className="anim a-draw"
        style={{ ["--dash" as string]: 300 } as CSSProperties}
      />
      <text x="520" y="118" fontSize="30" fill={C.ink} transform="rotate(-8 520 118)" style={hand}>
        this one!
      </text>
      <Label x={236} y={440}>
        FIG. 07 — ONE NUMBER
      </Label>
    </>
  );
}

/** A creator filming a product on a phone — used for UGC work. */
function Ugc() {
  const clip = `ugc-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <>
      <rect width="800" height="500" fill={C.lavSoft} />
      {[
        [236, 110, 12],
        [574, 150, 9],
        [560, 380, 7],
        [244, 360, 8],
      ].map(([x, y, s], i) => (
        <path key={i} d={sparkle(x, y, s)} fill={C.orange} className="anim a-fade" style={delay(-i * 0.6)} />
      ))}
      <g className="anim a-sway" style={{ animationDuration: "5s" }}>
        <rect x="302" y="34" width="196" height="432" rx="30" fill={C.ink} />
        <clipPath id={clip}>
          <rect x="312" y="44" width="176" height="412" rx="22" />
        </clipPath>
        <g clipPath={`url(#${clip})`}>
          <rect x="312" y="44" width="176" height="412" fill={C.paper3} />
          <rect x="312" y="300" width="176" height="156" fill="#d4c8ae" />
          <rect x="430" y="96" width="34" height="46" rx="4" fill={C.lime} opacity=".8" />
          {/* creator */}
          <g className="anim a-squish o-bottom" style={{ animationDuration: "2.8s" }}>
            <path d="M330 456C320 360 350 250 400 250S480 360 470 456Z" fill={C.cobalt} />
            <g className="anim a-blink">
              <ellipse cx="384" cy="300" rx="8" ry="10" fill={C.paper} />
              <ellipse cx="414" cy="300" rx="8" ry="10" fill={C.paper} />
              <circle cx="386" cy="302" r="4" fill={C.ink} />
              <circle cx="416" cy="302" r="4" fill={C.ink} />
            </g>
            <path d="M388 324Q399 334 410 324" stroke={C.paper} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          </g>
          {/* product held up */}
          <g className="anim a-float d-2">
            <rect x="438" y="300" width="30" height="62" rx="8" fill={C.orange} stroke={C.ink} strokeWidth="2.5" />
            <rect x="444" y="288" width="18" height="16" rx="3" fill={C.ink} />
            <rect x="443" y="320" width="20" height="16" rx="2" fill={C.paper} />
          </g>
          <path d="M452 372Q470 380 462 400" stroke={C.cobalt} strokeWidth="12" strokeLinecap="round" fill="none" />
          {/* caption */}
          <rect x="330" y="392" width="140" height="28" rx="6" fill={C.paper} />
          <text x="400" y="411" textAnchor="middle" fontSize="13" fill={C.ink} style={{ fontFamily: "var(--font-sans)", fontWeight: 700 }}>
            it finally arrived
          </text>
          {/* progress + rec */}
          <rect x="324" y="56" width="152" height="3" rx="1.5" fill={C.paper} opacity=".45" />
          <rect x="324" y="56" width="70" height="3" rx="1.5" fill={C.paper} className="anim a-stretch o-left" style={{ animationDuration: "4s" }} />
          <circle cx="330" cy="76" r="5" fill={C.orange} className="anim a-fade" style={{ animationDuration: "1.2s" }} />
        </g>
        <rect x="374" y="40" width="52" height="8" rx="4" fill={C.ink} />
      </g>
      <g className="anim a-pop" style={{ animationDuration: "2.2s" }}>
        <path
          d="M536 228c-10-12-30-2-20 14l20 18 20-18c10-16-10-26-20-14Z"
          fill={C.orange}
          stroke={C.ink}
          strokeWidth="2.5"
        />
      </g>
      <Label x={226} y={474}>
        UGC — 9:16 — TAKE 04
      </Label>
    </>
  );
}

const scenes: Record<ArtVariant, () => ReactNode> = {
  brand: Brand,
  explainer: Explainer,
  illustration: Illustration,
  product: Product,
  campaign: Campaign,
  experimental: Experimental,
  character: Character,
  data: Data,
  ugc: Ugc,
};
