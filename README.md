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

Or copy `skills/dodojo-travel` into your agent's skills folder
(`~/.claude/skills/`, `.agents/skills/`, …). Each skill folder is
self-contained.

## With dodojo

Connect your agent to dodojo's MCP server, `https://www.dodojo.ai/api/mcp`
(OAuth, sign in once), or install the [dodojo plugin](https://github.com/dodojo-AI/dodojo-plugin).
The agent in the dodojo desktop app is already connected. Then the skill:

- searches your memories first (bookings, saved places, notes from earlier
  trips) and builds on them;
- saves the page as a webpage Note: it shows in your library with the top of
  the page as its cover, opens full height on your phone and computer, draws
  each day's map, and remembers what you tick;
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
  into the dodojo Note.

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
