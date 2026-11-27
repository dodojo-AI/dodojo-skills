# Building a party game page

Patterns that work inside dodojo's frame and in a plain browser. Adapt them;
they are not a template.

## A secret that hides itself

```html
<div class="cover" id="cover">
  <p class="who">Pass to <b id="coverName">Mia</b></p>
  <p class="only">Only <span id="coverName2">Mia</span> looks</p>
  <button type="button" id="peek">Hold to see your word</button>
</div>
<div class="secret" id="secret" hidden aria-live="off"></div>
```

```js
const peek = document.getElementById("peek"), secret = document.getElementById("secret");
let hideTimer = 0;
let quietUntil = 0;                             // after a press or a hand-off, ignore stray taps
function show() {
  secret.textContent = secretFor(current);      // drawn from the seed, never kept in the DOM while hidden
  secret.hidden = false; clearTimeout(hideTimer);
  hideTimer = setTimeout(hide, 4000);           // a forgotten hold still covers itself
}
function hide() { secret.hidden = true; secret.textContent = ""; }
peek.addEventListener("pointerdown", e => { if (performance.now() < quietUntil) return; peek.setPointerCapture(e.pointerId); show(); });
peek.addEventListener("pointerup", () => { hide(); quietUntil = performance.now() + 450; });
peek.addEventListener("pointercancel", hide);
peek.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); show(); } });
peek.addEventListener("keyup", hide);
document.addEventListener("visibilitychange", () => document.hidden && hide());
```

- The main button checks `quietUntil` too, and each hand-off sets it about
  600ms ahead: the finger that held the secret is still down when the secret
  covers itself on its timer, and its release would otherwise pass the phone
  on.
- Empty the secret's text when it hides, so it is not in the page for a
  screen reader or a curious glance at the plain text.
- After the last player has looked, the cover says what happens next ("Lay
  the phone down and start talking"), not the secret.

## Pads for every finger

```js
const live = new Map();                       // pointerId -> pad index
table.addEventListener("pointerdown", e => {
  const pad = padAt(e.clientX, e.clientY);    // the pad under the finger, or null
  if (pad === null || live.has(e.pointerId)) return;
  e.preventDefault();
  table.setPointerCapture(e.pointerId);
  live.set(e.pointerId, pad);
  press(pad, performance.now());              // judge on pointerdown, not click
});
for (const type of ["pointerup", "pointercancel"]) table.addEventListener(type, e => live.delete(e.pointerId));
```

- `touch-action: none` on the table only, so the Note still scrolls from the
  page around it; `user-select: none` and `-webkit-touch-callout: none` so a
  long press does not select text.
- Judge a race by the time of `pointerdown`, and treat presses within about
  30ms as a tie.
- Lay the pads out from the number of players around the edge of the play
  area (two facing each other, four on the sides, up to ten round the rim),
  and rotate each pad's label to face its player.

## Fitting the big word

```js
function fit(el, max = 96, min = 36) {
  el.style.fontSize = max + "px";
  const room = el.parentElement.clientWidth;
  const size = Math.max(min, Math.floor(max * Math.min(1, room / el.scrollWidth)));
  el.style.fontSize = size + "px";
}
```

Call it when the word changes, on `resize` and after `document.fonts.ready`.
Keep `white-space: nowrap` on the word.

## A clock people hear

```js
let endsAt = 0, left = 0, ticker = 0;
function start(ms) { endsAt = performance.now() + ms; tick(); }
function tick() {
  const now = performance.now(); left = Math.max(0, endsAt - now);
  drawClock(left);                                  // sand, a fuse or a bar, plus the number
  const s = Math.ceil(left / 1000);
  if (s !== tick.last) { tick.last = s; if (s <= 10 && s > 0) beep(s <= 3 ? 1320 : 880, 0.05); }
  if (left === 0) return timeUp();
  ticker = requestAnimationFrame(tick);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden && left > 0) { cancelAnimationFrame(ticker); save({ left: Math.round(left) }); }
  else if (!document.hidden && left > 0) start(left);
});
```

## Sound without files

Create the `AudioContext` on the first tap, keep a sound switch that is
remembered, and keep every sound under half a second except the one big
moment (a bang, a gong) at most about a second.

```js
let audio = null;
function ctx() { if (!soundOn) return null; audio ||= new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === "suspended") audio.resume(); return audio; }
function beep(freq, dur = 0.08, type = "square", vol = 0.15) {
  const a = ctx(); if (!a) return;
  const t = a.currentTime, o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
}
```

A bang: half a second of white noise through a low-pass filter falling from
about 1400 to 90 Hz, with a short sine thump at 60 Hz under it.

## Prompts that never repeat in an evening

```js
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function deck(list, seed) {                        // a shuffled order, the same for the same seed
  const order = list.map((_, i) => i), r = mulberry32(seed);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  return order;
}
// keep { seed, pos } in state: the next prompt is list[deck(list, seed)[pos++]]; at the end, a new seed
```

## Languages on one page

```js
const PACKS = { en: { ui: { start: "Start" }, words: ["…"] }, zh: { ui: { start: "开始" }, words: ["…"] }, ja: { ui: { start: "スタート" }, words: ["…"] } };
function deviceLang() {
  const l = String(navigator.languages?.[0] || navigator.language || "en").toLowerCase();
  return l.startsWith("zh") ? "zh" : l.startsWith("ja") ? "ja" : "en";
}
let lang = state.lang || deviceLang();
function applyLang() {
  document.documentElement.lang = { en: "en", zh: "zh-CN", ja: "ja" }[lang];
  document.querySelectorAll("[data-t]").forEach(el => { el.textContent = PACKS[lang].ui[el.dataset.t]; });
  fitAll();
}
```

- The static HTML is written in the first language; the switch rewrites the
  labelled text and swaps the prompt list.
- Changing language between rounds starts a fresh deck in that language; in
  the middle of a round it waits for the round to end.

## Keeping the evening

```js
const api = window.dodojo || null;
const save = patch => { try { api?.setState(patch)?.catch?.(() => {}); } catch {} };
const state = api?.getState?.() || {};
// names "Mia|Leo|Ana", tally "3,1,0", deck seed and position, the round in progress
window.addEventListener("dodojo-state-change", e => { load(e.detail || {}); render(); });
```

## Playing it with a pretend table

```js
// several fingers at once, in Chromium through the DevTools protocol
const cdp = await page.context().newCDPSession(page);
const touch = (type, points) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: points.map(([x, y], id) => ({ x, y, id })) });
await touch("touchStart", [[60, 300], [300, 300], [180, 120]]);
await touch("touchEnd", []);
```

- Use a context with `hasTouch: true, isMobile: true` at 360px wide.
- Stand in for `window.dodojo` with the init script in
  [frame.md](frame.md). To reload with the saved state, read it first and
  register the stand-in again with it (init scripts run in the order added,
  so the last one wins):
  ```js
  async function reloadKeeping(page) {
    const saved = await page.evaluate(() => window.dodojo.getState());
    await page.addInitScript(s => { const state = { ...s }; window.dodojo = { getState: () => ({ ...state }), setState: p => (Object.assign(state, p), Promise.resolve(true)), viewer: null, writable: true }; }, saved);
    await page.reload();
  }
  ```
  Reload in the middle of a round and check it opens on the same round with
  the same secret.
- At every hand-off, assert that the secret's element is hidden and empty.
- Run the smallest and largest group, each mode and each language; collect
  `pageerror` and console errors, of which there should be none.
