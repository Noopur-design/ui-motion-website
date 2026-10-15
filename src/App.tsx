import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigationType } from "react-router";
import { AnimatePresence } from "motion/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageShell, rememberScroll } from "@/components/layout/PageShell";
import { ReelDialog } from "@/sections/Showreel";
import HomePage from "@/pages/HomePage";
import { MotionPreferenceProvider } from "@/hooks/useMotionPreference";
import { StudioUIProvider } from "@/hooks/useStudioUI";
import { useScrollTriggerRefresh } from "@/hooks/useScrollTriggerRefresh";

// Each page is its own chunk; the home page ships with the main bundle.
const pages = {
  work: () => import("@/pages/WorkPage"),
  caseStudy: () => import("@/pages/CaseStudyPage"),
  services: () => import("@/pages/ServicesPage"),
  about: () => import("@/pages/AboutPage"),
  contact: () => import("@/pages/ContactPage"),
  notFound: () => import("@/pages/NotFoundPage"),
};
const WorkPage = lazy(pages.work);
const CaseStudyPage = lazy(pages.caseStudy);
const ServicesPage = lazy(pages.services);
const AboutPage = lazy(pages.about);
const ContactPage = lazy(pages.contact);
const NotFoundPage = lazy(pages.notFound);

function AnimatedRoutes() {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Remember where the visitor is on this history entry (for Back/Forward).
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => rememberScroll(location.key));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [location.key]);

  // Warm the other pages once the first one has settled.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    idle(() => Object.values(pages).forEach((load) => load()));
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageShell
        key={location.pathname}
        locationKey={location.key}
        hash={location.hash}
        isPop={navigationType === "POP"}
      >
        <Suspense fallback={<div className="min-h-[100svh]" aria-hidden />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<CaseStudyPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </PageShell>
    </AnimatePresence>
  );
}

export default function App() {
  useScrollTriggerRefresh();

  return (
    <MotionPreferenceProvider>
      <StudioUIProvider>
        <a
          href="#main"
          className="fixed left-4 top-3 z-[120] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          <AnimatedRoutes />
        </main>
        <Footer />
        <ReelDialog />
      </StudioUIProvider>
    </MotionPreferenceProvider>
  );
}
