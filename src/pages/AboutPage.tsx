import { lazy, Suspense } from "react";
import { About } from "@/sections/About";
import { Collaborations } from "@/sections/Collaborations";
import { CtaBand } from "@/sections/CtaBand";
import { usePageMeta } from "@/hooks/usePageMeta";

// The sketchbook carries extra GSAP plugins; it loads as its own chunk.
const Playground = lazy(() => import("@/sections/Playground"));

export default function AboutPage() {
  usePageMeta("About", "An independent studio where design, illustration, motion and storytelling meet.");

  return (
    <>
      <About index="01" headingAs="h1" />
      <Suspense fallback={<div className="bg-dots min-h-[110rem]" aria-hidden />}>
        <Playground index="02" />
      </Suspense>
      <Collaborations index="03" />
      <CtaBand />
    </>
  );
}
