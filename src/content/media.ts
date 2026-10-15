import type { ArtVariant } from "@/components/art/Artwork";
import type { CategoryId } from "./projects";

/**
 * Media slots.
 *
 * Every video field accepts a path inside /public (e.g. "/media/showreel-2026.mp4")
 * or a direct, hosted MP4/WebM URL. Leave a field empty and the site shows the
 * illustrated placeholder artwork instead — nothing pretends to play.
 *
 * Recommended encodes:
 *  - Full films: H.264 MP4, 1920×1080, ~6–8 Mbps, AAC audio.
 *  - Hover previews: 4–8 s, muted, 960 px wide, < 1.5 MB, no audio track.
 *  - Posters: 1600 px wide WebP/AVIF/JPG.
 */
export type MediaSlot = {
  /** Full-length film played in the overlay / project player. */
  video?: string;
  /** Short muted loop played on hover or when in view. */
  preview?: string;
  /** Poster image shown before playback. Falls back to the illustrated artwork. */
  poster?: string;
  /** WebVTT captions file for the full film. */
  captions?: string;
};

export const showreel = {
  title: "Studio Showreel 2026",
  /** The studio's motion graphics showreel (1920×1080, 60 fps, with sound). */
  video: "/media/motion-graphics-showreel.mp4",
  /** Muted 10-second loop used as the living thumbnail and in the hero. */
  preview: "/media/motion-graphics-showreel-loop.mp4",
  poster: "/media/motion-graphics-showreel.jpg",
  captions: "",
  /**
   * Shown until the real file's metadata loads — the player then reads the
   * actual duration. Update it to match your cut.
   */
  durationLabel: "00:25",
} satisfies MediaSlot & { title: string; durationLabel: string };

/**
 * Vertical (9:16) UGC samples shown on the Services page. The bundled clips are
 * illustrated concepts rendered by npm run assets — swap in real creator footage.
 */
export const ugcVideos = [
  {
    id: "unboxing",
    label: "Unboxing",
    hook: "POV: it finally arrived",
    video: "/media/ugc-unboxing.mp4",
    poster: "/media/ugc-unboxing.jpg",
  },
  {
    id: "demo",
    label: "Product demo",
    hook: "3 things I didn’t expect",
    video: "/media/ugc-demo.mp4",
    poster: "/media/ugc-demo.jpg",
  },
  {
    id: "reaction",
    label: "First impressions",
    hook: "first sip, honest reaction",
    video: "/media/ugc-reaction.mp4",
    poster: "/media/ugc-reaction.jpg",
  },
];

/**
 * The featured film on the home page (also a project in projects.ts).
 * `video` plays with sound in the player; `loop` is a muted, lighter copy for inline autoplay.
 */
export const featuredFilm = {
  slug: "ideas-into-impact",
  title: "Ideas Into Impact",
  video: "/media/ideas-into-impact.mp4",
  loop: "/media/ideas-into-impact-muted.mp4",
  poster: "/media/ideas-into-impact.jpg",
  durationLabel: "00:35",
};

export type ReelStyle = {
  id: string;
  label: string;
  art: ArtVariant;
  /** Selected Work filter applied when the tile is clicked. */
  filter: CategoryId;
  preview?: string;
};

/** The "preview strip" of animation styles beneath the main reel. */
export const reelStyles: ReelStyle[] = [
  { id: "character", label: "2D character animation", art: "character", filter: "illustration" },
  { id: "motion-graphics", label: "Motion graphics", art: "experimental", filter: "experimental" },
  { id: "brand", label: "Brand identity animation", art: "brand", filter: "brand" },
  { id: "explainers", label: "Product explainers", art: "explainer", filter: "explainer" },
  { id: "story", label: "Illustrated storytelling", art: "illustration", filter: "illustration" },
  { id: "promo", label: "Promotional videos", art: "campaign", filter: "campaign" },
];
