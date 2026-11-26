// Gallery behavior: language, copy buttons, example tabs, the phone's
// light/dark switch and the library covers (each a live page drawn at 400px
// and scaled down, the way dodojo takes a page's cover from its top square).
// Pages load only when their example is shown.
(() => {
  const root = document.documentElement;
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} },
  };

  const setLang = lang => {
    root.dataset.lang = lang;
    root.lang = lang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-set-lang]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.setLang === lang)));
  };
  setLang(root.dataset.lang === "zh" ? "zh" : "en");
  document.querySelectorAll("[data-set-lang]").forEach(button => button.addEventListener("click", () => {
    setLang(button.dataset.setLang);
    store.set("dodojo-skills-lang", button.dataset.setLang);
  }));

  document.querySelectorAll("[data-copy]").forEach(button => button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      const before = button.innerHTML;
      button.innerHTML = '<span data-l="zh">已复制</span><span data-l="en">Copied</span>';
      setTimeout(() => { button.innerHTML = before; }, 1400);
    } catch {}
  }));

  const dark = window.matchMedia("(prefers-color-scheme: dark)");
  const pageScheme = () => (dark.matches ? "dark" : "light");
  const withTheme = (src, scheme) => src.replace(/([?&])theme=(light|dark)/, "$1theme=" + scheme);
  const shown = element => !element.closest("[data-example][hidden]");

  const fit = () => document.querySelectorAll(".cover").forEach(cover => {
    if (cover.clientWidth) cover.style.setProperty("--scale", String(cover.clientWidth / 400));
  });
  const loadCovers = () => document.querySelectorAll(".cover iframe[data-src]").forEach(frame => {
    if (!shown(frame)) return;
    const next = withTheme(frame.dataset.src, pageScheme());
    if (frame.getAttribute("src") !== next) frame.setAttribute("src", next);
  });

  // The phone: its own light/dark switch, starting from the gallery's theme.
  const startPhone = phone => {
    if (phone.dataset.ready || !shown(phone)) return;
    phone.dataset.ready = "1";
    const frame = phone.querySelector("iframe");
    const buttons = phone.querySelectorAll("[data-scheme]");
    const show = scheme => {
      buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.scheme === scheme)));
      if (!frame.getAttribute("src")) frame.setAttribute("src", withTheme(frame.dataset.src, scheme));
      else frame.contentWindow?.postMessage({ type: "dodojo-theme", scheme }, "*");
    };
    buttons.forEach(button => button.addEventListener("click", () => show(button.dataset.scheme)));
    show(pageScheme());
  };

  const refresh = () => {
    fit();
    loadCovers();
    document.querySelectorAll("[data-phone]").forEach(startPhone);
  };

  // Example tabs on a skill page; the address remembers the one shown.
  document.querySelectorAll("[data-examples]").forEach(group => {
    const buttons = group.querySelectorAll("[data-show-example]");
    const select = slug => {
      const target = group.querySelector(`[data-example="${CSS.escape(slug)}"]`);
      if (!target) return false;
      group.querySelectorAll("[data-example]").forEach(block => { block.hidden = block !== target; });
      buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.showExample === slug)));
      refresh();
      return true;
    };
    buttons.forEach(button => button.addEventListener("click", () => {
      if (select(button.dataset.showExample)) history.replaceState(null, "", "#" + button.dataset.showExample);
    }));
    if (location.hash.length > 1) select(decodeURIComponent(location.hash.slice(1)));
  });

  refresh();
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(document.body);
  dark.addEventListener?.("change", loadCovers);
})();
