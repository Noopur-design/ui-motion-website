import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { Captions, LoaderCircle, Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";

type VideoPlayerProps = {
  src: string;
  title: string;
  poster?: string;
  captions?: string;
  autoPlay?: boolean;
  className?: string;
};

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * Accessible video player with custom controls: play/pause, seek, time,
 * mute, captions and fullscreen. Keyboard: Space/K play, ←/→ seek 5s,
 * M mute, F fullscreen, C captions.
 */
export function VideoPlayer({ src, title, poster, captions, autoPlay = false, className }: VideoPlayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<FullscreenVideo>(null);
  const hideTimer = useRef<number | undefined>(undefined);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [muted, setMuted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [chrome, setChrome] = useState(true);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, []);

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration || 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  };

  const toggleFullscreen = () => {
    const wrap = wrapRef.current;
    const v = videoRef.current;
    if (!wrap || !v) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (wrap.requestFullscreen) wrap.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.(); // iOS Safari
  };

  const toggleCaptions = () => {
    const track = videoRef.current?.textTracks[0];
    if (!track) return;
    const next = !captionsOn;
    track.mode = next ? "showing" : "hidden";
    setCaptionsOn(next);
  };

  const retry = () => {
    setError(false);
    videoRef.current?.load();
  };

  // Autoplay after an explicit user action (opening the overlay). Browsers may still refuse.
  useEffect(() => {
    if (autoPlay) videoRef.current?.play().catch(() => setPlaying(false));
  }, [autoPlay]);

  useEffect(() => {
    const onFs = () => setFullscreen(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  // Auto-hide controls while playing; keep them up when paused or focused.
  const nudgeChrome = () => {
    setChrome(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!wrapRef.current?.contains(document.activeElement) || document.activeElement === videoRef.current) setChrome(false);
    }, 2400);
  };
  const showChrome = chrome || !playing || error;

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const onRange = target instanceof HTMLInputElement && target.type === "range";
    const onButton = target instanceof HTMLButtonElement;
    const key = e.key.toLowerCase();
    if ((key === " " && !onButton) || key === "k") {
      e.preventDefault();
      togglePlay();
    } else if (!onRange && (key === "arrowright" || key === "arrowleft")) {
      e.preventDefault();
      seekBy(key === "arrowright" ? 5 : -5);
    } else if (key === "m") toggleMute();
    else if (key === "f") toggleFullscreen();
    else if (key === "c" && captions) toggleCaptions();
    nudgeChrome();
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label={`${title} — video player`}
      className={cn("group/player relative isolate overflow-hidden bg-ink text-paper", className)}
      onPointerMove={nudgeChrome}
      onKeyDown={onKeyDown}
      onFocus={() => setChrome(true)}
    >
      <video
        ref={videoRef}
        className="h-full w-full bg-ink object-contain"
        src={src}
        poster={poster || undefined}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
          nudgeChrome();
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onProgress={(e) => {
          const v = e.currentTarget;
          if (v.buffered.length && v.duration) setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
        }}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onError={() => {
          setError(true);
          setPlaying(false);
        }}
      >
        {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
      </video>

      {/* Centre state: big play button before start, spinner while buffering, error panel */}
      {!started && !error && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 grid place-items-center bg-ink/20 transition-colors hover:bg-ink/10"
          aria-label={`Play ${title}`}
        >
          <span className="grid size-20 place-items-center rounded-full bg-lime text-ink transition-transform duration-500 ease-out-expo group-hover/player:scale-110 sm:size-24">
            <Play className="ml-1 size-8 fill-current" aria-hidden />
          </span>
        </button>
      )}
      {waiting && playing && !error && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden>
          <LoaderCircle className="size-10 animate-spin text-paper" />
        </div>
      )}
      {error && (
        <div role="alert" className="absolute inset-0 grid place-items-center bg-ink/90 p-6 text-center">
          <div className="max-w-sm">
            <p className="display text-2xl">This film couldn’t be loaded.</p>
            <p className="mt-2 text-sm text-paper/70">Check your connection and try again.</p>
            <button
              type="button"
              onClick={retry}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-ink hover:bg-lime"
            >
              <RotateCcw className="size-4" aria-hidden /> Try again
            </button>
          </div>
        </div>
      )}

      {/* Control bar */}
      {started && !error && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-ink/85 to-transparent px-3 pb-3 pt-10 transition-opacity duration-300 sm:gap-3 sm:px-5 sm:pb-4",
            showChrome ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <ControlButton label={playing ? "Pause" : "Play"} onClick={togglePlay}>
            {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
          </ControlButton>

          <span className="label-mono w-[5.5rem] shrink-0 tabular-nums text-paper/85 sm:w-28" aria-hidden>
            {formatTime(time)} / {formatTime(duration)}
          </span>

          <input
            type="range"
            className="seek min-w-0 flex-1"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => {
              const v = videoRef.current;
              if (v) v.currentTime = Number(e.target.value);
            }}
            aria-label="Seek"
            aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
            style={{ "--p": `${progress}%`, "--b": `${buffered}%` } as CSSProperties}
          />

          <ControlButton label={muted ? "Unmute" : "Mute"} onClick={toggleMute}>
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </ControlButton>
          {captions && (
            <ControlButton label={captionsOn ? "Hide captions" : "Show captions"} onClick={toggleCaptions} pressed={captionsOn}>
              <Captions className="size-5" />
            </ControlButton>
          )}
          <ControlButton label={fullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen}>
            {fullscreen ? <Minimize className="size-5" /> : <Maximize className="size-5" />}
          </ControlButton>
        </div>
      )}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  pressed,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className="grid size-10 shrink-0 place-items-center rounded-full text-paper transition-colors hover:bg-paper/15 focus-visible:outline-lime [&_svg]:pointer-events-none"
    >
      <span aria-hidden>{children}</span>
    </button>
  );
}
