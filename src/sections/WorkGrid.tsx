import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AnimatePresence, LayoutGroup, motion, useInView } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import { categories, categoryLabel, projects, type CategoryId, type Project } from "@/content/projects";
import { MediaFrame } from "@/components/media/MediaFrame";
import { Tilt } from "@/components/ui/tilt";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { useCanHover } from "@/hooks/useMediaQuery";
import type { WorkFilter } from "@/hooks/useStudioUI";

/** Editorial layout pattern, applied by position so any filtered subset stays composed. */
const layout = [
  { span: "lg:col-span-7", offset: "", media: "aspect-[4/3]" },
  { span: "lg:col-span-5", offset: "lg:mt-28", media: "aspect-[4/3] md:aspect-square" },
  { span: "lg:col-span-5", offset: "", media: "aspect-[4/3] md:aspect-[4/5]" },
  { span: "lg:col-span-7", offset: "lg:mt-44", media: "aspect-[4/3] md:aspect-[16/10]" },
  { span: "lg:col-span-4", offset: "", media: "aspect-[4/3] md:aspect-[4/5]" },
  { span: "lg:col-span-4", offset: "lg:mt-24", media: "aspect-[4/3] md:aspect-[4/5]" },
  { span: "lg:col-span-4", offset: "", media: "aspect-[4/3] md:aspect-[4/5]" },
  { span: "lg:col-span-8 lg:col-start-3", offset: "", media: "aspect-[4/3] md:aspect-video" },
];

const isCategory = (v: string | null): v is CategoryId => categories.some((c) => c.id === v);

type Props = {
  /** Show the category filters (synced to ?filter= in the URL). */
  filterable?: boolean;
  /** Show only the first N projects (used for the home page selection). */
  limit?: number;
};

export function WorkGrid({ filterable = false, limit }: Props) {
  const [params, setParams] = useSearchParams();
  const param = params.get("filter");
  const filter: WorkFilter = filterable && isCategory(param) ? param : "all";

  const visible = useMemo(() => {
    const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);
    return limit ? list.slice(0, limit) : list;
  }, [filter, limit]);

  const setFilter = (f: WorkFilter) =>
    setParams((p) => {
      if (f === "all") p.delete("filter");
      else p.set("filter", f);
      return p;
    }, { replace: true, preventScrollReset: true });

  const filters: { id: WorkFilter; label: string; count: number }[] = [
    { id: "all" as const, label: "All", count: projects.length },
    ...categories.map((c) => ({ id: c.id, label: c.label as string, count: projects.filter((p) => p.category === c.id).length })),
  ].filter((f) => f.count > 0);

  return (
    <div>
      {filterable && (
        <>
          <div
            role="group"
            aria-label="Filter projects by category"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            <LayoutGroup id="work-filters">
              {filters.map((f) => {
                const selected = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-300",
                      selected ? "text-paper" : "text-ink shadow-[inset_0_0_0_1px_rgb(20_18_16/0.2)] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{f.label}</span>
                    <span aria-hidden className={cn("label-mono relative", selected ? "text-lime" : "text-ink-faint")}>
                      {f.count}
                    </span>
                    <span className="sr-only">
                      {" "}
                      ({f.count} {f.count === 1 ? "project" : "projects"})
                    </span>
                  </button>
                );
              })}
            </LayoutGroup>
          </div>
          <p className="sr-only" aria-live="polite">
            Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
            {filter !== "all" ? ` in ${categoryLabel(filter)}` : ""}.
          </p>
        </>
      )}

      <motion.ul
        layout
        className={cn(
          "grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-2 md:gap-y-20 lg:grid-cols-12",
          filterable && "mt-10 md:mt-14",
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => {
            const slot = layout[i % layout.length];
            return (
              <motion.li
                layout
                key={project.slug}
                className={slot.span}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
                transition={{ duration: 0.7, ease: easeOutExpo }}
              >
                <div className={cn(i % 2 === 1 && "md:mt-16", "lg:mt-0", slot.offset)}>
                  <ProjectCard project={project} mediaClass={slot.media} index={i} />
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}

export function ProjectCard({ project, mediaClass, index }: { project: Project; mediaClass: string; index: number }) {
  const canHover = useCanHover();
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  // Artwork loops whenever the card is on screen; preview clips start on hover (or centre-screen on touch).
  const onScreen = useInView(ref, { amount: 0.3 });
  const centred = useInView(ref, { margin: "-35% 0px -35% 0px" });
  const previewActive = canHover ? hover : centred;
  const hasFilm = Boolean(project.media.video);

  return (
    <Link
      ref={ref}
      to={`/work/${project.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="group block"
    >
      <Tilt>
        <MediaFrame
          art={project.art}
          poster={project.media.poster}
          preview={project.media.preview}
          active={onScreen || hover}
          previewActive={previewActive}
          className={cn(
            "frame rounded-md transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-30px_rgb(20_18_16/0.55)]",
            mediaClass,
          )}
          innerClassName="transition-transform duration-[1.1s] ease-out-expo group-hover:scale-[1.04]"
        >
          <span className="label-mono absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1.5 text-ink">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.format === "vertical" && (
            <span className="label-mono absolute right-3 top-3 rounded-full bg-ink/85 px-2.5 py-1.5 text-paper">9:16</span>
          )}
          <span
            aria-hidden
            className="absolute bottom-3 right-3 grid size-12 translate-y-3 scale-75 place-items-center rounded-full bg-paper text-ink opacity-0 shadow-lg transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 md:size-14"
          >
            {hasFilm ? <Play className="ml-0.5 size-5 fill-current" /> : <ArrowUpRight className="size-5" />}
          </span>
        </MediaFrame>
      </Tilt>
      <span className="mt-4 flex items-baseline justify-between gap-4">
        <span className="display text-[clamp(1.6rem,2.4vw,2.25rem)] decoration-[1.5px] underline-offset-[6px] group-hover:underline">
          {project.title}
        </span>
        {project.year && <span className="label-mono shrink-0 text-ink-soft">{project.year}</span>}
      </span>
      <span className="label-mono mt-2 block text-ink-soft">{categoryLabel(project.category)}</span>
      <span className="mt-3 block max-w-md text-[0.98rem] leading-relaxed text-ink-soft">{project.summary}</span>
    </Link>
  );
}
