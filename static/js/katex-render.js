const renderArticleMath = () => {
  const content = document.querySelector('.article-content');
  if (!content || typeof renderMathInElement !== 'function') return;

  renderMathInElement(content, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '\\[', right: '\\]', display: true },
      { left: '$', right: '$', display: false },
      { left: '\\(', right: '\\)', display: false }
    ],
    throwOnError: false
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderArticleMath);
} else {
  renderArticleMath();
}
