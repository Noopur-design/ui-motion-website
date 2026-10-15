import { PageHeader } from "@/components/layout/PageHeader";
import { WorkGrid } from "@/sections/WorkGrid";
import { CtaBand } from "@/sections/CtaBand";
import { projects } from "@/content/projects";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function WorkPage() {
  usePageMeta("Work", "Selected motion design, 2D animation, explainer, brand, campaign and UGC work.");

  return (
    <>
      <PageHeader
        index="01"
        label={`Work — ${projects.length} projects`}
        title={[{ text: "Work That", breakAfter: true }, { text: "Moves People.", className: "serif-accent text-orange" }]}
        intro="Brand systems, explainers, illustrated shorts, product films, campaigns, UGC and the experiments in between. Filter by discipline, or open any project for the full story."
        cards={["character", "brand", "campaign"]}
      />
      <section aria-label="Projects" className="pb-8">
        <div className="container-x">
          <WorkGrid filterable />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
