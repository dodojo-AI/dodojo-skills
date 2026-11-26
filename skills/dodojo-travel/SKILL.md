---
name: dodojo-travel
description: Plan a trip, a day out, a road trip or a food crawl as a webpage the person follows on the road - opening hours, closures, tickets and transport checked for the actual dates, a route that does not backtrack, weather, real photos, a map with numbered stops and Google Maps links, and a look that comes from the place - saved into dodojo as a webpage Note, or as a standalone .html file. Use for itineraries, city or day plans, weekend getaways and outings, including 旅行攻略, 行程, 一日游 and 自驾.
license: MIT
---

# dodojo-travel

A trip page is a tool for the road: it must be right, quick to read on a
phone in the sun, and show where to go next. Its look comes from the place.
Nothing here is a layout to copy.

It is one self-contained `.html` file. In [dodojo](https://www.dodojo.ai) it is
shown inside a Note, full height, and the top of the page becomes the Note's
cover in the person's library; outside dodojo the same file opens in any
browser.

## Workflow

1. **Start from what is known** - search the person's dodojo memories for bookings, saved places and earlier trips, then pin down dates, base, party and pace.
2. **Check every place for the actual dates** - hours, closures, holidays, tickets, transport, light and weather, each with its source and the date checked.
3. **Plan routes that work** - cluster each day by area, timed entries first, three to five stops, buffers and a rain plan.
4. **Find real photos** - one per key place, downloaded from Wikimedia Commons, kept beside the page and credited.
5. **Design from the place** - colors, type and details taken from the destination, written as a plan before any layout.
6. **Build the page for the road** - an orienting first screen, then each day's map, a card per stop, food, a checklist and totals, in one file.
7. **Check and save** - phone width in both themes, every link and total checked, then saved as a dodojo Note with the key facts in Markdown.

## 1. Start from what is known

- With the dodojo connector, search the person's memories for this trip first
  (`search_memories`): bookings, saved places, notes from earlier trips, the
  hotel. Build on them and say which you used. Mark places they saved with
  `saved` on the map.
- The facts that change the plan: dates, where they stay (the base every day
  starts from), who is travelling (children, older people, anyone with limited
  mobility), pace, budget, car or no car, interests and anything to avoid. If
  the dates or the base are unknown and matter, ask once, briefly. Otherwise
  state your assumptions at the top of the page.

## 2. Check every place for the actual dates

Follow [references/research.md](references/research.md). For every place and
every leg, write down what you found with the source link and the date you
checked. Never present a guess as a checked fact; the page cannot fetch
anything live, so what you write is what the person will rely on.

## 3. Plan routes that work

- Cluster each day by area and order the stops so the day moves in one
  direction, without backtracking. Put timed entries first and plan around
  them. Put viewpoints at their best light (sunset spots at sunset).
- Three to five main stops a day; add buffers for meals, rest and getting lost
  (about a quarter of the travel time). The first and last day stay light
  around flights and check-in.
- Road trips: at most about three to four hours of driving a day, with fuel or
  charging, food and rest stops named, and the scenic stretches in daylight.
- With children or limited mobility: shorter walks, restrooms, places to sit,
  step-free routes, earlier evenings.
- Give each day a fallback for rain or a closure.

## 4. Find real photos

A real photo for each key place, downloaded (Wikimedia Commons first, or the
place's own press images) with a generic client name in the User-Agent and
nothing about the person in the request. Commons rate-limits quickly (HTTP
429): search once per place, and download its 1280px thumbnail rather than
the original. Pick photos of the season when you can. Keep the files beside
the page, show them with `src="attachment:<file name>"` and credit each in
small text (author, license). No stock-looking or generated pictures unless
the person asks.

## 5. Design from the place

Follow [references/design.md](references/design.md): an editorial treatment
with a tool's discipline, an identity taken from the destination (its light,
materials, signage, maps and printed matter), a written plan of color tokens
and type roles, and the looks to avoid. A coastal drive, a temple city and a
winter capital should not share a palette or a typeface. Use the place's own
conventions as content: its units (with the other system in small text if
the person uses it), its date and time format, its currency, the real names of
its transit lines and their colors where the operator uses them on its own
maps, signs or timetables (never guess a color). Write prices, times and dates
the way the place writes them, even when the page is in another language.

## 6. Build the page for the road

Choose the parts the trip needs; not every page has all of them, and their
look is yours to design.

- **An opening that orients**: dates, base, the days at a glance, the weather
  (the forecast when the trip is within about ten days, otherwise the usual
  weather for the place and month, labelled as such), what must be booked. It
  is also the Note's cover.
- **One section per day**, in order: its theme in a line, then the day's map,
  then the stops.
- **The day's places on a map**: one `<dodojo-map>` per day, written exactly as
  [references/map.md](references/map.md) says; a day that rides between areas
  far apart (old town in the morning, a waterfront district in the afternoon)
  gets one map per area, in order, so its pins stay readable. dodojo draws the map, numbered
  pins, the route line, a button that opens the whole day in the Maps app, and
  the stops as a timeline under it (time, name, a short plain-text detail, a
  small photo). So do not repeat the schedule in a table. Never draw your own
  map or embed one.
- **A card per stop** under the map, in the same order and numbering, for what
  the timeline cannot hold: why it is worth it, how long to spend, its ticket
  status as a clear marker (free, buy ahead, timed entry, closed that day), the
  price, the official link, a Google Maps link, one practical tip and, for the
  key places, a large photo. The legs between stops (mode, time, a directions link) sit between
  the cards.
- **Food** near the route, with what to order and whether to book.
- **A checklist** the person ticks on the road (tickets bought, restaurants
  booked, passports, chargers), kept with `data-dodojo-key`.
- **Practical notes**: transit cards or apps, tipping, plugs, emergency
  numbers and the hotel's address written out as text (calls and emails cannot
  be started from the page). When you do not know the address, leave a field
  for it (`data-dodojo-key`) rather than guess.
- **Totals that add up**: ticket and transport costs per day and for the trip,
  in the local currency.

Write it as one self-contained file inside the rules of
[references/frame.md](references/frame.md) (the page skeleton, pictures as
`attachment:` files, no network requests or embeds, remembered state, links,
sizing, the first screen as the cover) and
[references/fundamentals.md](references/fundamentals.md) (theme, phone-first
layout, type, spacing, interaction, copy and sources).

## 7. Check and save

- Look at the page as the person will, at 360 and 390px wide in both themes:
  `preview_webpage` in the dodojo desktop app, otherwise
  `node <this skill's folder>/scripts/shoot.mjs <page.html> <prefix> --width 360 --screens`
  (it needs Playwright) and open the images. Outside dodojo the map is not
  drawn and its stops show as the fallback list; that is expected.
- Check that today's plan is easy to find, every stop has a working map link,
  times and costs add up, closures on the travel dates are flagged, nothing
  overflows or scrolls sideways, both themes read well, and the first screen
  makes a good cover. Use every control once (tabs, the checklist). Fix what
  you find, then look again at what you changed.
- Save it as [references/save-to-dodojo.md](references/save-to-dodojo.md)
  describes: the page and its photos attached to one Note, with the dates, the
  base, one line per day (for a single day, one line per stop), the bookings
  and the key links in the Note's Markdown body. Without the dodojo connector,
  write the folder (the `.html` and its photos side by side) and tell the
  person where it is.
- To revise a trip page, keep its `dodojo-page-id` and `data-dodojo-key` names
  and update the same Note.
