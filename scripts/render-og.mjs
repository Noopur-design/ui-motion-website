// Renders scripts/og-card.html to public/og-image.png with a local headless Chromium.
// Usage: start the dev server (`npm run dev`), then `npm run og`.
// Set CHROME_PATH if your browser lives somewhere unusual.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error("No Chrome/Edge found. Set CHROME_PATH to a Chromium-based browser.");
  process.exit(1);
}

const out = fileURLToPath(new URL("../public/og-image.png", import.meta.url));
const url = process.env.OG_URL ?? "http://localhost:5173/scripts/og-card.html";

execFileSync(browser, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--force-device-scale-factor=1",
  "--window-size=1200,630",
  "--virtual-time-budget=5000",
  `--screenshot=${out}`,
  url,
]);
console.log(`Wrote ${out}`);
