# What to check, for the actual dates

For every place and every leg, check and write down, with the source link and
the date you checked:

- **Opening hours and closure days** on those dates, including public holidays
  (a museum closed on Mondays, a park shut on Thanksgiving, a market only on
  Saturdays), seasonal hours and closures, and last entry.
- **Tickets**: free, pay at the door, buy ahead, or timed entry; the price for
  this party in the local currency; the official booking link (not a
  reseller), and how far ahead it sells out.
- **Getting there**: mode, realistic time and distance from the previous stop
  (Google Maps' estimate plus a buffer), the line or road by its local name and
  color, parking and its cost, walking distance from the station.
- **Light and weather**: sunrise and sunset for the date and place when a stop
  depends on light; the forecast when the trip is within about ten days,
  otherwise the usual weather for that place and month, labelled as such, with
  the source.
- **Local rules and events** that matter: reservations for restaurants that
  need them, dress codes, road closures, festivals, strikes.

Prefer the place's own website and official tourism or transit sites. When
two sources disagree, use the official one and say so. When a fact comes only
from a secondary site (common for small restaurants), say so next to it
("from a travel site; check on the day"). When you cannot find a fact (a line
color, a price), leave it out rather than guess. Information that
changes after you write it (opening hours, traffic, weather) says when it was
checked and links to the live source; traffic is the Google Maps directions
link, which shows it live.

## Links

- A place: `https://www.google.com/maps/search/?api=1&query=<place, city>`
- A leg: `https://www.google.com/maps/dir/?api=1&origin=<from>&destination=<to>&travelmode=<walking|transit|driving>`
- A day, or one area of it: the same, with `&waypoints=<stop>%7C<stop>` for
  up to nine stops in between, and the `travelmode` of how it moves (a day
  that rides between areas gets one link per area).

URL-encode the place names, and write the `|` between waypoints as `%7C`.
These open in the Maps app on a phone.
