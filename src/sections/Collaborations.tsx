import { collaborationModels, testimonials } from "@/content/studio";
import { Reveal, SectionLabel, SplitReveal } from "@/components/decor/Reveal";

/**
 * Shows verified testimonials when any are configured in src/content/studio.ts.
 * Until then it presents a neutral statement of how the studio collaborates —
 * no invented quotes, names or logos.
 */
export function Collaborations({ index = "03" }: { index?: string }) {
  return (
    <section id="collaborations" aria-labelledby="collab-title" className="py-24 md:py-32">
      <div className="container-x">
        <SectionLabel index={index}>Working together</SectionLabel>

        {testimonials.length > 0 ? (
          <>
            <h2 id="collab-title" className="sr-only">
              What collaborators say
            </h2>
            <ul className="mt-10 grid gap-12 md:grid-cols-2">
              {testimonials.map((t) => (
                <Reveal as="li" key={t.name}>
                  <figure>
                    <blockquote className="serif-accent text-[clamp(1.6rem,2.8vw,2.4rem)] leading-snug">“{t.quote}”</blockquote>
                    <figcaption className="mt-6">
                      <span className="block font-semibold">{t.name}</span>
                      <span className="label-mono mt-1 block text-ink-soft">{t.role}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </ul>
          </>
        ) : (
          <>
            <SplitReveal
              id="collab-title"
              className="display mt-6 max-w-6xl text-[clamp(2.2rem,5.2vw,5rem)]"
              parts={[
                { text: "We work as your studio, your" },
                { text: "co-pilot,", className: "serif-accent text-cobalt" },
                { text: "or an extra pair of hands." },
              ]}
            />
            <ol className="mt-14 grid gap-px overflow-hidden rounded-md bg-ink/15 md:mt-20 md:grid-cols-3">
              {collaborationModels.map((m, i) => (
                <Reveal as="li" key={m.title} delay={i * 0.08} className="bg-paper p-6 md:p-8">
                  <span className="label-mono text-ink-faint">0{i + 1}</span>
                  <h3 className="display mt-6 text-3xl">{m.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{m.text}</p>
                </Reveal>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}
