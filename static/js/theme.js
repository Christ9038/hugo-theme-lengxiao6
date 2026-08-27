const initThemeAndSearch = () => {
  const root = document.documentElement;
  const siteHeader = document.querySelector('.site-header');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mainNavigation = document.querySelector('#main-navigation');
  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  let savedTheme = null;

  const closeNavigation = () => {
    siteHeader?.classList.remove('is-nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', '打开导航菜单');
    navToggle?.setAttribute('title', '打开导航菜单');
  };

  navToggle?.addEventListener('click', () => {
    const isOpen = siteHeader?.classList.toggle('is-nav-open') ?? false;
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
    navToggle.setAttribute('title', isOpen ? '关闭导航菜单' : '打开导航菜单');
  });
  mainNavigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNavigation();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) closeNavigation();
  });

  try {
    savedTheme = localStorage.getItem('theme');
  } catch (error) {
    savedTheme = null;
  }

  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

  const syncThemeButton = () => {
    const isDark = root.dataset.theme === 'dark';
    const themeColor = getComputedStyle(root).getPropertyValue('--bg').trim();
    if (themeColorMeta && themeColor) themeColorMeta.setAttribute('content', themeColor);
    document.querySelectorAll('[data-theme-image]').forEach(image => {
      const source = isDark ? image.dataset.darkSrc : image.dataset.lightSrc;
      if (source && image.getAttribute('src') !== source) image.setAttribute('src', source);
    });
    if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☾';
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(isDark));
      themeButton.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
      themeButton.setAttribute('title', isDark ? '切换到浅色模式' : '切换到深色模式');
    }
  };

  syncThemeButton();
  themeButton?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    try {
      localStorage.setItem('theme', nextTheme);
    } catch (error) {
      // Theme switching still works when storage is unavailable.
    }
    syncThemeButton();
  });

  const banner = document.querySelector('[data-banner-rotator]');
  if (banner) {
    const slides = [...banner.querySelectorAll('[data-banner-slide]')];
    const dots = [...banner.querySelectorAll('[data-banner-dot]')];
    const previous = banner.querySelector('[data-banner-prev]');
    const next = banner.querySelector('[data-banner-next]');
    const counter = banner.querySelector('[data-banner-current]');
    let current = slides.findIndex(slide => slide.classList.contains('is-active'));
    let timer = null;

    if (slides.length > 1) {
      if (current < 0) current = 0;
      const show = index => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === current));
        dots.forEach((dot, dotIndex) => {
          if (dotIndex === current) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
        if (counter) counter.textContent = String(current + 1);
      };
      const stop = () => {
        if (timer) window.clearInterval(timer);
        timer = null;
      };
      const start = () => {
        stop();
        timer = window.setInterval(() => show(current + 1), Number(banner.dataset.interval) || 5000);
      };

      previous?.addEventListener('click', () => { show(current - 1); start(); });
      next?.addEventListener('click', () => { show(current + 1); start(); });
      dots.forEach((dot, index) => dot.addEventListener('click', () => { show(index); start(); }));
      banner.addEventListener('mouseenter', stop);
      banner.addEventListener('mouseleave', start);
      banner.addEventListener('focusin', stop);
      banner.addEventListener('focusout', event => {
        if (!banner.contains(event.relatedTarget)) start();
      });
      show(current);
      start();
    }
  }

  document.querySelectorAll('.type-filters').forEach(filters => filters.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    filters.querySelectorAll('button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const type = button.dataset.type;
    filters.closest('.post-group').querySelectorAll('.type-item').forEach(item => {
      item.hidden = type !== 'all' && !item.dataset.articleTypes.split(',').includes(type);
    });
  }));

  const copyText = async text => {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch (error) {
        // Fall back for browsers that deny the asynchronous clipboard permission.
      }
    }

    const fallback = document.createElement('textarea');
    fallback.value = text;
    fallback.setAttribute('readonly', '');
    fallback.style.position = 'fixed';
    fallback.style.opacity = '0';
    document.body.append(fallback);
    fallback.select();
    const copied = document.execCommand('copy');
    fallback.remove();
    if (!copied) throw new Error('Clipboard unavailable');
  };

  if (document.body?.dataset.codeCopy !== 'false') {
    document.querySelectorAll('.article-content > .highlight, .article-content .highlight-wrapper').forEach(block => {
      if (block.querySelector(':scope > .code-copy')) return;
      const source = [...block.querySelectorAll('code')].find(code => !code.querySelector('.lnt'));
      if (!source) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy';
      button.textContent = '复制';
        button.setAttribute('aria-label', '复制代码');
        button.addEventListener('click', async () => {
          try {
          await copyText(source.textContent);
          button.textContent = '已复制';
          window.setTimeout(() => { button.textContent = '复制'; }, 1400);
        } catch (error) {
          button.textContent = '复制失败';
          window.setTimeout(() => { button.textContent = '复制'; }, 1400);
        }
      });
      block.append(button);
    });
  }

  const input = document.querySelector('#search-input');
  const results = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  if (!input || !results) return;

  const indexURL = root.dataset.searchIndex || '/index.json';
  fetch(indexURL)
    .then(response => {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.json();
    })
    .then(items => {
      const render = query => {
        const value = query.trim().toLowerCase();
        const matches = items.filter(item => JSON.stringify(item).toLowerCase().includes(value));
        results.replaceChildren();
        matches.forEach(item => {
          const card = document.createElement('article');
          card.className = 'article-card';
          const body = document.createElement('div');
          body.className = 'card-body';
          const meta = document.createElement('div');
          meta.className = 'card-meta';
          meta.textContent = (item.categories || []).join(' · ');
          const heading = document.createElement('h3');
          const link = document.createElement('a');
          link.href = item.url;
          link.textContent = item.title;
          heading.append(link);
          const description = document.createElement('p');
          description.textContent = item.description || '';
          body.append(meta, heading, description);
          card.append(body);
          results.append(card);
        });
        if (status) status.textContent = value ? `找到 ${matches.length} 篇相关文章` : `共 ${matches.length} 篇文章`;
      };

      input.addEventListener('input', () => render(input.value));
      render('');
    })
    .catch(() => {
      if (status) status.textContent = '搜索索引暂不可用。';
    });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeAndSearch);
} else {
  initThemeAndSearch();
}
