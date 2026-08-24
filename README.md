# Lengxiao6 Hugo Theme

Lengxiao6 是一套面向中文内容站的 Hugo 主题，提供首页 Banner 与文章板块、文章列表和类型筛选、分类/标签/选集页、站内搜索、深浅色模式、数学公式、代码复制和常用外链卡片。

主题不包含文章、Banner、头像、域名或其他站点品牌资源。这些内容应由使用主题的博客通过 `hugo.toml`、文章 Front Matter 和站点的 `static/` 目录提供。

## 要求与安装

- Hugo `>= 0.141.0`
- 推荐通过 Hugo Modules 引入主题

在站点根目录执行：

```bash
hugo mod get github.com/Christ9038/hugo-theme-lengxiao6
hugo mod tidy
```

在站点的 `hugo.toml` 中引入：

```toml
[module]
  [[module.imports]]
    path = "github.com/Christ9038/hugo-theme-lengxiao6"
```

完整可运行示例见 [exampleSite/hugo.toml](exampleSite/hugo.toml)。

## Hugo 基础配置

```toml
baseURL = "https://example.com/"
languageCode = "zh-cn"
title = "站点名称"
enableRobotsTXT = true

[permalinks]
  posts = "/posts/:slug/"

[taxonomies]
  category = "categories"
  tag = "tags"
  series = "series"
  author = "authors"

[outputs]
  home = ["HTML", "RSS", "JSON"]
```

- `languageCode` 用于页面语言及文章数量的中英文文本。
- `title` 用于浏览器标题、页脚、默认首页标题和默认 Banner 占位内容。
- `permalinks.posts` 是推荐的文章链接格式。
- `category`、`tag`、`series` 是主题文章展示和首页筛选使用的 taxonomy；`author` 可用于 Hugo 作者 taxonomy 页面。
- `outputs.home` 必须含有 `JSON`，站内搜索依赖根目录的 `index.json`。

主题固定显示“文章”“分类”“标签”。其他主导航使用 Hugo 原生菜单配置：

```toml
[[menus.main]]
  name = "选集"
  pageRef = "series"
  weight = 10

[[menus.main]]
  name = "关于"
  url = "/about/"
  weight = 20
```

`pageRef = "posts"` 会被主题忽略，避免与固定的“文章”入口重复。

## 站点统计

主题支持 Google Analytics 4 与百度统计。两项都是可选配置，留空或不配置时不会输出任何统计脚本。

```toml
# Google Analytics 4 测量 ID。使用 G- 开头的 GA4 ID。
[services.googleAnalytics]
  id = "G-XXXXXXXXXX"

# 百度统计站点 ID，即统计代码中 hm.js? 后面的值。
[params.baiduAnalytics]
  siteId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Google Analytics 使用 Hugo 内置的 GA4 模板，遵从 Hugo 的 `[privacy.googleAnalytics]` 隐私设置。需要尊重浏览器的 Do Not Track 时，可以这样配置：

```toml
[privacy.googleAnalytics]
  disable = false
  respectDoNotTrack = true
```

已废弃的 `UA-` Universal Analytics ID 不会输出。百度统计脚本由主题在页面 `<head>` 中异步加载。两项统计脚本都由 `layouts/partials/analytics.html` 统一加载，并在 `layouts/_default/baseof.html` 中应用到所有页面。

本地开发时如果不想产生统计数据，保持两个 ID 为空即可。主题不会根据 `hugo server` 或构建环境自动屏蔽已配置的统计代码；配置了真实 ID 后，开发预览页面也会加载对应脚本。

## 全站 Params

以下是 `[params]` 直接支持的全部顶层字段：

```toml
[params]
  # 首次进入时的外观："light" 或 "dark"。默认 "light"。
  defaultAppearance = "light"

  # 页面 meta description、首页默认简介和默认 Banner 文案。
  description = "站点简介"

  # Go 时间格式。
  dateFormat = "2006年1月2日"

  # 是否显示代码复制按钮，默认 true。
  enableCodeCopy = true

  # 未指定文章封面时的回退图片，均为可选。
  defaultFeaturedImage = "img/featured-light.svg"
  defaultFeaturedImageLight = "img/featured-light.svg"
  defaultFeaturedImageDark = "img/featured-dark.svg"
