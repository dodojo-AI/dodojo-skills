---
name: dodojo-game
description: Make a board, card or tabletop game as one webpage - a classic such as gomoku, chess, go, mancala, dots and boxes or a card game, or an original one - played against a computer opponent with real levels or by two people on one phone, or from their own devices in a dodojo team space, with the game first and the rules after it, input that answers at once, sound made in the page, every move kept and a look taken from the game's own materials - saved into dodojo as a webpage Note, or as a standalone .html file. Use for 棋类, 牌类, 桌游, 两人同屏, 人机对战 and any game no more specific dodojo game skill covers; for a party game, a puzzle, an arcade game or a story game, use dodojo-party-game, dodojo-puzzle-game, dodojo-arcade-game or dodojo-story-game when installed.
license: MIT
---

# dodojo-game

A game page is played, not read. It opens on the game, answers every touch
at once, and makes people want one more round. Its look comes from the
game's own world. Nothing here is a layout to copy.

Its siblings go deeper on other kinds of game, and share this frame:
`dodojo-party-game` (a group around one phone), `dodojo-puzzle-game` (logic
and level packs, checked by a solver), `dodojo-arcade-game` (one verb, a
fixed-step loop, one more run) and `dodojo-story-game` (branching stories,
mysteries and escape rooms). Use the one that fits when it is installed.

It is one self-contained `.html` file. In [dodojo](https://www.dodojo.ai) it is
shown inside a Note, full height, the top of the page becomes the Note's cover
in the person's library, and a game left halfway opens on the same move on any
of their devices; outside dodojo the same file opens in any browser.

## Workflow

1. **Pin down the game** - who plays, where and for how long, the exact rules and variant, and a computer opponent if two people are needed.
2. **Lay it out with the game first** - a slim status strip, the play area, the controls under it, and only then how to play, settings, records and rules.
3. **Design from the game's world** - the material of the board and pieces, a palette for light and dark, written as a plan before any code.
4. **Build input and feedback** - pointer, touch and keyboard, feedback in proportion to the moment, sound made with Web Audio, motion that never makes people wait.
5. **Make another round tempting** - visible goals and records, fair play, a difficulty curve, an ending that is a moment and a way to look back.
6. **Keep the game** - every move saved with the page's state, so it reopens on the same move on any device.
7. **Play it, then save** - whole games in every mode with mouse, touch and keyboard, screenshots at phone width in both themes, then a dodojo Note with a short body.

## 1. Pin down the game

- Who plays, where and for how long: one person, two people taking turns on
  one device, or a group passing a phone around; mostly on a phone or at a
  computer; two minutes or an evening. The page cannot reach a server of its
  own. In dodojo, play between people on their own devices works only when the
  Note is in a team space, where everyone who can edit shares the page's state
  live; elsewhere offer turns on one device or a computer opponent, and say so
  in one line if the person asked for online play.
- Write the rules down before any code: the board or grid, who starts, legal
  moves, how a game is won, drawn or lost, the scoring, and where chance comes
  in. A classic with variants (gomoku with or without renju's restrictions,
  the odds of a new tile in a merge puzzle) gets the common variant, named on
  the page; offer another as a setting only when it is cheap to get right.
- A game for two also gets a computer opponent, so one person can play alone:
  two or three levels that really differ. The easiest makes mistakes a
  beginner can punish; the strongest never misses a win in one move and always
  blocks one (in a game won on points, such as mancala, a move that settles
  the result, like taking more than half the seeds). Let it think in a worker (a worker from a Blob URL is allowed in
  dodojo) or in short slices, so the page never freezes; answer within about a
  second, and show that it is thinking. Before saving, pit the levels against
  each other in Node to check their order and speed
  ([references/build.md](references/build.md)).
- Make original games, or classics nobody owns (gomoku, chess, go, sudoku,
  mancala, dots and boxes, a sliding or merging tile puzzle). Never recreate a
  specific commercial game's name, characters, art, sounds or levels.
- With the dodojo connector, search the person's memories first
  (`search_memories`) for an earlier version of this game or notes on how they
  like to play it, and build on them.

## 2. Lay it out: the game first

Declare it a game in the head with
`<meta name="dodojo-page-kind" content="game">` (references/frame.md). On a
computer the page sits in the Note under its title and scrolls with the Note.
On a phone or tablet the Note shows it as a preview that one tap opens on a
screen of its own: the whole screen below a slim bar, where the page scrolls
inside itself and nothing floats over it. So the first screen is what is
played: about 700px tall on a phone. From the top:

1. **A status strip**, one line no taller than about 56px and as wide as the
   play area: whose turn it is or the score, the level, the clock. Show who is
   to move in form (a lit name plate, the colour of their pieces), not only in
   words.
2. **The play area**, as large as the column allows: on a phone, the page's
   width less its 16px gutters; on a computer at most about 560px wide, so the
   status, the play area and the controls fit in one window together. A
   square board stays square; a playfield that needs height gets a fixed
   aspect ratio. This is also the Note's cover, so before anyone plays it
   shows the game ready to start (the board and its pieces, the first puzzle
   dealt), never an empty frame, a menu or a start screen.
3. **The controls**, right under the play area where a thumb reaches them:
   the main action (play again, new game), undo, sound. One row on a phone,
   44px tall.
4. **Then everything that is read rather than played**, in this order: two or
   three lines on how to play, the opponent and variant settings, the record
   and the history, the full rules. Put the long parts in `<details>`. Never
   put rules, an introduction or settings above the game.

- Design for the narrowest phone. In a dodojo Note on a phone the page gets
  the screen's width less 32px (328px on a 360px phone, 358px on a 390px
  one), so inside the page's gutters the status strip, the play area and the
  controls have about 296px (opened on its own in a phone browser, the page
  has the whole screen, so about 328px inside its gutters). Make names,
  levels and labels fit that: two name plates with their scores fit in the
  strip, a third column of status beside them does not, so a message such as
  "thinking" or the move number goes on a plate or in the line under the
  board. Keep labels on one line (`white-space: nowrap`, a
  shorter word) rather than letting a button wrap. `preview_webpage`'s phone
  views are about 15px narrower still, so what fits there fits on the phone.
