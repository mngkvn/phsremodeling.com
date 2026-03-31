/* ================================================================
   PHS Remodeling — carousel.js
   Powers the per-category project carousel in the Featured Projects section.

   HOW IT WORKS:
   • Each .fc-category element is an independent carousel.
   • The carousel reads its own .fc-slide children (ordered by
     their position in the DOM, which maps to category_order in
     the CMS front matter).
   • Prev/Next buttons and dot indicators are scoped to each category.
   • Swipe (touch) is supported on mobile.
   • Keyboard arrows work when any button inside the carousel is focused.

   ADDING SLIDES VIA HTML:
   1. Add a new <div class="fc-slide"> inside the .fc-track.
   2. Add a matching <button class="fc-dot"> in .fc-dots.
   3. Update the fc-counter-total span to the new total count.
   The JS will find and wire everything automatically.
   ================================================================ */

(function () {
  'use strict';

  /* ── Initialise every .fc-category on the page ── */
  document.querySelectorAll('.fc-category').forEach(initCarousel);

  function initCarousel(cat) {
    const slides      = Array.from(cat.querySelectorAll('.fc-slide'));
    const prevBtn     = cat.querySelector('.fc-prev');
    const nextBtn     = cat.querySelector('.fc-next');
    const dots        = Array.from(cat.querySelectorAll('.fc-dot'));
    const counterCur  = cat.querySelector('.fc-counter-current');
    const counterTot  = cat.querySelector('.fc-counter-total');
    const total       = slides.length;

    if (total <= 1) {
      /* Single-slide — disable navigation entirely */
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    let current = 0;                 // index of the visible slide
    let isAnimating = false;         // prevent rapid double-clicks

    /* Sync counter total with actual slide count */
    if (counterTot) counterTot.textContent = total;

    /* ── Core transition function ── */
    function goTo(index, direction) {
      if (isAnimating || index === current) return;
      isAnimating = true;

      const prev  = slides[current];
      const next  = slides[index];
      const inClass  = direction > 0 ? 'slide-in-right' : 'slide-in-left';

      /* Hide outgoing slide */
      prev.classList.remove('active');

      /* Show incoming slide with animation */
      next.classList.add('active', inClass);

      /* Clean up animation class after transition completes */
      const onEnd = () => {
        next.classList.remove(inClass);
        next.removeEventListener('animationend', onEnd);
        isAnimating = false;
      };
      next.addEventListener('animationend', onEnd);

      /* Safety fallback if animationend never fires (e.g. prefers-reduced-motion) */
      setTimeout(() => {
        next.classList.remove(inClass);
        isAnimating = false;
      }, 500);

      current = index;
      updateUI();
    }

    /* ── Update counter, dots, and button states ── */
    function updateUI() {
      if (counterCur) counterCur.textContent = current + 1;

      /* Dots */
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-current', i === current ? 'true' : 'false');
      });

      /* Buttons */
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current === total - 1;
    }

    /* ── Button listeners ── */
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (current > 0) goTo(current - 1, -1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (current < total - 1) goTo(current + 1, 1);
      });
    }

    /* ── Dot listeners ── */
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (i !== current) goTo(i, i > current ? 1 : -1);
      });
    });

    /* ── Keyboard support (left/right arrow while carousel is focused) ── */
    cat.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft'  && current > 0)           goTo(current - 1, -1);
      if (e.key === 'ArrowRight' && current < total - 1)   goTo(current + 1,  1);
    });

    /* ── Touch / swipe support ── */
    let touchStartX = null;
    let touchStartY = null;

    cat.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    cat.addEventListener('touchend', e => {
      if (touchStartX === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      /* Only trigger if primarily a horizontal swipe */
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
        if (dx < 0 && current < total - 1) goTo(current + 1, 1);
        if (dx > 0 && current > 0)         goTo(current - 1, -1);
      }
      touchStartX = null;
      touchStartY = null;
    }, { passive: true });

    /* Initial UI sync */
    updateUI();
  }

})();
