/*
 * Compositions rendered to video by scripts/render-assets.mjs.
 *   ?comp=reel&id=<scene>   1280×720 CSS px (rendered at 1.5× → 1920×1080)
 *   ?comp=ugc&id=<video>    540×960 CSS px (rendered at 1.333× → 720×1280)
 * Only CSS animations are used, so every frame can be seeked exactly.
 */
import type { CSSProperties, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "../../src/index.css";
import "./stage.css";
import { Artwork, sparkle, type ArtVariant } from "@/components/art/Artwork";
import { C, mono } from "@/components/art/palette";

declare global {
  interface Window {
    __ready?: boolean;
  }
}

const anim = (...parts: (string | false | undefined)[]): CSSProperties => ({ animation: parts.filter(Boolean).join(", ") });
/** Visible from `start` until `end` (seconds) — hard cuts, like an edit. */
const shot = (start: number, end?: number) => [
  `appear .01s linear ${start}s both`,
  end !== undefined ? `disappear .01s linear ${end}s forwards` : undefined,
];

/* ------------------------------------------------------------------ */
/* Showreel scenes                                                     */
/* ------------------------------------------------------------------ */

const reelScenes: Record<string, { art: ArtVariant; label: string; title: string }> = {
  brand: { art: "brand", label: "Brand motion", title: "Shape Shift" },
  explainer: { art: "explainer", label: "Explainer film", title: "How Water Finds Its Way" },
  illustration: { art: "illustration", label: "Illustrated short", title: "Small Hours" },
  character: { art: "character", label: "2D character animation", title: "The Kite Keeper" },
  product: { art: "product", label: "Product film", title: "Weightless" },
  campaign: { art: "campaign", label: "Campaign", title: "Loud Week" },
  experimental: { art: "experimental", label: "Experimental motion", title: "Type Weather" },
  ugc: { art: "ugc", label: "UGC product video", title: "Morning Shelf" },
};

function ReelTitle() {
  const line = (text: ReactNode, delay: number, className = "") => (
    <span className="block overflow-hidden pb-[0.05em]">
      <span className={`block ${className}`} style={anim(`rise .9s cubic-bezier(.16,1,.3,1) ${delay}s both`)}>
        {text}
      </span>
    </span>
  );
  return (
    <div className="stage bg-paper text-ink">
      <p className="label-mono absolute left-16 top-14 text-ink-soft" style={anim("appear .4s ease .1s both")}>
        ( Showreel 2026 )
      </p>
      <p className="label-mono absolute right-16 top-14 text-ink-soft" style={anim("appear .4s ease .1s both")}>
        TC 00:00:00:00
      </p>
      <h1 className="display absolute left-16 top-[17%] text-[150px] leading-[0.84] tracking-[-0.045em]">
        {line("We Make", 0.15)}
        {line("Ideas", 0.3)}
        <span className="block pl-[1.3em]">
          <span className="serif-accent inline-block text-[1.12em] leading-[0.84] text-orange" style={anim("slideIn 1s cubic-bezier(.16,1,.3,1) .5s both")}>
            Move.
          </span>
        </span>
      </h1>
      <svg viewBox="0 0 200 320" className="absolute right-24 top-[18%] h-[62%]">
        <line x1="20" y1="300" x2="180" y2="300" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="60" r="34" fill={C.lime} stroke={C.ink} strokeWidth="4" style={{ ...anim("bounce 1.1s linear infinite"), transformOrigin: "50% 100%" }} />
      </svg>
    </div>
  );
}

function ReelScene({ id, index }: { id: string; index: number }) {
  const s = reelScenes[id];
  return (
    <div className="stage bg-ink">
      <div className="absolute inset-0" style={anim("push 3.4s linear both")}>
        <Artwork variant={s.art} play className="absolute inset-0" />
      </div>
      <div className="absolute bottom-12 left-12" style={anim("lowerIn .8s cubic-bezier(.16,1,.3,1) .35s both")}>
        <span className="label-mono inline-block rounded-full bg-paper px-4 py-2 text-[15px] text-ink">
          {String(index).padStart(2, "0")} — {s.label}
        </span>
        <p className="display mt-3 rounded-lg bg-ink px-5 py-3 text-[64px] text-paper">{s.title}</p>
      </div>
    </div>
  );
}

function ReelEnd() {
  return (
    <div className="stage bg-ink text-paper">
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="label-mono text-paper/60" style={anim("appear .5s ease .1s both")}>
            Showreel 2026
          </p>
          <p className="display mt-6 text-[120px] leading-[0.9]" style={anim("lowerIn 1s cubic-bezier(.16,1,.3,1) .2s both")}>
            Let’s make it <span className="serif-accent text-lime">move.</span>
          </p>
          <svg viewBox="0 0 200 200" className="mx-auto mt-6 h-40" style={anim("appear .4s ease .6s both")}>
            <line x1="40" y1="186" x2="160" y2="186" stroke={C.paper} strokeWidth="3" strokeLinecap="round" opacity=".6" />
            <circle cx="100" cy="40" r="22" fill={C.orange} style={{ ...anim("bounce 1s linear infinite"), transformOrigin: "50% 100%" }} />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* UGC building blocks (540×960 canvas)                                */
/* ------------------------------------------------------------------ */

type Expression = "open" | "happy" | "wow";

/** The studio's blob creator. Local origin = top-centre of the head. */
function Creator({ x = 270, y = 520, scale = 1, expression = "open", color = C.cobalt }: { x?: number; y?: number; scale?: number; expression?: Expression; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g style={{ ...anim("breathe 2.6s ease-in-out infinite"), transformOrigin: "50% 100%" }}>
        <path d="M-190 480C-200 240 -138 0 0 0S200 240 190 480Z" fill={color} />
        <path d="M-34 10C-26 -34 8 -34 -2 12M8 8C22 -28 50 -18 32 16" stroke={C.ink} strokeWidth="11" fill="none" strokeLinecap="round" />
        {expression === "happy" ? (
          <g stroke={C.paper} strokeWidth="8" fill="none" strokeLinecap="round">
            <path d="M-68 118Q-44 92 -20 118" />
            <path d="M20 118Q44 92 68 118" />
          </g>
        ) : (
          <g style={{ ...anim("blinkS 3.2s linear infinite") }}>
            {[-44, 44].map((ex) => (
              <g key={ex}>
                <ellipse cx={ex} cy="112" rx={expression === "wow" ? 32 : 26} ry={expression === "wow" ? 38 : 32} fill={C.paper} />
                <circle cx={ex + 4} cy="118" r={expression === "wow" ? 10 : 13} fill={C.ink} />
                <circle cx={ex + 9} cy="110" r="4" fill={C.paper} />
              </g>
            ))}
          </g>
        )}
        <circle cx="-82" cy="168" r="15" fill={C.orange} opacity=".75" />
        <circle cx="82" cy="168" r="15" fill={C.orange} opacity=".75" />
        {expression === "wow" ? (
          <ellipse cx="0" cy="186" rx="18" ry="22" fill={C.ink} />
        ) : (
          <path d="M-28 176Q0 206 28 176" stroke={C.ink} strokeWidth="8" fill="none" strokeLinecap="round" />
        )}
      </g>
    </g>
  );
}

function Room({ wall = C.paper3 }: { wall?: string }) {
  return (
    <g>
      <rect width="540" height="960" fill={wall} />
      <rect x="40" y="96" width="196" height="240" rx="8" fill={C.lavSoft} stroke={C.ink} strokeWidth="6" />
      <circle cx="168" cy="170" r="30" fill={C.orange} />
      <path d="M138 96V336M40 216H236" stroke={C.ink} strokeWidth="6" />
      <rect x="320" y="330" width="190" height="12" rx="3" fill={C.ink} />
      <path d="M352 330l6-46h48l6 46Z" fill={C.orange} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="370" cy="262" rx="14" ry="30" fill={C.lime} stroke={C.ink} strokeWidth="3" transform="rotate(-24 370 262)" />
      <ellipse cx="394" cy="254" rx="14" ry="34" fill={C.lime} stroke={C.ink} strokeWidth="3" transform="rotate(16 394 254)" />
      <rect x="436" y="268" width="18" height="62" fill={C.cobalt} stroke={C.ink} strokeWidth="3" />
      <rect x="456" y="280" width="16" height="50" fill={C.lavender} stroke={C.ink} strokeWidth="3" />
      <rect x="474" y="262" width="18" height="68" fill={C.lime} stroke={C.ink} strokeWidth="3" />
    </g>
  );
}

function Arm({ d, color = C.cobaltDeep }: { d: string; color?: string }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke={C.ink} strokeWidth="50" />
      <path d={d} stroke={color} strokeWidth="38" />
    </g>
  );
}

function Sparkles({ points, start, color = C.lime }: { points: [number, number, number][]; start: number; color?: string }) {
  return (
    <>
      {points.map(([x, y, s], i) => (
        <path
          key={i}
          d={sparkle(x, y, s)}
          fill={color}
          stroke={C.ink}
          strokeWidth="2.5"
          style={anim(`pop .5s cubic-bezier(.34,1.56,.64,1) ${start + i * 0.12}s both`, `bob 1.4s ease-in-out ${start + 0.5 + i * 0.2}s infinite`)}
        />
      ))}
    </>
  );
}

function Floaters({ start, children, xs }: { start: number; children: (x: number) => ReactNode; xs: number[] }) {
  return (
    <>
      {xs.map((x, i) => (
        <g key={i} style={anim(`floatUp 1.8s ease-out ${start + i * 0.35}s infinite`)}>
          {children(x)}
        </g>
      ))}
    </>
  );
}

function Caption({ text, start, end, top = 150 }: { text: string; start: number; end?: number; top?: number }) {
  return (
    <div className="absolute inset-x-0 flex justify-center px-8" style={{ top, ...anim(...shot(start, end)) }}>
      <span
        className="max-w-[85%] rounded-xl bg-paper px-5 py-3 text-center text-[30px] font-extrabold leading-[1.1] text-ink shadow-[0_4px_0_rgb(20_18_16)]"
        style={{ fontStretch: "88%", ...anim(`pop .45s cubic-bezier(.34,1.56,.64,1) ${start}s both`) }}
      >
        {text}
      </span>
    </div>
  );
}

function Progress({ segments }: { segments: number[] }) {
  let at = 0;
  return (
    <div className="absolute inset-x-4 top-4 flex gap-1.5">
      {segments.map((len, i) => {
        const start = at;
        at += len;
        return (
          <span key={i} className="relative h-1 flex-1 overflow-hidden rounded-full bg-paper/45">
            <span className="absolute inset-0 origin-left bg-paper" style={anim(`fill ${len}s linear ${start}s both`)} />
          </span>
        );
      })}
    </div>
  );
}

function UgcFrame({ children, captions, segments }: { children: ReactNode; captions: ReactNode; segments: number[] }) {
  return (
    <div className="stage bg-ink">
      <div className="absolute -inset-3" style={anim("handheld 3.6s ease-in-out infinite")}>
        <svg viewBox="0 0 540 960" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          {children}
        </svg>
      </div>
      <Progress segments={segments} />
      {captions}
    </div>
  );
}

const Bottle = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-34" y="-44" width="68" height="150" rx="18" fill={C.orange} stroke={C.ink} strokeWidth="5" />
    <rect x="-20" y="-78" width="40" height="38" rx="6" fill={C.ink} />
    <rect x="-26" y="2" width="52" height="44" rx="4" fill={C.paper} />
    <text x="0" y="31" textAnchor="middle" fontSize="18" fill={C.ink} style={{ ...mono, fontWeight: 700 }}>
      No.07
    </text>
  </g>
);

const Can = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-42" y="-80" width="84" height="170" rx="16" fill={C.paper} stroke={C.ink} strokeWidth="5" />
    <rect x="-42" y="-40" width="84" height="88" fill={C.lime} stroke={C.ink} strokeWidth="5" />
    <text x="0" y="12" textAnchor="middle" fontSize="20" fill={C.ink} style={{ ...mono, fontWeight: 700 }}>
      No.03
    </text>
    <ellipse cx="0" cy="-80" rx="42" ry="9" fill="#d8d0c0" stroke={C.ink} strokeWidth="5" />
  </g>
);

