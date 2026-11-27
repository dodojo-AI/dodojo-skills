# Designing a puzzle page

Work like the editor of a good puzzle page: everything serves the person
thinking. The look comes from where this kind of puzzle lives; it is exact,
quiet and generous with space. No two puzzles should come out looking alike,
and none should look generated.

## Where the puzzle lives

- A number or picture-logic grid: newsprint or a printed booklet, a ruled
  grid with heavier lines on the box edges, clues set like type, a pencil
  for notes and a pen for answers.
- Sliding blocks and box pushing: a wooden tray with blocks of a few woods,
  a felt floor, the exit cut into the frame.
- Merging tiles: enamel or ceramic tiles whose colour deepens with value.
- Paths and pipes: an engineer's drawing, a circuit board, a garden plan.
- Word puzzles: a letterpress block of letters, a crossword in a Sunday
  paper.

Draw the material with restraint: a hint of grain or paper, real line
weights, nothing that competes with the clues.

## Plan it before writing it

Write the plan into the page itself, as the first lines of its `<style>`:

- One line with the layout (strip, puzzle, tools, what is below; what sits
  beside the puzzle on a computer).
- The puzzle's material and the few colours drawn on it: grid lines (thin and
  heavy), given clues, the person's entries, notes, the cursor, conflicts.
  Given clues and the person's entries must look different (weight, colour or
  face), and both differ from notes.
- Page tokens with a light and a dark value: background, surface, text, muted
  text, one accent for the cursor, the tools and the solved mark, a border
  and the text colour on the accent, built on dodojo's tokens (see
  [frame.md](frame.md)).
- Type: numbers and letters in a face with clear, tabular figures, large in
  the cells (about 55-65% of the cell); a text face for the rules. For Chinese
  or Japanese text, the system face with Noto Sans SC or JP as a fallback.
- Compare the plan with what you would make for any other puzzle, revise what
  is generic, then follow it exactly.

## Light and dark

- A paper grid may go dark (light lines and figures on a dark sheet) or stay
  paper, dimmed; a wooden tray stays wood. Decide once and keep the contrast
  of the clues at least as high as in light.
- The cursor, a conflict and a completed region use colours that work on the
  material in both themes.

## Accessibility

- Never colour alone: a conflict also gets a mark (an underline, a slash), a
  completed row a tick at its end.
- Announce the cell under the cursor and its value in an `aria-live` line
  when moving with keys ("Row 3, column 5, empty, notes 2 and 7").
- Cells of at least about 26px on a 360px phone; a larger grid gets a zoom.

## Looks to avoid

Unless the person asks for them: neon on black; a purple-to-blue gradient;
emoji as pieces; a timer that flashes red; confetti at each completed row;
rounded cards with the same shadow on every block; a grid in default grey
1px lines with no hierarchy; a level select as the first screen.
