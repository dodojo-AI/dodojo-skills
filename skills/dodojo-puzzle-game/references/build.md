# Building a puzzle page

Patterns that work inside dodojo's frame and in a plain browser. Adapt them;
they are not a template.

## The solver lives in the page

Write the rules once, as one self-contained function, so the page (checking
a solve, giving a hint) and Node (checking every level) run the same code:

```js
function makePuzzle() {
  // rules, solver and grader for this kind; no DOM, no globals
  function solve(grid, limit = 2) { /* returns up to `limit` solutions */ }
  function nextStep(grid) { /* the easiest forced deduction: { cell, value, why, from: [cells] } or null */ }
  function grade(grid) { /* apply nextStep until solved; return { solved, hardest, steps } */ }
  return { solve, nextStep, grade };
}
const P = makePuzzle();
/* end puzzle */
```

- `nextStep` tries techniques from the simplest up and returns the first
  that applies, with the cells it relied on: that is the hint, and the
  `hardest` technique `grade` needed is the level's difficulty.
- A puzzle `grade` cannot finish without guessing is not a fair deduction
  puzzle; drop it or add a clue.

## Grading ladders

Write the techniques from the simplest up, and let `nextStep` try them in
that order. Two ladders as a start:

- **Number squares** (one of each per row, column and box): a cell with one
  candidate left; a value with one place left in a row, column or box; two
  cells in a unit that share the same two candidates (a pair); a chain of
  links between candidates.
- **Picture logic** (runs of filled cells given per row and column): a line
  whose clues and gaps add up to its length (counting); cells covered by a
  run wherever it slides (overlap); runs pushed against crosses and edges;
  whole-line logic, trying every placement of the line's runs and keeping
  what all of them agree on. Solid silhouettes rarely need more than overlap,
  so the hard levels come from outline drawings and scattered shapes.

## Checking every level in Node

```js
// node check-levels.mjs page.html
import { readFileSync } from "node:fs";
const html = readFileSync(process.argv[2], "utf8");
const src = html.slice(html.indexOf("function makePuzzle()"), html.indexOf("/* end puzzle */"));
const P = new Function(src + "; return makePuzzle;")()();
const levels = JSON.parse(html.match(/<script type="application\/json" id="levels">([\s\S]*?)<\/script>/)[1]);
for (const [i, level] of levels.entries()) {
  const t = performance.now();
  const n = P.solve(level.grid, 2).length;
  const g = P.grade(level.grid);
  console.log(i + 1, n === 1 ? "unique" : n === 0 ? "NO SOLUTION" : "SEVERAL", g.solved ? g.hardest : "needs a guess", Math.round(performance.now() - t) + "ms");
}
```

For a generator, run it over a few hundred seeds and report the spread of
grades and the slowest seed; keep only seeds whose grade matches the level
you want.

For moving-piece puzzles, the check is a breadth-first search over positions
(encode a position as a short string, keep a `Map` of seen positions): it
proves the level can be solved, gives the par, and counts how many positions
reachable in the first few moves are dead ends.

## Levels written into the page

```html
<script type="application/json" id="levels">
[{"id":"1","size":4,"grid":"1..4..3..2..3..1","par":null,"teaches":"one of each per row"}]
</script>
```

Keep levels as data in the page: they are content, search reads them, and
the Node check reads the same block.

## A grid that answers taps, drags and keys

```js
let cursor = 0, drag = null;
grid.addEventListener("pointerdown", e => {
  const c = cellAt(e); if (c < 0) return;
  cursor = c; startAudio();
  if (mode === "fill") { drag = { to: nextState(cells[c]) }; setCell(c, drag.to); grid.setPointerCapture(e.pointerId); }
  render();
});
grid.addEventListener("pointermove", e => { if (!drag) return; const c = cellAt(e); if (c >= 0 && cells[c] !== drag.to) setCell(c, drag.to); });
grid.addEventListener("pointerup", () => { if (drag) commit(); drag = null; });   // one undo step for the whole stroke
grid.addEventListener("keydown", e => {
  const move = { ArrowUp: -W, ArrowDown: W, ArrowLeft: -1, ArrowRight: 1 }[e.key];
  if (move) { e.preventDefault(); cursor = clampMove(cursor, move); render(); }
  else if (/^[1-9]$/.test(e.key)) { e.preventDefault(); enter(cursor, Number(e.key)); }
  else if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); enter(cursor, 0); }
  else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); }
});
```

- A drag that crosses cells sets them all to the state of the first one, and
  the whole stroke is one undo step.
- Draw the grid in SVG or in CSS grid cells when it has at most a few
  hundred cells (crisp at any zoom, focus and screen readers work); use a
  canvas for big boards or animated tiles.

## Undo that remembers

```js
const past = [], future = [];
function commit(change) {             // change: [[cell, before, after], …]
  past.push(change); future.length = 0; apply(change, "after"); save(snapshot());
}
function undo() { const c = past.pop(); if (c) { future.push(c); apply(c, "before"); save(snapshot()); } }
function redo() { const c = future.pop(); if (c) { past.push(c); apply(c, "after"); save(snapshot()); } }
```

`snapshot()` writes the grid as one compact string, plus the last few dozen
changes if they fit in 4000 characters, so undo still works after a reopen.

## A daily puzzle

```js
function today() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function seedOf(text) { let h = 2166136261; for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return h >>> 0; }
const day = today(), puzzle = generate(seedOf("my-puzzle:" + day));
// state keys by day: "d:2026-11-26" -> the grid string; the archive lists the days in state
```

Generate ahead of time when generation is slow: ship a year of seeds that
passed the grader in the page and pick by date.

## Keeping the progress

```js
const api = window.dodojo || null;
const save = patch => { try { api?.setState(patch)?.catch?.(() => {}); } catch {} };
const state = api?.getState?.() || {};
window.addEventListener("dodojo-state-change", e => { load(e.detail || {}); render(); });
// "L3": the grid string of level 3; "done": "1:42:0,2:57:1" (level:seconds:hints)
```

## Solving it in a browser

- Load the page in Playwright with a stand-in for `window.dodojo` that keeps
  the state in memory and records every `setState`.
- Enter a known solution through the UI (taps on a touch context, keys on a
  desktop one) and assert the solved banner, the saved result and that the
  grid did not move.
- Reload in the middle of a level and after a solve; both open as they were.
- Collect `pageerror` and console errors; there should be none.
