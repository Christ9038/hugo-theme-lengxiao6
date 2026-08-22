const initThemeAndSearch = () => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem('theme');
  } catch (error) {
    savedTheme = null;
  }

  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

  const syncThemeButton = () => {
    const isDark = root.dataset.theme === 'dark';
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