/* ------------------------------------------------------------------ */
/* UGC videos (8 s each)                                               */
/* ------------------------------------------------------------------ */

function UgcUnboxing() {
  return (
    <UgcFrame
      segments={[2.6, 2.6, 2.8]}
      captions={
        <>
          <Caption text="POV: it finally arrived" start={0} end={2.6} top={400} />
          <Caption text="the packaging tho…" start={2.6} end={5.2} />
          <Caption text="obsessed. 10/10" start={5.2} top={400} />
        </>
      }
    >
      {/* Shot A — the parcel */}
      <g style={anim(...shot(0, 2.6))}>
        <Room />
        <Creator expression="open" />
        <Arm d="M120 820Q150 760 200 770" />
        <Arm d="M420 820Q390 760 340 770" />
        <g style={{ ...anim("shake .45s ease-in-out 0.3s infinite") }}>
          <rect x="150" y="700" width="240" height="170" rx="8" fill="#d6b07a" stroke={C.ink} strokeWidth="6" />
          <rect x="254" y="700" width="32" height="170" fill={C.paper} opacity=".7" />
          <text x="270" y="800" textAnchor="middle" fontSize="20" fill={C.ink} style={{ ...mono, fontWeight: 700 }}>
            FRAGILE
          </text>
        </g>
      </g>

      {/* Shot B — close-up unboxing */}
      <g style={anim(...shot(2.6, 5.2))}>
        <rect width="540" height="960" fill={C.paper2} />
        <g style={anim("zoom 2.6s linear 2.6s both")}>
          <Sparkles points={[[110, 380, 22], [430, 330, 18], [420, 520, 14], [130, 560, 16]]} start={3.9} />
          <g style={{ ...anim("lift .9s cubic-bezier(.16,1,.3,1) 3.3s both") }}>
            <Bottle x={270} y={500} s={1.5} />
          </g>
          <rect x="110" y="600" width="320" height="260" rx="8" fill="#d6b07a" stroke={C.ink} strokeWidth="6" />
          <path d="M110 600L150 520H270V600Z" fill="#c99e64" stroke={C.ink} strokeWidth="6" strokeLinejoin="round" style={{ ...anim("flapOpen .5s cubic-bezier(.34,1.56,.64,1) 2.8s both"), transformOrigin: "50% 100%" }} />
          <path d="M430 600L390 520H270V600Z" fill="#c99e64" stroke={C.ink} strokeWidth="6" strokeLinejoin="round" style={{ ...anim("flapOpen .5s cubic-bezier(.34,1.56,.64,1) 2.95s both"), transformOrigin: "50% 100%" }} />
          <rect x="150" y="640" width="240" height="22" rx="4" fill={C.lavender} />
        </g>
      </g>

      {/* Shot C — the reaction */}
      <g style={anim(...shot(5.2))}>
        <Room />
        <Creator expression="happy" />
        <Arm d="M420 900Q450 760 390 690" />
        <g style={anim("bob 1.6s ease-in-out 5.2s infinite")}>
          <Bottle x={380} y={640} s={1.05} />
        </g>
        <Floaters start={5.4} xs={[150, 210, 120]}>
          {(x) => (
            <path d={`M${x} 620c-14-16-40-4-28 18l28 24 28-24c12-22-14-34-28-18Z`} fill={C.orange} stroke={C.ink} strokeWidth="4" />
          )}
        </Floaters>
      </g>
    </UgcFrame>
  );
}

