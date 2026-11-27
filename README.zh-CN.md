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

## 游戏 skills

五个 skill 做一页就能玩的游戏，各管一类。它们用同一套 dodojo 画框规矩：游戏在上、要读的在下，点下去马上有反应和声音，画面取自游戏本身的世界、深浅色都做，玩到哪儿都存在页面里，换台设备打开还在原处。

### dodojo-game

[`skills/dodojo-game`](skills/dodojo-game/SKILL.md) 做棋类、牌类和桌游：

- 细细一条对局条、棋盘和按钮一屏装下，玩法、设置、战绩和规则放在下面，下棋时界面不跳；
- 电脑对手分档且真的不一样强，存之前让各档互相对下检查过；
- 两个人用一台手机下，或者在 dodojo 团队空间里各用各的设备；
- 每一步都存着，画面取自棋盘棋子（榧木棋盘、黑石和贝壳白子、绿色台呢）。

示例：[榧木棋盘五子棋](examples/dodojo-game/gomoku/)（英文），可以跟三档电脑下，也可以两个人用一台手机下，带复盘和战绩；[雕木播棋 Mancala](examples/dodojo-game/mancala/)，Kalah 规则，种子一颗一颗播，三档电脑，两人同屏或在团队空间里各用各的手机，English / 中文 / 日本語。

<p>
  <img src="examples/dodojo-game/gomoku/preview/cover.jpg" height="240" alt="Gomoku as it opens: a kaya board">
  <img src="examples/dodojo-game/gomoku/preview/2.jpg" height="240" alt="Gomoku mid-game against the computer">
  <img src="examples/dodojo-game/mancala/preview/cover.jpg" height="240" alt="Mancala on a carved board">
  <img src="examples/dodojo-game/mancala/preview/2.jpg" height="240" alt="Mancala: a win against the computer">
</p>

### dodojo-party-game

[`skills/dodojo-party-game`](skills/dodojo-party-game/SKILL.md) 做 2 到 10 个人围着一部手机玩的聚会游戏：

- 按这一桌挑核心玩法（猜、骗、赌运气、抢、投票、抽签），想好手机怎么放：传着玩、平放在中间、举起来；
- 最要紧的词隔着桌子也看得清，每次看秘密前先盖住，手机放中间时每人在自己那边有一块拍区；
- 听得见的倒计时，每轮在高潮处收，一晚上的比分都记着；
- 题库几百条，每种语言按自己的文化写，不逐字翻译。

示例：[数字炸弹 Number Bomb](examples/dodojo-party-game/number-bomb/)，拆弹箱、越缩越小的范围和导火索，2–10 人；[差一点 Odd Word Out](examples/dodojo-party-game/odd-word-out/)，谁是卧底式的牛皮纸信封游戏，3–10 人，每种语言 150 组词。都支持 English / 中文 / 日本語。

<p>
  <img src="examples/dodojo-party-game/number-bomb/preview/cover.jpg" height="240" alt="Number Bomb, ready to play">
  <img src="examples/dodojo-party-game/number-bomb/preview/3.jpg" height="240" alt="Number Bomb: someone hit the bomb">
  <img src="examples/dodojo-party-game/odd-word-out/preview/cover.jpg" height="240" alt="Odd Word Out: sealed envelopes">
  <img src="examples/dodojo-party-game/odd-word-out/preview/1.jpg" height="240" alt="Odd Word Out: a secret word, shown while held">
</p>

### dodojo-puzzle-game

[`skills/dodojo-puzzle-game`](skills/dodojo-puzzle-game/SKILL.md) 做一个人解的谜题，每日一题或关卡包：

- 每道题都在 Node 里过求解器：有解、该唯一的唯一，难度按需要的推理来定；
- 关卡一次教一个新招，有难度曲线，中间留喘口气的关；
- 标记、笔记、无限撤销，错误只在想看时才显示，提示指出下一步能推出什么、为什么。

示例：[退潮 Low Tide](examples/dodojo-puzzle-game/low-tide/)，排成潮汐表小册子的看图解谜：12 幅海边小画从 5 × 5 到 10 × 10，外加每日一题，每道都验过解唯一，English / 中文 / 日本語。

