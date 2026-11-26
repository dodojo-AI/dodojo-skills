# The `<dodojo-map>` element

To show places on a map (a trip day, an outing, places to eat or stay), write
one `<dodojo-stop>` per stop inside `<dodojo-map>`, in order, with accurate
coordinates:

```html
<dodojo-map route forecast="2026-11-24">
  <dodojo-stop lat="35.1428" lng="-120.6413" time="10:30" name="Pismo Beach"
    place="Pismo Beach Pier, CA" weather="sunny" high="66" low="48"
    sunset="16:52">Walk the pier
    <img src="attachment:pismo.jpg" alt="Pismo Beach Pier"></dodojo-stop>
  <dodojo-stop time="11:15">Drive south</dodojo-stop>
  <dodojo-stop lat="34.5958" lng="-120.1376" time="12:30" name="Solvang"
    place="Solvang, CA" saved>Lunch</dodojo-stop>
</dodojo-map>
```

dodojo draws it as a map with numbered pins, a dashed line through them in
order, a button that opens the whole route in the Maps app and Directions on
each pin, and lists the stops as a timeline under the map (time, number, name,
detail, photo, weather). So do not repeat the stops in a table.

## Attributes

On `<dodojo-map>`:

- `route`: the stops are a sequence; draw the line and offer the full route.
  Leave it out for places with no order (restaurants nearby, hotels to choose
  from).
- `mode="walking"`, `mode="transit"` or `mode="bicycling"` when the day is
  not driven: the day's main way of moving between its pins (it sets the
  travel mode of the full route and of each pin's Directions). A bus or train
  from the base inside a walking day is a step without coordinates.
- `forecast="YYYY-MM-DD"`: the date you checked the forecast on the stops.
- `list="none"` hides the timeline (rarely wanted).

On `<dodojo-stop>`:

- `lat`, `lng`: accurate coordinates. A stop without them is a timeline step
  only (a bus, a train, a break), with just `time` and text; it gets no pin
  and is not part of the full route.
- `name`: the place's name; `place`: what Google Maps should search for, in
  the form Google Maps lists it (local script is fine: "清水寺, 京都"); `time`:
  when to be there.
- `saved`: a place the person already saved in dodojo; its pin takes the
  accent color.
- A forecast, when the trip is within about ten days: `weather` (sunny,
  partly-cloudy, cloudy, fog, rain, showers, storm, snow or wind), `high`,
  `low`, `rain` (percent), with `forecast` on the map. Further out, leave
  these and `forecast` off and give the usual weather in the page's opening,
  labelled as such. `sunset` (`16:52`) may go on the stop it matters for
  either way.
- The text inside is the stop's detail, shown as short plain text: links,
  chips and other markup inside a stop are reduced to their text. One
  `<img src="attachment:…">` inside is its photo, shown small. Put everything
  else about a stop in its card below the map.

One map per day, with at most 11 stops that have coordinates (Google Maps
takes nine between the first and the last); steps without coordinates do not
count. When the day rides between areas far apart, give each area its own map
instead, in order, each with its own `mode`, and put the ride as a step
without coordinates at the end of one map or the start of the next: one map
stretched over both zooms out until the pins pile up, and its full route
would walk the ride. Pins are numbered from 1 on each map; number the stop
cards the same way.

## Fallback

Outside dodojo, or in an older dodojo app, the element is not drawn. Put this
in the page's `<head>` so the stops still read as a list with small photos:

```html
<style>dodojo-stop{display:block;margin:.5em 0}dodojo-stop::before{content:attr(time) ' ' attr(name) ' ';font-weight:600}dodojo-stop img{display:block;width:96px;height:72px;object-fit:cover;border-radius:8px}</style>
```

Never load a map library or tiles yourself, set `location`, or embed an
iframe or another map widget: they are removed or go nowhere.
