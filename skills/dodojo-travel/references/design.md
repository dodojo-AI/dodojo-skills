# Designing a trip page

Work like the design lead of a small studio: the page gets a visual identity
that comes from the place, at the level of care a trip deserves. No two
destinations should come out looking alike, and none should look generated.

## The treatment

A trip page is something the person will use on the road and often share, so
it gets an editorial treatment with a tool's discipline: an opinionated look
and one real aesthetic risk where it serves the place, but today's plan,
times, prices and links stay quick to read on a phone in the sun. When the two
pull apart, legibility wins.

## The identity, from the place

- Look at the place's own world: its light and season, its materials (stone,
  tile, timber, paper, concrete), its signage and transit maps, its printed
  matter (tickets, menus, timetables).
- Put at least one detail only this place would have into the page as
  content, not ornament: the real names of its transit lines (with their
  colors where the operator publishes them), its units, date and time format
  and currency, a word of the local language where it helps.
- Use real content throughout: real photos of the places, real times and
  prices. Never lorem ipsum, never "Coming soon", never placeholder images.

## Plan it before writing it

Write the plan into the page itself, as the first lines of its `<style>`:

- A one-line comment with the layout concept.
- Color: 4-6 named tokens for this place (background, surface, text, muted
  text, one accent, at most one second accent), plus a border and the text
  color on the accent, each with a light and a dark value (see
  [frame.md](frame.md) for where each goes). Neutrals carry a slight tint from
  the place's materials or toward the accent; pure mid-grey looks unconsidered.
- Type: a display face used with restraint and a body face that pairs with it,
  plus a utility face for times and prices if needed. Google Fonts is allowed
  (for Chinese or Japanese text pair with Noto Sans/Serif SC, TC or JP and
  always give a system fallback stack). When nothing in the place calls for a
  face, `var(--dodojo-font-sans, system-ui)` is a fine body face.
- Before building, compare the plan with what you would produce for any other
  city. Revise any part that is generic, then follow the plan exactly. Do not
  describe the plan to the person; one plain sentence about the direction at
  most.

## Looks to avoid

Unless the person asks for them: warm cream with a serif display and a
terracotta accent; near-black with one acid-green or vermilion pop; broadsheet
hairline rules with dense columns; a purple-to-blue gradient hero; emoji as
section markers; everything centered; the same rounded card and shadow on every
block; a colored bar down the side of rounded cards; big-number tiles that are
not the point of the page; a travel-brochure look (stock sunset, script
fonts, "wanderlust" copy).