- Nothing moves while people play. Give the status line a fixed height, keep
  messages inside it, and show a result over the play area (a banner laid on
  the board, away from the winning line), not in a block that pushes the board
  down. A board that jumps makes people tap the wrong place. When the game
  ends, the controls row changes its buttons (review, play again), not its
  height.
- On a computer the Note's 920px column can hold the play area with a side
  panel beside it (the players, the settings, the move list); on a phone the
  same parts stack in the order above.
- Keep the Note's Markdown body short: what the game is, how to start and the
  main rule, in two or three lines. dodojo shows that text under the page.

## 3. Design from the game's world

Follow [references/design.md](references/design.md): an art direction taken
from the game's own materials and customs, written as a plan of colour tokens
and type before any code, real materials drawn with care, a board that keeps
its material in dark mode, and the looks to avoid.

## 4. Build input and feedback

Follow [references/build.md](references/build.md) for the details. In short:

- Answer on the same frame: the piece lands, the cell lights and the sound
  plays the moment the finger lifts. Animation confirms a move in 100-250ms;
  it never makes the person wait to make the next one. A move that is a
  sequence (sowing seeds pit by pit, a cascade of captures) may run longer,
  as long as any tap finishes it at once.
- Pointer Events for mouse, touch and pen alike. When targets are small,
  under about 32px (a 15x15 board on a phone gives cells of about 22px), keep
  a slip cheap: a first tap shows a ghost piece, a second tap on it places it,
  a tap elsewhere moves the ghost; say so in one line under the board. Larger
  targets act on one tap, cancelled if the finger slides off before lifting. `touch-action: manipulation`
  on a board that only takes taps, so the Note still scrolls; `touch-action:
  none` only on a playfield that takes swipes or drags, with room around it to
  scroll.
- Keyboard: a focusable play area (`tabindex="0"`), a visible cursor moved by
  the arrow keys or WASD, Enter or Space to act, and `preventDefault` on those
  keys only while the play area has focus.
- Feedback in proportion: every action gets a visible answer and bigger
  moments get more. A move: the piece settles with a soft click. A capture, a
  merge, a cleared line: a pop. A win: the winning line drawn across the
  board, a short phrase and a few notes. Always mark the last move.
