import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";

type MotionPreference = {
  /** The operating system asks for reduced motion. */
  systemReduced: boolean;
  /** The visitor paused decorative motion with the on-site toggle. */
  paused: boolean;
  /** Decorative loops and scroll effects may run. */
  allowMotion: boolean;
  togglePaused: () => void;
};

const MotionPreferenceContext = createContext<MotionPreference | null>(null);
const STORAGE_KEY = "inbetween:motion-paused";

function readStoredPause() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(
    () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [paused, setPaused] = useState(readStoredPause);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setSystemReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "off" : "on";
    try {
      localStorage.setItem(STORAGE_KEY, paused ? "1" : "0");
    } catch {
      /* storage unavailable (private mode) — preference just won't persist */
    }
  }, [paused]);

  const togglePaused = useCallback(() => setPaused((p) => !p), []);

  const value = useMemo(
    () => ({ systemReduced, paused, allowMotion: !systemReduced && !paused, togglePaused }),
    [systemReduced, paused, togglePaused],
  );

  return (
    <MotionPreferenceContext.Provider value={value}>
      {/* Interface transitions still run when paused, but without transforms. */}
      <MotionConfig reducedMotion={paused ? "always" : "user"}>{children}</MotionConfig>
    </MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference() {
  const ctx = useContext(MotionPreferenceContext);
  if (!ctx) throw new Error("useMotionPreference must be used inside MotionPreferenceProvider");
  return ctx;
}
