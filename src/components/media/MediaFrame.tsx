import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "@/hooks/useMotionPreference";
import { Artwork, type ArtVariant } from "@/components/art/Artwork";

/**
 * A muted, looping preview clip. The file isn't requested until the first
 * time `active` turns on, and it pauses whenever `active` turns off.
 */
export function PreviewVideo({ src, active, className }: { src: string; active: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) setArmed(true);
  }, [active]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !armed) return;
    if (active) v.play().catch(() => setVisible(false));
    else v.pause();
  }, [active, armed]);

  return (
    <video
      ref={ref}
      className={cn(
        "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
        visible && active ? "opacity-100" : "opacity-0",
        className,
      )}
      src={armed ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setVisible(true)}
    />
  );
}

type MediaFrameProps = {
  art: ArtVariant;
  poster?: string;
  preview?: string;
  /** On screen / hovered. Drives the artwork loop. */
  active: boolean;
  /** Plays the preview clip, if any. Defaults to `active`. */
  previewActive?: boolean;
  className?: string;
  children?: ReactNode;
  posterAlt?: string;
  /** Classes for the cover layer (e.g. hover scale). */
  innerClassName?: string;
};

/**
 * Cover for a piece of work: the supplied poster image, or the illustrated
 * placeholder artwork, with an optional muted preview clip on top.
 */
export function MediaFrame({
  art,
  poster,
  preview,
  active,
  previewActive = active,
  className,
  children,
  posterAlt = "",
  innerClassName,
}: MediaFrameProps) {
  const { allowMotion } = useMotionPreference();
  const run = active && allowMotion;

  return (
    <div className={cn("relative overflow-hidden bg-paper-2", className)}>
      {poster ? (
        <img src={poster} alt={posterAlt} loading="lazy" decoding="async" className={cn("absolute inset-0 h-full w-full object-cover", innerClassName)} />
      ) : (
        <Artwork variant={art} play={run} className={cn("absolute inset-0", innerClassName)} />
      )}
      {preview && <PreviewVideo src={preview} active={previewActive && allowMotion} className={innerClassName} />}
      {children}
    </div>
  );
}
