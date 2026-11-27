---
name: dodojo-story-game
description: Make a story game as one webpage - a branching story where choices matter, a mystery solved from clues in a case file, an escape room of locks and codes, a text adventure, or a personal treasure hunt or birthday quest built from shared memories - with the story mapped before it is written, short scenes with real choices, puzzles clued fairly in the text, a hint ladder, a journal of what was found, several earned endings and progress kept scene by scene - saved into dodojo as a webpage Note, or as a standalone .html file. Use for 互动故事, 文字冒险, 剧情游戏, 推理, 密室逃脱, 解谜书, 寻宝游戏, 生日惊喜游戏 and any game told as a story.
license: MIT
---

# dodojo-story-game

A story game is read and decided. Each scene is short, ends on something to
choose or to work out, and every choice leaves a mark that the story
remembers. Its puzzles are fair: the clue is in the text, the answer can be
reasoned, and a hint is there for anyone stuck. Its look comes from the
story's own world (a case file, a ship's log, a museum after hours). Nothing
here is a layout to copy.

It is one self-contained `.html` file. In [dodojo](https://www.dodojo.ai) it is
shown inside a Note, full height; the top of the page becomes the Note's cover
in the person's library, and a story left halfway opens on the same scene on
any of their devices. Outside dodojo the same file opens in any browser.

## Workflow

1. **Pin down the story** - the kind, who plays and for whom, the player's role and goal, the length, and whether it is built from the person's own memories.
2. **Map it before writing it** - the acts, the scenes, the choices and what each changes, the clues and where they are found, and the endings each earned.
3. **Write short scenes with real choices** - forty to a hundred and fifty words a scene, a concrete situation, two to four choices that each mean something.
4. **Make the puzzles fair** - every answer reasoned from what the page shows, an answer box that forgives small slips, a hint ladder from a nudge to the answer.
5. **Lay it out with the scene first** - the scene's picture and text on top, the choices right under it, then the journal, the map of endings and the settings.
6. **Keep the story** - the scene, the choices, the clues found and the endings reached kept with the page; a chapter can be replayed.
7. **Walk every path, then save** - a script that visits every scene and ending, a full play-through by hand, screenshots at phone width, then a dodojo Note.

## 1. Pin down the story

- **The kind**:
  - *a branching story*: the player decides at each turn and the story bends;
  - *a mystery*: a case file of statements, documents and photos; the player
    finds the contradiction and names the culprit, the motive and the means;
  - *an escape room*: a room of objects, each examined, some combined, locks
    opened with codes worked out from the room;
  - *a text adventure*: places to move between, things to take and use;
  - *a personal quest*: a treasure hunt, an anniversary or a birthday
    surprise built from the person's own places, photos and stories, for
    someone they love.
- **Who plays and for whom**: one person alone, a couple on one phone, a
  friend who receives it as a gift. A gift is solvable by its recipient
  without help from the maker.
- **The player's role and goal**, in one line each ("You are the night
  guard; find out who moved the painting before the museum opens").
- **The length**: 15-30 minutes is a good evening's story (about 20-40
  scenes, 2-5 puzzles, 2-4 endings); a mystery case can be shorter and
  denser.
- **Built from memories.** With the dodojo connector, search the person's
  memories first (`search_memories`): for a personal quest, the trips,
  places, dates and photos it can use; for any story, an earlier version or
  notes on what they like. Use only what the person points you to or agrees
  to when it involves someone else, and remember the page may be shared:
  never put addresses, codes or private details in it that the person did
  not ask for.
- Write original stories. A story may be set in a real place or a period,
  never in a commercial game's, book's or film's world with its characters.

## 2. Map it before writing it

- **Acts**: an opening that sets the goal in the first scene, a middle where
  the choices and clues pile up, a turn that changes what the player thought
  was true, and an end. Write the map as a list of scenes with ids before
  any prose.
- **Choices that matter.** Each choice either moves the player somewhere
  different, changes what they know or carry, or changes how someone treats
  them later. A choice that leads to the same next scene with nothing
  changed is a false choice: cut it or give it a consequence. Branch and
  rejoin (the paths come back together at key scenes) so the story stays
  writable.
