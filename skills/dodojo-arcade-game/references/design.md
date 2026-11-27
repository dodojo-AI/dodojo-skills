# Designing an arcade game page

Work like the art director of a small action game: one graphic idea, held
with discipline, so the scene reads at a glance at full speed on a small
phone. No two games should come out looking alike, and none should look
generated.

## One graphic idea, from the setting

- Start from the setting chosen with the verb: an echo-lit cave, a lagoon
  under a fruit tree, a rain-dark street with a paper boat, a night sky over
  rooftops.
- Choose one way of drawing it and hold it everywhere:
  - **silhouette**: dark shapes on a lit gradient, the hazards darker still;
  - **flat cut paper**: a few layered flat colours with a soft drop shadow;
  - **line on dark**: the world drawn as lines that light up, as by sonar or
    a torch;
  - **printed**: a risograph look with two or three inks and grain;
  - **pixel**: a small, honest pixel grid at a fixed scale, never blurred.
- Depth through layers that move at different speeds (parallax), not through
  detail.

## Plan it before writing it

Write the plan into the page itself, as the first lines of its `<style>`:

- One line with the layout (the playfield and its aspect ratio, the row
  under it, what is below).
- The scene's palette, fixed by the setting and the same in both themes:
  three to five colours, with one colour reserved for the player, one for
  danger and one for reward, so the eye sorts them instantly.
- Page tokens with a light and a dark value: background, surface, text, muted
  text, one accent for the controls, a border and the text colour on the
  accent, built on dodojo's tokens (see [frame.md](frame.md)).
- Type: a utility face with tabular figures for the score; a display face for
  the result at most. For Chinese or Japanese text, the system face with Noto
  Sans SC or JP as a fallback.
- Compare the plan with what you would make for any other action game,
  revise what is generic, then follow it exactly.

## Readable at speed

- Silhouettes a glance can tell apart: the player, a hazard and a pickup
  differ in shape, not only colour (a round fruit, a jagged rock).
- Contrast between moving things and the background is higher than between
  background layers.
- Motion of the background never competes with hazards: slower, lower
  contrast, fewer edges.
- The score is small and in a corner, out of the path of play.

## Light and dark

- The playfield is a scene and keeps its own colours in both themes (a night
  cave stays dark in light mode); only the page around it follows dodojo's
  theme.
- The row under the playfield and the reading below use the page's tokens.

## Accessibility

- Never colour alone for danger or reward; shape and motion carry it too.
- `prefers-reduced-motion`: no shake, no flashes, gentler parallax; the game
  plays the same.
- A setting for a slower speed where the game allows it, named plainly
  ("Relaxed").
- Name the result in an `aria-live` line when a run ends.

## Looks to avoid

Unless the person asks for them: neon on black with glow on everything; a
purple-to-blue gradient sky; emoji as the player or the hazards; clip-art
sprites from different styles; screen shake on every point; a "GAME OVER"
banner in a red pixel font; a title splash with a "PLAY" button before the
scene.
