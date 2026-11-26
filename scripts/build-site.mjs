#!/usr/bin/env node
// Builds the gallery in docs/ from the skills and their examples.
//
//   node scripts/build-site.mjs
//
// Each skill page is generated from the skill itself: its name and
// description from SKILL.md's front matter, its steps from SKILL.md's
// "## Workflow" list, its files from the skill folder, and what it made from
// examples/<skill>/<case>/ (index.html, meta.json, note.md, cards/*.png).
// site-src/content.json only adds display names and the Chinese text.

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs");
const read = path => readFileSync(join(ROOT, path), "utf8");
const content = JSON.parse(read("site-src/content.json"));
const GITHUB = `https://github.com/${content.repo}`;
const warnings = [];

const esc = value => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const t = (zh, en) => `<span data-l="zh">${zh}</span><span data-l="en">${en}</span>`;

// ---------- reading the skills ----------

function frontMatter(markdown) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(markdown);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split("\n")) {
    const pair = /^([a-z-]+):\s*(.*)$/.exec(line);
    if (pair) fields[pair[1]] = pair[2].trim();
  }
  return fields;
}

function workflow(markdown) {
  const section = /^## Workflow\n([\s\S]*?)(?=^## )/m.exec(markdown);
  if (!section) return [];
  return section[1].split("\n")
    .map(line => /^\d+\.\s+\*\*(.+?)\*\*\s+[-–—]\s+(.+)$/.exec(line.trim()))
    .filter(Boolean)
    .map(([, name, detail]) => ({ name, detail }));
}

function walk(dir, base = dir) {
  return readdirSync(dir).sort().flatMap(name => {
    if (name.startsWith(".")) return [];
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path, base);
    const text = readFileSync(path, "utf8");
    return [{ path: relative(base, path), lines: text.split("\n").length }];
  });
}

function examplesOf(skill) {
  const dir = join(ROOT, "examples", skill);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).sort().filter(slug => existsSync(join(dir, slug, "index.html"))).map(slug => {
    const folder = join(dir, slug);
    const meta = existsSync(join(folder, "meta.json")) ? JSON.parse(readFileSync(join(folder, "meta.json"), "utf8")) : {};
    let note = null;
    if (existsSync(join(folder, "note.md"))) {
      const raw = readFileSync(join(folder, "note.md"), "utf8");
      const title = /^title:\s*(.+)$/m.exec(raw)?.[1]?.trim() || meta.title || "";
      note = { title, body: raw.replace(/^title:.*\n+/, "") };
    }
    const cards = existsSync(join(folder, "cards")) ? readdirSync(join(folder, "cards")).filter(name => name.endsWith(".png")).sort() : [];
    const photos = readdirSync(folder).filter(name => /\.(jpe?g|png|webp|gif|avif)$/i.test(name));
    return { slug, folder, meta, note, cards, photos };
  }).sort((a, b) => (a.meta.lang === "en" ? 0 : 1) - (b.meta.lang === "en" ? 0 : 1));
}

const skills = content.order.map(name => {
  const markdown = read(`skills/${name}/SKILL.md`);
  const fields = frontMatter(markdown);
  if (fields.name !== name) warnings.push(`${name}: front matter name is "${fields.name}"`);
  const steps = workflow(markdown);
  const text = content.skills[name];
  const zhSteps = text?.zh?.steps || [];
  if (zhSteps.length !== steps.length) warnings.push(`${name}: SKILL.md has ${steps.length} workflow steps, content.json has ${zhSteps.length} Chinese ones`);
  return {
    name,
    description: fields.description || "",
    steps: steps.map((step, index) => ({ ...step, zh: zhSteps[index] || [step.name, step.detail] })),
    files: walk(join(ROOT, "skills", name)),
    examples: examplesOf(name),
    zh: text.zh,
    en: text.en,
  };
});

// ---------- dodojo Markdown, enough of it to show a Note ----------

