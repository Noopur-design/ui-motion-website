import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}

/** True on devices with a precise pointer that can hover (i.e. not touch-first). */
export const useCanHover = () => useMediaQuery("(hover: hover) and (pointer: fine)");
