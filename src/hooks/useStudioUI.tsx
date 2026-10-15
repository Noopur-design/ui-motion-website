import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import type { CategoryId } from "@/content/projects";

export type WorkFilter = CategoryId | "all";

type StudioUI = {
  /** Opens the Work page, optionally pre-filtered. */
  showWork: (f?: WorkFilter) => void;
  reelOpen: boolean;
  setReelOpen: (open: boolean) => void;
  /** Opens the Contact page with an optional project type pre-selected. */
  startProject: (type?: string) => void;
};

const StudioUIContext = createContext<StudioUI | null>(null);

export function StudioUIProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [reelOpen, setReelOpen] = useState(false);

  const showWork = useCallback(
    (f: WorkFilter = "all") => navigate(f === "all" ? "/work" : `/work?filter=${f}`),
    [navigate],
  );

  const startProject = useCallback(
    (type?: string) => navigate(type ? `/contact?type=${encodeURIComponent(type)}` : "/contact"),
    [navigate],
  );

  const value = useMemo(() => ({ showWork, reelOpen, setReelOpen, startProject }), [showWork, reelOpen, startProject]);

  return <StudioUIContext.Provider value={value}>{children}</StudioUIContext.Provider>;
}

export function useStudioUI() {
  const ctx = useContext(StudioUIContext);
  if (!ctx) throw new Error("useStudioUI must be used inside StudioUIProvider");
  return ctx;
}
