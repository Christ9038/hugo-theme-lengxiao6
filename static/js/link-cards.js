const linkCardText = (card, selector, value) => {
  const element = card.querySelector(selector);
  if (element && value) element.textContent = value;
};

const linkCardImage = (card, selector, value) => {
  const image = card.querySelector(selector);
  if (image && value) image.src = value;
};

const githubCardData = async card => {
  const owner = card.dataset.linkCardOwner;
  const repo = card.dataset.linkCardRepo;
  if (!owner || !repo) return;

  const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
    headers: { Accept: 'application/vnd.github+json' }
  });
  if (!response.ok) throw new Error('GitHub metadata unavailable');
  const data = await response.json();
  const description = data.description || 'GitHub 开源项目';
  const title = data.full_name || `${owner}/${repo}`;

  linkCardText(card, '[data-link-card-title-text]', title);
  linkCardText(card, '[data-link-card-description-text]', description);
  linkCardText(card, '[data-link-card-stat]', Intl.NumberFormat('zh-CN', { notation: 'compact', maximumFractionDigits: 1 }).format(data.stargazers_count || 0));
  const stat = card.querySelector('[data-link-card-stat]');
  if (stat && data.stargazers_count) stat.hidden = false;
};

const metadataValue = (document, selector) => document.querySelector(selector)?.getAttribute('content') || '';

const ydisksCardData = async card => {
  const response = await fetch(card.dataset.linkCardUrl, { credentials: 'omit' });
  if (!response.ok) throw new Error('Ydisks metadata unavailable');
  const html = await response.text();
  const remoteDocument = new DOMParser().parseFromString(html, 'text/html');
  const title = metadataValue(remoteDocument, 'meta[property="og:title"]') || remoteDocument.title || '云盘资源';
  const description = metadataValue(remoteDocument, 'meta[property="og:description"]') || metadataValue(remoteDocument, 'meta[name="description"]') || '公开资源链接';
  const image = metadataValue(remoteDocument, 'meta[property="og:image"]');
  const icon = remoteDocument.querySelector('link[rel~="icon"]')?.getAttribute('href') || '';
  const resolve = value => value ? new URL(value, response.url).href : '';

  linkCardText(card, '[data-link-card-title-text]', title);
  linkCardText(card, '[data-link-card-description-text]', description);
  linkCardImage(card, '.link-card-preview', resolve(image));
  linkCardImage(card, '.link-card-logo', resolve(icon));
};

const initLinkCards = () => {
  document.querySelectorAll('[data-link-card]').forEach(card => {
    const task = card.dataset.linkCard === 'github'
      ? githubCardData(card)
      : card.dataset.linkCard === 'ydisks'
        ? card.dataset.linkCardCustomTitle === 'true' ? null : ydisksCardData(card)
        : null;
    if (!task) return;
    task.catch(() => {
      card.classList.add('link-card--fallback');
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLinkCards);
} else {
  initLinkCards();
}
