#!/usr/bin/env node
// Screenshot a page the way a person sees it on a phone, light and dark.
//
//   node <dodojo-travel>/scripts/shoot.mjs <page.html | url> <out-prefix> [--width 390] [--top] [--screens]
//
// Writes <out-prefix>-light.png and <out-prefix>-dark.png (full page, or only
// the first screen with --top); --screens also writes the page one phone
// screen at a time (<out-prefix>-light-1.png …), easier to read than one tall
// image. Needs Playwright.

import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const args = process.argv.slice(2);
const [target, prefix] = args.filter((arg, index) => !arg.startsWith("--") && args[index - 1] !== "--width");
if (!target || !prefix) {
  console.error("Usage: node shoot.mjs <page.html | url> <out-prefix> [--width 390] [--top] [--screens]");
  process.exit(2);
}
const widthIndex = args.indexOf("--width");
const width = widthIndex >= 0 ? Number(args[widthIndex + 1]) : 390;
const url = /^https?:/.test(target) ? target : pathToFileURL(resolve(target)).href;

// Playwright from the folder you run this in, then beside this script, then
// a global install, so a skill installed under ~/.claude/skills still finds
// the copy in your project.
async function loadChromium() {
  const { createRequire } = await import("node:module");
  const { execSync } = await import("node:child_process");
  const bases = [join(process.cwd(), "noop.js"), fileURLToPath(import.meta.url)];
  try { bases.push(join(execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(), "noop.js")); } catch {}
  for (const base of bases) {
    for (const name of ["playwright", "playwright-core"]) {
      try {
        const module = await import(pathToFileURL(createRequire(base).resolve(name)).href);
        const chromium = module.chromium ?? module.default?.chromium;
        if (chromium) return chromium;
      } catch {}
    }
  }
  return null;
}
const chromium = await loadChromium();
if (!chromium) {
  console.error("Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}
const browser = await chromium.launch();
try {
  for (const scheme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 2, colorScheme: scheme });
    const tab = await context.newPage();
    const problems = [];
    tab.on("pageerror", error => problems.push(`error: ${error.message}`));
    // attachment: images fail once before the page's own line points them at
    // the files beside it; that is expected.
    tab.on("requestfailed", request => { if (!request.url().startsWith("attachment:")) problems.push(`failed: ${request.url().slice(0, 120)}`); });
    await tab.goto(url, { waitUntil: "networkidle" });
    await tab.evaluate(() => document.fonts.ready);
    await tab.waitForTimeout(400);
    const sideways = await tab.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (sideways > 1) problems.push(`page scrolls sideways by ${sideways}px`);
    await tab.screenshot({ path: `${prefix}-${scheme}.png`, fullPage: !args.includes("--top") });
    console.log(`${prefix}-${scheme}.png${problems.length ? `\n  ${problems.join("\n  ")}` : ""}`);
    if (args.includes("--screens")) {
      // A tall page shrinks to nothing as one image: also write it a screen at a time.
      const height = await tab.evaluate(() => document.documentElement.scrollHeight);
      const total = Math.ceil(height / 844);
      const screens = Math.min(40, total);
      if (total > screens) console.log(`  the page is ${total} screens long; only the first ${screens} were written`);
      for (let index = 0; index < screens; index += 1) {
        const y = index * 844;
        await tab.screenshot({ path: `${prefix}-${scheme}-${index + 1}.png`, fullPage: true, clip: { x: 0, y, width, height: Math.min(844, height - y) } });
      }
      console.log(`  and ${screens} screens: ${prefix}-${scheme}-1.png …`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}