```

图片路径相对于站点的 `static/` 根目录。封面优先级为：按当前主题的 `defaultFeaturedImageLight` 或 `defaultFeaturedImageDark`，再到 `defaultFeaturedImage`，最后到主题内置浅色/深色默认封面。用户切换外观会保存在浏览器本地；`defaultAppearance` 只决定首次访问的外观。

### 作者

`[params.Author]` 同时用于页头、首页和文章作者区域：

```toml
[params.Author]
  name = "站点作者"
  headline = "记录实践，分享方法"
  image = "img/avatar.jpg"
  links = [
    { telegram = "https://t.me/example" },
    { github = "https://github.com/example" },
    { bilibili = "https://space.bilibili.com/example" },
    { douyin = "https://www.douyin.com/user/example" },
    { xiaohongshu = "https://www.xiaohongshu.com/user/profile/example" },
    { youtube = "https://www.youtube.com/@example" },
    { x = "https://x.com/example" },
    { twitter = "https://x.com/example" }
  ]
```

| 字段 | 作用 |
| --- | --- |
| `name` | 作者名称；首页标题未配置时会使用它。 |
| `headline` | 页头简短介绍；默认“记录实践，分享方法”。 |
| `image` | 头像相对路径。 |
| `links` | 社交链接数组，每项为单个服务名和 URL；数组顺序即展示顺序。 |

支持的社交服务名为 `telegram`、`github`、`bilibili`、`douyin`、`xiaohongshu`、`youtube`、`x`、`twitter`。未知服务会显示通用加号图标，文字标签使用字段名。

### 页脚与备案

```toml
[params.footer]
  icp = "京ICP备00000000号-1"
  publicSecurity = "京公网安备11000000000000号"
  publicSecurityUrl = "https://beian.mps.gov.cn/"
  text = "其他说明"
```

| 字段 | 作用 |
| --- | --- |
| `icp` | 工信部备案号，显示在上方并固定链接至工信部备案网站。 |
| `publicSecurity` | 公安备案文字，显示在下方并固定附带主题内置公安备案图标。 |
| `publicSecurityUrl` | 公安备案链接；默认 `https://beian.mps.gov.cn/`。 |
| `text` | 备案信息后的补充纯文本。 |

### 文章默认设置

```toml
[params.article]
  showTableOfContents = true
  showArticleCopyright = true
  copyrightAuthor = "站点作者"
  copyrightLicense = "保留所有权利"
  copyrightLicenseLink = ""
  copyrightNotice = "版权说明，支持 **Markdown**"
```

| 字段 | 作用 |
| --- | --- |
| `showTableOfContents` | 是否显示文章目录，默认 `true`；文章无标题时不会显示目录。 |
| `showArticleCopyright` | 是否显示版权区，默认 `true`。 |
| `copyrightAuthor` | 默认版权作者；未配置时依次使用 `params.Author.name`、站点 `title`。 |
| `copyrightLicense` | 默认许可证文字；未配置时为“保留所有权利”。 |
| `copyrightLicenseLink` | 默认许可证链接；为空时许可证文字不带链接。 |
| `copyrightNotice` | 默认版权说明，支持 Markdown。 |

版权字段均可由单篇文章的同名 Front Matter 覆盖，包括 `showArticleCopyright` 开关。

## 首页配置

首页由 `[params.home]`、`[[params.home.banners]]` 与 `[[params.home.sections]]` 控制。

### 标题区

```toml
[params.home]
  eyebrow = "AI · 科技 · 实践"
  title = "第一行<br>第二行"
  description = "首页简介"
  bannerInterval = 5000
  recentOrder = 9999
```

| 字段 | 作用 |
| --- | --- |
| `eyebrow` | 首页标题上方小标题，默认 `AI · 科技 · 实践`。 |
| `title` | 首页主标题；未配置时依次使用 `params.Author.name`、站点 `title`。支持实际换行或 `<br>`。 |
| `description` | 首页简介；未配置时使用 `params.description`。 |
| `bannerInterval` | Banner 自动轮播间隔，单位毫秒，默认 `5000`；多张 Banner 时生效。 |
| `recentOrder` | 未手动配置最近文章板块时，自动补充板块的排序值，默认 `9999`。 |

### Banner

将 Banner 图放进站点的 `static/`，例如 `static/img/banner1.jpg`：

```toml
[[params.home.banners]]
  image = "img/banner1.jpg"
  title = "Banner 标题"
  description = "Banner 副标题"
  link = "/posts/example/"

[[params.home.banners]]
  image = "img/banner2.jpg"
  title = "第二张 Banner"
  description = "可继续添加任意数量的 Banner"
  link = "/categories/AI/"
```

| 字段 | 作用 |
| --- | --- |
| `image` | Banner 图片相对路径，应配置。 |
| `title` | Banner 主标题，应配置。 |
| `description` | Banner 副标题，可选。 |
| `link` | 点击跳转地址，可选；未配置为 `#`。 |

