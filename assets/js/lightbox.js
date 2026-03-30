/* ================================================================
   PHS Remodeling — lightbox.js
   Supports images and videos (.mp4 .webm .mov).
   Only items with a non-empty data-src get a click handler.
   Keyboard: Escape = close, ← → = prev/next, Space = play/pause.
   Touch: swipe left/right.
   ================================================================ */

(function () {
  'use strict';

  /* ── DOM refs ── */
  const overlay   = document.getElementById('lightbox');
  if (!overlay) return;

  const imgEl     = document.getElementById('lightboxImg');
  const vidEl     = document.getElementById('lightboxVid');
  const caption   = document.getElementById('lightboxCaption');
  const counter   = document.getElementById('lightboxCounter');
  const typeBadge = document.getElementById('lightboxTypeBadge');
  const btnClose  = document.getElementById('lightboxClose');
  const btnPrev   = document.getElementById('lightboxPrev');
  const btnNext   = document.getElementById('lightboxNext');

  let gallery = [];  // items with real data-src, for the current project
  let current = 0;

  /* ─────────────────────────────────────────────
     OPEN
     items    = all .fc-media in the clicked gallery
     clickIdx = index of the clicked item (in `items`)
     ───────────────────────────────────────────── */
  function open(items, clickIdx) {
    /* Build the viewable gallery — only items that have a real src */
    gallery = items.filter(el => el.dataset.src && el.dataset.src.trim() !== '');
    if (!gallery.length) return;

    /* Find position of clicked item inside the filtered gallery */
    const clicked   = items[clickIdx];
    const galleryIdx = gallery.indexOf(clicked);
    current = galleryIdx >= 0 ? galleryIdx : 0;

    render();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (btnClose) btnClose.focus();
  }

  /* ─────────────────────────────────────────────
     CLOSE
     ───────────────────────────────────────────── */
  function close() {
    if (vidEl) {
      vidEl.pause();
      vidEl.removeAttribute('src');
      vidEl.load();
    }
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { if (imgEl) imgEl.src = ''; }, 320);
  }

  /* ─────────────────────────────────────────────
     RENDER — swap between image / video player
     ───────────────────────────────────────────── */
  function render() {
    const el      = gallery[current];
    const src     = el.dataset.src || '';
    const cap     = el.dataset.caption || '';
    const isVideo = el.dataset.type === 'video' || /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(src);

    if (counter)   counter.textContent   = gallery.length > 1 ? `${current + 1} / ${gallery.length}` : '';
    if (typeBadge) typeBadge.textContent = isVideo ? '▶ Video' : '';
    if (caption)   caption.textContent   = cap;

    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current === gallery.length - 1;

    if (isVideo) {
      /* Show video player */
      if (imgEl) { imgEl.src = ''; imgEl.style.display = 'none'; }
      if (vidEl) {
        vidEl.style.display = 'block';
        vidEl.src = src;
        vidEl.load();
        setTimeout(() => vidEl.play().catch(() => {}), 180);
      }
    } else {
      /* Show image */
      if (vidEl) {
        vidEl.pause();
        vidEl.removeAttribute('src');
        vidEl.load();
        vidEl.style.display = 'none';
      }
      if (imgEl) {
        imgEl.style.display = 'block';
        imgEl.src = src;
        imgEl.alt = cap;
      }
    }
  }

  /* ─────────────────────────────────────────────
     NAVIGATE
     ───────────────────────────────────────────── */
  function prev() { if (current > 0)                   { current--; render(); } }
  function next() { if (current < gallery.length - 1)  { current++; render(); } }

  /* ─────────────────────────────────────────────
     BIND — attach to every project gallery
     Only items with a real data-src get a cursor + click handler
     ───────────────────────────────────────────── */
  document.querySelectorAll('.fc-gallery').forEach(galleryEl => {
    const allItems = Array.from(galleryEl.querySelectorAll('.fc-media'));

    allItems.forEach((item, i) => {
      const hasSrc = item.dataset.src && item.dataset.src.trim() !== '';

      if (!hasSrc) {
        /* Placeholder — not clickable */
        item.style.cursor = 'default';
        return;
      }

      /* Real media — make it clearly clickable */
      item.style.cursor = 'zoom-in';

      item.addEventListener('click', () => open(allItems, i));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(allItems, i);
        }
      });
    });
  });

  /* ─────────────────────────────────────────────
     CONTROLS
     ───────────────────────────────────────────── */
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev)  btnPrev.addEventListener('click', prev);
  if (btnNext)  btnNext.addEventListener('click', next);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape')     { close(); return; }
    if (e.key === 'ArrowLeft')  { prev();  return; }
    if (e.key === 'ArrowRight') { next();  return; }
    if (e.key === ' ' && vidEl && vidEl.style.display !== 'none') {
      e.preventDefault();
      vidEl.paused ? vidEl.play() : vidEl.pause();
    }
  });

  /* ─────────────────────────────────────────────
     SWIPE (touch)
     ───────────────────────────────────────────── */
  let tx = null, ty = null;
  overlay.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
  }, { passive: true });
  overlay.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
      dx < 0 ? next() : prev();
    }
    tx = null; ty = null;
  }, { passive: true });

})();
