# Building a story game page

Patterns that work inside dodojo's frame and in a plain browser. Adapt them;
they are not a template.

## Scenes written in the HTML

```html
<section class="scene" id="scene-open" data-gives="card" data-chapter="1" hidden>
  <h2 tabindex="-1">Floor 6½</h2>
  <p>The lift stops between floors. …</p>
  <div class="choices">
    <button type="button" data-go="call" data-sets="heard_voice">Press the call button</button>
    <button type="button" data-go="climb" data-needs="has_torch">Climb through the hatch</button>
  </div>
</section>
<section class="scene" id="scene-door7" hidden>
  <h2 tabindex="-1">Door 7</h2>
  <p>A keypad with four worn keys. …</p>
  <form class="lock" data-hash="1kq3zd|0x9r2w" data-go="office"
        data-hints="Look at the inspection card from the lift.|The missing digits are a year on the card's stamp."
        data-hint-answer="MTk1OA==">
    <label>Code <input inputmode="numeric" autocomplete="off" maxlength="4"></label>
    <button type="submit">Try it</button>
    <p class="hint" aria-live="polite"></p>
  </form>
</section>
```

- Every scene is in the HTML, hidden; script shows one. An app that cannot
  run scripts shows them all as text, in order, which still reads as the
  story.
- **What changes the state**, in attributes the checker can read:
  - `data-sets="heard_voice,!trusts_lin"` on a choice or a lock sets the
    flags it names (and clears those with `!`) when it is taken;
  - `data-gives="card,ticket"` on a scene adds those clue ids to the set of
    clues found when the scene is reached. A set, not a counter, so coming
    back to a scene never counts a clue twice;
  - `data-needs="has_torch,!called,clues:6"` on a choice shows it only when
    every term holds: a flag set, a flag not set (`!`), at least that many
    clues found (`clues:6`). Never put `<` or `>` in an attribute.
  - `data-ending="true"` on a scene marks an ending; `data-chapter="2"` marks
    where a chapter starts.
- A lock form never submits anywhere: handle `submit` with `preventDefault`.

## The state, packed for saving

```js
const state = { at: "open", flags: new Set(), clues: new Set(), trail: [], endings: new Set(), hints: {} };
const pack = () => ({
  at: state.at, flags: [...state.flags].join(","), clues: [...state.clues].join(","),
  trail: state.trail.slice(-30).join(";"), endings: [...state.endings].join(","),
  hints: Object.entries(state.hints).map(([k, n]) => k + ":" + n).join(","),
});
const set = s => new Set(String(s || "").split(",").filter(Boolean));
function unpack(saved) {
  state.at = saved.at || "open";
  state.flags = set(saved.flags); state.clues = set(saved.clues); state.endings = set(saved.endings);
  state.trail = String(saved.trail || "").split(";").filter(Boolean);
  state.hints = Object.fromEntries(String(saved.hints || "").split(",").filter(Boolean).map(p => { const [k, n] = p.split(":"); return [k, Number(n)]; }));
}
const snapshot = () => [state.at, [...state.flags].join(","), [...state.clues].join(",")].join("|");
```

Saved values are strings, numbers, booleans or null; a `Set` or an array
must be packed into a string and unpacked on load, never assigned back as
they come.

## Taking a choice, and drawing

`go` changes the state once; `render` only draws from it. The listener for
changes from another device unpacks and renders; it never saves.

```js
const api = window.dodojo || null;
const save = patch => { try { api?.setState(patch)?.catch?.(() => {}); } catch {} };
const needs = expr => String(expr || "").split(",").filter(Boolean).every(term =>
  term.startsWith("!") ? !state.flags.has(term.slice(1))
  : term.startsWith("clues:") ? state.clues.size >= Number(term.slice(6))
  : state.flags.has(term));
function applySets(el) {
  for (const term of String(el?.dataset.sets || "").split(",").filter(Boolean))
    term.startsWith("!") ? state.flags.delete(term.slice(1)) : state.flags.add(term);
}
function go(id, from) {
  const next = document.getElementById("scene-" + id); if (!next) return console.error("no scene", id);
  state.trail.push(snapshot());                       // for "Go back to the last choice"
  applySets(from);
  for (const c of String(next.dataset.gives || "").split(",").filter(Boolean)) state.clues.add(c);
  if (next.dataset.ending) state.endings.add(next.dataset.ending);
  state.at = id;
  if (next.dataset.chapter) save({ ["ch" + next.dataset.chapter]: snapshot() });
  save(pack());
  render(true);
}
function render(moved) {
  const scene = document.getElementById("scene-" + state.at);
  document.querySelectorAll(".scene").forEach(s => { s.hidden = s !== scene; });
  scene.querySelectorAll("[data-needs]").forEach(b => { b.hidden = !needs(b.dataset.needs); });
  renderJournal();
  if (moved) scene.querySelector("h2").focus({ preventScroll: true });
}
unpack(api?.getState?.() || {});
render(false);
window.addEventListener("dodojo-state-change", e => { unpack(e.detail || {}); render(false); });
document.addEventListener("click", e => {
  const b = e.target.closest("button[data-go]"); if (!b) return;
  startAudio(); go(b.dataset.go, b);
});
```