<p>
  <img src="examples/dodojo-puzzle-game/low-tide/preview/cover.jpg" height="240" alt="Low Tide, level 1">
  <img src="examples/dodojo-puzzle-game/low-tide/preview/1.jpg" height="240" alt="Low Tide: a hint explains the next step">
  <img src="examples/dodojo-puzzle-game/low-tide/preview/2.jpg" height="240" alt="Low Tide: a solved picture">
  <img src="examples/dodojo-puzzle-game/low-tide/preview/3.jpg" height="240" alt="Low Tide: today's puzzle">
</p>

### dodojo-arcade-game

[`skills/dodojo-arcade-game`](skills/dodojo-arcade-game/SKILL.md) 做一根手指就能玩的小游戏：

- 三秒学会一个动作，配一个给它理由的场景；
- 固定步长循环，60 Hz 和 120 Hz 的手机玩起来一样，输入缓冲到下一步，拇指、鼠标、键盘都顺手；
- 反馈和事情大小相称，判定比画面宽容，前一分钟慢慢加难，一秒内重开，最高分存着；
- 存之前让机器人在 Node 里跑几百个种子，降速测过帧时间。

示例：[路灯蜘蛛 Lamplight Spider](examples/dodojo-arcade-game/lamplight-spider/)，钠灯下的蜘蛛吊着丝下去捉飞蛾、爬上来躲蝙蝠：按住下降，松手上爬。English / 中文 / 日本語。

<p>
  <img src="examples/dodojo-arcade-game/lamplight-spider/preview/cover.jpg" height="240" alt="Lamplight Spider, ready to play">
  <img src="examples/dodojo-arcade-game/lamplight-spider/preview/2.jpg" height="240" alt="Lamplight Spider in play">
  <img src="examples/dodojo-arcade-game/lamplight-spider/preview/3.jpg" height="240" alt="Lamplight Spider: the end of a run">
</p>

### dodojo-story-game

[`skills/dodojo-story-game`](skills/dodojo-story-game/SKILL.md) 做讲故事的游戏：分支剧情、推理案卷、密室逃脱、文字冒险，或者用共同回忆做的寻宝：

- 动笔前先画故事地图，选择会在后面起作用，每种结局都要自己挣来；
- 每段场景短，谜题线索都在文字里，答案框容得下小笔误，提示一级一级给；
- 存之前用脚本走遍每条路：每个场景和结局都能到，没有死路。

示例：[霍林霜冻案 The Hollin Frost](examples/dodojo-story-game/hollin-frost/)（英文），1956 年的保险理赔案卷：四点钟前查出是谁让一株名贵兰花冻死。29 个场景、两道锁、三种结局。

<p>
  <img src="examples/dodojo-story-game/hollin-frost/preview/cover.jpg" height="240" alt="The Hollin Frost: the opening scene">
  <img src="examples/dodojo-story-game/hollin-frost/preview/2.jpg" height="240" alt="The Hollin Frost: reading the thermograph">
  <img src="examples/dodojo-story-game/hollin-frost/preview/3.jpg" height="240" alt="The Hollin Frost: the yard">
</p>

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

构建时，每个 skill 的名字和简介来自 `SKILL.md`，步骤来自其中的 `## Workflow` 列表，文件清单来自 skill 文件夹，产出来自 `examples/<skill>/<case>/`（`index.html` 和照片、`meta.json`、`note.md`，以及可选的 `preview/`：`cover.jpg` 是 dodojo 首页那样的封面，`1.jpg`、`2.jpg`… 是 390 宽手机上玩起来的画面，画廊卡片和 README 用的就是这些图）。英文示例排在前面。画廊里每个页面都跑在 `site-src/dodojo-runtime.js` 里，它模拟 dodojo 的画框（深浅色配色、`window.dodojo`、`attachment:` 文件、`<dodojo-map>` 地图），所以看起来和 App 里一样；skill 本身从不加载这个文件。

## 贡献一个 skill

- `skills/` 下一个自包含的文件夹，`SKILL.md` 的 front matter 写 `name`（与文件夹同名）、`description`、`license: MIT`，需要的话加 `references/`、`scripts/`。
- 靠前放一节 `## Workflow`：编号列表，每条 `**步骤名** - 一句话`。画廊就是按它画的。
- 至少一个示例放在 `examples/<skill>/<case>/`，由 Agent 按 skill 真实做出来，事实带来源，英文优先。在 `site-src/content.json` 和 `.claude-plugin/marketplace.json` 里登记。

## 许可

[MIT](LICENSE)。`examples/` 里的照片保留各自的许可，每页都有署名。
