import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { services, type Service } from "@/content/studio";
import { ServiceArt } from "@/components/art/ServiceArt";
import { Reveal } from "@/components/decor/Reveal";
import { ScribbleUnderline } from "@/components/decor/Scribbles";
import { Button, ArrowNudge } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useInViewPlay } from "@/hooks/useInViewPlay";
import { useStudioUI } from "@/hooks/useStudioUI";

const tileBg: Record<Service["art"], string> = {
  motion: "bg-lime",
  animation: "bg-lavender",
  illustration: "bg-paper-3",
  explainer: "bg-paper",
  brand: "bg-orange-soft",
  social: "bg-lavender-soft",
  ugc: "bg-lime-soft",
};

export const serviceTileBg = tileBg;

/** Interactive service list: hover/focus drives a sticky preview on desktop, an accordion on smaller screens. */
export function ServicesList() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { hash } = useLocation();
  const linked = Math.max(0, services.findIndex((s) => `#${s.id}` === hash));
  const [active, setActive] = useState(linked);
  const [expanded, setExpanded] = useState<number | null>(hash ? linked : null);

  // Arriving from a service card (/services#id) opens that service.
  useEffect(() => {
    const i = services.findIndex((s) => `#${s.id}` === hash);
    if (i >= 0) {
      setActive(i);
      setExpanded(i);
    }
  }, [hash]);
  const [panelRef, playing] = useInViewPlay<HTMLDivElement>(0.2);
  const { startProject, showWork } = useStudioUI();
  const current = services[active];

  return (
    <section aria-label="Services" className="border-t border-ink/10 bg-paper-2 py-20 md:py-28">
      <div className="container-x">
        <div ref={panelRef} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Desktop: sticky preview of the active service */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28" id="service-preview" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: easeOutExpo }}
                >
                  <div className={cn("frame grid aspect-[5/4] place-items-center overflow-hidden rounded-md", tileBg[current.art])}>
                    <ServiceArt kind={current.art} play={playing} className="w-[52%]" />
                  </div>
                  <ServiceDetail service={current} onStart={() => startProject(current.projectType)} onWork={() => showWork(current.category)} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <ol className="border-t border-ink/20 lg:col-span-7">
            {services.map((service, i) => {
              const isActive = isDesktop ? active === i : expanded === i;
              const panelId = `service-panel-${service.id}`;
              return (
                <li key={service.id} id={service.id} className="border-b border-ink/20">
                  <h3>
                    <button
                      type="button"
                      onMouseEnter={() => isDesktop && setActive(i)}
                      onFocus={() => isDesktop && setActive(i)}
                      onClick={() => (isDesktop ? setActive(i) : setExpanded(expanded === i ? null : i))}
                      {...(isDesktop
                        ? { "aria-pressed": active === i, "aria-controls": "service-preview" }
                        : { "aria-expanded": expanded === i, "aria-controls": panelId })}
                      className="group relative flex w-full items-center gap-4 py-6 text-left md:gap-8 md:py-8"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-0 -z-0 origin-left bg-lime transition-transform duration-500 ease-out-expo",
                          isActive && isDesktop ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                      <span className="label-mono relative w-8 shrink-0 text-ink-soft md:pl-3">0{i + 1}</span>
                      <span className="relative flex-1">
                        <span className="display block text-[clamp(1.75rem,3.6vw,3.25rem)] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                          {service.title}
                        </span>
                        <span className="mt-2 block max-w-xl text-[0.98rem] leading-relaxed text-ink-soft lg:hidden xl:block">
                          {service.summary}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "relative mr-1 grid size-11 shrink-0 place-items-center rounded-full transition-all duration-500 ease-out-expo md:mr-3",
                          isActive ? "bg-ink text-lime" : "shadow-[inset_0_0_0_1px_rgb(20_18_16/0.25)]",
                        )}
                      >
                        {isDesktop ? (
                          <ArrowUpRight className={cn("size-5 transition-transform duration-500", isActive && "rotate-45")} />
                        ) : (
                          <Plus className={cn("size-5 transition-transform duration-500", isActive && "rotate-45")} />
                        )}
                      </span>
                    </button>
                  </h3>

                  {/* Mobile / tablet accordion panel */}
                  {!isDesktop && (
                    <AnimatePresence initial={false}>
                      {expanded === i && (
                        <motion.div
                          id={panelId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: easeOutExpo }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-6 pb-8 sm:grid-cols-[minmax(0,14rem)_1fr]">
                            <div className={cn("frame grid aspect-[16/10] place-items-center rounded-md sm:aspect-square", tileBg[service.art])}>
                              <ServiceArt kind={service.art} play={playing} className="w-[42%] sm:w-[58%]" />
                            </div>
                            <ServiceDetail
                              service={service}
                              compact
                              onStart={() => startProject(service.projectType)}
                              onWork={() => showWork(service.category)}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal className="relative mt-20 overflow-hidden rounded-md bg-ink px-6 py-12 text-paper md:mt-28 md:px-12 md:py-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <p className="display text-[clamp(2.2rem,5vw,4.5rem)]">
              Have a Project in Mind?
              <br />
              <span className="relative inline-block">
                <span className="serif-accent text-lime">Let’s Create It.</span>
                <ScribbleUnderline className="-bottom-3 left-0 h-4 w-full text-lime" />
              </span>
            </p>
            <Button variant="lime" size="lg" onClick={() => startProject()}>
              Start a Project <ArrowNudge />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ServiceDetail({
  service,
  compact = false,
  onStart,
  onWork,
}: {
  service: Service;
  compact?: boolean;
  onStart: () => void;
  onWork: () => void;
}) {
  return (
    <div className={compact ? "" : "mt-6"}>
      {/* In the accordion the summary is already shown in the row above. */}
      {!compact && <p className="text-xl leading-relaxed">{service.summary}</p>}
      <ul className={cn("flex flex-wrap gap-2", !compact && "mt-5")} aria-label={`${service.title} includes`}>
        {service.includes.map((item) => (
          <li key={item} className="rounded-full bg-paper px-3 py-1.5 text-sm font-medium shadow-[inset_0_0_0_1px_rgb(20_18_16/0.12)]">
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button size="sm" onClick={onStart}>
          Discuss {service.title.toLowerCase()} <ArrowNudge />
        </Button>
        <button
          type="button"
          onClick={onWork}
          className="text-sm font-semibold underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
        >
          See related work
        </button>
      </div>
    </div>
  );
}
