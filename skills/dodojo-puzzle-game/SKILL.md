---
name: dodojo-puzzle-game
description: Make a puzzle game for one person as one webpage - a logic grid, a number or picture-logic puzzle, a sliding, merging or box-pushing puzzle, a path or connection puzzle, a word puzzle, a daily puzzle or a pack of levels - with every puzzle checked by a solver to have a solution (exactly one where logic should decide it), difficulty that comes from the reasoning it needs, levels that teach one idea at a time, hints that explain the next step, marks and undo that never punish thinking, and progress kept move by move - saved into dodojo as a webpage Note, or as a standalone .html file. Use for 益智游戏, 解谜, 数独, 数织, 华容道, 推箱子, 每日一题, 关卡, brain teasers and any puzzle to solve alone.
license: MIT
---

# dodojo-puzzle-game

A puzzle is a conversation between its maker and one person thinking. It is
fair: everything needed to solve it is on the screen, and the solution can be
reached by reasoning, not by guessing. It is calm, so the person can think,
and it remembers every mark, so they can put it down and come back. Its look
comes from where puzzles of this kind live (a newspaper's puzzle page, a
wooden tray of tiles, a printed booklet). Nothing here is a layout to copy.

It is one self-contained `.html` file. In [dodojo](https://www.dodojo.ai) it is
shown inside a Note, full height; the top of the page becomes the Note's cover
in the person's library, and a puzzle left halfway opens with the same marks
on any of their devices. Outside dodojo the same file opens in any browser.

## Workflow

1. **Pin down the puzzle** - the kind, the exact rules, the size that fits a phone, one puzzle a day or a pack of levels, and how long one takes.
2. **Make puzzles that are fair** - hand-made or generated from a seed, and every one checked by a solver: solvable, unique where logic should decide, graded by the reasoning it needs.
3. **Shape the levels** - the first teaches the rule without words, each new idea gets its own level, difficulty climbs with breathers between.
4. **Lay it out with the puzzle first** - a slim strip, the grid as large as the column allows, the tools under it, then rules, levels and records.
5. **Make thinking comfortable** - marks and notes, unlimited undo, mistakes shown only when asked, hints that explain the next step.
6. **Keep the progress** - every mark and every finished level kept with the page, so it reopens exactly where the person left it.
7. **Solve it, then save** - every level run through the solver, a few solved by hand with touch, mouse and keyboard, screenshots at phone width, then a dodojo Note.

## 1. Pin down the puzzle

- **The kind.** Deduction puzzles on a grid (a number-placement square, a
  picture-logic grid with row and column clues, a region or star placement,
  a sum puzzle), moving-piece puzzles (sliding blocks, merging tiles, pushing
  boxes onto targets, a sliding-tile picture), path and connection puzzles
  (link the pairs, one line through every cell, a pipe network), word puzzles
  (a word search, anagrams, a crossword), and small classics (lights out,
  tangram, the river crossing).
- **The rules, written down before any code**: the board, what a move is,
  what counts as solved, and any variant named on the page. A puzzle with a
  traditional name keeps its common rules.
- **The size that fits.** On a 360px phone a Note gives the page 328px, and
  inside the page's own 16px gutters about 296px remain. Cells of about
  26px are comfortable and about 20px is the least a finger can hit with a
  cursor to help: a 9 x 9 number grid fits at 32px; a 10 x 10 picture-logic
  grid, with its clues outside, comes to about 21px, which is the limit; a
  15 x 15 one needs a zoom. Measure the clues in the real font (their width
  decides the grid's) and lay out again once `document.fonts.ready`
  resolves, and test at 328px with `scripts/shoot.mjs --note`.
- **One a day or a pack.** A daily puzzle is drawn from a seed made of the
  local date, so it is the same on every device that day, with the archive
  of earlier days a tap away. A pack is a fixed list of levels with a curve
  (section 3). Many pages do both.
- **How long one takes**: two to ten minutes on a phone is the usual target;
  say the size of a level in its card ("8 x 8 · about 5 minutes").
- Make original puzzles, or kinds nobody owns (number squares, picture logic,
  sliding blocks, lights out, word search). Never copy a commercial puzzle
  game's name, levels or art, or a published puzzle book's puzzles. Some
  common names are trademarks in some languages (in Japanese お絵かきロジック
  and イラストロジック belong to publishers): give the puzzle its own title
  and describe the kind plainly.
- With the dodojo connector, search the person's memories first
  (`search_memories`) for an earlier version, puzzles they liked, or material
  to build puzzles from (a word search of their trip's places, a picture
  puzzle drawn from their own photo).

## 2. Make puzzles that are fair

- **A solver before a single level.** Write the solver as one self-contained
  function in the page, and run it in Node over every puzzle before saving
  ([references/build.md](references/build.md)). It answers: is there a
  solution, how many (stop at two), and which techniques it needed.
- **Unique where logic should decide.** A deduction puzzle has exactly one
  solution, reachable without guessing; a generator removes clues one at a
  time and keeps a removal only if the solver still finds one solution.
  Moving-piece puzzles need a solution and a known shortest one (a
  breadth-first search over positions), shown as the par.
- **Difficulty comes from reasoning, not from emptiness.** Grade each puzzle
  by the hardest technique the solver had to use and how often. Write the
  ladder for the kind first ([references/build.md](references/build.md) has
  two): for number squares, a single forced cell, a hidden single, a pair, a
  chain; for picture logic, counting, overlap, pushing runs against marks,
  whole-line logic; for moving pieces, the length of the shortest solution
  and how many dead ends lie near the start. Fewer clues is not harder on
  its own.
- **Generated puzzles are seeded.** The same seed makes the same puzzle on
  every device; keep the seed with the progress. Generation must finish in
  under about 200ms on a phone, or happen ahead of time: a pack of hand-made
  or pre-generated levels written into the page is often better than live
  generation.
- **Hand-made levels are checked like generated ones**: the solver proves
  each one, and its par comes from the search, not from a guess.

## 3. Shape the levels

- **The first level teaches the rule without words**: so small and so open
  that trying things shows how it works (a 4 x 4 grid, a two-move slide).
  One sentence above the tools names the goal.
- **One new idea per level.** When a technique or a piece is new, the level
  that introduces it is built so that the idea is the only way forward; the
  next few use it in a new way.
- **A curve with breathers**: difficulty climbs across a pack, with an easier
  level after each hard one, and the last few are the real test.
- **Show the map**: the pack as a grid of numbered levels, each marked
  unplayed, in progress or solved (with the moves or the time against par),
  the next one open, later ones open too unless the person asks for locks.
- The end of a pack is a moment: a line about what they mastered, their
  totals, and where to go next (the daily puzzle, a harder pack).

## 4. Lay it out with the puzzle first

Declare it a game in the head with
`<meta name="dodojo-page-kind" content="game">` (references/frame.md). On a
computer the page sits in the Note under its title and scrolls with the Note.
On a phone or tablet the Note shows it as a preview that one tap opens on a
screen of its own: the whole screen below a slim bar, where the page scrolls
inside itself and nothing floats over it. So the first screen is what is
played: about 700px tall on a phone. From the top:

1. **A slim strip**, one line about 44-52px: the level or the date, the moves
   against par or the time, a small mark when it is solved.
2. **The puzzle**, as large as the column allows, square when the grid is
   square. It is also the Note's cover, so before anyone plays it shows the
   puzzle ready to solve, never a menu or a level picker.
3. **The tools**, right under it, one row of 44px buttons: undo and redo, the
   mark mode (a value, a note, a cross), a hint, restart; then next level when
   solved.
4. **Then what is read**: the rule in two or three lines, the level map or
   the archive, the settings (show mistakes, timer on or off), the records and
   the full rules with a worked example.

- **Nothing moves while the person thinks**: a strip of fixed height, a solved
  message laid over the strip or the clues (never over a picture the solve
  just revealed), tools that change their labels but not their size. A grid that jumps makes people mark the wrong cell.
- On a computer the Note's 920px column can hold the puzzle with the level
  map or the clue list beside it; on a phone they stack in the order above.

## 5. Make thinking comfortable

- **Marks**: a value, small notes (candidates in a corner), a cross for
  "not here". A tap selects a cell, the tools or the keys set what goes in;
  where a cell cycles through states on taps (empty, filled, crossed), a long
  press or a drag fills a run of cells in one stroke.
- **Undo without limit**, redo, and restart that asks once. Undo steps through
  marks as well as moves.
- **Mistakes only when asked**: by default the puzzle says nothing until it is
  solved; a setting shows conflicts as they happen (two of a kind in a row),
  marked with a shape as well as colour. Never end the game on a mistake,
  never take points for thinking time.
- **Hints that teach**: a hint points at the next cell or move that logic
  forces, highlights the clues that force it and says why in one line ("Only
  this cell in the row can hold a 7"). The answer itself comes only on a
  second tap. When a mark already on the grid is wrong, the hint points at
  that mistake first, since deductions from it would mislead. Count hints
  honestly in the result.
- **Feedback that stays calm**: a soft tick when a mark goes in, a small chime
  when a row or a region completes, and at the solve a sweep across the
  grid, a short phrase and three or four rising notes. No fanfare on every
  move, no timer pressure unless the person turns the clock on.
- **Input**: Pointer Events for taps and drags; `touch-action: manipulation`
  on a grid that only takes taps, `none` only where cells are dragged across,
  with room around the grid to scroll the Note. Keyboard: a focusable grid,
  arrow keys move a visible cursor, digits and letters enter values, Space
  toggles, Backspace clears, `Ctrl/Cmd+Z` undoes.

## 6. Keep the progress

- After every mark, save the puzzle's state with `window.dodojo.setState` in
  compact strings (a grid as one string of digits and dots; a move list as
  `"R,R,U,L"`), together with which puzzle is open, so a reopen shows the
  same one; a value holds at most 4000 characters. Undo history may be saved
  for the open puzzle only.
- Keep each level's result (solved, moves, time, hints) once, at the move
  that solves it, in the same `setState` call; reopening a solved level shows
  it solved, with "play again" that does not erase the record.
- A daily puzzle keys its state by date, so yesterday's half-solved grid is
  still there in the archive. Mind the budget (about 32 KB and 200 keys in
  all): keep grids for the last few weeks of days, results for older days
  packed into one key per month, and drop the rest.
- Outside dodojo keep everything in memory and carry on.

The page's frame (one file, no network requests, what is blocked, the state
API) is in [references/frame.md](references/frame.md); the look is in
[references/design.md](references/design.md); theme, phone layout, type and
copy are in [references/fundamentals.md](references/fundamentals.md).

## 7. Solve it, then save

- Run the solver over every level and every seed you ship: each has a
  solution, a deduction puzzle has exactly one, the grades rise as planned,
  the par matches the shortest search, generation stays under its time.
- Solve the first levels and one hard one by hand in a browser with touch,
  mouse and keyboard; use every tool (notes, crosses, a drag fill, undo past
  a solve, a hint at the start and near the end, restart); reopen mid-level
  and after a solve; check the daily puzzle on two "days" by changing the
  date. [references/build.md](references/build.md) has a Playwright pattern.
- Look at the page at 360 and 390px wide and in the Note column, in both
  themes: the grid, the strip and the tools on screen together, clues
  readable, nothing shifts, the first screen a good cover. Use
  `preview_webpage` in the dodojo desktop app, or
  `node <this skill's folder>/scripts/shoot.mjs <page.html> <prefix> --width 360 --top`
  (it needs Playwright).
- Save it as [references/save-to-dodojo.md](references/save-to-dodojo.md)
  describes, with a short Markdown body: what the puzzle is, its rule in one
  line, how many levels. Without the dodojo connector, write the `.html` and
  tell the person where it is.
