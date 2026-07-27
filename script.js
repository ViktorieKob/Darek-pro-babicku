(() => {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const isBooklet = params.get('booklet') === '1';
  const printButton = document.getElementById('printButton');
  const bookletButton = document.getElementById('bookletButton');
  const printHelp = document.getElementById('printHelp');
  const bookletGuide = document.getElementById('bookletGuide');
  const bookletStyles = document.getElementById('bookletStyles');
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const updatePageScale = () => {
    if (isBooklet) {
      document.querySelectorAll('.booklet-sheet-wrap').forEach((wrap) => {
        const sheet = wrap.querySelector('.booklet-sheet');
        if (!sheet) return;
        const available = Math.max(280, document.documentElement.clientWidth - 16);
        const scale = Math.min(1, available / sheet.offsetWidth);
        const scaledWidth = sheet.offsetWidth * scale;
        const scaledHeight = sheet.offsetHeight * scale;
        sheet.style.transformOrigin = 'top left';
        sheet.style.transform = `scale(${scale})`;
        sheet.style.margin = '0';
        wrap.style.width = `${scaledWidth}px`;
        wrap.style.height = `${scaledHeight}px`;
      });
      return;
    }
    const page = document.querySelector('.page');
    if (!page) return;
    const scale = Math.min(1, document.documentElement.clientWidth / page.offsetWidth);
    document.documentElement.style.setProperty('--page-scale', scale.toFixed(4));
  };

  const createBlankPage = () => {
    const blank = document.createElement('article');
    blank.className = 'page booklet-blank';
    blank.setAttribute('aria-label', 'Prázdná strana pro vazbu');
    return blank;
  };

  const makeSlot = (page) => {
    const slot = document.createElement('div');
    slot.className = 'booklet-slot';
    slot.appendChild(page);
    return slot;
  };

  const makeSheet = (leftPage, rightPage, sheetNumber, side) => {
    const wrap = document.createElement('div');
    wrap.className = 'booklet-sheet-wrap';
    const sheet = document.createElement('section');
    sheet.className = 'booklet-sheet';
    sheet.dataset.sheet = String(sheetNumber);
    sheet.dataset.side = side;
    const label = document.createElement('span');
    label.className = 'booklet-side-label';
    label.textContent = `Arch ${sheetNumber} · ${side === 'front' ? 'přední strana' : 'zadní strana'}`;
    sheet.append(label, makeSlot(leftPage), makeSlot(rightPage));
    wrap.appendChild(sheet);
    return wrap;
  };

  const buildBooklet = () => {
    document.body.classList.add('booklet-mode');
    if (bookletStyles) bookletStyles.disabled = false;
    if (bookletGuide) bookletGuide.hidden = false;
    document.title = 'Tisk jako sešit · Dárek pro babičku';

    const barTitle = document.querySelector('.print-bar strong');
    const barMeta = document.querySelector('.print-bar div > span');
    if (barTitle) barTitle.textContent = 'Tisk jako skládaný sešit';
    if (barMeta) barMeta.textContent = '20 stran · 5 archů A4 · výsledný formát A5';
    if (printButton) printButton.textContent = '↗ Tisk sešitu na šířku';
    if (bookletButton) {
      bookletButton.textContent = '← Zpět na normální časopis';
      bookletButton.href = window.location.pathname;
    }

    const magazine = document.querySelector('.magazine');
    if (!magazine) return;
    const pages = Array.from(magazine.querySelectorAll(':scope > .page'));
    while (pages.length % 4 !== 0) pages.push(createBlankPage());

    const total = pages.length;
    const sheets = [];
    for (let index = 0; index < total / 4; index += 1) {
      sheets.push(makeSheet(
        pages[total - 1 - index * 2],
        pages[index * 2],
        index + 1,
        'front'
      ));
      sheets.push(makeSheet(
        pages[index * 2 + 1],
        pages[total - 2 - index * 2],
        index + 1,
        'back'
      ));
    }
    magazine.replaceChildren(...sheets);
  };

  if (isBooklet) buildBooklet();
  updatePageScale();
  window.addEventListener('resize', updatePageScale, { passive: true });
  window.addEventListener('orientationchange', updatePageScale, { passive: true });

  if (printButton) {
    printButton.addEventListener('click', () => {
      if (isIOS && printHelp) {
        printHelp.hidden = false;
        document.body.style.overflow = 'hidden';
        return;
      }
      window.print();
    });
  }

  const closePrintHelp = () => {
    if (!printHelp) return;
    printHelp.hidden = true;
    document.body.style.overflow = '';
  };
  [document.getElementById('printHelpClose'), document.getElementById('printHelpOk')]
    .filter(Boolean)
    .forEach((button) => button.addEventListener('click', closePrintHelp));
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