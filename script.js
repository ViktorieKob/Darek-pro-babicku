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
  const printHelp = document.getElementById('printHelp');
  const closeButtons = [
    document.getElementById('printHelpClose'),
    document.getElementById('printHelpOk')
  ].filter(Boolean);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (!button) return;
  button.addEventListener('click', () => {
    if (isIOS && printHelp) {
      printHelp.hidden = false;
      document.body.style.overflow = 'hidden';
      return;
    }
    window.print();
  });
  const closePrintHelp = () => {
    if (!printHelp) return;
    printHelp.hidden = true;
    document.body.style.overflow = '';
  };
  closeButtons.forEach((closeButton) => closeButton.addEventListener('click', closePrintHelp));
  printHelp?.addEventListener('click', (event) => {
    if (event.target === printHelp) closePrintHelp();
  });
  window.addEventListener('beforeprint', () => {
    document.documentElement.dataset.printing = 'true';
  });
  window.addEventListener('afterprint', () => {
    delete document.documentElement.dataset.printing;
  });
})();