- Going back restores the last snapshot from `trail` (scene, flags and
  clues), keeping the endings reached. A chapter starts from the snapshot
  saved under `ch<n>` the first time it was reached.
- In a plain browser `scrollIntoView` brings the new scene's top into view.
  Inside dodojo the Note, not the page, scrolls, and whether the call
  reaches it depends on the app, so do not rely on it: keep each scene and
  its choices within about one phone screen (below), so the next scene
  appears where the eye already is.

## One phone screen, measured

Aim for each scene with its choices at most about 700px tall at 390px wide
(a phone screen less the app's own bars). The opening scene is also the
cover and may run longer with its picture. Measure every scene in
Playwright:

```js
const heights = await page.evaluate(() => [...document.querySelectorAll(".scene")].map(s => {
  s.hidden = false; const h = Math.round(s.getBoundingClientRect().height); s.hidden = true; return [s.id, h];
}));
console.log(heights.filter(([, h]) => h > 700));
```

## An answer box that forgives

```js
const WORDS = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const norm = s => String(s).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/g, w => WORDS[w])
  .replace(/^(no|number|the)\s+/, "").replace(/[^a-z0-9一-鿿぀-ヿ]/g, "");
// Hides an answer from someone reading the page's text; it is not security.
// (crypto.subtle needs a secure context, which a sandboxed frame may not be.)
function fnv(s) { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.codePointAt(0), 16777619); return (h >>> 0).toString(36); }
// A time read off a chart: accept any reading within a tolerance.
function minutes(s) {
  const m = /(\d{1,2})[:.h ]?(\d{2})?\s*(am|pm)?/i.exec(String(s)); if (!m) return null;
  let h = Number(m[1]) % 12 + (/pm/i.test(m[3] || "") ? 12 : 0); if (!m[3] && Number(m[1]) >= 12) h = Number(m[1]);
  return h * 60 + Number(m[2] || 0);
}
document.addEventListener("submit", e => {
  const f = e.target.closest(".lock"); if (!f) return; e.preventDefault();
  const raw = f.querySelector("input").value, tried = norm(raw);
  const ok = f.dataset.time
    ? Math.abs((minutes(raw) ?? -999) - Number(f.dataset.time)) <= Number(f.dataset.tolerance || 10)
    : f.dataset.hash.split("|").includes(fnv(tried));
  if (ok) { click(); go(f.dataset.go, f); } else { thud(); f.querySelector(".hint").textContent = "Not that. Look again at what you have."; }
});
```

- `data-hash` lists the FNV hash of each accepted answer after `norm`;
  compute them in Node with the same two functions.
- Hashing hides an answer only from a glance at the page's text: the scene
  that follows a lock and the endings are plain text anyway. Do not spend
  effort on more than that.

## A hint ladder

```js
function hint(lock) {
  const key = lock.closest(".scene").id.slice(6);
  const rungs = [...lock.dataset.hints.split("|"), "The answer: " + decodeURIComponent(escape(atob(lock.dataset.hintAnswer)))];
  state.hints[key] = Math.min(rungs.length, (state.hints[key] || 0) + 1);
  save({ hints: pack().hints });
  lock.querySelector(".hint").textContent = rungs[state.hints[key] - 1];
}
```

The last rung, the answer, is kept as base64 (`btoa(unescape(encodeURIComponent(answer)))`):
it has to be shown, so it cannot be a hash. The answer must be one the lock
accepts.

## Restart without confirm()

```js
let armed = 0;
restart.addEventListener("click", () => {
  if (Date.now() - armed > 3000) { armed = Date.now(); restart.textContent = "Tap again to restart"; return; }
  armed = 0; restart.textContent = "Restart"; unpack({ endings: pack().endings }); save(pack()); render(true);
});
```

## Checking every path in Node

```js
// node check-story.mjs page.html
import { readFileSync } from "node:fs";
const html = readFileSync(process.argv[2], "utf8");
const attr = (tag, name) => (new RegExp(`${name}="([^"]*)"`).exec(tag) || [])[1] || "";
const scenes = new Map([...html.matchAll(/<section([^>]*)id="scene-([\w-]+)"([^>]*)>([\s\S]*?)<\/section>/g)].map(m => {
  const tag = m[1] + m[3], body = m[4];
  const exits = [...body.matchAll(/<(?:button|form)([^>]*data-go="[\w-]+"[^>]*)>/g)].map(x => ({
    go: attr(x[1], "data-go"), sets: attr(x[1], "data-sets"), needs: attr(x[1], "data-needs") }));
  const words = body.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return [m[2], { gives: attr(tag, "data-gives"), ending: attr(tag, "data-ending"), exits, words }];
}));
const list = s => s.split(",").filter(Boolean);
const holds = (needs, flags, clues) => list(needs).every(t => t[0] === "!" ? !flags.has(t.slice(1)) : t.startsWith("clues:") ? clues.size >= +t.slice(6) : flags.has(t));
// walk (scene, flags, clues) states from the start
const key = (at, f, c) => `${at}|${[...f].sort()}|${[...c].sort()}`;
const start = { at: "open", flags: new Set(), clues: new Set(list(scenes.get("open").gives)) };
const seen = new Map(), queue = [start], endings = new Set(), stuck = [];
while (queue.length) {
  const s = queue.shift(), k = key(s.at, s.flags, s.clues); if (seen.has(k)) continue; seen.set(k, s);
  const scene = scenes.get(s.at); if (!scene) { stuck.push("missing " + s.at); continue; }
  if (scene.ending) { endings.add(scene.ending); continue; }
  const open = scene.exits.filter(x => holds(x.needs, s.flags, s.clues));
  if (!open.length) stuck.push("no choice in " + k);
  for (const x of open) {
    const flags = new Set(s.flags); for (const t of list(x.sets)) t[0] === "!" ? flags.delete(t.slice(1)) : flags.add(t);
    const clues = new Set(s.clues); for (const c of list(scenes.get(x.go)?.gives || "")) clues.add(c);
    queue.push({ at: x.go, flags, clues });
  }
}
const reached = new Set([...seen.values()].map(s => s.at));
console.log(`${scenes.size} scenes, ${seen.size} states, endings reached: ${[...endings].join(", ")}`);
for (const id of scenes.keys()) if (!reached.has(id)) console.log("UNREACHABLE", id);
for (const s of stuck.slice(0, 20)) console.log("STUCK", s);
for (const [id, s] of scenes) if (s.words > 160) console.log("LONG", id, s.words);
```

- Every ending you planned is in the list, no scene is unreachable, nothing
  is stuck. A state from which some planned ending can no longer be reached
  is fine only when the story means it (a choice that closes a door);
  check those by eye.
- Word counts leave out SVG, so a drawing's labels do not count as text.

## Keeping the story

- Save `pack()` after every choice, a solved lock and a hint; the endings
  reached survive a restart.
- In dodojo the state is the owner's: a gift sent as a shared link starts
  fresh for each visitor, which suits a gift.

## Sound without files

A soft page turn on each choice (a short burst of filtered noise), a click
for an opened lock, a low note for a wrong answer, all from a Web Audio
context made on the first tap, quiet, with a switch that is remembered. No
music unless asked.

## Playing it in a browser

- Load the page in Playwright with the stand-in for `window.dodojo` from
  [frame.md](frame.md).
- Click through the best path and one other to their endings; answer each
  lock once wrong and once right with a slip in case, spacing and a number
  written as a word; take every hint rung; go back after a choice; reload
  mid-story and check the scene, the flags and the journal come back; start
  from a chapter.
- Collect `pageerror` and console errors; there should be none.
