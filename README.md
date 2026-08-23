# Lengxiao6 Hugo Theme

Lengxiao6 是一套独立的中文内容门户型 Hugo 主题，适合个人博客、知识库和资源型内容网站。主题提供可配置首页、分类文章列表、文章类型筛选、taxonomy 页面、搜索和深色模式。

主题与具体站点内容解耦，不包含任何文章、品牌图片或域名配置。

## 开发

```bash
hugo -s exampleSite
hugo server -s exampleSite -D
```

通过 Hugo Module 引入：

```toml
[module]
  [[module.imports]]
    path = "github.com/Christ9038/hugo-theme-lengxiao6"
```

文章可选字段：

```yaml
categories: ["AI"]
articleType: ["教程", "实践"]
homeSections: ["featured"]
homeOrder: 10
```

首页可以在站点配置中设置作者信息、Banner 和内容板块：

```toml
[params.Author]
  name = "站点作者"
  headline = "记录实践，分享方法"
  image = "img/avatar.jpg"
  links = [
    { bilibili = "https://space.bilibili.com/你的账号" },
    { douyin = "https://www.douyin.com/user/你的账号" },
    { xiaohongshu = "https://www.xiaohongshu.com/user/profile/你的账号" },
    { youtube = "https://www.youtube.com/@你的账号" },
    { x = "https://x.com/你的账号" }
  ]

[params.footer]
  icp = "京ICP备00000000号-1"
  publicSecurity = "京公网安备11000000000000号"
  publicSecurityUrl = "https://beian.mps.gov.cn/"

[[params.home.sections]]
  key = "featured"
  source = "manual"
  order = 10
  title = "精选文章"
  href = "/posts/"
  limit = 6

[[params.home.sections]]
  key = "ai"
  source = "category"
  category = "AI"
  order = 20
  title = "AI 实践"
  href = "/categories/AI/"
  limit = 6
```

首页板块支持 `manual`、`recent`、`category`、`tag` 和 `series` 五种文章来源。`manual` 会读取文章前言中的 `homeSections`，适合精确控制文章归属；其他来源按对应分类、标签或选集自动取文章。每个板块都可以独立设置 `title`、`description`、`href`、`limit`、`layout` 和 `order`，因此首页可以配置多个文章板块。未配置时，主题会自动追加“最近的文章”板块，并放在最后；可通过 `params.home.recentOrder` 调整它的位置，也可以显式配置 `key = "recent"` 覆盖默认设置。

Banner 使用 `[[params.home.banners]]` 重复配置，每项包含 `image`、`title`、`description` 和 `link`。数量不设上限；配置多项时自动启用轮播和底部圆点导航。不配置时会显示主题默认占位图。Banner 图片属于站点内容，应放在使用主题的站点 `static/` 目录中；主题只提供默认占位图，不携带具体站点的 Banner。

备案文字与链接由站点配置提供。公安备案图标是主题统一资源，主题会在配置了 `publicSecurity` 时固定显示。

## 配置参考

主题只读取以下站点参数；未配置的项目会使用主题默认值。站点只应通过 `hugo.toml`、文章 Front Matter 和站点 `static/` 中的内容资源定制页面，不要在站点仓库新增 `layouts/` 或 `assets/` 覆盖主题。

```toml
[params]
  defaultAppearance = "light" # "light" 或 "dark"
  description = "站点简介"
  dateFormat = "2006年1月2日"
  enableCodeCopy = true

  # 可选。未配置时使用主题自带的浅色/深色默认封面。
  defaultFeaturedImage = "img/featured-light.svg"
  defaultFeaturedImageLight = "img/featured-light.svg"
  defaultFeaturedImageDark = "img/featured-dark.svg"

  [params.Author]
    name = "站点作者"
    headline = "一句简介"
    image = "img/avatar.jpg"
    links = [{ github = "https://github.com/example" }]

  [params.article]
    showTableOfContents = true
    showArticleCopyright = true
    copyrightAuthor = "站点作者"
    copyrightLicense = "保留所有权利"
    copyrightLicenseLink = ""
    copyrightNotice = "版权说明"

  [params.footer]
    icp = "京ICP备00000000号-1"
    publicSecurity = "京公网安备11000000000000号"
    publicSecurityUrl = "https://beian.mps.gov.cn/"
    text = ""

  [params.home]
    eyebrow = "AI · 科技 · 实践"
    title = "站点标题"
    description = "首页简介"
    bannerInterval = 5000
    recentOrder = 9999 # 仅在未显式配置 recent 板块时使用

```

`params.home.banners` 是可选数组；不配置时首页使用主题默认 Banner 占位区。每个 Banner 可配置 `image`、`title`、`description` 与 `link`。`params.home.sections` 的每项可配置 `key`、`source`、`category`、`tag`、`series`、`sort`、`order`、`title`、`description`、`href`、`limit`、`layout` 与 `eyebrow`。`source` 可选 `manual`、`recent`、`category`、`tag` 或 `series`；`layout` 可选 `grid` 或 `featured`。

文章 Front Matter 支持 `featuredImage`、`categories`、`tags`、`articleType`、`homeSections`、`homeOrder`、`series`、`series_order`、`seriesOpened`、`math`。版权相关的 `showArticleCopyright`、`copyrightAuthor`、`copyrightLicense`、`copyrightLicenseLink` 和 `copyrightNotice` 可在单篇文章中覆盖全站默认值。

站点图片如头像、文章封面和 Banner 应放在站点自己的 `static/` 目录，并通过上述配置或 Front Matter 引用。主题提供的字体、默认封面、公安备案图标、数学公式库、样式、脚本和模板均由主题自身加载。

GitHub、Ydisks、百度网盘、夸克网盘和迅雷网盘链接会渲染为卡片。网盘链接的 Markdown 文本标题优先级最高，例如 `[PPT 资源合集](https://pan.baidu.com/s/...)`；写了标题时不会读取远程页面。裸 Ydisks URL 才会读取公开页面的标题、描述、预览图和图标，其他裸网盘 URL 显示服务默认标题。

主题仓库的 `exampleSite/` 是独立示例站点，可直接用于本地开发和视觉验证。

## 许可

本项目采用 MIT License。详见 [LICENSE](LICENSE)。
