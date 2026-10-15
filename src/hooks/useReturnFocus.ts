import { useRef } from "react";

/**
 * Remembers which element was focused when `open` became true and returns a
 * function that puts focus back there. Needed because our dialogs are opened
 * from many places rather than a single Radix <Dialog.Trigger>.
 */
export function useReturnFocus(open: boolean) {
  const opener = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  // Captured during render, before the dialog mounts and moves focus inside.
  if (open && !wasOpen.current && typeof document !== "undefined") {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }
  wasOpen.current = open;

  return () => {
    const el = opener.current;
    opener.current = null;
    if (el && el.isConnected) el.focus({ preventScroll: true });
  };
}
