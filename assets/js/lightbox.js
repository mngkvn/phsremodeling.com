/* ================================================================
   PHS Remodeling — lightbox.js
   Supports: images (.jpg .png .webp .gif) and videos (.mp4 .webm .mov)
   Triggered by clicking any .fc-media with a non-empty data-src.
   data-type="image" | "video" tells the viewer which player to use.
   Keyboard: Escape = close, ← → = navigate, Space = play/pause video.
   Touch: swipe left/right to navigate.
   ================================================================ */

(function () {
  'use strict';

  /* ── DOM refs ── */
  const overlay    = document.getElementById('lightbox');
  if (!overlay) return;

  const mediaWrap  = document.getElementById('lightboxMedia');
  const imgEl      = document.getElementById('lightboxImg');
  const vidEl      = document.getElementById('lightboxVid');
  const caption    = document.getElementById('lightboxCaption');
  const counter    = document.getElementById('lightboxCounter');
  const typeBadge  = document.getElementById('lightboxTypeBadge');
  const btnClose   = document.getElementById('lightboxClose');
  const btnPrev    = document.getElementById('lightboxPrev');
  const btnNext    = document.getElementById('lightboxNext');

  let gallery = [];   // filtered items with a real data-src
  let current = 0;

  /* ─────────────────────────────────────────────────────────────
     OPEN — called with the item array from a project's gallery
     and the index of the clicked item.
     ───────────────────────────────────────────────────────────── */
  function open(items, clickedIndex) {
    // Only include items that have a real src
    gallery = items.filter(el => el.dataset.src && el.dataset.src.trim() !== '');
    if (!gallery.length) return;

    // Find the clicked item's position in the filtered gallery
    const clickedSrc = items[clickedIndex] && items[clickedIndex].dataset.src;
    const filteredIdx = gallery.findIndex(el => el === items[clickedIndex]);
    current = filteredIdx >= 0 ? filteredIdx : 0;

    render();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    btnClose && btnClose.focus();
  }

  /* ─────────────────────────────────────────────────────────────
     CLOSE
     ───────────────────────────────────────────────────────────── */
  function close() {
    // Pause & reset video before closing
    if (vidEl) {
      vidEl.pause();
      vidEl.removeAttribute('src');
      vidEl.load();
    }
    overlay.classList.remove('active');
    document.body.style.overflow = '';

    // Clear image src after animation
    setTimeout(() => {
      if (imgEl) imgEl.src = '';
    }, 320);
  }

  /* ─────────────────────────────────────────────────────────────
     RENDER — swap between image and video modes
     ───────────────────────────────────────────────────────────── */
  function render() {
    const el      = gallery[current];
    const src     = el.dataset.src || '';
    const cap     = el.dataset.caption || '';
    const isVideo = el.dataset.type === 'video' || isVideoUrl(src);

    // Counter
    if (counter) {
      counter.textContent = gallery.length > 1 ? `${current + 1} / ${gallery.length}` : '';
    }

    // Type badge
    if (typeBadge) {
      typeBadge.textContent = isVideo ? '▶ Video' : '';
    }

    // Caption
    if (caption) caption.textContent = cap;

    // Prev / Next state
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current === gallery.length - 1;

    if (isVideo) {
      // ── Video mode ──
      if (imgEl) { imgEl.src = ''; imgEl.style.display = 'none'; }
      if (vidEl) {
        vidEl.style.display = 'block';
        vidEl.src = src;
        vidEl.load();
        // Autoplay with a small delay so overlay animation finishes first
        setTimeout(() => vidEl.play().catch(() => {}), 200);
      }
    } else {
      // ── Image mode ──
      if (vidEl) {
        vidEl.pause();
        vidEl.removeAttribute('src');
        vidEl.load();
        vidEl.style.display = 'none';
      }
      if (imgEl) {
        imgEl.style.display = 'block';
        imgEl.src  = src;
        imgEl.alt  = cap;
      }
    }
  }

  /* Helper — detect video by file extension */
  function isVideoUrl(url) {
    return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
  }

  /* ─────────────────────────────────────────────────────────────
     NAVIGATE
     ───────────────────────────────────────────────────────────── */
  function prev() {
    if (current > 0) { current--; render(); }
  }
  function next() {
    if (current < gallery.length - 1) { current++; render(); }
  }

  /* ─────────────────────────────────────────────────────────────
     BIND CLICKS — attach to every .fc-gallery on the page
     ───────────────────────────────────────────────────────────── */
  document.querySelectorAll('.fc-gallery').forEach(galleryEl => {
    const items = Array.from(galleryEl.querySelectorAll('.fc-media'));

    items.forEach((item, i) => {
      item.addEventListener('click', () => open(items, i));
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(items, i);
        }
      });
    });
  });

  /* ─────────────────────────────────────────────────────────────
     CONTROLS
     ───────────────────────────────────────────────────────────── */
  btnClose && btnClose.addEventListener('click', close);
  btnPrev  && btnPrev.addEventListener('click', prev);
  btnNext  && btnNext.addEventListener('click', next);

  // Click backdrop to close (but not the video/image itself)
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target === mediaWrap) close();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    switch (e.key) {
      case 'Escape':
        close();
        break;
      case 'ArrowLeft':
        prev();
        break;
      case 'ArrowRight':
        next();
        break;
      case ' ':
        // Space toggles play/pause on video
        if (vidEl && vidEl.style.display !== 'none') {
          e.preventDefault();
          vidEl.paused ? vidEl.play() : vidEl.pause();
        }
        break;
    }
  });

  /* ─────────────────────────────────────────────────────────────
     SWIPE (touch)
     ───────────────────────────────────────────────────────────── */
  let touchStartX = null;
  let touchStartY = null;

  overlay.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  overlay.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Only trigger for primarily horizontal swipes
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
      dx < 0 ? next() : prev();
    }
    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

})();
