# The frame a webpage note lives in

dodojo shows the page in a locked sandbox inside a Note. The same file must
also open on its own in any browser. Build around these limits instead of
detecting them.

## Skeleton

```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="dodojo-page-id" content="PAGE-ID">
<title>WHAT THIS PAGE IS</title>
<style>
/* layout: ONE LINE ON THE LAYOUT CONCEPT FOR THIS SUBJECT */
/* The values below are placeholders showing where each token goes.
   Choose every color for the subject; never keep these. */
:root {
  --paper: var(--dodojo-bg, #f5f5f4);
  --panel: var(--dodojo-surface, #ffffff);
  --ink: var(--dodojo-fg, #1c1c1c);
  --soft: var(--dodojo-muted-fg, #5f6061);
  --line: var(--dodojo-border, rgba(28, 28, 28, .12));
  --accent: #345;             /* the subject's own color */
  --accent-ink: #fff;         /* text on the accent */
}
:root[data-dodojo-theme="dark"] {
  --paper: var(--dodojo-bg, #131313);
  --panel: var(--dodojo-surface, #1c1c1c);
  --ink: var(--dodojo-fg, #ececea);
  --soft: var(--dodojo-muted-fg, #a2a3a4);
  --line: var(--dodojo-border, rgba(236, 236, 234, .12));
  --accent: #9ab;
  --accent-ink: #111;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-dodojo-theme]) {
    --paper: #131313; --panel: #1c1c1c; --ink: #ececea; --soft: #a2a3a4;
    --line: rgba(236, 236, 234, .12); --accent: #9ab; --accent-ink: #111;
  }
}
[hidden] { display: none !important; }
img { max-width: 100%; height: auto; }
body { margin: 0; padding: 16px; background: var(--paper); color: var(--ink);
  font-family: var(--dodojo-font-sans, system-ui, -apple-system, "PingFang SC", "Noto Sans SC", sans-serif); }
</style>
</head>
<body>
  <!-- real content here -->
  <script>
  // Outside dodojo, show the attached photos from the folder beside the page.
  if (!window.dodojo) document.querySelectorAll('[src^="attachment:"]').forEach(el => { el.src = el.getAttribute('src').slice(11); });
  </script>
</body>
</html>
```

- `color-scheme` with `dark` tells dodojo the page follows the app's light
  and dark. dodojo then sets `data-dodojo-theme="light"` or `"dark"` on
  `<html>` and supplies its palette as `--dodojo-bg`, `--dodojo-fg`,
  `--dodojo-surface`, `--dodojo-muted`, `--dodojo-muted-fg`,
  `--dodojo-border`, `--dodojo-accent`, `--dodojo-accent-fg`,
  `--dodojo-radius`, `--dodojo-font-sans` and `--dodojo-font-mono`.
- Build neutrals on those variables, always with your own fallback, so the
  page sits naturally in the app and still looks finished on its own. Put the
  subject's accent on top.
- Dark values go twice: under `:root[data-dodojo-theme="dark"]` (inside
  dodojo, which may differ from the system setting) and under
  `prefers-color-scheme: dark` guarded by `:root:not([data-dodojo-theme])`
  (on its own).
- `dodojo-page-id` (letters, numbers, dots, underscores, hyphens) names the
  page's saved state. Keep it when you revise the page.
- The closing script is the only line that cares where the page runs; keep it
  last.

## Rules

- **One self-contained file.** CSS and JavaScript inline. Libraries only from
  cdnjs.cloudflare.com, cdn.jsdelivr.net, unpkg.com, esm.sh,
  cdn.tailwindcss.com or code.jquery.com, pinned to an exact version at least
  two weeks old, loaded before the script that uses them. Stylesheets only from
  those and Google Fonts. Any other host is blocked. Use a library only when it
  does substantial work (a chart, a date library).
- **Pictures are attachments.** Images, video and audio from other websites do
  not load. Download what the page shows, keep it in the folder beside the
  page, and refer to it as `src="attachment:<file name>"`. Never base64-inline
  photos, never hotlink. Give every image alt text and fixed dimensions or an
  `aspect-ratio`, and credit photos you did not take in small text.
- **Nothing live.** No requests except to the CDNs above: no weather, traffic,
  exchange-rate or other APIs. Put the facts in the page with the date you
  checked them, and link to the live source.
- **Nothing that leaves the page.** No iframes, embeds, map widgets, forms that
  submit anywhere, downloads, print, `alert`/`confirm`/`prompt`, `localStorage`
  or `sessionStorage` (they throw inside dodojo), and never set `location`.
- **Remembered state.** Put `data-dodojo-key="<name>"` on an input, textarea,
  select or checkbox and dodojo keeps its value for the Note's owner and puts
  it back when the page opens. A checkbox keeps `true`/`false`; give every
  radio in a group the same key and dodojo keeps the checked one's `value`.
  For anything else (a custom segmented control, a timer's last setting):
  - `window.dodojo?.getState()` returns the saved values at once (an object);
  - `window.dodojo?.setState({ name: value })` saves and returns a Promise
    (keys of letters, digits, `.`, `_`, `:` or `-`; values are strings up to
    4000 characters, numbers, booleans or null; about 32 KB in all);
  - `window` receives a `dodojo-state-change` event, `detail` holding all the
    values, when they change while the page is open (from another device,
    say). Read `getState()` at start and listen for the event as well.
  Outside dodojo `window.dodojo` is undefined and the values last for the
  visit only, so guard every call with `?.`.
- **No device features.** Camera, microphone, location, clipboard, screen
  wake lock and vibration are not available inside dodojo. Do not build on
  them; guard any optional use with `try`.
- **Links.** Ordinary `<a href="https://…">` links with text that says where
  they go. dodojo opens websites in the browser and map links in the Maps app.
  `mailto:`, `tel:`, `javascript:` and relative links open nothing. Link a place
  as `https://www.google.com/maps/search/?api=1&query=<place, city>`.
- **The Note scrolls, not the page.** Size by content: no `100vh`, no
  full-screen layouts, no `position: fixed` or `sticky` (they stick to the top
  of the page, not the screen). Do not repeat the Note's title as a big header;
  dodojo shows it above the page. Start with what the page is for.
- **The first screen is the cover.** The library card shows the top square of
  the page (about 400 × 400 CSS px). Make it worth seeing: a strong image or a
  typographic opening with the key facts, never a blank band, a spinner or a
  "loading" state. Nothing waits at `opacity: 0` for an observer.
- **Text without script.** An app that cannot run scripts shows the page's
  plain text instead, and search reads that text. Keep the content in the HTML
  and use script for behavior. Script may switch what is shown and rewrite
  numbers that depend on input (a calculator's results, a schedule's grams),
  but every step, row and sentence is written in the HTML.
- **Size.** Keep the file well under a few megabytes; photos are separate
  files.
