(() => {
  'use strict';
  const updatePageScale = () => {
    const page = document.querySelector('.page');
    if (!page) return;
    const availableWidth = document.documentElement.clientWidth;
    const scale = Math.min(1, availableWidth / page.offsetWidth);
    document.documentElement.style.setProperty('--page-scale', scale.toFixed(4));
  };

  updatePageScale();
  window.addEventListener('resize', updatePageScale, { passive: true });
  window.addEventListener('orientationchange', updatePageScale, { passive: true });
  const button = document.getElementById('printButton');
  if (!button) return;
  button.addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', () => {
    document.documentElement.dataset.printing = 'true';
  });
  window.addEventListener('afterprint', () => {
    delete document.documentElement.dataset.printing;
  });
})();