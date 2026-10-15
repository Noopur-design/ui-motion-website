// Generates the favicon set from one drawing of the studio mark
// (a bouncing ball with its onion-skin trail — the same motif as the wordmark).
//
//   public/favicon.svg            browser tab (scales to any size)
//   public/favicon.ico            16/32/48 px for older browsers and search results
//   public/apple-touch-icon.png   180 px for iOS home screens
//   public/icon-192.png, icon-512.png, icon-maskable-512.png   Android / PWA
//
// Usage: npm run icons   (needs a local Chrome/Edge; set CHROME_PATH if needed)
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const INK = "#141210";
const LIME = "#d9f24f";
const PAPER = "#f3eee4";
const out = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

/** The mark on a 64×64 grid: two fading in-between frames, the ball, the floor. */
const mark = `
  <circle cx="15" cy="41" r="6" fill="${LIME}" fill-opacity=".3"/>
  <circle cx="25.5" cy="32.5" r="7.5" fill="${LIME}" fill-opacity=".6"/>
  <circle cx="41" cy="25" r="12" fill="${LIME}"/>
  <path d="M11 51h42" stroke="${PAPER}" stroke-width="3.5" stroke-linecap="round"/>`;

/** Rounded tile for browser tabs. */
const tile = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${INK}"/>${mark}
</svg>
`;

/** Full-bleed square; the platform rounds or masks it. `scale` keeps the mark inside safe zones. */
const square = (scale) => {
  const offset = (64 - 64 * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${INK}"/>
  <g transform="translate(${offset} ${offset}) scale(${scale})">${mark}</g>
</svg>`;
};

const browserPath = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));
if (!browserPath) throw new Error("No Chrome/Edge found — set CHROME_PATH.");

const browser = await chromium.launch({ executablePath: browserPath });
const page = await browser.newPage();

async function png(svg, size) {
  await page.setViewportSize({ width: size, height: size });
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  await page.setContent(`<html><body style="margin:0;background:transparent"><img src="${src}" width="${size}" height="${size}" style="display:block"></body></html>`);
  await page.waitForFunction(() => document.images[0]?.complete);
  return page.screenshot({ omitBackground: true, type: "png" });
}

/** Packs PNG images into a single .ico (PNG-compressed entries, supported everywhere current). */
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2); // palette
    header.writeUInt8(0, e + 3); // reserved
    header.writeUInt16LE(1, e + 4); // colour planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
}

try {
  writeFileSync(out("favicon.svg"), tile);
  const icoSizes = [16, 32, 48];
  const icoImages = [];
  for (const size of icoSizes) icoImages.push({ size, data: await png(tile, size) });
  writeFileSync(out("favicon.ico"), ico(icoImages));
  writeFileSync(out("apple-touch-icon.png"), await png(square(0.82), 180));
  writeFileSync(out("icon-192.png"), await png(tile, 192));
  writeFileSync(out("icon-512.png"), await png(tile, 512));
  // Maskable icons may be cropped to a circle: keep the mark inside the central 80%.
  writeFileSync(out("icon-maskable-512.png"), await png(square(0.66), 512));
  console.log("Wrote favicon.svg, favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, icon-maskable-512.png");
} finally {
  await browser.close();
}
