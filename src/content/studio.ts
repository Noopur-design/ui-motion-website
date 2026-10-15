import type { CategoryId } from "./projects";

export type ServiceArt = "motion" | "animation" | "illustration" | "explainer" | "brand" | "social" | "ugc";

export type Service = {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  art: ServiceArt;
  /** Pre-selects the project type in the contact form. */
  projectType: string;
  /** Related Selected Work filter. */
  category: CategoryId;
};

export const services: Service[] = [
  {
    id: "motion-graphics",
    title: "Motion Graphics",
    summary: "Animated typography, kinetic visuals, graphic sequences, and visual storytelling.",
    includes: ["Kinetic typography", "Title sequences", "Data in motion", "Graphic loops", "Event visuals"],
    art: "motion",
    projectType: "Motion graphics",
    category: "experimental",
  },
  {
    id: "2d-animation",
    title: "2D Animation",
    summary: "Character animation, scene animation, animated stories, and stylized visual narratives.",
    includes: ["Character design & rigs", "Frame-by-frame", "Scene animation", "Short films", "Loops"],
    art: "animation",
    projectType: "2D animation",
    category: "illustration",
  },
  {
    id: "illustration",
    title: "Illustration",
    summary: "Custom illustrations, editorial artwork, brand illustrations, and illustrated campaign assets.",
    includes: ["Editorial artwork", "Brand illustration systems", "Campaign key art", "Icon & spot sets"],
    art: "illustration",
    projectType: "Illustration",
    category: "illustration",
  },
  {
    id: "explainer-videos",
    title: "Explainer Videos",
    summary: "Script-led animated videos that simplify products, services, and complex concepts.",
    includes: ["Scriptwriting", "Storyboards & animatics", "Voice-over direction", "Product walkthroughs"],
    art: "explainer",
    projectType: "Explainer video",
    category: "explainer",
  },
  {
    id: "brand-promo",
    title: "Brand & Promotional Videos",
    summary: "Brand films, launch videos, digital advertisements, and campaign creatives.",
    includes: ["Logo animation", "Brand films", "Launch videos", "Digital ads", "Motion guidelines"],
    art: "brand",
    projectType: "Brand / promotional film",
    category: "brand",
  },
  {
    id: "social",
    title: "Social Media Animation",
    summary: "Reels, short-form promotional videos, animated advertisements, and platform-specific content.",
    includes: ["Reels & Shorts", "Animated ads", "Sticker & GIF packs", "Platform cut-downs"],
    art: "social",
    projectType: "Social media animation",
    category: "campaign",
  },
  {
    id: "ugc",
    title: "UGC Product Videos",
    summary: "Creator-style product videos — unboxings, demos and first impressions — made to feel real on TikTok, Reels and Shorts.",
    includes: ["Creator briefs & scripts", "Unboxing & demo videos", "Hook variations", "Captions & subtitles", "9:16, 4:5 & 1:1 cuts"],
    art: "ugc",
    projectType: "UGC product video",
    category: "ugc",
  },
];

export const projectTypes = [
  "Motion graphics",
  "2D animation",
  "Illustration",
  "Explainer video",
  "Brand / promotional film",
  "Social media animation",
  "UGC product video",
  "Something else",
];

/** Edit the ranges and currency to match how you quote. */
export const budgetRanges = ["Under $5k", "$5k – $15k", "$15k – $40k", "$40k +", "Not sure yet"];

export const processSteps = [
  {
    n: "01",
    title: "Discover",
    text: "Understand the brand, audience, goals, and message.",
    outputs: ["Brief & goals", "Audience", "Key message"],
  },
  {
    n: "02",
    title: "Conceptualize",
    text: "Develop the creative direction, references, scripts, storyboards, and visual style.",
    outputs: ["Script", "Storyboards", "Style frames"],
  },
  {
    n: "03",
    title: "Animate",
    text: "Build illustrations, motion systems, transitions, sound, and final sequences.",
    outputs: ["Animatic", "Animation", "Sound"],
  },
  {
    n: "04",
    title: "Deliver",
    text: "Refine the work, complete revisions, and export assets for the required platforms.",
    outputs: ["Revisions", "Masters", "Platform cuts"],
  },
];

/**
 * Studio highlights for the About section. These are written as approach
 * statements rather than claims — edit them to describe your real studio.
 */
export const highlights = [
  {
    label: "Creative approach",
    text: "Idea first, style second. Every project starts on paper — a sentence, a sketch, a rhythm — before it reaches the timeline.",
  },
  {
    label: "Who we work with",
    text: "Brands, agencies and in-house teams who need to explain something, launch something, or simply be remembered.",
  },
  {
    label: "Production",
    text: "Script, storyboard, illustration, 2D and motion graphics, sound and final delivery — handled in one place.",
  },
  {
    label: "Collaboration",
    text: "Small senior team, open files and regular check-ins. You see the work early and often, never just at the end.",
  },
];

/**
 * Add verified testimonials only. While this list is empty the site shows a
 * neutral collaboration statement instead.
 */
export const testimonials: { quote: string; name: string; role: string }[] = [];

export const collaborationModels = [
  {
    title: "Full production",
    text: "From the first conversation to the final export — concept, script, design, animation and sound.",
  },
  {
    title: "Agency partner",
    text: "A quiet extension of your creative team, bringing motion to campaigns you've already shaped.",
  },
  {
    title: "In-house support",
    text: "Motion systems, templates and training so your own team can keep the work moving.",
  },
];
