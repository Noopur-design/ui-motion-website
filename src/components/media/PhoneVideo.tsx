import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "motion/react";
import { Play } from "lucide-react";
import { Tilt } from "@/components/ui/tilt";
import { AnimatedDialog, DialogCloseButton, DialogTitle } from "@/components/ui/dialog";
import { VideoPlayer } from "./VideoPlayer";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "@/hooks/useMotionPreference";

type PhoneVideoProps = {
  /** Muted clip that loops inline while the phone is on screen. */
  src: string;
  poster: string;
  /** Accessible name for the button that opens the full player. */
  label: string;
  onOpen: () => void;
  className?: string;
  size?: "sm" | "lg";
  /** Hold the inline loop (e.g. while the full player is open). */
  paused?: boolean;
  children?: ReactNode;
};

/**
 * A phone-framed, muted loop. The file isn't requested until the phone is
 * near the viewport, and it only plays while visible (and motion is allowed).
 */
export function PhoneVideo({ src, poster, label, onOpen, className, size = "sm", paused = false, children }: PhoneVideoProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const near = useInView(ref, { margin: "300px 0px" });
  const visible = useInView(ref, { amount: 0.35 });
  const { allowMotion } = useMotionPreference();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (near) setArmed(true);
  }, [near]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !armed) return;
    if (visible && allowMotion && !paused) v.play().catch(() => {});
    else v.pause();
  }, [visible, allowMotion, armed, paused]);

  const lg = size === "lg";

  return (
    <Tilt className={className}>
      <button
        ref={ref}
        type="button"
        onClick={onOpen}
        aria-label={label}
        className={cn(
          "group relative block w-full overflow-hidden bg-ink shadow-[0_40px_80px_-40px_rgb(20_18_16/0.75)]",
          lg ? "rounded-[2.4rem] p-2.5" : "rounded-[1.6rem] p-[5px] sm:rounded-[2rem] sm:p-2",
        )}
      >
        <span className={cn("relative block aspect-[9/16] overflow-hidden bg-paper-3", lg ? "rounded-[1.9rem]" : "rounded-[1.25rem] sm:rounded-[1.5rem]")}>
          <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={armed ? src : undefined}
            poster={poster}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            tabIndex={-1}
          />
          <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20">
            <span
              className={cn(
                "grid scale-75 place-items-center rounded-full bg-lime text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100",
                lg ? "size-16" : "size-12",
              )}
            >
              <Play className={cn("ml-0.5 fill-current", lg ? "size-6" : "size-5")} aria-hidden />
            </span>
          </span>
          {children}
        </span>
        <span
          aria-hidden
          className={cn("absolute left-1/2 -translate-x-1/2 rounded-full bg-ink", lg ? "top-4 h-2 w-16" : "top-2.5 h-1.5 w-10 sm:top-3.5 sm:w-14")}
        />
      </button>
    </Tilt>
  );
}

export type VerticalClip = { src: string; poster?: string; title: string };

/** Full-screen player sized for 9:16 video, with sound and real controls. */
export function VerticalPlayerDialog({ clip, onClose }: { clip: VerticalClip | null; onClose: () => void }) {
  // Keep the last clip rendered while the dialog animates out.
  const last = useRef(clip);
  if (clip) last.current = clip;
  const shown = clip ?? last.current;

  return (
    <AnimatedDialog
      open={Boolean(clip)}
      onOpenChange={(o) => !o && onClose()}
      enter="fade"
      className="inset-0 flex flex-col items-center justify-center p-3 sm:p-6"
      overlayClassName="bg-ink/92"
    >
      {shown && (
        <div className="flex h-full max-h-[calc(100svh-1.5rem)] w-full flex-col items-center">
          <div className="flex w-full max-w-[min(26rem,calc((100svh-6rem)*9/16))] items-center justify-between gap-3 pb-3 text-paper">
            <DialogTitle className="display text-xl">{shown.title}</DialogTitle>
            <DialogCloseButton />
          </div>
          <div className="aspect-[9/16] w-full max-w-[min(26rem,calc((100svh-6rem)*9/16))] overflow-hidden rounded-2xl">
            <VideoPlayer src={shown.src} poster={shown.poster} title={shown.title} autoPlay className="h-full w-full" />
          </div>
        </div>
      )}
    </AnimatedDialog>
  );
}
