# Inbetween — motion design & animation studio site

A multi-page studio site built with React, React Router, Vite, Tailwind CSS v4, Motion for React
and GSAP. Light editorial theme, illustrated artwork, real video playback, a working contact form,
UGC showcase and a scroll-driven process sequence.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run assets     # re-render the UGC sample videos (dev server must be running)
npm run og         # re-render public/og-image.png (dev server must be running)
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — hero, showreel, selected work, services overview, pinned Process sequence, CTA |
| `/work` | All work with category filters (`/work?filter=ugc` etc.) |
| `/work/:slug` | One case-study page per project, with prev/next |
| `/services` | Service list, UGC product videos (`/services#ugc-videos`), delivery formats |
| `/about` | Studio story, playground sketchbook, how we collaborate |
| `/contact` | Enquiry form (`/contact?type=UGC%20product%20video` pre-selects a type) |
| `*` | 404 |

Pages swap with an ink "curtain" transition, restore scroll position on Back/Forward, honour
`#anchors`, and move keyboard focus to the new page. Each page is its own code-split chunk.

**Hosting:** every route must serve `index.html`. `public/_redirects` (Netlify) and `vercel.json`
(Vercel) are included; for other hosts add an equivalent SPA fallback.

## Before launch — replace the placeholders

Everything a visitor reads lives in `src/content/`. Nothing below is real yet.

| What | Where | Notes |
| --- | --- | --- |
| Studio name, email, location, socials | `src/content/site.ts` | "Inbetween" and `hello@example.com` are placeholders. Socials with an empty `href` are hidden. |
| Page title, description, social preview | `index.html` | Replace `https://example.com` with your domain so link previews resolve. |
| Portfolio | `src/content/projects.ts` | All ten entries are **samples** (`sample: true`). Replace titles, copy, deliverables and add real media. `client` only shows when filled in. `format: "vertical"` gives a 9:16 phone-style player. |
| Showreel | `src/content/media.ts` → `showreel` | Uses your motion graphics showreel (`/media/motion-graphics-showreel.mp4`, with a muted 10 s loop and poster). Swap the files to update it; the duration label reads the file's actual length. |
| Featured film | `src/content/media.ts` → `featuredFilm` | "Ideas Into Impact" (your supplied 9:16 film) is featured on Home and as the first project. Its write-up in `projects.ts` was drafted from what's on screen — check it, and add year/client. |
| UGC videos | `src/content/media.ts` → `ugcVideos` | The bundled clips are illustrated concepts. Replace with real creator footage (9:16 MP4). |
| Services, process, highlights, budgets | `src/content/studio.ts` | Highlights are written as approach statements, not claims — edit to describe your studio. |
| Testimonials | `src/content/studio.ts` → `testimonials` | Leave empty until you have verified quotes; a neutral "working together" section shows instead. |
| Social card | `scripts/og-card.html` → `npm run og` | Re-render after changing the name or headline. |

## Video assets

`npm run assets` renders the UGC sample MP4s from `scripts/render/stage.tsx` — the same artwork components
the site uses, animated with CSS and captured frame by frame with a local Chrome/Edge
(playwright-core) and encoded with ffmpeg:

- `public/media/ugc-unboxing|demo|reaction.mp4` — 720×1280 vertical, burned-in captions
- matching `.jpg` posters

Requires `ffmpeg` on PATH (or `FFMPEG_PATH`) and Chrome/Edge (or `CHROME_PATH`).
`npm run assets reel` renders an illustrated placeholder reel (`showreel-2026.mp4`, not used now that
the real showreel is in place); `npm run assets all` renders both. Edit the compositions in
`scripts/render/stage.tsx` and re-run to change them.

### Using your own media

Put files in `public/media/` and reference them as `/media/your-file.mp4`, or use a direct,
hosted MP4/WebM URL. When a slot is empty the illustrated artwork is shown and no player
controls are rendered.

- **Full films** (`video`): H.264 MP4, 1080p, ~6–8 Mbps. Played with custom, accessible controls
  (play/pause, seek, time, mute, captions, fullscreen; keyboard: Space/K, ←/→, M, C, F).
- **Previews** (`preview`): 4–8 s muted loops, ~960 px wide, under 1.5 MB. Not requested until a
  card is hovered (or reaches the centre of the screen on touch devices).
- **Posters** (`poster`): 1600 px WebP/AVIF/JPG. **Captions** (`captions`): WebVTT.

In development, placeholder slots show a small "Dev:" hint; these never appear in production.

## Contact form

Copy `.env.example` to `.env.local` and set `VITE_FORM_ENDPOINT` to any service that accepts a JSON
`POST` and returns 2xx on success (Formspree, Basin, Getform, your own API). The form validates
inline, shows a success message only after a 2xx response, keeps the visitor's text on failure and
includes a honeypot field. Without an endpoint it falls back to opening the visitor's email app,
and says plainly that the message is only sent once they press send there.

## Motion system

- **Motion for React** handles interface motion: reveals, page transitions, menu, dialogs, filters,
  card tilt and hover states.
- **GSAP + ScrollTrigger** drives the scroll-linked sequences: the pinned, sideways **Process**
  sequence (each step's illustration builds as you scroll; on phones the cards stack and still build
  with scroll, without pinning), the showreel frame scale, and the Playground's line drawing and
  shape morphing. The two libraries never animate the same element.
- Card artwork loops (CSS `.anim` classes in `src/index.css`) run whenever a card is on screen.
- `prefers-reduced-motion` is respected everywhere, and visitors can pause decorative motion with
  the toggle in the Playground and footer (remembered per browser; covers WCAG 2.2.2). With motion
  off, Process becomes a static grid.
- No smooth-scroll library. Lottie/Rive are not installed because there are no vector animation
  files yet — add `lottie-react` or `@rive-app/react-canvas` when you have some.

## Structure

```
src/
  content/        all editable copy, links and media slots
  pages/          one component per route
  sections/       page sections (Hero, WorkGrid, ServicesList, UgcShowcase, Process, …)
  components/
    art/          SVG artwork, reel poster, service/process/study loops
    layout/       header, mobile menu, footer, page shell (transitions), page header
    media/        VideoPlayer, MediaFrame, PreviewVideo
    ui/           shadcn-style primitives (Button, Dialog, Field, Tilt)
    decor/        reveals, section labels, hand-drawn scribbles
  hooks/          motion preference, in-view playback, page meta, focus return, refresh
  lib/            utils, motion presets, GSAP registration
scripts/
  render/         video composition stage (npm run assets)
  render-assets.mjs, render-og.mjs, og-card.html
```

`components.json` is configured for the shadcn CLI, so `npx shadcn@latest add <component>` drops
new primitives into `src/components/ui`.