function UgcDemo() {
  return (
    <UgcFrame
      segments={[2, 2, 2, 2]}
      captions={
        <>
          <Caption text="3 things I didn’t expect" start={0} end={2} top={380} />
          <Caption text="1. it’s tiny" start={2} end={4} />
          <Caption text="2. the case clicks" start={4} end={6} />
          <Caption text="3. it actually fits" start={6} top={400} />
        </>
      }
    >
      {/* Shot A — talking to camera */}
      <g style={anim(...shot(0, 2))}>
        <Room wall={C.lavSoft} />
        <g style={anim("zoom 2s linear both")}>
          <Creator expression="wow" y={480} />
        </g>
      </g>

      {/* Shot B — case in the palm */}
      <g style={anim(...shot(2, 4))}>
        <rect width="540" height="960" fill={C.lime} />
        <circle cx="270" cy="640" r="170" fill={C.cobalt} />
        {[-110, -40, 30, 100].map((dx) => (
          <rect key={dx} x={270 + dx - 28} y="380" width="56" height="200" rx="28" fill={C.cobalt} />
        ))}
        <g style={anim("pop .5s cubic-bezier(.34,1.56,.64,1) 2.15s both", "bob 1.2s ease-in-out 2.7s infinite")}>
          <rect x="190" y="520" width="160" height="110" rx="44" fill={C.paper} stroke={C.ink} strokeWidth="6" />
          <path d="M196 566H344" stroke={C.ink} strokeWidth="4" />
          <circle cx="270" cy="598" r="6" fill={C.lime} />
        </g>
      </g>

      {/* Shot C — the click */}
      <g style={anim(...shot(4, 6))}>
        <rect width="540" height="960" fill={C.paper3} />
        <rect x="130" y="470" width="280" height="150" rx="60" fill={C.paper} stroke={C.ink} strokeWidth="7" />
        <g style={{ ...anim("lidFlip 1s cubic-bezier(.65,0,.35,1) 4.2s infinite"), transformOrigin: "0% 100%" }}>
          <path d="M130 470C130 400 180 380 270 380S410 400 410 470Z" fill={C.paper} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
        </g>
        <circle cx="220" cy="520" r="26" fill={C.ink} />
        <circle cx="320" cy="520" r="26" fill={C.ink} />
        <g style={anim("pop .4s cubic-bezier(.34,1.56,.64,1) 4.55s both")}>
          <text x="400" y="360" textAnchor="middle" fontSize="54" fill={C.orange} stroke={C.ink} strokeWidth="2" transform="rotate(-12 400 360)" style={{ fontFamily: "var(--font-sans)", fontWeight: 800 }}>
            click!
          </text>
        </g>
      </g>

      {/* Shot D — wearing them */}
      <g style={anim(...shot(6))}>
        <Room wall={C.lavSoft} />
        <Creator expression="happy" />
        <circle cx="150" cy="652" r="20" fill={C.paper} stroke={C.ink} strokeWidth="5" />
        <Floaters start={6.1} xs={[90, 130, 70]}>
          {(x) => (
            <g fill={C.ink}>
              <ellipse cx={x} cy="620" rx="12" ry="9" />
              <rect x={x + 9} y="570" width="5" height="50" />
            </g>
          )}
        </Floaters>
      </g>
    </UgcFrame>
  );
}