未配置 Banner 时显示主题占位区；配置多项时自动轮播并显示圆点导航。

### 首页文章板块

每个 `[[params.home.sections]]` 是一个文章列表，可配置任意多个：

```toml
[[params.home.sections]]
  key = "featured"
  source = "manual"
  sort = "order"
  order = 10
  title = "精选文章"
  description = "值得优先阅读的内容"
  href = "/posts/"
  limit = 6
  layout = "featured"
  eyebrow = "精选内容"

[[params.home.sections]]
  key = "ai"
  source = "category"
  category = "AI"
  order = 20
  title = "AI 实践"
  href = "/categories/AI/"
  limit = 6
  layout = "grid"

[[params.home.sections]]
  key = "recent"
  source = "recent"
  order = 30
  title = "最近的文章"
  href = "/posts/"
  limit = 6
  layout = "featured"
```

| 字段 | 可选值/作用 |
| --- | --- |
| `key` | 板块标识。`manual` 来源时必须与文章 `homeSections` 对应；其他来源用作唯一标识。 |
| `source` | `manual`、`recent`、`category`、`tag`、`series`；未配置为 `manual`。 |
| `category` | `source = "category"` 时匹配文章 `categories`。 |
| `tag` | `source = "tag"` 时匹配文章 `tags`。 |
| `series` | `source = "series"` 时匹配文章 `series`。 |
| `sort` | `order` 按文章 `homeOrder` 升序；其他值或未配置按发布日期倒序。`recent` 始终按日期倒序。 |
| `order` | 板块排序，数字小的在前。 |
| `title` | 板块标题。 |
| `description` | 板块标题旁说明，可选。 |
| `href` | “更多内容”链接，可选。 |
| `limit` | 最多显示文章数，默认 `6`。 |
| `layout` | `grid` 或 `featured`，作为文章列表布局类输出。 |
| `eyebrow` | 板块小标题；非 `recent` 默认“精选内容”，`recent` 默认不显示。 |

没有匹配文章的板块不会渲染。未配置 `source = "recent"` 时，主题会自动添加最近文章板块；显式配置它可控制标题、位置和数量。

## 文章 Front Matter

主题使用以下文章字段。`title`、`description`、`date`、`draft` 是 Hugo 原生字段，其余为主题字段：

```yaml
---
title: "文章标题"
description: "列表摘要和页面 meta description"
date: 2026-08-23
draft: false
featuredImage: "img/cover.jpg"

categories: ["AI"]
tags: ["Hugo", "教程"]
articleType: ["教程", "实践"]
homeSections: ["featured"]
homeOrder: 10

series: ["Hugo 入门"]
series_order: 1
seriesOpened: true
math: true

showArticleCopyright: true
copyrightAuthor: "作者"
copyrightLicense: "CC BY 4.0"
copyrightLicenseLink: "https://creativecommons.org/licenses/by/4.0/"
copyrightNotice: "许可说明，支持 **Markdown**"
---
```

| 字段 | 作用 |
| --- | --- |
| `title` | 页面、卡片和浏览器标题。 |
| `description` | 卡片摘要和 `meta description`；未配置时回退到正文摘要。 |
| `date` | 发布日期，显示格式由 `params.dateFormat` 控制。 |
| `draft` | Hugo 草稿开关；`hugo server -D` 可显示草稿。 |
| `featuredImage` | 卡片封面相对路径；未配置时使用全站默认封面。 |
| `categories` | 分类数组，用于分类页、相关文章和首页分类来源。 |
| `tags` | 标签数组，用于标签页和首页标签来源；卡片最多显示前三个。 |
| `articleType` | 类型数组；卡片显示第一个值，文章列表页按它筛选。 |
| `homeSections` | 手动首页板块的匹配数组。 |
| `homeOrder` | 首页 `sort = "order"` 时的文章排序值。 |
| `series` | 选集数组；主题使用第一个值生成文章内选集导航。 |
| `series_order` | 选集内排序和显示编号。 |
| `seriesOpened` | `true` 时选集导航默认展开。 |
| `math` | `true` 时加载 KaTeX 并渲染公式。 |
| `showArticleCopyright` | 文章级版权区开关，限制见上文文章默认设置。 |
| `copyrightAuthor` | 覆盖全站默认版权作者。 |
| `copyrightLicense` | 覆盖全站默认许可证文字。 |
| `copyrightLicenseLink` | 覆盖全站默认许可证链接。 |
| `copyrightNotice` | 覆盖全站默认版权说明，支持 Markdown。 |

## Markdown、代码与公式

推荐保留以下 Hugo 高亮设置，主题的代码块、行号与复制按钮会与之配合：

