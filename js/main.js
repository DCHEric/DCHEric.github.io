/* ───────────────────────────────────────────────────────────────
   DCH GEEK THEME — main.js
   ─────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // ─── SIDEBAR MOBILE TOGGLE ─────────────────────────────────
  const sidebar        = document.getElementById('sidebar');
  const overlay        = document.getElementById('sidebar-overlay');
  const hamburgerBtn   = document.getElementById('hamburger');

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    overlay && overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    overlay && overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburgerBtn && hamburgerBtn.addEventListener('click', openSidebar);
  overlay      && overlay.addEventListener('click', closeSidebar);

  // ─── ACTIVE NAV ITEM ─────────────────────────────────────
  const path = window.location.pathname;
  document.querySelectorAll('.nav-item[href]').forEach(function (el) {
    const href = el.getAttribute('href');
    if (href === '/' && (path === '/' || path === '/index.html')) {
      el.classList.add('active');
    } else if (href !== '/' && path.startsWith(href)) {
      el.classList.add('active');
    }
  });

  // ─── VIEW TOGGLE (list / grid) ────────────────────────────
  const listBtn = document.getElementById('listBtn');
  const gridBtn = document.getElementById('gridBtn');

  listBtn && listBtn.addEventListener('click', function () {
    document.body.classList.remove('grid-view');
    listBtn.classList.add('active');
    gridBtn && gridBtn.classList.remove('active');
    localStorage.setItem('dch-view', 'list');
  });

  gridBtn && gridBtn.addEventListener('click', function () {
    document.body.classList.add('grid-view');
    gridBtn.classList.add('active');
    listBtn && listBtn.classList.remove('active');
    localStorage.setItem('dch-view', 'grid');
  });

  // restore view preference
  if (localStorage.getItem('dch-view') === 'grid' && gridBtn) {
    gridBtn.click();
  }

  // ─── CATEGORY FILTER ─────────────────────────────────────
  function setupFilter() {
    var chips    = document.querySelectorAll('[data-filter]');
    var listCards = document.querySelectorAll('#postList .post-card');
    var gridCards = document.querySelectorAll('#postGrid .post-grid-card');

    if (!chips.length) return;

    function applyFilter(filter) {
      // update chips
      chips.forEach(function (c) {
        c.classList.toggle('active', c.dataset.filter === filter);
      });

      // filter list cards
      listCards.forEach(function (card) {
        var match = filter === 'all' || card.dataset.cat === filter;
        card.style.display = match ? '' : 'none';
      });

      // filter grid cards
      gridCards.forEach(function (card) {
        var match = filter === 'all' || card.dataset.cat === filter;
        card.style.display = match ? '' : 'none';
      });

      localStorage.setItem('dch-filter', filter);
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function (e) {
        e.preventDefault();
        applyFilter(c.dataset.filter);
      });
    });

    // restore filter
    var saved = localStorage.getItem('dch-filter');
    if (saved && saved !== 'all') applyFilter(saved);
  }

  setupFilter();

  // ─── TWEAKS PANEL ────────────────────────────────────────
  var tweaksToggle = document.getElementById('tweaks-toggle');
  var tweaksPanel  = document.getElementById('tweaks-panel');

  tweaksToggle && tweaksToggle.addEventListener('click', function () {
    tweaksPanel && tweaksPanel.classList.toggle('open');
  });

  document.addEventListener('click', function (e) {
    if (!tweaksPanel) return;
    if (!tweaksPanel.contains(e.target) && e.target !== tweaksToggle) {
      tweaksPanel.classList.remove('open');
    }
  });

  // accent color
  var accentSel = document.getElementById('accentSel');
  var accentClasses = ['accent-green', 'accent-amber', 'accent-purple'];

  function setAccent(val) {
    accentClasses.forEach(function (c) { document.body.classList.remove(c); });
    if (val) document.body.classList.add(val);
    localStorage.setItem('dch-accent', val || '');
  }

  // restore accent
  var savedAccent = localStorage.getItem('dch-accent');
  if (savedAccent) {
    setAccent(savedAccent);
    if (accentSel) accentSel.value = savedAccent;
  }

  accentSel && accentSel.addEventListener('change', function () {
    setAccent(this.value);
  });

  // compact mode
  var compactToggle = document.getElementById('compactToggle');
  if (localStorage.getItem('dch-compact') === '1') {
    document.body.classList.add('compact');
    if (compactToggle) compactToggle.checked = true;
  }
  compactToggle && compactToggle.addEventListener('change', function () {
    document.body.classList.toggle('compact', this.checked);
    localStorage.setItem('dch-compact', this.checked ? '1' : '');
  });

  // scanlines toggle
  var scanlineToggle = document.getElementById('scanlineToggle');
  var scanlineStyle;

  function setScanlines(on) {
    if (scanlineStyle) scanlineStyle.remove();
    if (!on) {
      scanlineStyle = document.createElement('style');
      scanlineStyle.textContent = 'body::after { display: none !important; }';
      document.head.appendChild(scanlineStyle);
    }
    localStorage.setItem('dch-scanlines', on ? '1' : '');
  }

  if (localStorage.getItem('dch-scanlines') === '') {
    setScanlines(false);
    if (scanlineToggle) scanlineToggle.checked = false;
  }
  scanlineToggle && scanlineToggle.addEventListener('change', function () {
    setScanlines(this.checked);
  });

  // grid bg toggle
  var gridBgToggle = document.getElementById('gridBgToggle');
  var gridBgStyle;

  function setGridBg(on) {
    if (gridBgStyle) gridBgStyle.remove();
    if (!on) {
      gridBgStyle = document.createElement('style');
      gridBgStyle.textContent = 'body::before { display: none !important; }';
      document.head.appendChild(gridBgStyle);
    }
    localStorage.setItem('dch-gridbg', on ? '1' : '');
  }

  if (localStorage.getItem('dch-gridbg') === '') {
    setGridBg(false);
    if (gridBgToggle) gridBgToggle.checked = false;
  }
  gridBgToggle && gridBgToggle.addEventListener('change', function () {
    setGridBg(this.checked);
  });

  // ─── TOC SCROLL SPY ──────────────────────────────────────
  function setupTocSpy() {
    var tocLinks = document.querySelectorAll('.toc a');
    if (!tocLinks.length) return;

    var headings = [];
    tocLinks.forEach(function (link) {
      var id = decodeURIComponent(link.getAttribute('href').slice(1));
      var el = document.getElementById(id);
      if (el) headings.push({ el: el, link: link });
    });

    if (!headings.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove('active'); });
          var found = headings.find(function (h) { return h.el === entry.target; });
          if (found) found.link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0% -75% 0%' });

    headings.forEach(function (h) { observer.observe(h.el); });
  }

  setupTocSpy();

  // ─── CODE BLOCK COPY BUTTON ──────────────────────────────
  function setupCodeCopy() {
    document.querySelectorAll('figure.highlight').forEach(function (fig) {
      var btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.textContent = 'copy';
      btn.setAttribute('aria-label', 'Copy code');

      btn.addEventListener('click', function () {
        var lines = fig.querySelectorAll('.code .line');
        var text = Array.from(lines).map(function (l) { return l.textContent; }).join('\n');
        navigator.clipboard && navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'copied!';
          setTimeout(function () { btn.textContent = 'copy'; }, 2000);
        });
      });

      fig.style.position = 'relative';
      fig.appendChild(btn);
    });
  }

  setupCodeCopy();

})();
