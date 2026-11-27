# dodojo skills

Open [Agent Skills](https://agentskills.io) from [dodojo](https://www.dodojo.ai),
the memory library you share with your AI. Each skill is a method, not a
template: what to find out, how to plan, how to design and how to check the
result. What comes out is one page that works on a phone and looks right in
light and dark.

They work in any agent that supports skills (Claude Code, Codex, Cursor and
others). Connected to dodojo, they start from what you already keep and save
the result there as a Note.

**See what each skill makes: [dodojo-ai.github.io/dodojo-skills](https://dodojo-ai.github.io/dodojo-skills/)**
([中文说明](README.zh-CN.md))

## dodojo-travel

[`skills/dodojo-travel`](skills/dodojo-travel/SKILL.md) plans a trip, a day out,
a road trip or a food crawl as a page the person follows on the road:

- opening hours, closures, tickets and transport checked for the actual dates,
  each with its source and the date it was checked;
- a route that moves in one direction, with buffers and a rain plan;
- a map of each day's stops with numbered pins and one-tap Google Maps
  directions, a card per stop, food, a checklist that remembers what you tick,
  and totals that add up;
- real photos of the places, credited;
- a look taken from the place itself, in light and dark.

Examples, each made by an agent following the skill:
[a Saturday in Lisbon](examples/dodojo-travel/lisbon-saturday/) and
[a day walking Kyoto's Higashiyama](examples/dodojo-travel/kyoto-higashiyama/) (in Chinese).

## Game skills

Five skills make games people play on one page, each for a different kind of
game. They share dodojo's frame: the game first and the reading after it,
input and sound that answer at once, a look taken from the game's own world,
in light and dark, and play kept with the page so it reopens where it
stopped, on any device.

### dodojo-game

[`skills/dodojo-game`](skills/dodojo-game/SKILL.md) makes a board, card or
tabletop game:

- a slim status strip, the board and its controls on one screen, with how to
  play, settings, records and rules below, and nothing that moves during
  play;
- a computer opponent with levels that really differ, checked against each
  other before saving;
- two people on one phone, or, in a dodojo team space, each on their own
  device;
- every move kept, and a look taken from the board and pieces (a kaya board,
  slate and shell stones, green felt).

Examples: [gomoku on a kaya board](examples/dodojo-game/gomoku/), against the
computer at three levels or two people on one phone, with replay and a record
of wins; [mancala on a carved board](examples/dodojo-game/mancala/), Kalah
rules with seeds sown one by one, three computer levels, and two people on one
phone or each on their own in a team space.

<p>
  <img src="examples/dodojo-game/gomoku/preview/cover.jpg" height="240" alt="Gomoku as it opens: a kaya board">
  <img src="examples/dodojo-game/gomoku/preview/2.jpg" height="240" alt="Gomoku mid-game against the computer">
  <img src="examples/dodojo-game/mancala/preview/cover.jpg" height="240" alt="Mancala on a carved board">
  <img src="examples/dodojo-game/mancala/preview/2.jpg" height="240" alt="Mancala: a win against the computer">
</p>

### dodojo-party-game

[`skills/dodojo-party-game`](skills/dodojo-party-game/SKILL.md) makes a party
game for two to ten people around one phone:

- an engine chosen for the table (guess, bluff, push your luck, race, vote,
  draw lots) and where the phone sits: passed round, flat in the middle or
  held up;
- the word that matters readable across the table, a cover screen before
  every secret, a pad for each player at their edge of a phone in the middle;
- a clock people hear, rounds that end on a moment and a tally across the
  evening;
- hundreds of prompts written natively for each language, never translated
  word for word.

Examples: [Number Bomb](examples/dodojo-party-game/number-bomb/), a bomb box
with a shrinking range and a fuse, for 2-10 players;
[Odd Word Out](examples/dodojo-party-game/odd-word-out/), a bluffing game in
sealed envelopes where one or two players' words are only almost the same,
for 3-10 players with 150 word pairs per language. Both in English, 中文 and
日本語.

<p>
  <img src="examples/dodojo-party-game/number-bomb/preview/cover.jpg" height="240" alt="Number Bomb, ready to play">
  <img src="examples/dodojo-party-game/number-bomb/preview/3.jpg" height="240" alt="Number Bomb: someone hit the bomb">
  <img src="examples/dodojo-party-game/odd-word-out/preview/cover.jpg" height="240" alt="Odd Word Out: sealed envelopes">
  <img src="examples/dodojo-party-game/odd-word-out/preview/1.jpg" height="240" alt="Odd Word Out: a secret word, shown while held">
</p>

### dodojo-puzzle-game

[`skills/dodojo-puzzle-game`](skills/dodojo-puzzle-game/SKILL.md) makes a
puzzle to solve alone, one a day or in a pack of levels:

- every puzzle proven by a solver run in Node: solvable, unique where logic
  should decide, graded by the reasoning it needs;
- levels that teach one idea at a time, with a curve and breathers;
- marks, notes and unlimited undo, mistakes shown only when asked, hints that
  point at the next deduction and say why.

Example: [Low Tide](examples/dodojo-puzzle-game/low-tide/), picture logic set
like a tide-table booklet: twelve shore pictures from 5 x 5 to 10 x 10 and a
new puzzle every day, each proven unique, in English, 中文 and 日本語.

<p>
  <img src="examples/dodojo-puzzle-game/low-tide/preview/cover.jpg" height="240" alt="Low Tide, level 1">
  <img src="examples/dodojo-puzzle-game/low-tide/preview/1.jpg" height="240" alt="Low Tide: a hint explains the next step">
  <img src="examples/dodojo-puzzle-game/low-tide/preview/2.jpg" height="240" alt="Low Tide: a solved picture">
  <img src="examples/dodojo-puzzle-game/low-tide/preview/3.jpg" height="240" alt="Low Tide: today's puzzle">
</p>

### dodojo-arcade-game

[`skills/dodojo-arcade-game`](skills/dodojo-arcade-game/SKILL.md) makes a
quick action game for one thumb:

- one verb learned in seconds, a setting that gives it a reason;
- a fixed-step loop that plays the same at 60 and 120 Hz, input buffered to
  the next step, controls for a thumb, a mouse and a keyboard;
- juice in proportion, hitboxes kinder than sprites, a ramp over the first
  minute, a restart in under a second, the best score kept;
- a bot that plays hundreds of seeded runs in Node and frame times measured
  on a throttled CPU before saving.

Example: [Lamplight Spider](examples/dodojo-arcade-game/lamplight-spider/), a
spider under a sodium streetlamp that drops on its thread to catch moths and
climbs away from bats: hold to drop, let go to climb. In English, 中文 and
日本語.

<p>
  <img src="examples/dodojo-arcade-game/lamplight-spider/preview/cover.jpg" height="240" alt="Lamplight Spider, ready to play">
  <img src="examples/dodojo-arcade-game/lamplight-spider/preview/2.jpg" height="240" alt="Lamplight Spider in play">
  <img src="examples/dodojo-arcade-game/lamplight-spider/preview/3.jpg" height="240" alt="Lamplight Spider: the end of a run">
</p>

### dodojo-story-game

[`skills/dodojo-story-game`](skills/dodojo-story-game/SKILL.md) makes a game
told as a story: a branching story, a mystery case file, an escape room, a
text adventure, or a treasure hunt built from shared memories:

- the story mapped before it is written, with choices that change something
  later and endings that are earned;
- short scenes, puzzles clued fairly in the text, an answer box that forgives
  slips and a hint ladder;
- every path walked by a script before saving: every scene and ending
  reachable, no dead ends.

Example: [The Hollin Frost](examples/dodojo-story-game/hollin-frost/), a 1956
case file: an insurance adjuster has until four o'clock to find out who let a
famous orchid freeze. Twenty-nine scenes, two locks and three endings.

<p>
  <img src="examples/dodojo-story-game/hollin-frost/preview/cover.jpg" height="240" alt="The Hollin Frost: the opening scene">
  <img src="examples/dodojo-story-game/hollin-frost/preview/2.jpg" height="240" alt="The Hollin Frost: reading the thermograph">
  <img src="examples/dodojo-story-game/hollin-frost/preview/3.jpg" height="240" alt="The Hollin Frost: the yard">
</p>

## Install

With the [skills CLI](https://github.com/vercel-labs/skills):

```bash
npx skills add dodojo-AI/dodojo-skills
```

In Claude Code, as a plugin:

```
/plugin marketplace add dodojo-AI/dodojo-skills
/plugin install dodojo-skills@dodojo-skills
```

Or copy a skill folder, such as `skills/dodojo-travel`, into your agent's skills folder
(`~/.claude/skills/`, `.agents/skills/`, …). Each skill folder is
self-contained.

## With dodojo

Connect your agent to dodojo's MCP server, `https://www.dodojo.ai/api/mcp`
(OAuth, sign in once), or install the [dodojo plugin](https://github.com/dodojo-AI/dodojo-plugin).
The agent in the dodojo desktop app is already connected. Then the skill:

- searches your memories first (for a trip: bookings, saved places, notes
  from earlier trips) and builds on them;
- saves the page as a webpage Note: it shows in your library with the top of
  the page as its cover, opens full height on your phone and computer, draws
  each day's map, and remembers what you tick and where a game stands;
- writes the key facts into the Note's text, so search finds them.

Without dodojo, the page is saved as a local folder (the `.html` and its
photos) that opens in any browser and can be added to dodojo later.

## The gallery

`docs/` is generated, not written by hand:

```bash
npm install          # Playwright, for the screenshot script
npm run build        # node scripts/build-site.mjs
```

For every skill, the build reads the name and description from `SKILL.md`,
the steps from its `## Workflow` list, the files in its folder, and what it
made from `examples/<skill>/<case>/`:

- `index.html` (and its photos): the page, exactly as the skill wrote it;
- `meta.json`: `lang`, the request it was given (`prompt`, `prompt_en`),
  `title`, `title_en`, `inputs` and the date the facts were `checked`;
- `note.md`: `title: …` on the first line, then the Markdown the agent saves
  into the dodojo Note;
- `preview/` (optional): `cover.jpg`, the page's top as dodojo's library shows
  it (400 x 400 CSS px at 2x, light), and `1.jpg`, `2.jpg` … screens of it in
  use at 390 px wide. The gallery's cards and this README show these.

English examples come first. In the gallery each page runs inside
`site-src/dodojo-runtime.js`, a stand-in for dodojo's frame (its palette in
light and dark, `window.dodojo`, `attachment:` files and the `<dodojo-map>`
element), so it looks the way it does in the app. Skills never load that file.

`skills/dodojo-travel/scripts/shoot.mjs <page> <prefix>` takes phone-width
screenshots in light and dark (`--screens` writes one image per screen); that
is how the examples were checked.

## Adding a skill

- One self-contained folder in `skills/` with a `SKILL.md` whose front matter
  has `name` (the folder name), `description` (what it makes and when to use
  it) and `license: MIT`, plus `references/` and `scripts/` as needed.
- A `## Workflow` section near the top: a numbered list of
  `**Step name** - one line`. The gallery draws the skill from it.
- At least one example in `examples/<skill>/<case>/`, made by an agent
  following the skill, with real facts and their sources; English first. Add
  the skill to `site-src/content.json` (display names and Chinese text) and to
  `.claude-plugin/marketplace.json`.

## License

[MIT](LICENSE). Photos in `examples/` keep their own licenses, credited on
each page.
