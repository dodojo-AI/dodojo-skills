# Designing a game page

Work like the art director of a small game studio: the page gets a look
that comes from the game itself, at the care a game people come back to
deserves. No two games should come out looking alike, and none should look
generated.

## The treatment

A game is used and often shared, so it gets an opinionated look with a
tool's discipline: one real aesthetic risk where it serves the game, while
the state of play stays readable at a glance on a small phone. When the two
pull apart, readability wins.

## The identity, from the game's world

- Look at where the game comes from: its board and pieces (kaya wood, slate
  and clamshell stones, green baize, enamel tiles, a printed puzzle grid), its
  printed matter (game records, score sheets, rule booklets), its terms and
  customs.
- Choose the direction by kind:
  - **Board and card games**: real materials drawn with care. Wood grain, a
    soft highlight and shadow on each stone, stones that sit a little
    irregularly on their points, card stock with a printed edge. It should
    feel like the object, not clip art.
  - **Arcade and reflex games**: one strong graphic style, a small palette,
    shapes readable at a glance at speed, motion that carries weight.
  - **Puzzles**: calm and exact, large numbers or symbols, generous spacing,
    nothing that competes with thinking.
  - **Party games around one phone**: big type readable from across a table,
    one bold colour per player or team.
- Put at least one detail only this game would have into the page as content:
  its real terms in the rules, its notation in the status line (a move as
  "H8"), its customs in how a match is counted.

## Plan it before writing it

Write the plan into the page itself, as the first lines of its `<style>`:

- A one-line comment with the layout concept (what is on top, what is below).
- The materials of the play area, and the two or three colours drawn on it
  (lines, marks, highlights). These are fixed by the material, not by the
  theme.
- Colour tokens for the page around it: background, surface, text, muted
  text, one accent for controls and whose turn it is, a border and the text
  colour on the accent, each with a light and a dark value (see
  [frame.md](frame.md)). Build the neutrals on dodojo's own tokens so the page
  sits in the app.
- Type: a utility face with tabular figures for the status strip; a display
  face only for one moment (the result), if at all. For Chinese or Japanese,
  Noto Sans or Serif SC, TC or JP from Google Fonts with a system fallback; ask
  Google Fonts for only the characters you use (`&text=`) when the face is for
  a few words.
- Before building, compare the plan with what you would produce for any
  other game. Revise what is generic, then follow it exactly.

## Light and dark

- The play area keeps its material in dark mode: wood stays wood, a little
  dimmer, felt stays felt. Only the page around it goes dark.
- Pieces must read at a glance on both: check a black piece on a dark board
  and a white piece on a light one.
- Marks drawn on the board (the last move, a winning line, a hint) use one
  colour that works on the material in both themes.

## Accessibility

- Never let colour alone tell players or pieces apart: add a shape, a mark or
  a label. Name whose turn it is in an `aria-live` status line.
- The smallest target on a 360px phone is about 22px; a game that needs more
  cells than that gets a smaller board on phones or a zoom.
- Visible focus on the play area and every control.

## Looks to avoid

Unless the person asks for them: neon on black with glow on everything; a
purple-to-blue gradient background; emoji as pieces or section markers;
flat clip-art boards with default grey lines; cartoon confetti and "Great
job!" on every move; warm cream with a serif display and a terracotta accent;
everything centered in rounded cards with the same shadow; a big "START"
splash before the game.
