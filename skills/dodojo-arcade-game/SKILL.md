---
name: dodojo-arcade-game
description: Make an arcade, action or reflex game for one person as one webpage - a one-button jumper or flyer, a dodger, a catcher, a breakout or brick game, a rhythm or timing game, an aim-and-release game, an endless runner or a short score attack - with one verb learned in seconds, controls that feel right on a phone and a keyboard, a fixed-step loop that runs smoothly at 60 fps, deaths that feel fair, juice in proportion, a run of a minute or two and a best score kept - saved into dodojo as a webpage Note, or as a standalone .html file. Use for 街机, 小游戏, 休闲游戏, 反应游戏, 跑酷, 打砖块, 接东西, 节奏游戏 and any quick action game.
license: MIT
---

# dodojo-arcade-game

An arcade game is one verb, done well. Within three seconds the person knows
what to do; within three minutes they are still learning to do it better.
Every input answers on the next frame, every death is their own fault and
the restart is instant, so "one more run" is always the easy choice. Its look
is one strong graphic idea, taken from the world the game is set in. Nothing
here is a layout to copy.

It is one self-contained `.html` file. In [dodojo](https://www.dodojo.ai) it is
shown inside a Note, full height; the top of the page becomes the Note's cover
in the person's library, and the best score follows the person to all their
devices. Outside dodojo the same file opens in any browser.

## Workflow

1. **Find the verb** - one action (jump, steer, catch, aim, tap on the beat), what the person masters over many runs, and a setting that gives it a reason.
2. **Lay it out with the playfield first** - the scene on top with the score in it, a slim row of controls under it, then how to play, records and a note on the world.
3. **Design from the game's world** - one graphic idea, a small palette that reads at speed, shapes a glance can tell apart, written as a plan before any code.
4. **Build the loop and the controls** - a fixed-step simulation on requestAnimationFrame, input buffered to the next step, controls made for a thumb, a mouse and a keyboard.
5. **Make it feel good and fair** - juice in proportion, hitboxes kinder than sprites, a ramp over the first minute, deaths that show their cause, restart in under a second.
6. **Keep the best** - the best score, the runs played and the settings kept with the page; a run paused when the page is hidden.
7. **Play it, then save** - a bot and a person playing many runs, frame times measured, every control tried, screenshots at phone width, then a dodojo Note.

## 1. Find the verb

- **One verb**, learned in seconds: tap to flap, hold to charge and release
  to jump, drag to steer, tap left or right half, tap on the beat, pull back
  and let go. Two verbs only when the second grows out of the first (a tap
  jumps, a hold jumps higher).
- **What is mastered**: timing, a route through obstacles, risk for reward
  (a near miss scores more, a fruit near the spikes is worth double). Write
  in one line what a good player does that a new one does not.
- **A setting that gives the verb a reason**: a bat finding moths by echo, a
  dodo catching fruit under a tree, a paper boat in a gutter after rain. The
  setting decides the look, the sounds and the names of things.
- **How long a run lasts**: thirty seconds to three minutes, ending on a
  mistake or a clock. Short runs make "one more" easy.
- Make original games or kinds nobody owns (a one-button flyer, a brick
  breaker, a dodger, an endless runner). Never recreate a specific commercial
  game's name, characters, art, sounds or levels, even renamed.
- With the dodojo connector, search the person's memories first
  (`search_memories`) for an earlier version or a setting from their own life
  (a city they love, their dog) and build on it.

## 2. Lay it out with the playfield first

Declare it a game in the head with
`<meta name="dodojo-page-kind" content="game">` (references/frame.md). On a
computer the page sits in the Note under its title and scrolls with the Note.
On a phone or tablet the Note shows it as a preview that one tap opens on a
screen of its own: the whole screen below a slim bar, where the page scrolls
inside itself and nothing floats over it. So the first screen is what is
played: about 700px tall on a phone. From the top:

1. **The playfield**, as wide as the column allows (the page's width less its
   16px gutters on a phone, at most about 560px on a computer), at a fixed
   aspect ratio that fits on one phone screen with the controls (4:5 or 1:1
   is usual). The score and the best sit inside it, small, in a corner. It
   is also the Note's cover, so before the first run it shows the scene alive
   and ready (the bat at the cave's mouth, the tree heavy with fruit) with a
   short invitation inside the scene ("Tap to fly"), never an empty frame or a
   title splash.
2. **A slim row under it**, 44px: pause or restart, sound, and a small line
   of stats (the run's score, the best, runs played) if they do not fit in
   the playfield.
3. **Then what is read**: how to play in two or three lines, the controls for
   each device, the records (best, last runs, totals), settings (sound,
   reduced motion, difficulty if any) and a few lines on the world the game
   comes from.

- **The narrowest phone.** On a 360px phone a Note gives the page 328px,
  and inside the page's own 16px gutters the playfield is about 296px wide. Everything that matters reads at that size; text in the playfield is
  at least 14px.
- **The page never moves under the thumb.** Nothing above the playfield
  changes height, the row under it keeps its size, and the end of a run is
  drawn inside the playfield.
- **The Note still scrolls.** Give the playfield `touch-action: none` only if
  it takes drags or holds, and keep the row under it and the page around it
  free to scroll. A tap-only game can keep `touch-action: manipulation`.

## 3. Design from the game's world

Follow [references/design.md](references/design.md): one graphic idea taken
from the setting, a small palette fixed by the scene, silhouettes that read
at speed, written as a plan of colour tokens and type before any code, and the
looks to avoid.

## 4. Build the loop and the controls

Follow [references/build.md](references/build.md) for the code. In short:

- **A fixed-step simulation**: update the world at 60 steps per second with
  an accumulator, draw on every `requestAnimationFrame`, interpolate between
  the last two steps, and clamp a long gap (after the page was hidden) so the
  world never jumps. Physics in units per second, never per frame, so a
  120 Hz phone plays like a 60 Hz one.
- **A seeded run**: the obstacles and pickups come from a seed kept with the
  run, so a paused run continues the same way and a bot can replay a run.
- **Input answers on the next step**: read Pointer Events and keys into a
  small buffer that the next step consumes; a press up to about 100ms before
  it would count (a jump just before landing) is kept and used. Coyote time:
  a jump up to about 80ms after leaving a ledge still works.
- **Controls for every device**: tap or hold anywhere on the playfield for a
  one-button game; drag for steering (the object follows the finger with an
  offset so the thumb does not cover it); left and right halves for two
  directions. Keyboard: Space for the verb (plus the arrow that matches its
  direction: Up to jump, Down to drop), arrows or A and D to steer, P or
  Escape to pause, Enter to restart. Mouse: click, or move to steer. No
  on-screen joystick unless the game truly needs eight directions. A tap
  gives the playfield focus (`focus({ preventScroll: true })`, the ring only
  on `:focus-visible`), so the keys work after it; a hold game captures the
  pointer, so a release off the playfield still counts.
- **Drawing**: one canvas sized from its box with a ResizeObserver and scaled
  by `devicePixelRatio` (capped at 2), sprites drawn once into offscreen
  canvases, no allocations in the hot loop, and the work done in each frame
  (the frame callback) kept under about 8ms on a mid phone. Draw the score
  in the page over the canvas, where tabular figures work, rather than on
  the canvas.
- **Sound** made with the Web Audio API from the first tap: a sound for the
  verb, one for scoring (pitch rising with a combo), one for the end, all
  quiet, with a switch that is remembered.

## 5. Make it feel good and fair

- **Juice in proportion**: the verb gets a small squash and a puff; a score
  gets a pop and a rising note; a near miss gets a brief flash and a bonus
  shown where it happened; the end of a run gets a hit-stop of about 60ms, a
  short shake (off with `prefers-reduced-motion`) and a falling sound. Nothing
  hides the playfield or delays the next input.
- **Fair**: hitboxes a little smaller than the sprites, hazards visible early
  enough to react (about 0.4 s at the current speed), no hazard that appears
  where the player already is, chance that never makes a run impossible
  (generate the next stretch, check it can be passed, else re-roll).
- **A ramp**: the first ten seconds are gentle enough to learn; speed and
  density rise over the first minute or two, then plateau with spikes; the
  best players end on skill, not on an impossible wall. Aim for a typical
  run of about 45 to 120 seconds: standing still or holding forever loses
  within seconds, and a player who reacts in half a second does not live
  for ten minutes.
- **Death shows its cause** for about half a second to a second (the spike
  that hit, the fruit that fell), then the result: the score, the best (and
  that it fell, when it did), one line about what happened. Enter restarts
  at once; a tap on the playfield restarts from about a second after the
  death, so the tap that died does not skip the result. Restart is the obvious control and
  runs in under a second; a tap on the playfield after a short pause starts
  the next run.
- **No filler**: no coins for their own sake, no lives to buy, no daily
  streaks, no confetti on every point. Unlockable skins only when they say
  something true about mastery (a colour for passing 100).

## 6. Keep the best

- Save the best score, the runs played and a short list of recent scores
  with `window.dodojo.setState` once at the end of each run (a value holds
  at most 4000 characters), and a setting (sound, language) when it
  changes. Never save every frame.
- Pause the run when the page is hidden (`visibilitychange`), when the
  playfield scrolls out of view (an `IntersectionObserver`: inside a Note the
  page is scrolled away, not hidden) and on the pause control; a paused run shows the scene frozen with "Tap to carry on". A run
  in progress does not need to survive a reload; the records do.
- Outside dodojo keep everything in memory and carry on.

The page's frame (one file, no network requests, what is blocked, the state
API) is in [references/frame.md](references/frame.md); theme, phone layout,
type and copy are in [references/fundamentals.md](references/fundamentals.md).

## 7. Play it, then save

- Write a small bot that plays the simulation without the screen (the same
  step function, scripted inputs) and run a few hundred seeds in Node: every
  run can be survived for at least the first thirty seconds by a perfect
  player, no hazard spawns on the player, the ramp reaches its top speed
  when planned, scores are what the rules say. Run two more bots: one that
  never acts and one that always does should die within seconds, and one
  that reacts half a second late should have a median run of about 45 to
  120 seconds.
- Play runs yourself in a browser with touch, mouse and keyboard: the first
  run from the cover, a death, an instant restart, a pause by hiding the page
  and coming back, a new best, sound off and on, reduced motion.
- Measure, on a throttled CPU (4x in Chromium's DevTools protocol) and with
  the world at the top of its ramp: the time spent in the frame callback
  stays under about 8ms, frames arrive about every 16.7ms, and no long task
  appears during play.
  [references/build.md](references/build.md) has the pattern.
- Look at the page at 360 and 390px wide and in the Note column, in both
  themes: the playfield and the row under it fit on one screen, the score is
  readable, the first screen makes a good cover. Use `preview_webpage` in the
  dodojo desktop app, or
  `node <this skill's folder>/scripts/shoot.mjs <page.html> <prefix> --width 360 --top`
  (it needs Playwright).
- Save it as [references/save-to-dodojo.md](references/save-to-dodojo.md)
  describes, with a short Markdown body: what the game is, the one control,
  what a run is. Without the dodojo connector, write the `.html` and tell the
  person where it is.
