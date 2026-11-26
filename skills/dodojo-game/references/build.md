# Building a game page

Patterns that work inside dodojo's frame and in a plain browser. Adapt them;
they are not a template.

## A sharp canvas that follows its box

```js
const canvas = document.getElementById("board"), ctx = canvas.getContext("2d");
const box = canvas.parentElement;          // the element that is square by CSS (aspect-ratio: 1)
let size = 0, dpr = 1, sprites = null;
function resize() {
  const w = box.clientWidth, d = Math.min(devicePixelRatio || 1, 3);
  if (!w || (w === size && d === dpr)) return;
  size = w; dpr = d;
  canvas.width = canvas.height = Math.round(w * d);
  sprites = null;                          // pieces are drawn once per size, then copied
  draw();
}
new ResizeObserver(() => requestAnimationFrame(resize)).observe(box);
window.addEventListener("dodojo-theme-change", () => { sprites = null; draw(); });
```

- Draw the board's material and each kind of piece once into offscreen
  canvases at the current size, then copy them with `drawImage` every frame.
- Read the theme from `document.documentElement.dataset.dodojoTheme`
  (`"dark"` or `"light"`); outside dodojo fall back to
  `matchMedia("(prefers-color-scheme: dark)")`.
- A seeded random (mulberry32) keeps the wood grain and the small offsets of
  each piece the same every time the board is drawn.

## Taps, clicks and keys

```js
let lastPointer = "mouse", ghost = null;
canvas.addEventListener("pointerdown", e => { lastPointer = e.pointerType || "mouse"; startAudio(); });
canvas.addEventListener("click", e => {
  const p = pointAt(e);                    // nearest point within ~0.6 of a cell, or null
  if (p === null || !canMove(p)) return;
  if (lastPointer === "touch" && ghost !== p) { ghost = p; draw(); return; }   // first tap: ghost
  ghost = null; move(p);                   // second tap on the ghost, or a mouse click
});
canvas.addEventListener("keydown", e => {
  const step = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
  if (step) { e.preventDefault(); moveCursor(step); }
  else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); startAudio(); move(cursor); }
});
```

- Mouse: show a faint piece where the pointer hovers (`pointermove` with
  `e.pointerType === "mouse"`).
- The canvas has `tabindex="0"`, an `aria-label` that says how to play with
  keys, and `touch-action: manipulation`.

## Sound without files

```js
let audio = null, noise = null;
function startAudio() {               // call from a tap or a key press
  if (!soundOn) return null;
  audio ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state === "suspended") audio.resume();
  if (!noise) {
    noise = audio.createBuffer(1, audio.sampleRate * 0.08, audio.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3;
  }
  return audio;
}
function clack(freq = 2200) {         // a stone on wood: filtered noise and a short low thump
  const a = startAudio(); if (!a) return;
  const t = a.currentTime + 0.005, g = a.createGain();
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.4, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07); g.connect(a.destination);
  const src = a.createBufferSource(), bp = a.createBiquadFilter();
  src.buffer = noise; bp.type = "bandpass"; bp.frequency.value = freq; bp.Q.value = 1.6;
  src.connect(bp).connect(g); src.start(t); src.stop(t + 0.09);
}
```

A win: three or four short triangle-wave notes rising, 100ms apart. A loss:
two or three falling sine notes, quieter. Keep every sound under half a
second.

## A computer opponent that never freezes the page

Write the opponent as one self-contained function, so the same source runs in
a worker or, if a worker cannot start, on the page:

```js
function makeAI() { /* tables, search … */ return { choose(cells, me, level) { /* … */ } }; }
const local = makeAI();
let worker = null, job = null;
try {
  const src = "const AI=(" + makeAI + ")();onmessage=e=>postMessage({id:e.data.id,move:AI.choose(e.data.cells,e.data.me,e.data.level)})";
  worker = new Worker(URL.createObjectURL(new Blob([src], { type: "text/javascript" })));
  worker.onmessage = e => job && e.data.id === job.id && job.done(e.data.move);
  worker.onerror = () => { worker = null; if (job) runHere(job); };
} catch { worker = null; }
```

- Give every request an id and drop answers to an old one (after undo, a new
  game or a change of opponent).
- Wait at least about 400ms before showing the computer's move, so it reads
  as a reply; say "thinking" in the status strip meanwhile.
- Levels for a board game such as gomoku: the easiest scores each point with
  a simple pattern table, underweights defence and picks at random among the
  good points; the middle scores attack and defence fully and always takes or
  blocks a win in one; the strongest searches a few moves ahead (alpha-beta
  over the best ten or so points at each step) with forced replies to a four.

Check the levels in Node before saving: pull the function out of the page and
play them against each other.

```js
// node check-ai.mjs page.html
import { readFileSync } from "node:fs";
const html = readFileSync(process.argv[2], "utf8");
const src = html.slice(html.indexOf("function makeAI()"), html.indexOf("/* end AI */"));
const AI = new Function(src + "; return makeAI;")()();
// play strongest vs middle, middle vs easiest, both colours, ten games each;
// count wins, check every move is legal, time the slowest move
```

The stronger level should win clearly in both colours, and the slowest move
should stay well under a second.

## Keeping the game

```js
const api = window.dodojo || null;
const save = patch => { try { api?.setState(patch)?.catch?.(() => {}); } catch {} };
const state = api?.getState?.() || {};     // read at start
load(state);
window.addEventListener("dodojo-state-change", e => { cancelThinking(); load(e.detail || {}); render(); });
```

- Save after every move: `save({ moves: moves.join(",") })`. When a move ends
  the game, put the updated record in the same call.
- `data-dodojo-key` fields are filled after the page's script runs: read their
  saved values from `getState()` at start, and render again on the
  `dodojo-ready` event.

## Playing it in a browser

Load the page in Playwright with a stand-in for `window.dodojo` that keeps
the state in memory and records every `setState`, then play:

```js
await page.addInitScript(state => {
  window.__saved = [];
  window.dodojo = { getState: () => ({ ...state }), setState: p => { Object.assign(state, p); window.__saved.push(p); return Promise.resolve(); } };
}, { moves: "112,113,98" });            // start from any position you want to test
```

- Use a context with `hasTouch: true, isMobile: true` and
  `page.touchscreen.tap` to check the ghost-then-place step; a desktop context
  with `page.mouse.click` and `page.keyboard` for the rest.
- Assert on what was saved (`window.__saved`), on the status text, and that
  the board's position does not change when the game ends.
- Collect `pageerror` and console errors; there should be none.