```toml
[markup.highlight]
  noClasses = false
  lineNos = true
  lineNumbersInTable = true
```

通过 `params.enableCodeCopy = false` 可全站隐藏复制按钮。代码块按标准 Markdown 书写：

````markdown
```go
fmt.Println("Hello, Hugo")
```
````

公式需配置 Goldmark passthrough：

```toml
[markup.goldmark]
  [markup.goldmark.extensions]
    [markup.goldmark.extensions.passthrough]
      enable = true
      [markup.goldmark.extensions.passthrough.delimiters]
        block = [['\\[', '\\]'], ['$$', '$$']]
        inline = [['\\(', '\\)'], ['$', '$']]
```

在文章 Front Matter 设置 `math: true` 后可使用：

```markdown
行内公式：$E = mc^2$。

$$
\\int_a^b f(x) \\, dx
$$
```

主题会在页面包含 `katex` shortcode 时加载公式资源，但不提供该 shortcode 模板；推荐使用 `math: true`。需要在 Markdown 中输出原始 HTML 时，可额外配置：

```toml
[markup.goldmark.renderer]
  unsafe = true
```

首页标题的 `<br>` 换行由主题模板直接处理，不依赖此项。

### 内置短代码

```markdown
{{< lead >}}导语文字{{< /lead >}}

{{< alert >}}提示内容，支持 **Markdown**。{{< /alert >}}

{{< badge >}}标签文字{{< /badge >}}

{{< button href="/posts/" >}}浏览文章{{< /button >}}

{{< button href="https://example.com" target="_blank" >}}外部链接{{< /button >}}
```

内置短代码为 `lead`、`alert`、`badge`、`button`、`video`。`button` 的 `href` 为必填链接地址，`target` 为可选链接目标；其他短代码只接收正文。

`video` 从当前文章 Page Bundle 读取本地视频文件。`src` 必填，也可以使用位置参数；`poster`、`caption`、`preload`、`type`、`autoplay`、`loop` 和 `muted` 可选。该 shortcode 不需要正文内容，因此旧文章中的未自闭合写法也可以继续使用：

```markdown
{{< video src="demo.mp4" >}}

{{< video src="demo.mp4" poster="cover.jpg" caption="演示视频" preload="metadata" >}}

{{< video src="demo.mp4" autoplay="true" loop="true" muted="true" >}}
```

视频文件和封面图应与文章的 `index.md` 放在同一目录中。主题会将资源发布到该文章页面，并输出带控制条、移动端内联播放和自适应宽度的 HTML5 播放器。

## 链接卡片

正文中的下列链接会自动渲染为卡片，无需额外配置：

| 域名 | 行为 |
| --- | --- |
| `github.com` | 有效 `owner/repository` 链接会请求 GitHub API，补充仓库名称、简介和 Star 数。 |
| `t.ydisks.cn`、`ydisks.cn` | 裸 URL 尝试读取公开页标题、描述、预览图和图标。Markdown 已提供链接文字时，文字优先且不请求远程页面。 |
| `pan.baidu.com` | 百度网盘服务卡片。 |
| `pan.quark.cn` | 夸克网盘服务卡片。 |
| `pan.xunlei.com` | 迅雷网盘服务卡片。 |

```markdown
https://github.com/owner/repository
https://t.ydisks.cn/r/example
[资料包名称](https://t.ydisks.cn/r/example)
[课程资料](https://pan.baidu.com/s/example)
[下载地址](https://pan.quark.cn/s/example)
[资源包](https://pan.xunlei.com/s/example)
```

Ydisks 的 Markdown 链接文字优先级最高，写了标题就不会抓取。其他网盘的链接文字也会作为卡片标题；裸 URL 使用服务默认标题。

## 站点资源规则

站点图片放在站点自己的 `static/` 目录，从配置或 Front Matter 使用相对静态根路径：

```text
your-site/
├── hugo.toml
├── content/posts/example.md
└── static/img/
    ├── avatar.jpg
    ├── banner1.jpg
    └── cover.jpg
```

对应写法为 `image = "img/avatar.jpg"`、`image = "img/banner1.jpg"`、`featuredImage: "img/cover.jpg"`。不要在主题仓库放站点 Banner、头像、文章封面或域名资源；主题内只保留可复用默认资源，例如默认封面、公安备案图标、网盘图标、字体、脚本和样式。

## 本地开发与构建

主题仓库可使用独立示例站：

```bash
hugo -s exampleSite
hugo server -s exampleSite -D
```

实际站点的构建与预览：

```bash
hugo
hugo server -D
```

## 许可

本项目采用 MIT License。详见 [LICENSE](LICENSE)。
