import type { ArtVariant } from "@/components/art/Artwork";
import type { MediaSlot } from "./media";

export const categories = [
  { id: "brand", label: "Brand Motion" },
  { id: "explainer", label: "Explainer Films" },
  { id: "illustration", label: "Illustration & Animation" },
  { id: "product", label: "Product Films" },
  { id: "campaign", label: "Campaign Films" },
  { id: "experimental", label: "Experimental Motion" },
  { id: "ugc", label: "UGC Videos" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export const categoryLabel = (id: CategoryId) =>
  categories.find((c) => c.id === id)?.label ?? id;

export type Project = {
  slug: string;
  title: string;
  category: CategoryId;
  year?: number;
  /** Leave empty until you can name the client publicly. */
  client?: string;
  /** One-line hook shown on the card and at the top of the case study. */
  summary: string;
  overview: string;
  approach: string;
  deliverables: string[];
  /** Placeholder artwork used whenever no poster/video is supplied. */
  art: ArtVariant;
  media: MediaSlot;
  /** "vertical" for 9:16 work such as UGC and Reels — the case study uses a phone-shaped player. */
  format?: "landscape" | "vertical";
  /** Stills shown in the case study's Frames section (falls back to artwork crops). */
  frames?: string[];
  /**
   * Sample entries ship with the template so the layout can be judged.
   * Replace them with real case studies (and set `sample: false`) before launch.
   */
  sample?: boolean;
};

export const projects: Project[] = [
  {
    slug: "ideas-into-impact",
    title: "Ideas Into Impact",
    category: "brand",
    summary: "A vertical brand film that takes an idea from first pencil line to finished identity in 35 seconds.",
    overview:
      "A 9:16 brand film told in six chapters — create, transform, refine, rise up. Sketches, moodboards and wireframes resolve on screen into a finished identity and website, ending on a clean brand card.",
    approach:
      "Every chapter has its own visual language: a pencil construction line, a wireframe that becomes a live layout, an easing curve tuned frame by frame. Warm film tones and kinetic typography carry the story from the first sketch to the final frame.",
    deliverables: ["35-second film (9:16)", "Kinetic typography", "Identity & UI animation"],
    art: "brand",
    format: "vertical",
    media: {
      video: "/media/ideas-into-impact.mp4",
      preview: "/media/ideas-into-impact-muted.mp4",
      poster: "/media/ideas-into-impact.jpg",
    },
    frames: [
      "/media/ideas-into-impact-frame-1.jpg",
      "/media/ideas-into-impact-frame-2.jpg",
      "/media/ideas-into-impact-frame-3.jpg",
      "/media/ideas-into-impact-frame-4.jpg",
    ],
  },
  {
    slug: "shape-shift",
    title: "Shape Shift",
    category: "brand",
    year: 2026,
    summary: "A modular motion identity built from three shapes and one rule.",
    overview:
      "A brand reveal and motion toolkit for a modular furniture label. The identity is made of a circle, a square and a wedge — so the animation system had to make three simple shapes feel endlessly flexible.",
    approach:
      "We wrote a single rule — every shape moves like it has weight — and built everything from it: the logo build, transitions, lower thirds and a library of social loops the in-house team can re-use.",
    deliverables: ["Logo animation", "Motion guidelines", "Transition kit", "12 social loops"],
    art: "brand",
    media: {},
    sample: true,
  },
  {
    slug: "how-water-finds-its-way",
    title: "How Water Finds Its Way",
    category: "explainer",
    year: 2026,
    summary: "A 2-minute explainer that turns a filtration system into a story.",
    overview:
      "A script-led 2D explainer for a water-technology product. The brief: explain a multi-stage process to non-engineers without a single cutaway diagram that looks like a manual.",
    approach:
      "We followed one drop of water through the whole system as a character, using colour to signal each stage. Storyboards were tested with people outside the industry before a single frame was animated.",
    deliverables: ["Script & storyboard", "2:00 explainer film", "3 cut-downs", "Subtitled versions"],
    art: "explainer",
    media: {},
    sample: true,
  },
  {
    slug: "small-hours",
    title: "Small Hours",
    category: "illustration",
    year: 2025,
    summary: "An illustrated short about a town that only wakes up at night.",
    overview:
      "A self-contained animated short exploring a night-time town, its lights and its quiet routines — designed as a world first, so it could later grow into stills, prints and loops.",
    approach:
      "Everything was painted in a limited palette of four colours with hand-drawn texture. Animation is deliberately sparse: small, looping gestures that make the stillness feel alive.",
    deliverables: ["Illustrated world", "90-second short", "Looping stills", "Print series"],
    art: "illustration",
    media: {},
    sample: true,
  },
  {
    slug: "weightless",
    title: "Weightless",
    category: "product",
    year: 2025,
    summary: "A product film where nothing touches the ground.",
    overview:
      "A launch film for a pair of lightweight headphones. The product had one story to tell — how little it weighs — and the film needed to make that felt rather than stated.",
    approach:
      "We built a gravity-free world of floating objects that drift, collide softly and settle around the product. Feature callouts are animated as part of the scene rather than layered on top.",
    deliverables: ["30-second hero film", "Feature cut-downs", "Product loops for web"],
    art: "product",
    media: {},
    sample: true,
  },
  {
    slug: "loud-week",
    title: "Loud Week",
    category: "campaign",
    year: 2026,
    summary: "A typographic campaign made to stop the scroll in under a second.",
    overview:
      "A week-long promotional campaign for a music festival line-up announcement, delivered across vertical video, out-of-home screens and paid social.",
    approach:
      "Big type, hard cuts and a strict rhythm locked to the music. One master animation system generated more than forty platform-specific outputs without losing its energy.",
    deliverables: ["Campaign toolkit", "40+ social edits", "OOH screen loops", "Animated posters"],
    art: "campaign",
    media: {},
    sample: true,
  },
  {
    slug: "type-weather",
    title: "Type Weather",
    category: "experimental",
    year: 2025,
    summary: "Letters that behave like wind, rain and tide.",
    overview:
      "A studio exploration into kinetic typography. Each piece asks what a letterform would do if it were caught in a particular kind of weather.",
    approach:
      "Procedural rigs drive the letters, then every loop is hand-tuned frame by frame. The series became a test-bed for techniques we now use in client title sequences.",
    deliverables: ["8 typographic loops", "Title-sequence R&D", "Open type rigs"],
    art: "experimental",
    media: {},
    sample: true,
  },
  {
    slug: "the-kite-keeper",
    title: "The Kite Keeper",
    category: "illustration",
    year: 2024,
    summary: "A character-led story about holding on and letting go.",
    overview:
      "A short 2D character animation for a children's charity campaign, following a small character who looks after the town's lost kites.",
    approach:
      "We designed the character to be readable at thumbnail size and animated on twos for a handmade feel. A quiet sound design leaves room for the story to breathe.",
    deliverables: ["Character design", "60-second film", "Social cut-downs", "Sticker set"],
    art: "character",
    media: {},
    sample: true,
  },
  {
    slug: "ten-seconds-of-data",
    title: "Ten Seconds of Data",
    category: "explainer",
    year: 2024,
    summary: "A series of ten-second films that make one number unforgettable.",
    overview:
      "A short-form explainer series for an annual report: each film takes one statistic and turns it into a visual idea that works with the sound off.",
    approach:
      "A tight grid, a single accent colour and a reusable chart-to-object transition gave the series consistency while every film still has its own visual punchline.",
    deliverables: ["10 short films", "Animated chart system", "Report web embeds"],
    art: "data",
    media: {},
    sample: true,
  },
  {
    slug: "morning-shelf",
    title: "Morning Shelf",
    category: "ugc",
    year: 2026,
    summary: "A creator-style unboxing that sells the ritual, not the bottle.",
    overview:
      "A run of creator-style unboxing videos for a skincare launch, built for TikTok, Reels and Shorts. The brief: feel like a friend's recommendation, not an advert.",
    approach:
      "We wrote hooks that land in the first second, planned handheld shots and jump cuts, and added captions so the story works with the sound off. Every video was cut in three hook variations for testing.",
    deliverables: ["Creator brief & script", "3 UGC videos (9:16)", "Hook variations", "Burned-in captions"],
    art: "ugc",
    format: "vertical",
    media: {
      video: "/media/ugc-unboxing.mp4",
      preview: "/media/ugc-unboxing.mp4",
      poster: "/media/ugc-unboxing.jpg",
    },
    sample: true,
  },
  {
    slug: "three-things",
    title: "Three Things I Didn’t Expect",
    category: "ugc",
    year: 2025,
    summary: "A product demo told as a list — fast, honest and easy to repeat.",
    overview:
      "Short-form demo videos for a pair of wireless earbuds, structured as a simple countdown so viewers stay to the end.",
    approach:
      "Each beat shows one feature in under two seconds, with on-screen numbering and captions. The format became a template the brand now reuses for every launch.",
    deliverables: ["Demo script", "UGC demo videos (9:16)", "Caption system", "Paid-social cut-downs"],
    art: "ugc",
    format: "vertical",
    media: {
      video: "/media/ugc-demo.mp4",
      preview: "/media/ugc-demo.mp4",
      poster: "/media/ugc-demo.jpg",
    },
    sample: true,
  },
];
