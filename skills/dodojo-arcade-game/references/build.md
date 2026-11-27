# Building an arcade game page

Patterns that work inside dodojo's frame and in a plain browser. Adapt them;
they are not a template.

## A fixed-step loop

```js
const STEP = 1 / 60;                     // seconds per simulation step
let acc = 0, last = 0, running = false, raf = 0;
function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = Math.min(0.1, (now - last) / 1000 || 0);  // a long gap never jumps the world
  last = now;
  if (running) {
    acc += dt;
    while (acc >= STEP) { step(world, takeInput(), STEP); acc -= STEP; }
  }
  draw(world, acc / STEP);               // interpolate each object from (px, py) to (x, y)
}
requestAnimationFrame(t => { last = t; frame(t); });
document.addEventListener("visibilitychange", () => { if (document.hidden && running) pause(); });
```

- `step(world, input, dt)` is pure: no DOM, no `Math.random` (use the run's
  seeded random), no `Date`. The same seed and inputs give the same run, in
  the page and in Node.
- Keep the world as plain numbers and arrays; reuse objects from a pool
  instead of creating them every step. At the top of each step, every moving
  object copies its position into its own `px`, `py`; `draw` places it at
  `px + (x - px) * t`. Nothing is copied or allocated per step.
- Pause when the playfield leaves the screen as well as when the page is
  hidden: inside a Note the person scrolls the page away rather than hiding
  it.
  ```js
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && running) pause(); }, { threshold: 0.5 }).observe(field);
  ```

## Input into a buffer

```js
const input = { pressed: 0, held: false, x: null };   // pressed: when the verb was last pressed (ms)
const BUFFER_MS = 100;
field.addEventListener("pointerdown", e => {
  e.preventDefault(); field.focus({ preventScroll: true }); field.setPointerCapture(e.pointerId);
  startAudio(); input.pressed = performance.now(); input.held = true; input.x = toWorldX(e);
});
field.addEventListener("pointermove", e => { if (input.held) input.x = toWorldX(e); });
for (const t of ["pointerup", "pointercancel"]) field.addEventListener(t, () => { input.held = false; });
field.addEventListener("keydown", e => {
  if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); if (!e.repeat) input.pressed = performance.now(); input.held = true; }
});
field.addEventListener("keyup", e => { if (e.key === " " || e.key === "ArrowUp") input.held = false; });
function takeInput() {
  const fresh = performance.now() - input.pressed <= BUFFER_MS;
  return { verb: fresh, held: input.held, x: input.x, consume() { input.pressed = 0; } };
}
```

- The playfield has `tabindex="0"` and an `aria-label` naming the keys; key
  handlers call `preventDefault` only while it has focus.
- In `step`, call `consume()` when the verb was used, so one press is one
  jump; an unused press expires after the buffer.

## A sharp canvas

```js
const canvas = document.getElementById("field"), ctx = canvas.getContext("2d");
let W = 0, H = 0, dpr = 1, sprites = null;
new ResizeObserver(() => requestAnimationFrame(() => {
  const box = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
  if (box.width === W && d === dpr) return;
  W = box.width; H = box.height; dpr = d;
  canvas.width = Math.round(W * d); canvas.height = Math.round(H * d);
  ctx.setTransform(d, 0, 0, d, 0, 0);
  sprites = null;                        // redraw the sprites once at the new size
})).observe(canvas);
```

The world uses its own units (say 100 wide); `draw` scales them to `W`.
Draw each sprite once into an offscreen canvas and copy it with `drawImage`.

## Juice without waiting

```js
let hitStop = 0, shake = 0;
function onDeath() { hitStop = 0.06; if (!reducedMotion) shake = 6; play("thud"); }
// in frame(): if (hitStop > 0) { hitStop -= dt; draw(...); return; }   // the world pauses, input still buffers
// in draw(): const s = shake *= 0.85; ctx.translate((rand() - .5) * s, (rand() - .5) * s);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
```

- Particles from a fixed pool (a few dozen), each with a short life.
- A score pop drawn where it happened, rising and fading in about 400ms.
- Vary a repeated sound's pitch by a few percent so it never drones; raise it
  with a combo.

## Sound without files

```js
let audio = null;
function startAudio() { if (!soundOn) return null; audio ||= new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === "suspended") audio.resume(); return audio; }
function blip(freq, dur = 0.08, type = "triangle", vol = 0.12, slide = 1) {
  const a = startAudio(); if (!a) return;
  const t = a.currentTime, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(freq * slide, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
}
// a flap: blip(520, .07, "triangle", .1, 1.5); a score: blip(880 * combo ** .1, .09); the end: blip(300, .5, "sine", .14, .3)
```

## A bot in Node

```js
// node bot.mjs page.html
import { readFileSync } from "node:fs";
const html = readFileSync(process.argv[2], "utf8");
const src = html.slice(html.indexOf("function makeGame()"), html.indexOf("/* end game */"));
const G = new Function(src + "; return makeGame;")()();   // { newWorld(seed), step(world, input, dt) }
for (let seed = 1; seed <= 300; seed++) {
  const w = G.newWorld(seed);
  for (let t = 0; t < 60 * 30 && !w.over; t++) G.step(w, botInput(w), 1 / 60);   // a bot that looks ahead
  if (w.over) console.log("seed", seed, "died at", (w.time).toFixed(1), "s", w.cause);
}
```

- Put the simulation in one function (`makeGame`) ending at a
  `/* end game */` marker, so Node can lift it out of the page.
- A bot that reacts perfectly should survive the first thirty seconds on
  every seed; where it cannot, the generator made an unfair stretch.
- Two idle bots (never acting, always acting) should die within seconds, so
  there is no safe place to hide. A bot that sees the world half a second
  late (feed it the state from 30 steps ago) plays like a person: its median
  run should land near the 45-120 seconds the skill aims for.

## Measuring frames in a browser

Time the work in the frame callback, not only the gap between frames (a 16.7ms
gap cannot show an 8ms budget), watch for long tasks, and measure with the
world at the top of its ramp (start a run with its clock set to the time the
ramp peaks, through a test hook), since the first seconds stress nothing.

```js
const cdp = await page.context().newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await page.evaluate(() => {
  window.__work = []; window.__long = 0;
  new PerformanceObserver(list => { window.__long += list.getEntries().length; }).observe({ type: "longtask" });
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = cb => raf(t => { const a = performance.now(); cb(t); window.__work.push(performance.now() - a); });
});
// start a run at the peak of the ramp, play it with scripted input for ten seconds, then:
const { work, long } = await page.evaluate(() => ({ work: window.__work.sort((a, b) => a - b), long: window.__long }));
console.log("p95 work", work[Math.floor(work.length * 0.95)].toFixed(1), "ms; long tasks", long);
```

The 95th percentile of the work should stay under about 8ms, with no long
tasks.

## Keeping the best

```js
const api = window.dodojo || null;
const save = patch => { try { api?.setState(patch)?.catch?.(() => {}); } catch {} };
const state = api?.getState?.() || {};
function endRun(score) {
  const best = Math.max(score, Number(state.best) || 0);
  const recent = [score, ...String(state.recent || "").split(",").filter(Boolean)].slice(0, 10).join(",");
  Object.assign(state, { best, recent, runs: (Number(state.runs) || 0) + 1 });
  save({ best, recent, runs: state.runs });
}
window.addEventListener("dodojo-state-change", e => { Object.assign(state, e.detail || {}); renderStats(); });
```
