/* ================================================================
   PHS Remodeling — lightbox.js
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
   Supports images and videos (.mp4 .webm .mov).
   Only items with a non-empty data-src get a click handler.
   Keyboard: Escape = close, ← → = prev/next, Space = play/pause.
   Touch: swipe left/right.
=======
=======
>>>>>>> parent of d827440 (Changed lightbox to support videos)
   ================================================================
   Handles the image lightbox for project gallery items.
   Triggered by clicking any .media-item that has a data-src attribute.
   Keyboard: Escape = close, ← → = prev/next.
<<<<<<< HEAD
>>>>>>> parent of d827440 (Changed lightbox to support videos)
=======
>>>>>>> parent of d827440 (Changed lightbox to support videos)
   ================================================================ */

(function () {
  'use strict';

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
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
<<<<<<< HEAD
<<<<<<< HEAD

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

=======
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
>>>>>>> parent of d827440 (Changed lightbox to support videos)
=======
  const overlay  = document.getElementById('lightbox');
  const imgEl    = document.getElementById('lightboxImg');
  const caption  = document.getElementById('lightboxCaption');
  const counter  = document.getElementById('lightboxCounter');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev  = document.getElementById('lightboxPrev');
  const btnNext  = document.getElementById('lightboxNext');
=======

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

=======

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

>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
    /* Find position of clicked item inside the filtered gallery */
    const clicked   = items[clickIdx];
    const galleryIdx = gallery.indexOf(clicked);
    current = galleryIdx >= 0 ? galleryIdx : 0;
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)

  if (!overlay) return;

  let gallery = [];  // all clickable items in the current project row
  let current = 0;   // current index within gallery

  /* ── Open ── */
  function open(items, index) {
    // Only use items that have a non-empty data-src (real images)
    gallery = items.filter(el => el.dataset.src && el.dataset.src.trim() !== '');
    if (!gallery.length) return;

    current = Math.max(0, Math.min(index, gallery.length - 1));
>>>>>>> parent of d827440 (Changed lightbox to support videos)
    render();

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
<<<<<<< HEAD
<<<<<<< HEAD
    if (btnClose) btnClose.focus();
  }

  /* ─────────────────────────────────────────────
     CLOSE
     ───────────────────────────────────────────── */
<<<<<<< HEAD
<<<<<<< HEAD
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
=======

    // Move focus into lightbox
    btnClose.focus();
  }

  /* ── Close ── */
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
  function close() {
    if (vidEl) {
      vidEl.pause();
      vidEl.removeAttribute('src');
      vidEl.load();
    }
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Delay clearing src so close animation completes
    setTimeout(() => { imgEl.src = ''; }, 320);
  }

<<<<<<< HEAD
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

=======

    // Move focus into lightbox
    btnClose.focus();
  }

  /* ── Close ── */
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
  function close() {
    if (vidEl) {
      vidEl.pause();
      vidEl.removeAttribute('src');
      vidEl.load();
    }
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Delay clearing src so close animation completes
    setTimeout(() => { imgEl.src = ''; }, 320);
  }

<<<<<<< HEAD
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

>>>>>>> parent of d827440 (Changed lightbox to support videos)
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
<<<<<<< HEAD
>>>>>>> parent of d827440 (Changed lightbox to support videos)
=======
>>>>>>> parent of d827440 (Changed lightbox to support videos)
=======
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

=======
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

>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
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
<<<<<<< HEAD
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open(allItems, i);
        }
      });
    });
  });

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
  /* ─────────────────────────────────────────────
     CONTROLS
     ───────────────────────────────────────────── */
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev)  btnPrev.addEventListener('click', prev);
  if (btnNext)  btnNext.addEventListener('click', next);
<<<<<<< HEAD
<<<<<<< HEAD

=======
  /* ── Lightbox controls ── */
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev)  btnPrev.addEventListener('click',  prev);
  if (btnNext)  btnNext.addEventListener('click',  next);

  // Click outside image to close
>>>>>>> parent of d827440 (Changed lightbox to support videos)
=======
  /* ── Lightbox controls ── */
  if (btnClose) btnClose.addEventListener('click', close);
  if (btnPrev)  btnPrev.addEventListener('click',  prev);
  if (btnNext)  btnNext.addEventListener('click',  next);

  // Click outside image to close
>>>>>>> parent of d827440 (Changed lightbox to support videos)
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

<<<<<<< HEAD
<<<<<<< HEAD
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

=======
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)

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

<<<<<<< HEAD
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
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
>>>>>>> parent of d827440 (Changed lightbox to support videos)
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
=======
>>>>>>> parent of 56bfe39 (Removed Video Capability. Added Elfsight)
      dx < 0 ? next() : prev();
    }
    tx = null; ty = null;
=======
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
<<<<<<< HEAD
>>>>>>> parent of d827440 (Changed lightbox to support videos)
=======
>>>>>>> parent of d827440 (Changed lightbox to support videos)
  }, { passive: true });

})();
