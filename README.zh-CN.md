# dodojo skills

[dodojo](https://www.dodojo.ai)（你和自己的 AI 共用的记忆库）的开源 [Agent Skills](https://agentskills.io)。每个 skill 是一套做法而不是模板：查什么、怎么排、设计怎么定、做完怎么检查。做出来的是一页手机上好用、深浅色都好看的页面。

在任何支持 skills 的 Agent 里都能用（Claude Code、Codex、Cursor 等）。连上 dodojo，它会先翻你存过的东西，做好后存成一条笔记。

**看看 skill 能做出什么：[dodojo-ai.github.io/dodojo-skills](https://dodojo-ai.github.io/dodojo-skills/)**

## dodojo-travel

[`skills/dodojo-travel`](skills/dodojo-travel/SKILL.md) 把一趟旅行、一日游、自驾或吃喝路线做成路上能用的一页：

- 营业时间、闭馆日、门票和交通按出行当天核实，每条都有来源和查询日期；
- 路线朝一个方向走、不走回头路，留余量和雨天方案；
- 每天一张地图（编号图钉、一键 Google 地图导航）、每站一张卡片、吃什么、会记住勾选的清单、对得上的花费合计；
- 真实照片并署名；
- 配色和字体取自目的地本身，深浅色都做。

示例（都由 Agent 按 skill 真实做出）：[里斯本的一个周六](examples/dodojo-travel/lisbon-saturday/)（英文）、[京都东山一日步行](examples/dodojo-travel/kyoto-higashiyama/)（中文）。

## dodojo-game

[`skills/dodojo-game`](skills/dodojo-game/SKILL.md) 做一个手机和电脑上都能玩的游戏：棋类、牌类、益智、街机、文字游戏，或者一台手机传着玩的聚会游戏。

- 游戏放在最上面：细细一条对局条、棋盘和按钮一屏装下，玩法、设置、战绩和规则放在下面，下棋时界面不跳；
- 触屏、鼠标、键盘点下去马上有反应，反馈和事情大小相称，声音用 Web Audio 在页面里现做；
- 电脑对手分档且真的不一样强，存之前让各档互相对下检查过；
- 每一步都存着，下到一半关掉，换台设备打开也停在同一手；在 dodojo 团队空间里，大家用各自的设备轮流下；
- 画面取自游戏本身的材质（榧木棋盘、黑石和贝壳白子、绿色台呢），深浅色都做。

示例（按 skill 做出）：[榧木棋盘五子棋](examples/dodojo-game/gomoku/)（中文），可以跟三档电脑下，也可以两个人用一台手机下，带复盘和战绩。

## 安装

用 [skills CLI](https://github.com/vercel-labs/skills)：

```bash
npx skills add dodojo-AI/dodojo-skills
```

在 Claude Code 里当插件装：

```
/plugin marketplace add dodojo-AI/dodojo-skills
/plugin install dodojo-skills@dodojo-skills
```

也可以把某个 skill 文件夹（比如 `skills/dodojo-travel`）直接拷进 Agent 的 skills 目录（`~/.claude/skills/`、`.agents/skills/` 等）。每个 skill 文件夹都是自包含的。

## 配合 dodojo

让 Agent 连接 dodojo 的 MCP：`https://www.dodojo.ai/api/mcp`（OAuth，登录一次），或装 [dodojo 插件](https://github.com/dodojo-AI/dodojo-plugin)。dodojo 桌面版里的 Agent 已经连好。连上之后：

- 先搜你的记忆（做行程时是订单、收藏、以前的游记），在此基础上做；
- 页面存成网页笔记：在首页里以页面顶部为封面，手机和电脑上都能完整打开，每天的地图会画出来，勾过的清单和下到哪一手都会记住；
- 要点同时写进笔记正文，搜索能找到。

不连 dodojo 也能用：页面存成本地文件夹（`.html` 和照片），任何浏览器都能打开，以后也能原样放进 dodojo。

## 可视化画廊

`docs/` 是生成的，不手写：

```bash
npm install          # 装 Playwright，截图脚本要用
npm run build        # node scripts/build-site.mjs
```

构建时，每个 skill 的名字和简介来自 `SKILL.md`，步骤来自其中的 `## Workflow` 列表，文件清单来自 skill 文件夹，产出来自 `examples/<skill>/<case>/`（`index.html` 和照片、`meta.json`、`note.md`）。英文示例排在前面。画廊里每个页面都跑在 `site-src/dodojo-runtime.js` 里，它模拟 dodojo 的画框（深浅色配色、`window.dodojo`、`attachment:` 文件、`<dodojo-map>` 地图），所以看起来和 App 里一样；skill 本身从不加载这个文件。

## 贡献一个 skill

- `skills/` 下一个自包含的文件夹，`SKILL.md` 的 front matter 写 `name`（与文件夹同名）、`description`、`license: MIT`，需要的话加 `references/`、`scripts/`。
- 靠前放一节 `## Workflow`：编号列表，每条 `**步骤名** - 一句话`。画廊就是按它画的。
- 至少一个示例放在 `examples/<skill>/<case>/`，由 Agent 按 skill 真实做出来，事实带来源，英文优先。在 `site-src/content.json` 和 `.claude-plugin/marketplace.json` 里登记。

## 许可

[MIT](LICENSE)。`examples/` 里的照片保留各自的许可，每页都有署名。
