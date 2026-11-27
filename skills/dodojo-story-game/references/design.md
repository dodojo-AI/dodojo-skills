# Designing a story game page

Work like the designer of a beautiful printed game book: the page looks like
an object from the story's world, and the text is a pleasure to read on a
small phone at night. No two stories should come out looking alike, and none
should look generated.

## An object from the story's world

- A mystery: a police case file (manila folder, typed statements, a paper
  clip, a stamped date), a newspaper's evening edition, an insurer's report.
- An escape room: the room itself, drawn as a flat isometric or front view
  with the things to examine as clear shapes.
- A sea or travel story: a ship's log, a field notebook with pencil sketches,
  a passport with stamps.
- A personal quest: the couple's own photos as prints with handwritten
  captions, a map of the places in order.
- A text adventure: a terminal of its period, a typewritten page, a
  hand-drawn map that fills in as places are visited.

Draw documents as documents: type set like the original (a typewriter face
for a statement, a stamp in red ink), with real paper edges, not a generic
card.

## Plan it before writing it

Write the plan into the page itself, as the first lines of its `<style>`:

- One line with the layout (the strip, the scene, the choices, the journal;
  what sits beside the scene on a computer).
- The object's materials and the few colours printed on it (paper, ink,
  stamp, highlight for a found clue). These are fixed by the material; in
  dark mode paper may dim rather than turn black.
- Page tokens with a light and a dark value: background, surface, text, muted
  text, one accent for choices and focus, a border and the text colour on the
  accent, built on dodojo's tokens (see [frame.md](frame.md)).
- Type: a reading face for the scene text, comfortable at 17-18px (a book
  serif or a humanist sans); one period face for documents (a typewriter, a
  newspaper's); tabular figures for codes. For Chinese or Japanese, Noto
  Serif or Sans SC or JP from Google Fonts with a system fallback.
- Compare the plan with what you would make for any other story, revise what
  is generic, then follow it exactly.

## Pictures

- Attached photos (the person's own, or Wikimedia Commons, credited) or
  drawings made in SVG in the page. Never images from other websites.
- A picture per chapter or per key scene, not per scene; text carries most
  scenes.
- A clue in a picture is described for screen readers in the drawing's
  `<title>` or `aria-label`. When reading the picture is the puzzle (a chart,
  a clock face), the description says what the picture shows, not the
  answer; otherwise the clue is also in the text nearby.

## Accessibility

- Choices are real buttons, in reading order, with visible focus.
- The new scene's heading takes focus after a choice, so screen readers read
  it.
- A text size setting (normal, large) that is remembered.

## Looks to avoid

Unless the person asks for them: parchment textures with a medieval script;
neon on black "hacker" screens; a purple-to-blue gradient; emoji as
characters or objects; choices as rounded pills with the same shadow; a big
title splash with "Begin your adventure"; red "WRONG!" on a mistaken answer.
