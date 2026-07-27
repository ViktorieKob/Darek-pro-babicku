(() => {
  'use strict';
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