function inline(text) {
  return esc(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>")
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    .replace(/==\{(?:green|blue|pink|orange|purple|gray)\}(.+?)==/g, "<mark>$1</mark>")
    .replace(/==(.+?)==/g, "<mark>$1</mark>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
}

function markdown(source) {
  const out = [];
  let list = null;
  let table = null;
  const close = () => {
    if (list) out.push(`</${list}>`), (list = null);
    if (table) out.push("</table>"), (table = null);
  };
  for (const raw of source.split("\n")) {
    const line = raw.replace(/\s+$/, "");
    if (/^\|.*\|$/.test(line)) {
      if (/^\|\s*-/.test(line)) continue;
      if (!table) close(), out.push("<table>"), (table = true);
      out.push("<tr>" + line.slice(1, -1).split("|").map(cell => `<td>${inline(cell.trim()).replace(/&lt;br&gt;/g, "<br>")}</td>`).join("") + "</tr>");
      continue;
    }
    if (table) close();
    let match;
    if ((match = /^(#{2,3})\s+(.+)$/.exec(line))) { close(); out.push(match[1] === "##" ? `<h5>${inline(match[2])}</h5>` : `<h6>${inline(match[2])}</h6>`); continue; }
    if ((match = /^(\s*)[-*]\s+(?:\[( |x)\]\s+)?(.+)$/.exec(line))) {
      if (list !== "ul") close(), out.push("<ul>"), (list = "ul");
      const box = match[2] ? (match[2] === "x" ? "☑ " : "☐ ") : "";
      out.push(`<li style="margin-left:${match[1].length * 8}px">${box}${inline(match[3])}</li>`);
      continue;
    }
    if ((match = /^\d+\.\s+(.+)$/.exec(line))) {
      if (list !== "ol") close(), out.push("<ol>"), (list = "ol");
      out.push(`<li>${inline(match[1])}</li>`);
      continue;
    }
    close();
    if (!line.trim()) continue;
    if (/^-{3,}$/.test(line)) { out.push("<hr>"); continue; }
    if (line.startsWith("> ")) { out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`); continue; }
    out.push(`<p>${inline(line)}</p>`);
  }
  close();
  return out.join("\n");
}

// ---------- pages ----------

// English unless the visitor picked Chinese on an earlier visit.
const LANG_BOOT = `<script>try{var l=localStorage.getItem("dodojo-skills-lang")}catch(e){}document.documentElement.dataset.lang=l==="zh"?"zh":"en"</script>`;

function page({ title, description, body, depth }) {
  const up = "../".repeat(depth);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" href="${up}assets/icon.png">
<link rel="stylesheet" href="${up}assets/site.css">
${LANG_BOOT}
</head>
<body>
<div class="wrap">
<header class="bar">
  <a class="brand" href="${up}index.html"><img src="${up}assets/icon.png" alt="" width="28" height="28" style="border-radius:7px">dodojo <span>/ skills</span></a>
  <nav>
    <span class="seg" role="group" aria-label="Language"><button type="button" data-set-lang="zh">中文</button><button type="button" data-set-lang="en">EN</button></span>
    <a class="pill-button" href="${GITHUB}">GitHub ↗</a>
  </nav>
</header>
${body}
<footer class="foot">
  <div>${t(`MIT 开源 · 页面由 skill 生成，可视化由 <code>scripts/build-site.mjs</code> 从 skill 文件自动生成`, `MIT licensed · Pages made by the skills; this gallery is generated from the skill files by <code>scripts/build-site.mjs</code>`)}</div>
  <div><a href="${GITHUB}">${esc(content.repo)}</a> · <a href="https://www.dodojo.ai">dodojo.ai</a> · <a href="https://github.com/dodojo14/dodojo-plugin">dodojo plugin</a></div>
</footer>
</div>
<script src="${up}assets/site.js"></script>
</body>
</html>
`;
}

const install = command => `<div class="install"><code>${esc(command)}</code><button type="button" data-copy="${esc(command)}">${t("复制", "Copy")}</button></div>`;
const exampleUrl = (up, skill, example, scheme = "light") => `${up}examples/${skill.name}/${example.slug}/index.html?theme=${scheme}`;
const dateLabel = iso => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  if (!match) return t("", "");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return t(`${Number(match[2])}月${Number(match[3])}日`, `${months[Number(match[2]) - 1]} ${Number(match[3])}`);
};

function tile(up, skill, example, { href, heading, line, blurb }) {
  return `<a class="tile" href="${href}">
  <div class="cover"><iframe data-src="${exampleUrl(up, skill, example)}" title="" tabindex="-1" aria-hidden="true" loading="lazy"></iframe></div>
  <h3>${heading}</h3>
  <div class="meta">${line}</div>
  ${blurb ? `<p>${blurb}</p>` : ""}
</a>`;
}

function indexPage() {
  const rows = skills.map(skill => `
<article class="skill-row">
  <header>
    <h3>${t(esc(skill.zh.title), esc(skill.en.title))} <span class="mono">${skill.name}</span></h3>
    <p>${t(esc(skill.zh.tagline), esc(skill.en.tagline))}</p>
    <a class="open-link" href="skills/${skill.name}.html">${t("看它怎么做 →", "See how it works →")}</a>
  </header>
  <div class="library">
${skill.examples.map(example => tile("", skill, example, {
    href: `skills/${skill.name}.html#${encodeURIComponent(example.slug)}`,
    heading: esc(example.meta.lang === "zh" ? example.meta.title : example.meta.title_en || example.meta.title),
    line: `<span>${example.meta.lang === "zh" ? t("中文示例", "In Chinese") : t("英文示例", "In English")}</span>·<span>${dateLabel(example.meta.checked)}</span>`,
  })).join("\n")}
  </div>
</article>`).join("\n");
  const body = `
<section class="hero">
  <p class="eyebrow">${t("开源 Agent Skills", "Open Agent Skills")}</p>
  <h1>${t("让 AI 做的东西，<br>值得留下来", "Make what your AI makes<br>worth keeping")}</h1>
  <p class="lede">${t("dodojo 的开源 Agent Skills。第一个是 dodojo-travel：把一趟行程做成路上能用的一页，营业时间和门票按出行当天核实，路线不走回头路，配真实照片和地图。每个 skill 都是一套做法而不是模板。连上 dodojo，它会先翻你存过的东西，做好后直接存进你的记忆库。", "Open agent skills from dodojo. The first, dodojo-travel, turns a trip into a page you follow on the road: hours and tickets checked for your dates, a route that never backtracks, real photos and a map. Each skill is a way of working, not a template. Connected to dodojo, it starts from what you already keep and saves the result into your library.")}</p>
  ${install(`npx skills add ${content.repo}`)}
  <p class="works">${t("适用于 Claude Code、Codex、Cursor 等支持 Agent Skills 的工具 · MIT 开源", "Works in Claude Code, Codex, Cursor and other tools that support Agent Skills · MIT licensed")}</p>
</section>
<section class="section">
  <h2>${t("技能", "Skills")}</h2>
  <p class="sub">${t("每张卡片都是 skill 真实做出来的页面，显示方式和 dodojo 首页一样：页面顶部就是封面。点开看它怎么做。", "Each card is a page a skill actually made, shown the way dodojo's library shows it: the top of the page is the cover. Open one to see how it was made.")}</p>
${rows}
</section>
<section class="section">
  <h2>${t("一个 skill 怎么变成一页", "How a skill becomes a page")}</h2>
  <ol class="how">
    <li><b>${t("你说一句话", "You ask")}</b><span>${t("「帮我排个京都东山一日游」。连上 dodojo 时，Agent 先翻你存过的订单、收藏和笔记。", "\"Plan me a day in Kyoto's Higashiyama.\" With dodojo connected, the agent first looks through your bookings, saved places and notes.")}</span></li>
    <li><b>${t("Agent 按 skill 做事", "The agent follows the skill")}</b><span>${t("skill 写的是方法：查什么、怎么排、设计怎么定、做完怎么检查。不是模板，所以每个主题长得不一样。", "A skill is a method: what to check, how to plan, how to design and how to check the result. Not a template, so every subject gets its own look.")}</span></li>
    <li><b>${t("得到一页能用的东西", "You get a page to keep")}</b><span>${t("一个 HTML 文件，任何浏览器都能打开。存进 dodojo 就是一条网页笔记，勾过的清单会记住。", "One HTML file that opens in any browser. In dodojo it is a webpage Note that remembers what you ticked.")}</span></li>
  </ol>
</section>
<section class="section">
  <h2>${t("配合 dodojo 用", "With dodojo")}</h2>
  <p class="sub">${t("在 Agent 里连接 dodojo 的 MCP（<code>https://www.dodojo.ai/api/mcp</code>，登录一次），skill 就能搜你的记忆、把页面存成笔记。dodojo 桌面版里的 Agent 已经连好。不连也能用：页面存成本地文件。", "Connect your agent to dodojo's MCP server (<code>https://www.dodojo.ai/api/mcp</code>, sign in once) and the skills can search your memories and save pages as Notes. The agent in the dodojo desktop app is already connected. Without it, pages are saved as local files.")}</p>
</section>`;
  return page({ title: "dodojo skills", description: "Open agent skills from dodojo, starting with dodojo-travel: trip pages checked for your dates, with a map and real photos.", body, depth: 0 });
}

function pngSize(path) {
  const bytes = readFileSync(path);
  return bytes.length > 24 ? [bytes.readUInt32BE(16), bytes.readUInt32BE(20)] : [0, 0];
}

function exampleBlock(skill, example, index, steps) {
  const meta = example.meta;
  const url = exampleUrl("../", skill, example);
  const attachments = ["index.html", ...example.photos].map(name => `<span class="chip">📎 ${esc(name)}</span>`).join("");
  const translated = meta.prompt_en && meta.prompt_en !== meta.prompt;
  const [cardWidth, cardHeight] = example.cards.length ? pngSize(join(example.folder, "cards", example.cards[0])) : [0, 0];
  return `<div class="example" data-example="${esc(example.slug)}"${index ? " hidden" : ""}>
<section class="flow" aria-label="${esc(meta.title_en || meta.title || skill.en.title)}">
  <div class="stage">
    <div class="stage-label"><b>1</b>${t("喂给它", "Give it")}</div>
    <div class="ask"><q lang="${meta.lang === "zh" ? "zh-CN" : "en"}">${esc(meta.prompt || "")}</q>${translated ? `<small data-l="en">${esc(meta.prompt_en)}</small>` : ""}</div>
    <dl class="facts">
      <div><dt>${t("输入", "Input")}</dt><dd>${t(esc(skill.zh.input), esc(skill.en.input))}</dd></div>
      <div><dt>${t("产出", "Output")}</dt><dd>${t(esc(skill.zh.output), esc(skill.en.output))}</dd></div>
      ${(meta.inputs || []).length ? `<div><dt>${t("这次的材料", "Material this time")}</dt><dd class="chips">${meta.inputs.map(input => `<span class="chip">${esc(input)}</span>`).join("")}</dd></div>` : ""}
    </dl>
  </div>
  <div class="stage">
    <div class="stage-label"><b>2</b>${t("它怎么做", "How it works")}</div>
    <ol class="steps">
${steps}
    </ol>
    <p class="from-skill">${t("步骤取自 SKILL.md 的 Workflow 一节，skill 改了，这里跟着变。金色步骤是和 dodojo 打交道的地方。", "Steps are read from the Workflow section of SKILL.md, so this page changes with the skill. Gold steps are where dodojo comes in.")}</p>
  </div>
  <div class="stage phone" data-phone>
    <div class="toggles">
      <div class="stage-label"><b>3</b>${t("做出来", "What comes out")}</div>
      <span class="seg" role="group" aria-label="Theme"><button type="button" data-scheme="light">${t("浅色", "Light")}</button><button type="button" data-scheme="dark">${t("深色", "Dark")}</button></span>
    </div>
    <div class="device"><div class="screen"><iframe data-src="${url}" title="${esc(meta.title_en || meta.title || skill.name)}"></iframe></div></div>
    <a class="open-link" href="${url}" target="_blank" rel="noopener">${t("单独打开这页 ↗", "Open the page on its own ↗")}</a>
  </div>
</section>
<section class="section">
  <h2>${t("存进 dodojo 之后", "Once it is in dodojo")}</h2>
  <p class="sub">${t("左边是它在首页里的卡片（封面就是页面顶部那一块），右边是 Agent 一起写进笔记正文的要点，方便搜索和不打开页面时看。", "Left, its card in the library (the cover is the top of the page); right, the key facts the agent writes into the Note's body, so search finds them and they read without the page.")}</p>
  <div class="indodojo">
    ${tile("../", skill, example, { href: url, heading: meta.lang === "zh" ? t(esc(meta.title || ""), esc(meta.title || "")) : esc(meta.title || ""), line: `<span>Claude</span>·<span>${dateLabel(meta.checked)}</span>` })}
    ${example.note ? `<article class="note" lang="${meta.lang === "zh" ? "zh-CN" : "en"}"><h4>${esc(example.note.title)}</h4>${markdown(example.note.body)}<div class="attach">${attachments}</div></article>` : ""}
  </div>
</section>
${example.cards.length ? `
<section class="section">
  <h2>${t("导出的 PNG", "Exported PNGs")}</h2>
  <p class="sub">${t(`用 skill 自带的 <code>scripts/export-cards.mjs</code> 导出：${example.cards.length} 张，每张 ${cardWidth} × ${cardHeight}，可以直接发帖。`, `Exported with the skill's own <code>scripts/export-cards.mjs</code>: ${example.cards.length} cards at ${cardWidth} × ${cardHeight}, ready to post.`)}</p>
  <div class="strip">${example.cards.map(name => `<img src="../examples/${skill.name}/${example.slug}/cards/${name}" alt="" loading="lazy" width="${Math.round(cardWidth / 5.4)}" height="${Math.round(cardHeight / 5.4)}">`).join("")}</div>
</section>` : ""}
</div>`;
}

function skillPage(skill) {
  const others = skills.filter(other => other !== skill);
  const steps = skill.steps.map((step, index) => {
    const dodojo = /dodojo|\bNote\b/.test(step.detail);
    return `<li class="${dodojo ? "dodojo" : ""}"><span class="n">${index + 1}</span><div><b>${t(esc(step.zh[0]), esc(step.name))}${dodojo ? ' <span class="tag">dodojo</span>' : ""}</b><span class="detail">${t(esc(step.zh[1]), esc(step.detail))}</span></div></li>`;
  }).join("\n");
  const files = skill.files.map(file => `<li><a href="${GITHUB}/blob/main/skills/${skill.name}/${file.path}">${esc(file.path)}</a><span>${t(`${file.lines} 行`, `${file.lines} lines`)}</span></li>`).join("\n");
  const tabs = skill.examples.length > 1 ? `
<div class="example-tabs" role="group" aria-label="Examples">
  <span class="tabs-label">${t("示例", "Examples")}</span>
  ${skill.examples.map((example, index) => `<button type="button" data-show-example="${esc(example.slug)}" aria-pressed="${index === 0}">${esc(example.meta.lang === "zh" ? example.meta.title : example.meta.title_en || example.meta.title)}<span class="lang">${example.meta.lang === "zh" ? "中文" : "EN"}</span></button>`).join("\n  ")}
</div>` : "";
  const body = `
<a class="crumb" href="../index.html">← ${t("全部技能", "All skills")}</a>
<section class="skill-head">
  <h1><span class="mono">${skill.name}</span>${t(esc(skill.zh.title), esc(skill.en.title))}</h1>
  <p>${t(esc(skill.zh.tagline), esc(skill.en.tagline))}</p>
  ${install(`npx skills add ${content.repo} --skill ${skill.name}`)}
</section>
${skill.examples.length ? `<div data-examples>${tabs}
${skill.examples.map((example, index) => exampleBlock(skill, example, index, steps)).join("\n")}
</div>` : `<p class="sub">${t("还没有示例。", "No example yet.")}</p>`}
<section class="section">
  <h2>${t("Skill 里有什么", "What is in the skill")}</h2>
  <p class="sub">${t("整个文件夹就是 skill：Agent 先读 SKILL.md，需要时再读 references。", "The folder is the skill: the agent reads SKILL.md first and the references when it needs them.")}</p>
  <ul class="files">
${files}
  </ul>
</section>
${others.length ? `<section class="section">
  <h2>${t("其他技能", "Other skills")}</h2>
  <div class="next">${others.map(other => `<a href="${other.name}.html"><b>${t(esc(other.zh.title), esc(other.en.title))}</b><small class="mono">${other.name}</small></a>`).join("")}</div>
</section>` : ""}`;
  return page({ title: `${skill.en.title} · dodojo skills`, description: skill.description, body, depth: 1 });
}

// ---------- write ----------

rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, "assets"), { recursive: true });
mkdirSync(join(OUT, "skills"), { recursive: true });
for (const file of ["site.css", "site.js", "dodojo-runtime.js", "icon.png"]) cpSync(join(ROOT, "site-src", file), join(OUT, "assets", file));
writeFileSync(join(OUT, ".nojekyll"), "");

for (const skill of skills) {
  for (const example of skill.examples) {
    const target = join(OUT, "examples", skill.name, example.slug);
    mkdirSync(target, { recursive: true });
    for (const name of readdirSync(example.folder)) {
      if (["meta.json", "note.md"].includes(name) || name.startsWith(".")) continue;
      const from = join(example.folder, name);
      if (name === "index.html") {
        const html = readFileSync(from, "utf8");
        const tag = '<script src="../../../assets/dodojo-runtime.js"></script>';
        const injected = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, match => `${match}\n${tag}`) : `${tag}\n${html}`;
        writeFileSync(join(target, name), injected);
      } else {
        cpSync(from, join(target, name), { recursive: true });
      }
    }
  }
  writeFileSync(join(OUT, "skills", `${skill.name}.html`), skillPage(skill));
}
writeFileSync(join(OUT, "index.html"), indexPage());

for (const warning of warnings) console.warn(`warning: ${warning}`);
console.log(`Built ${skills.length} skill pages and ${skills.reduce((sum, skill) => sum + skill.examples.length, 0)} examples into docs/`);
