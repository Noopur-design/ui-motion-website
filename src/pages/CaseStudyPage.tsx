import { useRef } from "react";
import { Link, useParams } from "react-router";
import { useInView } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { categoryLabel, projects, type Project } from "@/content/projects";
import { projectTypes } from "@/content/studio";
import { Artwork } from "@/components/art/Artwork";
import { MediaFrame } from "@/components/media/MediaFrame";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Reveal, SplitReveal } from "@/components/decor/Reveal";
import { Button, ArrowNudge } from "@/components/ui/button";
import { Tilt } from "@/components/ui/tilt";
import { cn } from "@/lib/utils";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { useStudioUI } from "@/hooks/useStudioUI";
import NotFoundPage from "./NotFoundPage";

/** Closest contact-form project type for each work category. */
const typeForCategory: Record<Project["category"], string> = {
  brand: "Brand / promotional film",
  explainer: "Explainer video",
  illustration: "2D animation",
  product: "Brand / promotional film",
  campaign: "Social media animation",
  experimental: "Motion graphics",
  ugc: "UGC product video",
};

export default function CaseStudyPage() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  usePageMeta(project ? project.title : "Project not found", project?.summary);
  const { startProject } = useStudioUI();

  if (!project) return <NotFoundPage />;

  const next = projects[(index + 1) % projects.length];
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const vertical = project.format === "vertical";
  const type = typeForCategory[project.category];

  return (
    <article>
      <header className="container-x pt-6 md:pt-10">
        <Link to="/work" className="label-mono group inline-flex items-center gap-2 text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden /> All work
        </Link>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="label-mono text-ink-soft">
              {categoryLabel(project.category)}
              {project.year ? ` — ${project.year}` : ""}
              {vertical ? " — 9:16" : ""}
            </p>
            <SplitReveal as="h1" immediate className="display mt-4 text-[clamp(3rem,8vw,8rem)]" parts={[{ text: project.title }]} />
          </div>
          <Reveal className="lg:col-span-4" delay={0.2}>
            <p className="serif-accent text-[clamp(1.5rem,2.2vw,2rem)] leading-snug text-ink-soft">{project.summary}</p>
          </Reveal>
        </div>
      </header>

      <Reveal className="container-x mt-10 md:mt-14" delay={0.1}>
        {vertical ? (
          <div className="grid gap-6 rounded-xl bg-paper-2 p-4 sm:p-8 md:grid-cols-[minmax(0,22rem)_1fr] md:items-center md:gap-12 md:p-12">
            <div className="mx-auto w-full max-w-[22rem] rounded-[2rem] bg-ink p-2 shadow-[0_30px_60px_-30px_rgb(20_18_16/0.7)]">
              <div className="aspect-[9/16] overflow-hidden rounded-[1.5rem]">
                {project.media.video ? (
                  <VideoPlayer src={project.media.video} poster={project.media.poster} captions={project.media.captions} title={project.title} className="h-full w-full" />
                ) : (
                  <MediaFrame art={project.art} poster={project.media.poster} active className="h-full w-full" />
                )}
              </div>
            </div>
            <div>
              {project.category === "ugc" ? (
                <>
                  <p className="label-mono text-ink-soft">Shot vertical, made for</p>
                  <p className="display mt-3 text-[clamp(2rem,4vw,3.5rem)]">TikTok, Reels &amp; Shorts</p>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
                    Captions are burned in, the hook lands in the first second, and every cut is exported again for 4:5
                    and 1:1 feeds.
                  </p>
                </>
              ) : (
                <>
                  <p className="label-mono text-ink-soft">Composed for</p>
                  <p className="display mt-3 text-[clamp(2rem,4vw,3.5rem)]">The vertical screen</p>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
                    Framed 9:16 from the first sketch, so every detail reads on a phone. Press play for the full film
                    with sound.
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-md">
            {project.media.video ? (
              <VideoPlayer src={project.media.video} poster={project.media.poster} captions={project.media.captions} title={project.title} className="aspect-video w-full" />
            ) : (
              <MediaFrame art={project.art} poster={project.media.poster} preview={project.media.preview} active className="frame aspect-[4/3] w-full rounded-md sm:aspect-video">
                {import.meta.env.DEV && (
                  <span className="label-mono absolute right-3 top-3 rounded-full bg-ink px-3 py-1.5 text-lime">
                    Dev: add media.video for “{project.slug}”
                  </span>
                )}
              </MediaFrame>
            )}
          </div>
        )}
      </Reveal>

      <section className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink/15 pt-6 lg:sticky lg:top-28">
            <Meta term="Category" value={categoryLabel(project.category)} />
            {project.year && <Meta term="Year" value={String(project.year)} />}
            {project.client && <Meta term="Client" value={project.client} />}
            <Meta term="Format" value={vertical ? "Vertical 9:16" : "Landscape 16:9"} />
            <div className="col-span-2">
              <dt className="label-mono text-ink-faint">Deliverables</dt>
              <dd className="mt-3">
                <ul className="flex flex-wrap gap-2">
                  {project.deliverables.map((d) => (
                    <li key={d} className="rounded-full px-3 py-1.5 text-sm font-medium shadow-[inset_0_0_0_1px_rgb(20_18_16/0.2)]">
                      {d}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </Reveal>
        <div className="space-y-14 lg:col-span-7 lg:col-start-6">
          <Block title="Overview">{project.overview}</Block>
          <Block title="Creative approach">{project.approach}</Block>
          <Reveal>
            <Button variant="lime" size="lg" onClick={() => startProject(projectTypes.includes(type) ? type : undefined)}>
              Start a similar project <ArrowNudge />
            </Button>
          </Reveal>
        </div>
      </section>

      <Frames project={project} />

      <nav aria-label="More projects" className="container-x grid gap-4 py-20 md:grid-cols-2 md:py-28">
        <NeighbourLink project={prev} direction="prev" />
        <NeighbourLink project={next} direction="next" />
      </nav>
    </article>
  );
}

function Meta({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="label-mono text-ink-faint">{term}</dt>
      <dd className="mt-1.5 font-medium">{value}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: string }) {
  return (
    <Reveal as="section">
      <h2 className="label-mono text-ink-soft">{title}</h2>
      <p className="mt-4 text-xl leading-relaxed md:text-2xl md:leading-relaxed">{children}</p>
    </Reveal>
  );
}

/** Style frames: animated crops of the project's artwork (replace with real stills via project media). */
function Frames({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const onScreen = useInView(ref, { amount: 0.2 });
  const { allowMotion } = useMotionPreference();
  const play = onScreen && allowMotion;
  // Real stills from the film, when the project provides them.
  if (project.frames?.length) {
    const tall = project.format === "vertical";
    return (
      <section aria-label="Frames from the film" className="border-y border-ink/10 bg-paper-2 py-20 md:py-28">
        <div className="container-x">
          <p className="label-mono text-ink-soft">Frames</p>
          <ul className={cn("mt-10 grid gap-4 md:gap-6", tall ? "grid-cols-2 md:grid-cols-4" : "md:grid-cols-2")}>
            {project.frames.map((src, i) => (
              <Reveal as="li" key={src} delay={i * 0.08} className={cn(tall && i % 2 === 1 && "md:mt-16")}>
                <Tilt>
                  <figure className={cn("frame relative overflow-hidden rounded-md", tall ? "aspect-[9/16]" : "aspect-video")}>
                    <img
                      src={src}
                      alt={`${project.title}, frame ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <figcaption className="label-mono absolute bottom-3 left-3 rounded-full bg-paper/90 px-2.5 py-1.5">
                      Frame {String(i + 1).padStart(2, "0")}
                    </figcaption>
                  </figure>
                </Tilt>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const frames = [
    { label: "Style frame 01", cell: "md:col-span-7", media: "aspect-[16/10]" },
    { label: "Style frame 02", cell: "md:col-span-5 md:mt-24", media: "aspect-[4/5]" },
    { label: "Style frame 03", cell: "md:col-span-5", media: "aspect-square" },
    { label: "Style frame 04", cell: "md:col-span-7 md:-mt-16", media: "aspect-[16/9]" },
  ];
  return (
    <section aria-label="Style frames" className="border-y border-ink/10 bg-paper-2 py-20 md:py-28">
      <div ref={ref} className="container-x">
        <p className="label-mono text-ink-soft">Frames</p>
        <div className="mt-10 grid gap-6 md:grid-cols-12">
          {frames.map((f, i) => (
            <Reveal key={f.label} delay={(i % 2) * 0.08} className={cn("relative", f.cell)}>
              <Tilt>
                <figure className={cn("frame relative overflow-hidden rounded-md", f.media)}>
                  <Artwork variant={project.art} play={play} className={cn("absolute inset-0", i % 2 && "scale-125")} />
                  <figcaption className="label-mono absolute bottom-3 left-3 rounded-full bg-paper/90 px-2.5 py-1.5">{f.label}</figcaption>
                </figure>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function NeighbourLink({ project, direction }: { project: Project; direction: "prev" | "next" }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const onScreen = useInView(ref, { amount: 0.4 });
  const { allowMotion } = useMotionPreference();
  return (
    <Link
      ref={ref}
      to={`/work/${project.slug}`}
      className={cn("group grid grid-cols-[1fr_auto] items-end gap-4 rounded-xl p-5 transition-colors sm:p-6", direction === "next" ? "bg-ink text-paper hover:bg-cobalt" : "bg-paper-2 hover:bg-paper-3")}
    >
      <div className="col-span-2 overflow-hidden rounded-md">
        <div className="aspect-[16/9] transition-transform duration-[1.1s] ease-out-expo group-hover:scale-105">
          <Artwork variant={project.art} play={onScreen && allowMotion} />
        </div>
      </div>
      <div>
        <p className={cn("label-mono", direction === "next" ? "text-paper/60" : "text-ink-soft")}>
          {direction === "next" ? "Next project" : "Previous project"}
        </p>
        <p className="display mt-2 text-[clamp(1.75rem,3vw,2.75rem)]">{project.title}</p>
      </div>
      <span className={cn("grid size-12 place-items-center rounded-full transition-transform duration-500 group-hover:rotate-[-45deg]", direction === "next" ? "bg-lime text-ink" : "bg-ink text-paper")}>
        {direction === "next" ? <ArrowRight className="size-5" aria-hidden /> : <ArrowUpRight className="size-5 -scale-x-100" aria-hidden />}
      </span>
    </Link>
  );
}