- Sound made with the Web Audio API (sound files from other sites do not load
  in dodojo), from an AudioContext created on the person's first tap; quiet,
  with a sound switch in the controls that is remembered. No sound before the
  first tap, no music unless asked.
- `requestAnimationFrame` for anything that moves; on page elements animate
  only `transform` and `opacity`. With `prefers-reduced-motion` keep every
  change of state and drop the flourishes. Stop clocks and loops while the
  page is hidden and carry on from where they stopped.

## 5. Make another round tempting

- A goal people can see and progress toward it: the score, the match (first
  to three wins), a best score or best time kept in the page's state. Say so
  when a best falls.
- Fair play: who starts alternates between games; between two people undo is
  limited (once each per game is usual), against the computer it is free but
  counted; there is a rule for a draw; chance is visible (the dice, the next
  tile), never hidden luck that decides the result.
- A difficulty curve: the first game is easy to understand and can be won;
  puzzles start easy and get harder; after a win against the computer, offer
  the next level.
- An ending that is a moment: what happened, the number that matters (moves,
  time, score), "Play again" as the obvious button, and a way to look back
  over the finished game (step through its moves).
- The game's own world as content: its real terms (in gomoku: an open three,
  a four, renju's forbidden moves), its materials (a kaya-wood board, slate and
  shell stones, green felt), its customs (who starts, how a match is counted).
- Optional help that teaches, off by default: mark the point that must be
  blocked, show move numbers like a printed game record.
- No filler: no confetti on every move, no points or badges for their own
  sake, no streaks that mean nothing. The reward matches what happened.

## 6. Keep the game

- Save the whole game after every move with `window.dodojo.setState`, in
  compact strings (moves as `"112,113,98"`), so a game closed halfway opens on
  the same move on any of the person's devices; follow the
  `dodojo-state-change` event for a move made on another device. Names and
  settings use `data-dodojo-key` or `setState`. A value holds at most 4000
  characters, so split a long game across several keys. Outside dodojo
  `window.dodojo` is missing: keep the game in memory and carry on.
- A game with chance keeps its seed, so reopening continues the same deal.
- Record a result once, at the move that ends the game, in the same `setState`
  call, so reopening a finished game never counts it twice.
- Outside a team space only the owner's state is kept: on a shared page each
  visitor starts a fresh game, which needs no explanation. In a team space the
  state is the team's, and each player can play from their own device: keep
  seats, turns, rounds and restarts with `window.dodojo.game`
  ([references/frame.md](references/frame.md)), let only the seated player
  whose turn it is move, show the game without its controls to someone
  watching, and while nobody else has taken a seat let one device play every
  seat. Without `dodojo.game` (an older app, or outside dodojo), two people
  share one device.

The page's frame (one file, no network requests, what is blocked, the state
API, `dodojo.game`, sizing) is in [references/frame.md](references/frame.md); theme, phone
layout, type, spacing and copy are in
[references/fundamentals.md](references/fundamentals.md).

## 7. Play it, then save

- Play whole games to the end in every mode (each computer level, two people
  on one device), with a mouse, with touch and with the keyboard. Try the
  edges: a win along the edge of the board, a draw, undo right after a move
  (and after a win, where the rules allow it), a new game in the middle of
  one, reopening mid-game, reopening during the computer's turn,
  a narrower window. [references/build.md](references/build.md) has a
  Playwright pattern that does this with a stand-in for `window.dodojo`.
- The computer opponent never makes an illegal move and answers within about
  a second; its easiest level can be beaten, and its strongest takes a win in
  one move and blocks one.
- Look at the page at 360 and 390px wide and in the Note column, in both
  themes: `preview_webpage` in the dodojo desktop app, otherwise
  `node <this skill's folder>/scripts/shoot.mjs <page.html> <prefix> --width 360 --top`
  (it needs Playwright). The status, the play area and the controls are on
  screen together without scrolling, nothing shifts during play, and the
  first screen makes a good cover. Fix what you find, then look again at what
  you changed.
- Save it as [references/save-to-dodojo.md](references/save-to-dodojo.md)
  describes, with the short Markdown body. Without the dodojo connector, write
  the `.html` and tell the person where it is.
