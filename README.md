# Lengxiao Hugo Theme

独立的中文内容门户型 Hugo 主题，提供可配置首页、分类文章列表、文章类型筛选、taxonomy 页面、搜索和深色模式。

## 开发

```bash
hugo -s exampleSite
hugo server -s exampleSite -D
```

主题不包含任何博客内容，也不依赖具体站点仓库。通过 Hugo Module 引入：

```toml
[module]
  [[module.imports]]
    path = "github.com/Christ9038/hugo-theme-lengxiao"
```

文章可选字段：

```yaml
categories: ["AI"]
articleType: ["教程", "实践"]
homeSections: ["featured"]
homeOrder: 10
```

## 许可

MIT License。主题为独立实现，不包含 Blowfish 源码。

