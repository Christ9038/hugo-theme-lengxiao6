const initThemeAndSearch = () => {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const themeIcon = document.querySelector('[data-theme-icon]');
  const syncThemeButton = () => {
    const isDark = root.dataset.theme === 'dark';
    if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☾';
    themeButton?.setAttribute('aria-pressed', String(isDark));
    themeButton?.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
  };
  syncThemeButton();
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
    syncThemeButton();
  });
  document.querySelectorAll('.type-filters').forEach(filters => filters.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    filters.querySelectorAll('button').forEach(item => item.classList.remove('active')); button.classList.add('active');
    const type = button.dataset.type; const group = filters.closest('.post-group');
    group.querySelectorAll('.type-item').forEach(item => { item.hidden = type !== 'all' && !item.dataset.articleTypes.split(',').includes(type); });
  }));
  const input = document.querySelector('#search-input'); const results = document.querySelector('#search-results');
  if (input && results) fetch(root.dataset.searchIndex || '/index.json').then(response => response.json()).then(items => {
    const render = query => { const value = query.toLowerCase(); results.innerHTML = items.filter(item => JSON.stringify(item).toLowerCase().includes(value)).map(item => `<article class="article-card"><div class="card-body"><div class="card-meta">${(item.categories || []).join(' · ')}</div><h3><a href="${item.url}">${item.title}</a></h3><p>${item.description || ''}</p></div></article>`).join(''); };
    input.addEventListener('input', () => render(input.value)); render('');
  }).catch(() => { results.textContent = '搜索索引暂不可用。'; });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeAndSearch);
} else {
  initThemeAndSearch();
}