- **State, few and named**: a handful of flags (`trusts_lin`, `has_key`)
  and the set of clues found (counted where a choice needs "at least six
  clues"). Each flag is set somewhere and read somewhere else; a flag nobody
  reads is a false choice. [references/build.md](references/build.md) gives
  the attributes that set and read them, which the path check reads too.
- **Clues**: list every clue, where it is found, and which conclusion it
  supports. A conclusion the player must reach has at least two routes to
  its clues.
- **Endings**: two to four, each earned by what the player did, none a dead
  end out of nowhere. A bad ending teaches what went wrong and offers to go
  back to the last choice. One best ending asks for the fullest
  understanding.
- **No dead ends**: from every scene the player can go on, and nothing can
  be lost that is needed later without a way back.

## 3. Write short scenes with real choices

- Forty to a hundred and fifty words a scene, in the second person and the
  present tense ("The lift stops between floors"), concrete and sensory,
  ending on the decision.
- Two to four choices, each a short action in the player's voice ("Read the
  letter", "Call Lin back"), never "Continue" when there is only one way: then
  the scene ends with a button that says what happens ("Open the door").
- A cast of a few people with names, each wanting something; dialogue that
  sounds like them.
- Write in the person's language for its readers. For several languages,
  write each one, not a word-for-word translation.
- Every scene is written in the HTML (a `<section id="scene-…">` per scene,
  shown one at a time by script), so search and the apps that cannot run
  scripts still read the whole story.

## 4. Make the puzzles fair

- **The answer is on the page**: a code is read from the clock in the
  photo, a culprit named by the one statement that contradicts the ticket.
  The page shows everything needed when it is needed; outside knowledge is
  limited to what anyone knows.
- **Kinds that work on a phone**: a code of digits or letters, a choice among
  the suspects, an order to put things in, an object to use on another, a
  word from a cipher printed in the page. No pixel hunting: things to
  examine are listed or clearly drawn, with targets of at least 44px.
- **An answer box that forgives**: trim spaces, ignore case and accents,
  accept the obvious spellings and digits as words; a wrong answer says so
  gently and costs nothing.
- **A hint ladder**, one rung at a time on request: a nudge toward where to
  look, then what to notice, then the answer. Count hints honestly at the
  end.
- **The solve is a moment**: the lock clicks, the drawer slides, the
  culprit's face in the photo; a short sound, the scene moves on.

## 5. Lay it out with the scene first

The page sits in the Note under its title and scrolls with the Note. From the
top:

1. **A slim strip**, one line: the chapter or the place, and the clues found
   or the time on the case clock.
2. **The scene**: its picture (a drawn scene, an attached photo, a document
   set in type) and its text. It is also the Note's cover, so before anyone
   plays it shows the opening scene, never a title screen or a menu.
3. **The choices or the answer box**, right under the text, full width, at
   least 48px tall each. "Go back to the last choice" restores the scene,
   flags and clues from before it (keeping the endings reached); offer it
   after a bad ending and in the journal, not under every scene.
4. **Then what is read and kept**: the journal (clues, people, objects), the
   endings reached out of how many, settings (text size, sound), how to play
   in two lines, and credits for photos.

- **Moving to a scene** keeps the reader's place: keep each scene with its
  choices within about one phone screen, so the next scene appears where the
  eye already is (inside dodojo the Note scrolls, not the page, so the page
  cannot always scroll the reader back up), with a short fade at most.
- **The narrowest phone**: on a 360px phone a Note gives the page 328px,
  and inside the page's own 16px gutters about 296px remain; scene text 17-18px with a line height around 1.6
  (1.8 for Chinese and Japanese), choices that wrap to two lines rather than
  cut.
- On a computer the Note's 920px column can put the journal beside the
  scene; on a phone it stacks below.

## 6. Keep the story

- After every choice, save the scene id, the flags, the clues found and the
  history of choices with `window.dodojo.setState`, in compact strings (a
  value holds at most 4000 characters), so the story reopens on the same
  scene on any device.
- Keep the endings reached across play-throughs; a new play-through keeps
  them and offers to start from a chapter.
- A gift's progress is the recipient's: in a team space it is shared with the
  people in it; elsewhere a shared page starts fresh for each visitor, which
  suits a gift sent as a link.
- Outside dodojo keep everything in memory and carry on.

The page's frame (one file, no network requests, what is blocked, the state
API) is in [references/frame.md](references/frame.md); the look is in
[references/design.md](references/design.md); the writing in
[references/writing.md](references/writing.md); theme, phone layout, type and
copy in [references/fundamentals.md](references/fundamentals.md).

## 7. Walk every path, then save

- Check the story as a graph in Node
  ([references/build.md](references/build.md)): every scene can be reached,
  every ending can be reached, every choice leads to a scene that exists,
  every flag is set before it is read, and no scene leaves the player stuck.
- Play it through by hand in a browser to the best ending and to one other,
  with touch and the keyboard; solve each puzzle with a slip in the answer
  (a capital, a space), take every hint once, reload in the middle, and
  start again from a chapter.
- Read the whole story once more for consistency: names, times, the facts a
  clue relies on.
- Look at the page at 360 and 390px wide and in the Note column, in both
  themes: the scene text comfortable to read, the choices right under it,
  the first screen a good cover. Use `preview_webpage` in the dodojo desktop
  app, or `node <this skill's folder>/scripts/shoot.mjs <page.html> <prefix> --width 360 --top`
  (it needs Playwright).
- Save it as [references/save-to-dodojo.md](references/save-to-dodojo.md)
  describes, with a short Markdown body: what the story is, the player's
  goal, how long it takes, with no spoilers. Without the dodojo connector,
  write the `.html` and its pictures and tell the person where they are.
