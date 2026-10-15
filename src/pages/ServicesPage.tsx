import { Link } from "react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, ArrowNudge } from "@/components/ui/button";
import { ServicesList } from "@/sections/ServicesList";
import { UgcShowcase } from "@/sections/UgcShowcase";
import { FormatsStrip } from "@/sections/FormatsStrip";
import { CtaBand } from "@/sections/CtaBand";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function ServicesPage() {
  usePageMeta(
    "Services",
    "Motion graphics, 2D animation, illustration, explainer videos, brand films, social animation and UGC product videos.",
  );

  return (
    <>
      <PageHeader
        index="01"
        label="Services"
        title={[
          { text: "From the First Sketch", breakAfter: true },
          { text: "to the" },
          { text: "Final Frame.", className: "serif-accent text-cobalt" },
        ]}
        intro="One studio for the whole journey — or just the part you need. Every service is led by the same small senior team, from script to final export."
        cards={["ugc", "explainer", "experimental"]}
      >
        <Button asChild variant="lime">
          <Link to="/services#ugc-videos">
            See UGC videos <ArrowNudge />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/contact">Start a project</Link>
        </Button>
      </PageHeader>
      <ServicesList />
      <UgcShowcase index="02" />
      <FormatsStrip index="03" />
      <CtaBand />
    </>
  );
}
