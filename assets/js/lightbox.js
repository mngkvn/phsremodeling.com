/* ================================================================
   PHS Remodeling — lightbox.js
   Image + video lightbox for project gallery photos and video
   highlights. Click any .fc-media / .video-card with a real
   data-src to open. Video items use data-type="video".
   Keyboard: Escape = close,  ← → = navigate.
   Touch: swipe left/right.
   ================================================================ */

(function () {
  'use strict';

  const overlay  = document.getElementById('lightbox');
  if (!overlay) return;

  const imgEl    = document.getElementById('lightboxImg');
  const vidEl    = document.getElementById('lightboxVid');
  const caption  = document.getElementById('lightboxCaption');
  const counter  = document.getElementById('lightboxCounter');
  const typeBadge= document.getElementById('lightboxTypeBadge');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev  = document.getElementById('lightboxPrev');
  const btnNext  = document.getElementById('lightboxNext');

  let gallery = [];
  let current = 0;

  /* ── Open ── */
  function open(allItems, clickIdx) {
    gallery = allItems.filter(el => el.dataset.src && el.dataset.src.trim() !== '');
    if (!gallery.length) return;

    const clicked    = allItems[clickIdx];
    const galleryIdx = gallery.indexOf(clicked);
    current = galleryIdx >= 0 ? galleryIdx : 0;

    render();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (btnClose) btnClose.focus();
  }

  /* ── Close ── */
  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (imgEl) imgEl.src = '';
      if (vidEl) { vidEl.pause(); vidEl.removeAttribute('src'); vidEl.load(); }
    }, 320);
  }

  /* ── Render ── */
  function render() {
    const el   = gallery[current];
    const src  = el.dataset.src || '';
    const cap  = el.dataset.caption || '';
    const type = el.dataset.type === 'video' ? 'video' : 'image';

    if (counter)    counter.textContent    = gallery.length > 1 ? `${current + 1} / ${gallery.length}` : '';
    if (typeBadge)  typeBadge.textContent  = type === 'video' ? 'Video' : '';
    if (caption)    caption.textContent    = cap;
    if (btnPrev)    btnPrev.disabled       = current === 0;
    if (btnNext)    btnNext.disabled       = current === gallery.length - 1;

    if (type === 'video') {
      if (vidEl) {
        vidEl.style.display = 'block';
        vidEl.src = src;
        vidEl.load();
      }
      if (imgEl) {
        imgEl.style.display = 'none';
        imgEl.src = '';
        imgEl.alt = '';
      }
    } else {
      if (vidEl) {
        vidEl.pause();
        vidEl.style.display = 'none';
        vidEl.removeAttribute('src');
        vidEl.load();
      }
      if (imgEl) {
        imgEl.style.display = 'block';
        imgEl.src = src;
        imgEl.alt = cap;
      }
    }
  }

  /* ── Navigate ── */
  function prev() { if (current > 0)                  { current--; render(); } }
  function next() { if (current < gallery.length - 1) { current++; render(); } }

  /* ── Bind to every project gallery ── */
  document.querySelectorAll('.fc-gallery').forEach(galleryEl => {
    const items = Array.from(galleryEl.querySelectorAll('.fc-media'));
    items.forEach((item, i) => {
      const hasSrc = item.dataset.src && item.dataset.src.trim() !== '';
      item.style.cursor = hasSrc ? 'zoom-in' : 'default';
      if (!hasSrc) return;

      item.addEventListener('click', () => open(items, i));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(items, i); }
      });
    });
  });

  /* ── Bind to the video highlights gallery ── */
  document.querySelectorAll('.video-grid').forEach(galleryEl => {
    const items = Array.from(galleryEl.querySelectorAll('.video-card'));
    items.forEach((item, i) => {
      const hasSrc = item.dataset.src && item.dataset.src.trim() !== '';
      item.style.cursor = hasSrc ? 'zoom-in' : 'default';
      if (!hasSrc) return;

      item.addEventListener('click', () => open(items, i));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(items, i); }
      });
    });
  });

  /* ── Controls ── */
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev)  btnPrev.addEventListener('click', prev);
  if (btnNext)  btnNext.addEventListener('click', next);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  /* ── Swipe ── */
  let tx = null, ty = null;
  overlay.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  overlay.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) { dx < 0 ? next() : prev(); }
    tx = null; ty = null;
  }, { passive: true });

})();
