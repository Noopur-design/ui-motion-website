import { Link } from "react-router";
import { ArrowUp, Pause, Play } from "lucide-react";
import { site } from "@/content/site";
import { useMotionPreference } from "@/hooks/useMotionPreference";

export function Footer() {
  const { paused, togglePaused, systemReduced } = useMotionPreference();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="container-x pt-20 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label-mono text-paper/55">Start a conversation</p>
            <a
              href={`mailto:${site.email}`}
              className="display mt-4 block break-all text-[clamp(1.9rem,3.4vw,3rem)] underline decoration-paper/20 decoration-2 underline-offset-[8px] transition-colors hover:decoration-lime"
            >
              {site.email}
            </a>
            {site.location && <p className="mt-4 text-paper/70">{site.location}</p>}
          </div>

          <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
            <p className="label-mono text-paper/55">Site</p>
            <ul className="mt-4 space-y-2">
              {[{ label: "Home", href: "/" }, ...site.nav].map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-lg text-paper/90 transition-colors hover:text-lime">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="label-mono text-paper/55">Follow</p>
            <ul className="mt-4 space-y-2">
              {site.socials
                .filter((s) => s.href)
                .map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="text-lg text-paper/90 transition-colors hover:text-lime">
                      {s.label} <span aria-hidden>↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-3 md:col-span-2 md:items-end">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
              className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-[inset_0_0_0_1px_rgb(243_238_228/0.3)] transition-colors hover:bg-paper hover:text-ink"
            >
              <ArrowUp className="size-4" aria-hidden /> Back to top
            </button>
            {!systemReduced && (
              <button
                type="button"
                onClick={togglePaused}
                aria-pressed={paused}
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-[inset_0_0_0_1px_rgb(243_238_228/0.3)] transition-colors hover:bg-paper hover:text-ink"
              >
                {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
                {paused ? "Play animations" : "Pause animations"}
              </button>
            )}
          </div>
        </div>

        {/* Oversized wordmark */}
        <div aria-hidden className="mt-20 flex items-end gap-[2vw] md:mt-28">
          <svg viewBox="0 0 40 28" className="mb-[3.4vw] h-[10.5vw] w-auto shrink-0 overflow-visible">
            <circle cx="6" cy="20" r="4" className="fill-paper/25" />
            <circle cx="15" cy="13" r="5" className="fill-paper/50" />
            <circle cx="28" cy="10" r="8" className="fill-lime" />
          </svg>
          <p className="display select-none whitespace-nowrap text-[22.5vw] leading-[0.78] tracking-[-0.055em] text-paper">
            {site.name.toLowerCase()}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-paper/15 py-6 text-sm text-paper/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="label-mono">Made frame by frame.</p>
        </div>
      </div>
    </footer>
  );
}
