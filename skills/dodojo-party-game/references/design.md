# Designing a party game page

Work like the props department of a game show: the page looks like the
object the game could have been played with, built to be read across a noisy
room. No two party games should come out looking alike, and none should look
generated.

## The prop

Ask what this game would be if it were a thing on the table, and draw that:

- a guessing game with a clock: a stack of index cards and a glass hourglass;
- a drawing game: a school blackboard with coloured chalk and a sponge;
- a push-your-luck number game: a bomb box with a seven-segment readout, a
  fuse that chars and a rubber keypad;
- a reflex game: a quiz-show buzzer console with a split-flap board and an
  enamel button per player;
- drawing lots: a bamboo cup of fortune sticks on rice paper, with a seal for
  each finger;
- a hidden-role game: sealed envelopes, a ballot box, a dossier.

Pick materials the players will recognise, and draw them with care: grain,
wear, a printed edge, the way chalk skips. The prop holds the play area; the
page around it stays quiet and follows dodojo's theme.

## Plan it before writing it

Write the plan into the page itself, as the first lines of its `<style>`:

- One line with the layout (what is on top, what is below, what moves beside
  the play area on a computer).
- The prop's materials and the few colours printed on it. These are fixed by
  the material, not by the theme (an index card stays paper-white in dark
  mode, dimmed a little).
- The players' colours: up to ten that tell apart on the prop and on the page,
  each paired with a number or a shape, each a step brighter in dark mode.
- Page tokens with a light and a dark value: background, surface, text, muted
  text, one accent for the main button and focus, a border and the text
  colour on the accent, built on dodojo's tokens (see [frame.md](frame.md)).
- Type: one face that reads at a distance for the big word (a condensed sans
  for long English words, a heavy weight for Chinese and Japanese), a utility
  face with tabular figures for scores and time. For Chinese and Japanese use
  the system faces (PingFang SC, Hiragino Sans) with Noto Sans SC or JP as a
  fallback; ask Google Fonts only for a Latin display face.
- Compare the plan with what you would make for any other party game, revise
  what is generic, then follow it exactly.

## Reading at a distance

- The big word is fitted to the play area's width (measure it and scale the
  font size down, from 96px to no less than 36px) instead of wrapping.
- High contrast on the prop: dark ink on light card, light chalk on dark
  board. Avoid thin weights, outlined text and text over busy texture.
- Player colours are saturated enough to tell apart in dim light and are
  never the only cue.

## Light and dark

- The prop keeps its material in dark mode: card stays card, the blackboard
  stays slate, a little dimmer. Only the page around it goes dark.
- Check every player's colour on the prop and on the page in both themes.

## Accessibility

- Name whose turn it is and the result in an `aria-live` status line.
- Pads and buttons at least 44px, the main button 56px; visible focus.
- Everything the page says aloud with sound is also said on screen.

## Looks to avoid

Unless the group asks for them: neon on black with glow on everything;
confetti on every point; cartoon emoji as players or prompts; a purple
gradient with a party-popper; a big "LET'S PLAY!" splash before the game;
rounded cards with the same shadow on every block; tiny text a player must
lean in to read.
