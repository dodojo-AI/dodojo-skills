/*
 * A stand-in for dodojo's webpage frame, used only by this repository's
 * gallery so the examples look the way they do inside dodojo: the app's
 * palette as --dodojo-* variables, light and dark, window.dodojo,
 * attachment: files, links that open outside, and the <dodojo-map> element
 * (whose code below is dodojo's own, from its web-note runtime). Skills never
 * load this file; a page made by a skill works without it.
 */
(() => {
  "use strict";
  const params = new URLSearchParams(location.search);
  const PALETTE = {
    light: { bg: "#ffffff", fg: "#1c1a17", surface: "#faf8f5", muted: "#f3f0eb", "muted-fg": "#6f675f", border: "rgb(28 26 23 / 10%)", accent: "#8a6a3e", "accent-fg": "#ffffff" },
    dark: { bg: "#0e0d0c", fg: "#ede7df", surface: "#1a1816", muted: "#1f1c19", "muted-fg": "#9a9187", border: "rgb(237 231 223 / 10%)", accent: "#d2b48c", "accent-fg": "#17130f" },
  };
  const SHARED = { radius: "0.75rem", "font-sans": '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", system-ui, sans-serif', "font-mono": 'ui-monospace, "SF Mono", Menlo, monospace' };
  const config = {
    capture: false,
    get themeAware() {
      return /\bdark\b/i.test(document.querySelector('meta[name="color-scheme"]')?.getAttribute("content") || "");
    },
  };
  const settling = new Set();
  const theme = { scheme: params.get("theme") === "dark" ? "dark" : "light" };
  const themeStyle = document.createElement("style");
  themeStyle.id = "dodojo-theme";
  document.documentElement.prepend(themeStyle);
  const applyTheme = scheme => {
    theme.scheme = scheme === "dark" ? "dark" : "light";
    const tokens = { ...PALETTE[theme.scheme], ...SHARED };
    themeStyle.textContent = ":root{" + Object.entries(tokens).map(([name, value]) => "--dodojo-" + name + ":" + value).join(";") + "}"
      + (config.themeAware ? ":where(html){color-scheme:" + theme.scheme + "}" : "");
    document.documentElement.setAttribute("data-dodojo-theme", theme.scheme);
  };
  applyTheme(theme.scheme);
  document.addEventListener("DOMContentLoaded", () => applyTheme(theme.scheme), { once: true });
  window.addEventListener("message", event => {
    if (event.source !== window.parent || event.data?.type !== "dodojo-theme") return;
    applyTheme(event.data.scheme);
    window.dispatchEvent(new CustomEvent("dodojo-theme-change", { detail: { ...theme } }));
  });

  // Remembered state: kept for this visit only.
  let state = Object.create(null);
  Object.defineProperty(window, "dodojo", {
    value: Object.freeze({
      getState: () => ({ ...state }),
      setState(patch) {
        if (!patch || typeof patch !== "object") return Promise.reject(new Error("Invalid state"));
        state = Object.assign(Object.create(null), state, patch);
        return Promise.resolve();
      },
      writable: true,
      get theme() { return { ...theme }; },
      attachments: Object.freeze([]),
      attachmentUrl: name => Promise.resolve(String(name)),
    }),
  });
  const remember = event => {
    const element = event.target?.closest?.("[data-dodojo-key]");
    if (!element) return;
    if (element.type === "radio" && !element.checked) return;
    state[element.getAttribute("data-dodojo-key")] = element.type === "checkbox" ? element.checked : element.value;
  };
  document.addEventListener("input", remember, true);
  document.addEventListener("change", remember, true);

  // attachment:<file name> is a file kept beside the page.
  const SCHEME = /^\s*attachment:/i;
  const adopt = element => {
    for (const attribute of ["src", "poster", "data-dodojo-src", "data-dodojo-poster"]) {
      const value = element.getAttribute?.(attribute);
      if (!value || !SCHEME.test(value)) continue;
      const target = attribute.replace("data-dodojo-", "");
      element.setAttribute(target, value.replace(SCHEME, "").trim());
      if (target !== attribute) element.removeAttribute(attribute);
    }
  };
  const adoptAll = root => {
    if (root.nodeType !== 1) return;
    adopt(root);
    root.querySelectorAll("[src],[poster],[data-dodojo-src],[data-dodojo-poster]").forEach(adopt);
  };
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === "attributes") adopt(record.target);
      else record.addedNodes.forEach(adoptAll);
    }
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["src", "poster", "data-dodojo-src", "data-dodojo-poster"] });

  // Links open outside the page; the frame itself never navigates.
  document.addEventListener("click", event => {
    const link = event.target?.closest?.("a[href]");
    if (!link) return;
    event.preventDefault();
    const href = link.getAttribute("href") || "";
    if (/^https?:\/\//i.test(href)) window.open(href, "_blank", "noopener");
  }, true);
  document.addEventListener("submit", event => event.preventDefault(), true);

    // <dodojo-map> (owner, 2026-11-24, of ChatGPT's trip map: «你看看 chatgpt
    // 这种可视化多好»). A page lists its places as <dodojo-stop lat lng name
    // time> and dodojo draws them the same way whichever AI wrote it: a map
    // with numbered pins (with `route`, a dashed line through them in order
    // and a button that opens the whole route in the Maps app) and the stops
    // as a timeline under it. A stop with no lat/lng is a timeline step only.
    // MapLibre loads from the CDN only for a page that has a map, its tiles
    // from OpenFreeMap; without them (offline, no WebGL) the timeline stays.
    const MAP_LIBRARY = "https://cdn.jsdelivr.net/npm/maplibre-gl@5.24.0/dist/maplibre-gl";
    const MAP_STYLES = { light: "https://tiles.openfreemap.org/styles/liberty", dark: "https://tiles.openfreemap.org/styles/dark" };
    const MAP_WORDS = {
      en: { route: "Full route", go: "Directions", saved: "Saved", map: "Map", rain: "Rain", sunset: "Sunset", forecast: "Weather as forecast on {date}", touch: "Use two fingers to move the map", mac: "Use ⌘ + scroll to zoom the map", windows: "Use Ctrl + scroll to zoom the map" },
      zh: { route: "全程导航", go: "导航", saved: "你存过", map: "地图", rain: "降雨", sunset: "日落", forecast: "天气为 {date} 查到的预报", touch: "用两根手指移动地图", mac: "按住 ⌘ 滚动来缩放地图", windows: "按住 Ctrl 滚动来缩放地图" },
      "zh-hant": { route: "全程導航", go: "導航", saved: "你存過", map: "地圖", rain: "降雨", sunset: "日落", forecast: "天氣為 {date} 查到的預報", touch: "用兩根手指移動地圖", mac: "按住 ⌘ 捲動來縮放地圖", windows: "按住 Ctrl 捲動來縮放地圖" },
      ja: { route: "全ルートを案内", go: "経路", saved: "保存済み", map: "地図", rain: "降水", sunset: "日の入り", forecast: "{date} 時点の天気予報", touch: "2 本の指で地図を動かします", mac: "⌘ を押しながらスクロールで拡大・縮小", windows: "Ctrl を押しながらスクロールで拡大・縮小" },
    };
    const mapLanguage = () => {
      const lang = String(document.documentElement.lang || navigator.language || "en").toLowerCase();
      if (lang.startsWith("zh")) return /hant|-(tw|hk|mo)\b/.test(lang) ? "zh-hant" : "zh";
      return lang.startsWith("ja") ? "ja" : lang.split("-")[0] || "en";
    };
    let mapLibrary = null;
    const loadMapLibrary = () => mapLibrary || (mapLibrary = new Promise((resolve, reject) => {
      if (window.maplibregl?.Map) return resolve(window.maplibregl);
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = MAP_LIBRARY + ".css";
      document.head.prepend(style);
      const script = document.createElement("script");
      script.src = MAP_LIBRARY + ".js";
      script.onload = () => (window.maplibregl?.Map ? resolve(window.maplibregl) : reject(new Error("No map library")));
      script.onerror = () => reject(new Error("The map library did not load"));
      document.head.append(script);
    }));
    let mapStylesAdded = false;
    const addMapStyles = () => {
      if (mapStylesAdded) return;
      mapStylesAdded = true;
      const style = document.createElement("style");
      // Scoped under .dm so a page's own button, list or link rules do not
      // reach in; a page that means to restyle the map can still be more
      // specific.
      style.textContent = ":where(dodojo-map){display:block;margin:16px 0}dodojo-map[data-dodojo-map] dodojo-stop{display:none}"
        + ".dm{--dm-bg:#fff;--dm-fg:#1d1d1f;--dm-muted:#6e6e73;--dm-border:rgba(0,0,0,.1);--dm-surface:#ecebe6;--dm-accent:#8a6a3e;--dm-accent-fg:#fff;color:var(--dm-fg)}"
        + ".dm.dm-aware{--dm-bg:var(--dodojo-bg,#fff);--dm-fg:var(--dodojo-fg,#1d1d1f);--dm-muted:var(--dodojo-muted-fg,#6e6e73);--dm-border:var(--dodojo-border,rgba(0,0,0,.1));--dm-surface:var(--dodojo-surface,#ecebe6);--dm-accent:var(--dodojo-accent,#8a6a3e);--dm-accent-fg:var(--dodojo-accent-fg,#fff)}"
        + ".dm .dm-wrap{position:relative;overflow:hidden;margin:0;border-radius:var(--dodojo-radius,14px);border:1px solid var(--dm-border);background:var(--dm-surface)}"
        + ".dm .dm-frame{width:100%;aspect-ratio:1/1;max-height:460px}@media(min-width:640px){.dm .dm-frame{aspect-ratio:16/10}}"
        + ".dm .dm-route{position:absolute;z-index:2;top:10px;right:10px;margin:0;padding:7px 13px;border-radius:999px;background:var(--dm-bg);color:var(--dm-fg);font-weight:600;font-size:13px;line-height:1.25;text-decoration:none;box-shadow:0 1px 5px rgba(0,0,0,.28)}"
        + ".dm .dm-route.dm-route-plain{position:static;display:inline-block;margin:0 0 4px}"
        + ".dm .dm-pin{box-sizing:border-box;width:30px;height:30px;margin:0;padding:0;border-radius:50%;border:2px solid #1d1d1f;background:#fff;color:#1d1d1f;font:700 13px/26px var(--dodojo-font-sans,system-ui,sans-serif);text-align:center;cursor:pointer;box-shadow:0 1px 5px rgba(0,0,0,.35)}"
        // WebKit draws a pin's round shadow as a grey square in a cover.
        + ".dm.dm-still .dm-pin{box-shadow:none}"
        + ".dm .dm-pin.dm-saved-pin{background:var(--dm-accent);color:var(--dm-accent-fg);border-color:#fff}"
        + ".dm .dm-list{list-style:none;margin:10px 0 0;padding:0}"
        + ".dm .dm-row{display:flex;gap:12px;align-items:flex-start;margin:0;padding:11px 2px;border:0;border-bottom:1px solid var(--dm-border);background:none}.dm .dm-row:last-child{border-bottom:0}"
        + ".dm .dm-row[data-located]{cursor:pointer}.dm .dm-row[data-located]:focus-visible{outline:2px solid var(--dm-accent);outline-offset:2px;border-radius:8px}"
        + ".dm .dm-time{flex:0 0 3.4em;color:var(--dm-muted);font-variant-numeric:tabular-nums;white-space:nowrap}.dm .dm-untimed .dm-time{display:none}"
        + ".dm .dm-num{position:relative;flex:0 0 auto;box-sizing:border-box;width:22px;height:22px;margin-top:2px;border-radius:50%;border:1.5px solid currentColor;font-size:12px;font-weight:700;line-height:19px;text-align:center}"
        + ".dm .dm-num.dm-saved-pin{background:var(--dm-accent);color:var(--dm-accent-fg);border-color:var(--dm-accent)}"
        + ".dm .dm-num.dm-step{border:0}.dm .dm-num.dm-step::before{content:'';position:absolute;left:8px;top:8px;width:6px;height:6px;border-radius:50%;background:var(--dm-muted)}"
        + ".dm .dm-body{flex:1 1 auto;min-width:0}.dm .dm-name{font-weight:600}.dm .dm-detail{display:block;color:var(--dm-muted);font-size:.92em}"
        + ".dm .dm-weather{display:block;margin-top:3px;color:var(--dm-muted);font-size:.85em;font-variant-numeric:tabular-nums}"
        + ".dm .dm-forecast{margin:4px 0 0;color:var(--dm-muted);font-size:.78em}"
        + ".dm .dm-saved{display:inline-block;margin-left:6px;padding:0 7px;border-radius:999px;background:color-mix(in srgb,var(--dm-accent) 22%,transparent);font-size:.75em;font-weight:600;white-space:nowrap;vertical-align:1px}"
        + ".dm .dm-thumb{flex:0 0 auto;width:56px;height:56px;margin:0;border-radius:10px;object-fit:cover;background:var(--dm-surface)}"
        + ".dm .dm-popup .maplibregl-popup-content{padding:0;overflow:hidden;border-radius:12px;background:var(--dm-bg);color:var(--dm-fg);box-shadow:0 4px 18px rgba(0,0,0,.28)}.dm .dm-popup .maplibregl-popup-tip{display:none}"
        + ".dm .dm-card{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;font-size:14px;line-height:1.4}.dm .dm-card-photo{flex:0 0 auto;width:64px;height:64px;margin:0;border-radius:8px;object-fit:cover}"
        + ".dm .dm-card-body{min-width:0}.dm .dm-card .dm-detail{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}"
        + ".dm .dm-card-meta{color:var(--dm-muted);font-size:.9em}.dm .dm-go{display:inline-block;margin-top:4px;font-weight:600;color:inherit}"
        // The map data's licence asks for this credit on the map (owner, 2026-11-25:
        // the library's own credit box, swollen by a page's fonts, looked bad):
        // one small line of dodojo's, which a page's styles do not reach.
        + ".dm .dm-credit{position:absolute;z-index:2;left:8px;bottom:5px;margin:0;padding:0;font:400 9px/1.2 var(--dodojo-font-sans,system-ui,sans-serif);letter-spacing:0;color:rgba(0,0,0,.5);text-shadow:0 0 2px rgba(255,255,255,.9);pointer-events:none}"
        + ".dm .dm-credit a{color:inherit;font:inherit;text-decoration:none;pointer-events:auto}"
        + ":root[data-dodojo-theme=dark] .dm.dm-aware .dm-credit{color:rgba(255,255,255,.45);text-shadow:0 0 2px rgba(0,0,0,.9)}"
        // On the dark map the page's own background would vanish into it.
        + ":root[data-dodojo-theme=dark] .dm.dm-aware .dm-popup .maplibregl-popup-content,:root[data-dodojo-theme=dark] .dm.dm-aware .dm-route:not(.dm-route-plain){background:var(--dm-surface);box-shadow:0 0 0 1px var(--dm-border),0 4px 18px rgba(0,0,0,.5)}";
      document.head.append(style);
    };
    const located = stop => stop.lat !== null && stop.lng !== null;
    // The forecast an agent looked up when it planned the trip (owner,
    // 2026-11-24: «天气什么的也都得考虑»; it chose that over a live weather
    // service), shown the same way on every stop, with the date it was taken.
    const WEATHER = { sunny: "☀️", clear: "☀️", "partly-cloudy": "⛅", cloudy: "☁️", fog: "🌫️", rain: "🌧️", showers: "🌦️", storm: "⛈️", snow: "🌨️", wind: "💨" };
    const weatherLine = (stop, words) => {
      const sky = WEATHER[stop.weather] || "";
      const temperature = stop.high !== null && stop.low !== null ? stop.high + "° / " + stop.low + "°" : stop.high !== null ? stop.high + "°" : "";
      return [[sky, temperature].filter(Boolean).join(" "), stop.rain ? words.rain + " " + stop.rain + "%" : "", stop.sunset ? words.sunset + " " + stop.sunset : ""].filter(Boolean).join(" · ");
    };
    const forecastDate = (value, language) => {
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
      if (!match) return value.slice(0, 40);
      try {
        return new Intl.DateTimeFormat(language === "zh-hant" ? "zh-TW" : language, { month: "short", day: "numeric" }).format(new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
      } catch {
        return value;
      }
    };
    const degrees = raw => {
      const value = Number.parseFloat(raw ?? "");
      return Number.isFinite(value) && Math.abs(value) <= 150 ? Math.round(value) : null;
    };
    const readStops = host => Array.from(host.querySelectorAll("dodojo-stop")).map(element => {
      const coordinate = (names, limit) => {
        for (const name of names) {
          const value = Number.parseFloat(element.getAttribute(name) ?? "");
          if (Number.isFinite(value) && Math.abs(value) <= limit) return value;
        }
        return null;
      };
      const photo = element.querySelector("img");
      const copy = element.cloneNode(true);
      copy.querySelectorAll("img").forEach(image => image.remove());
      const text = copy.textContent.replace(/\s+/g, " ").trim();
      const named = (element.getAttribute("name") || "").trim();
      let lat = coordinate(["lat", "latitude"], 90);
      let lng = coordinate(["lng", "lon", "longitude"], 180);
      if (lat === null || lng === null) lat = lng = null;
      return {
        lat, lng, photo,
        name: (named || text).slice(0, 200),
        detail: named ? text.slice(0, 600) : "",
        time: (element.getAttribute("time") || "").trim().slice(0, 40),
        place: (element.getAttribute("place") || "").trim().slice(0, 300),
        saved: element.hasAttribute("saved"),
        weather: (element.getAttribute("weather") || "").trim().toLowerCase(),
        high: degrees(element.getAttribute("high")),
        low: degrees(element.getAttribute("low")),
        rain: (value => (Number.isFinite(value) && value > 0 && value <= 100 ? Math.round(value) : 0))(Number.parseFloat(element.getAttribute("rain") ?? "")),
        sunset: /^\d{1,2}:\d{2}(\s?[AaPp][Mm])?$/.test((element.getAttribute("sunset") || "").trim()) ? element.getAttribute("sunset").trim() : "",
      };
    });
    const where = stop => encodeURIComponent(stop.place || stop.lat.toFixed(6) + "," + stop.lng.toFixed(6));
    const directionsUrl = (stop, mode) => "https://www.google.com/maps/dir/?api=1&destination=" + where(stop) + "&travelmode=" + mode;
    // Google Maps takes up to nine stops between the first and the last.
    const routeUrl = (stops, mode) => {
      const between = stops.slice(1, -1).slice(0, 9);
      return "https://www.google.com/maps/dir/?api=1&origin=" + where(stops[0]) + "&destination=" + where(stops[stops.length - 1])
        + (between.length ? "&waypoints=" + between.map(where).join("%7C") : "") + "&travelmode=" + mode;
    };
    const tag = (name, className, text) => {
      const element = document.createElement(name);
      if (className) element.className = className;
      if (text) element.textContent = text;
      return element;
    };
    // A stop's photo, once the runtime has filled it from the Note's files.
    const photoCopy = (photo, className) => {
      const image = tag("img", className);
      image.alt = photo.getAttribute("alt") || "";
      image.decoding = "async";
      const take = () => {
        const source = photo.getAttribute("src");
        if (!source) return false;
        image.src = source;
        return true;
      };
      if (!take()) {
        const watch = new MutationObserver(() => { if (take()) watch.disconnect(); });
        watch.observe(photo, { attributes: true, attributeFilter: ["src"] });
      }
      return image;
    };
    // What a pin shows when tapped: small enough to fit above it on a phone.
    const stopCard = (stop, number, mode, words) => {
      const card = tag("div", "dm-card");
      if (stop.photo) card.append(photoCopy(stop.photo, "dm-card-photo"));
      const body = tag("div", "dm-card-body");
      body.append(tag("div", "dm-name", number + ". " + stop.name));
      const meta = [stop.time, stop.saved ? "★ " + words.saved : ""].filter(Boolean).join(" · ");
      if (meta) body.append(tag("div", "dm-card-meta", meta));
      if (stop.detail) body.append(tag("div", "dm-detail", stop.detail));
      const sky = weatherLine(stop, words);
      if (sky) body.append(tag("div", "dm-weather", sky));
      const go = tag("a", "dm-go", words.go + " ↗");
      go.href = directionsUrl(stop, mode);
      body.append(go);
      card.append(body);
      return card;
    };
    class DodojoMap extends HTMLElement {
      connectedCallback() {
        if (this.dodojoMap) return;
        // Defined before the page is parsed, so the stops are not there yet.
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => this.build(), { once: true });
        else queueMicrotask(() => this.build());
      }
      build() {
        if (this.dodojoMap || !this.isConnected) return;
        this.dodojoMap = true;
        addMapStyles();
        const words = MAP_WORDS[mapLanguage()] || MAP_WORDS.en;
        const mode = ["walking", "transit", "bicycling", "driving"].includes(this.getAttribute("mode")) ? this.getAttribute("mode") : "driving";
        const stops = readStops(this);
        const places = stops.filter(located);
        const route = this.hasAttribute("route") && places.length > 1;
        const shell = tag("div", "dm" + (config.themeAware ? " dm-aware" : "") + (config.capture ? " dm-still" : ""));
        let wrap = null;
        let frame = null;
        let routeLink = null;
        if (places.length) {
          wrap = tag("div", "dm-wrap");
          frame = tag("div", "dm-frame");
          frame.setAttribute("role", "region");
          frame.setAttribute("aria-label", words.map);
          const height = Number(this.getAttribute("height"));
          if (height >= 160 && height <= 900) Object.assign(frame.style, { aspectRatio: "auto", height: height + "px", maxHeight: "none" });
          wrap.append(frame);
          if (route) {
            routeLink = tag("a", "dm-route", words.route + " ↗");
            routeLink.href = routeUrl(places, mode);
            wrap.append(routeLink);
          }
          const credit = tag("p", "dm-credit");
          for (const [label, href] of [["© OpenMapTiles", "https://www.openmaptiles.org/"], ["© OpenStreetMap", "https://www.openstreetmap.org/copyright"]]) {
            const link = tag("a", "", label);
            link.href = href;
            credit.append(link, " ");
          }
          wrap.append(credit);
          shell.append(wrap);
        }
        const rows = new Map();
        const list = tag("ol", "dm-list" + (stops.some(stop => stop.time) ? "" : " dm-untimed"));
        list.hidden = places.length > 0 && this.getAttribute("list") === "none";
        for (const stop of stops) {
          const row = tag("li", "dm-row");
          row.append(tag("span", "dm-time", stop.time));
          const number = located(stop) ? places.indexOf(stop) + 1 : 0;
          row.append(tag("span", "dm-num" + (number ? (stop.saved ? " dm-saved-pin" : "") : " dm-step"), number ? String(number) : ""));
          const body = tag("span", "dm-body");
          body.append(tag("span", "dm-name", stop.name));
          if (stop.saved) body.append(tag("span", "dm-saved", "★ " + words.saved));
          if (stop.detail) body.append(tag("span", "dm-detail", stop.detail));
          const sky = weatherLine(stop, words);
          if (sky) body.append(tag("span", "dm-weather", sky));
          row.append(body);
          if (stop.photo) row.append(photoCopy(stop.photo, "dm-thumb"));
          if (number) {
            row.setAttribute("data-located", "");
            row.tabIndex = 0;
            row.setAttribute("role", "button");
            rows.set(stop, row);
          }
          list.append(row);
        }
        shell.append(list);
        const forecast = (this.getAttribute("forecast") || "").trim();
        if (forecast && stops.some(stop => weatherLine(stop, words))) {
          const note = tag("p", "dm-forecast", words.forecast.replace("{date}", forecastDate(forecast, mapLanguage())));
          note.hidden = list.hidden;
          shell.append(note);
        }
        this.setAttribute("data-dodojo-map", "");
        this.append(shell);
        if (!frame) return;
        let finish;
        const drawn = new Promise(resolve => { finish = resolve; });
        settling.add(drawn);
        const done = () => { settling.delete(drawn); finish(); };
        // Offline, blocked or without WebGL: the timeline is the page.
        // The whole route still opens in the Maps app, which may work offline.
        const giveUp = () => {
          if (routeLink) {
            routeLink.classList.add("dm-route-plain");
            shell.prepend(routeLink);
          }
          wrap.remove();
          list.hidden = false;
          shell.querySelector(".dm-forecast")?.removeAttribute("hidden");
          done();
        };
        loadMapLibrary().then(maplibregl => {
          const scheme = () => (config.themeAware && theme.scheme === "dark" ? "dark" : "light");
          const lngs = places.map(stop => stop.lng);
          const lats = places.map(stop => stop.lat);
          const edge = Math.max(24, Math.min(48, Math.round(frame.clientWidth / 8)));
          const view = places.length > 1
            ? { bounds: [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], fitBoundsOptions: { padding: { top: route ? edge + 28 : edge, bottom: edge, left: edge, right: edge }, maxZoom: 13 } }
            : { center: [places[0].lng, places[0].lat], zoom: 12 };
          let map;
          try {
            map = new maplibregl.Map(Object.assign({
              container: frame,
              style: MAP_STYLES[scheme()],
              attributionControl: false,
              interactive: !config.capture,
              cooperativeGestures: !config.capture,
              dragRotate: false,
              pitchWithRotate: false,
              touchPitch: false,
              fadeDuration: config.capture ? 0 : 300,
              locale: {
                "CooperativeGesturesHandler.WindowsHelpText": words.windows,
                "CooperativeGesturesHandler.MacHelpText": words.mac,
                "CooperativeGesturesHandler.MobileHelpText": words.touch,
              },
            }, view));
          } catch {
            giveUp();
            return;
          }
          map.touchZoomRotate?.disableRotation();
          // Before the style arrives an error means no map at all (offline);
          // after it, a missing tile is only a gap.
          let styled = false;
          map.on("error", () => { if (!styled) { map.remove(); giveUp(); } });
          map.once("idle", done);
          const language = mapLanguage();
          map.on("style.load", () => {
            styled = true;
            // Place names in the page's language where the map has them. A
            // name can list several spellings ("旧金山;舊金山;三藩市"): the first.
            const names = language === "zh-hant" ? ["name:zh-Hant", "name:zh"] : language === "zh" ? ["name:zh-Hans", "name:zh"] : language === "en" ? [] : ["name:" + language];
            const first = name => ["let", "n", ["to-string", ["get", name]], ["case", [">", ["index-of", ";", ["var", "n"]], 0], ["slice", ["var", "n"], 0, ["index-of", ";", ["var", "n"]]], ["var", "n"]]];
            if (names.length) {
              for (const layer of map.getStyle().layers) {
                const field = layer.type === "symbol" ? map.getLayoutProperty(layer.id, "text-field") : null;
                if (Array.isArray(field) && JSON.stringify(field).includes('"name')) {
                  try { map.setLayoutProperty(layer.id, "text-field", ["case", ...names.flatMap(name => [["has", name], first(name)]), field]); } catch {}
                }
              }
            }
            if (!route || map.getSource("dodojo-route")) return;
            const dark = scheme() === "dark";
            map.addSource("dodojo-route", { type: "geojson", data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: places.map(stop => [stop.lng, stop.lat]) } } });
            map.addLayer({ id: "dodojo-route-casing", type: "line", source: "dodojo-route", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": dark ? "#111113" : "#ffffff", "line-width": 7, "line-opacity": 0.8 } });
            map.addLayer({ id: "dodojo-route", type: "line", source: "dodojo-route", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": dark ? "#f5f2ea" : "#1d1d1f", "line-width": 3, "line-dasharray": [1.4, 1.8] } });
          });
          if (config.themeAware) window.addEventListener("dodojo-theme-change", () => map.setStyle(MAP_STYLES[scheme()], { diff: false }));
          const markers = new Map();
          places.forEach((stop, index) => {
            const pin = tag("div", "dm-pin" + (stop.saved ? " dm-saved-pin" : ""), String(index + 1));
            pin.setAttribute("role", "button");
            pin.tabIndex = 0;
            pin.setAttribute("aria-label", index + 1 + ". " + stop.name);
            const marker = new maplibregl.Marker({ element: pin }).setLngLat([stop.lng, stop.lat]).addTo(map);
            if (!config.capture) marker.setPopup(new maplibregl.Popup({ offset: 20, closeButton: false, maxWidth: "260px", className: "dm-popup" }).setDOMContent(stopCard(stop, index + 1, mode, words)));
            markers.set(stop, marker);
          });
          // A tap on a stop in the timeline shows it on the map.
          for (const [stop, row] of rows) {
            const show = () => {
              const marker = markers.get(stop);
              for (const other of markers.values()) if (other !== marker && other.getPopup()?.isOpen()) other.togglePopup();
              // The pin lands below the middle, so its card opens above it.
              map.flyTo({ center: [stop.lng, stop.lat], zoom: Math.min(13, Math.max(map.getZoom(), 10)), offset: [0, Math.round(frame.clientHeight * 0.2)] });
              if (marker && !marker.getPopup()?.isOpen()) map.once("moveend", () => { if (!marker.getPopup()?.isOpen()) marker.togglePopup(); });
            };
            row.addEventListener("click", event => { if (!event.target.closest?.("a")) show(); });
            row.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); show(); } });
          }
        }, giveUp);
      }
    }
    if (window.customElements && !customElements.get("dodojo-map")) customElements.define("dodojo-map", DodojoMap);
})();
