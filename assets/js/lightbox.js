/* ================================================================
   PHS Remodeling — lightbox.js
   ================================================================
   Handles the image lightbox for project gallery items.
   Triggered by clicking any .media-item that has a data-src attribute.
   Keyboard: Escape = close, ← → = prev/next.
   ================================================================ */

(function () {
  'use strict';

  const overlay  = document.getElementById('lightbox');
  const imgEl    = document.getElementById('lightboxImg');
  const caption  = document.getElementById('lightboxCaption');
  const counter  = document.getElementById('lightboxCounter');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev  = document.getElementById('lightboxPrev');
  const btnNext  = document.getElementById('lightboxNext');

  if (!overlay) return;

  let gallery = [];  // all clickable items in the current project row
  let current = 0;   // current index within gallery

  /* ── Open ── */
  function open(items, index) {
    // Only use items that have a non-empty data-src (real images)
    gallery = items.filter(el => el.dataset.src && el.dataset.src.trim() !== '');
    if (!gallery.length) return;

    current = Math.max(0, Math.min(index, gallery.length - 1));
    render();

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Move focus into lightbox
    btnClose.focus();
  }

  /* ── Close ── */
  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Delay clearing src so close animation completes
    setTimeout(() => { imgEl.src = ''; }, 320);
  }

  /* ── Render current image ── */
  function render() {
    const el = gallery[current];

    imgEl.src = el.dataset.src;
    imgEl.alt = el.dataset.caption || '';

    if (caption) caption.textContent = el.dataset.caption || '';
    if (counter) counter.textContent = gallery.length > 1
      ? `${current + 1} / ${gallery.length}`
      : '';

    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current === gallery.length - 1;
  }

  /* ── Navigate ── */
  function prev() {
    if (current > 0) { current--; render(); }
  }
  function next() {
    if (current < gallery.length - 1) { current++; render(); }
  }

  /* ── Bind gallery clicks ──────────────────────────────────── */
  document.querySelectorAll('.project-gallery').forEach(galleryEl => {
    const items = Array.from(galleryEl.querySelectorAll('.media-item'));

    items.forEach((item, i) => {
      // Click
      item.addEventListener('click', () => open(items, i));

      // Keyboard (Enter / Space)
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(items, i);
        }
      });
    });
  });

  /* ── Lightbox controls ── */
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev)  btnPrev.addEventListener('click',  prev);
  if (btnNext)  btnNext.addEventListener('click',  next);

  // Click outside image to close
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    switch (e.key) {
      case 'Escape':     close(); break;
      case 'ArrowLeft':  prev();  break;
      case 'ArrowRight': next();  break;
    }
  });

  /* ── Swipe support (touch) ── */
  let touchStartX = null;
  overlay.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  overlay.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
    touchStartX = null;
  }, { passive: true });

})();
