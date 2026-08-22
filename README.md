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

[[params.home.sections]]
  key = "featured"
  title = "精选文章"
  href = "/posts/"
  limit = 6
```

主题仓库的 `exampleSite/` 是独立示例站点，可直接用于本地开发和视觉验证。

## 许可

本项目采用 MIT License。详见 [LICENSE](LICENSE)。