function UgcReaction() {
  return (
    <UgcFrame
      segments={[2.6, 2.6, 2.8]}
      captions={
        <>
          <Caption text="first sip, honest reaction" start={0} end={2.6} top={400} />
          <Caption text="wait…" start={2.6} end={5.2} />
          <Caption text="okay I’m hooked" start={5.2} top={400} />
        </>
      }
    >
      {/* Shot A */}
      <g style={anim(...shot(0, 2.6))}>
        <Room wall={C.limeSoft} />
        <Creator expression="open" />
        <Arm d="M120 900Q100 780 160 720" />
        <g style={anim("bob 1.4s ease-in-out infinite")}>
          <Can x={170} y={680} />
        </g>
      </g>

      {/* Shot B — close-up sip */}
      <g style={anim(...shot(2.6, 5.2))}>
        <rect width="540" height="960" fill={C.cobalt} />
        <Floaters start={2.7} xs={[200, 250, 300, 230, 280]}>
          {(x) => <circle cx={x} cy="520" r="10" fill="none" stroke={C.paper} strokeWidth="4" />}
        </Floaters>
        <g style={{ ...anim("tilt 1.4s cubic-bezier(.65,0,.35,1) 2.8s both"), transformOrigin: "50% 100%" }}>
          <Can x={270} y={560} s={2} />
        </g>
      </g>

      {/* Shot C — the verdict */}
      <g style={anim(...shot(5.2))}>
        <Room wall={C.limeSoft} />
        <Creator expression="wow" />
        <Arm d="M420 900Q450 780 380 720" />
        <Can x={370} y={690} />
        <Sparkles points={[[110, 470, 26], [440, 460, 22], [80, 640, 16], [470, 610, 18]]} start={5.35} color={C.orange} />
      </g>
    </UgcFrame>
  );
}

/* ------------------------------------------------------------------ */

function Stage() {
  const params = new URLSearchParams(location.search);
  const comp = params.get("comp");
  const id = params.get("id") ?? "";
  if (comp === "reel") {
    if (id === "title") return <ReelTitle />;
    if (id === "end") return <ReelEnd />;
    return <ReelScene id={id} index={Number(params.get("n") ?? 1)} />;
  }
  if (id === "unboxing") return <UgcUnboxing />;
  if (id === "demo") return <UgcDemo />;
  return <UgcReaction />;
}

createRoot(document.getElementById("root")!).render(<Stage />);
document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => (window.__ready = true))));
