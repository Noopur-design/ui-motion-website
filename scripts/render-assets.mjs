// Renders the site's video assets from scripts/render/stage.tsx:
//   public/media/showreel-2026.mp4        1920×1080, scenes joined with transitions
//   public/media/showreel-2026-loop.mp4   960×540 muted loop for thumbnails
//   public/media/showreel-2026.jpg        poster
//   public/media/ugc-{unboxing,demo,reaction}.mp4 + .jpg   720×1280 vertical
//
// Usage: npm run dev   (in another terminal)   then   npm run assets
// Needs a local Chrome/Edge (CHROME_PATH) and ffmpeg (FFMPEG_PATH or on PATH).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const FPS = 25;
const STAGE = process.env.STAGE_URL ?? "http://localhost:5173/scripts/render/stage.html";
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";
const OUT = fileURLToPath(new URL("../public/media/", import.meta.url));
const WORK = join(tmpdir(), "inbetween-render");
// "ugc" (default) renders the UGC samples; "reel" renders the illustrated placeholder reel.
const only = process.argv[2] ?? "ugc";

const browserPath = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));
if (!browserPath) throw new Error("No Chrome/Edge found — set CHROME_PATH.");

const ff = (args) => execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

async function renderClip(browser, { name, query, width, height, scale, seconds }) {
  const dir = join(WORK, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
  const page = await context.newPage();
  await page.goto(`${STAGE}?${query}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 30000 });

  const frames = Math.round(seconds * FPS);
  for (let i = 0; i < frames; i++) {
    const t = (i * 1000) / FPS;
    await page.evaluate((time) => {
      for (const a of document.getAnimations()) {
        a.pause();
        a.currentTime = time;
      }
    }, t);
    await page.screenshot({ path: join(dir, `${String(i).padStart(4, "0")}.jpg`), type: "jpeg", quality: 93 });
  }
  await context.close();

  const clip = join(WORK, `${name}.mp4`);
  ff(["-framerate", String(FPS), "-i", join(dir, "%04d.jpg"), "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", clip]);
  process.stdout.write(`  rendered ${name} (${frames} frames)\n`);
  return clip;
}

async function main() {
  mkdirSync(WORK, { recursive: true });
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: browserPath });

  try {
    if (only === "reel" || only === "all") {
      console.log("Showreel");
      const SCENE = 3.4;
      const XFADE = 0.5;
      const scenes = ["title", "brand", "explainer", "illustration", "character", "product", "campaign", "experimental", "ugc", "end"];
      const clips = [];
      for (const [n, id] of scenes.entries()) {
        clips.push(await renderClip(browser, { name: `reel-${id}`, query: `comp=reel&id=${id}&n=${n}`, width: 1280, height: 720, scale: 1.5, seconds: SCENE }));
      }

      // Join scenes with editorial transitions.
      const transitions = ["slideleft", "circleopen", "wipeup", "smoothleft", "slideup", "radial", "wiperight", "circleclose", "fadeblack"];
      let graph = "";
      let prev = "[0:v]";
      for (let i = 1; i < clips.length; i++) {
        const label = i === clips.length - 1 ? "[out]" : `[v${i}]`;
        graph += `${prev}[${i}:v]xfade=transition=${transitions[(i - 1) % transitions.length]}:duration=${XFADE}:offset=${(i * (SCENE - XFADE)).toFixed(2)}${label};`;
        prev = `[v${i}]`;
      }
      const reel = join(OUT, "showreel-2026.mp4");
      ff([...clips.flatMap((c) => ["-i", c]), "-filter_complex", graph.slice(0, -1), "-map", "[out]", "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p", "-movflags", "+faststart", reel]);
      ff(["-ss", "3.6", "-t", "8.4", "-i", reel, "-vf", "scale=960:-2", "-an", "-c:v", "libx264", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(OUT, "showreel-2026-loop.mp4")]);
      ff(["-ss", "19.2", "-i", reel, "-frames:v", "1", "-q:v", "3", join(OUT, "showreel-2026.jpg")]);
      console.log("  → public/media/showreel-2026.mp4, -loop.mp4, .jpg");
    }

    if (only === "ugc" || only === "all") {
      console.log("UGC");
      for (const id of ["unboxing", "demo", "reaction"]) {
        const clip = await renderClip(browser, { name: `ugc-${id}`, query: `comp=ugc&id=${id}`, width: 540, height: 960, scale: 4 / 3, seconds: 8 });
        ff(["-i", clip, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p", "-movflags", "+faststart", join(OUT, `ugc-${id}.mp4`)]);
        ff(["-ss", "1.2", "-i", clip, "-frames:v", "1", "-q:v", "3", join(OUT, `ugc-${id}.jpg`)]);
        console.log(`  → public/media/ugc-${id}.mp4, .jpg`);
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
