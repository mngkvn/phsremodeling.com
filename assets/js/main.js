/* ================================================================
   PHS REMODELING — main.js
   ================================================================ */

(function () {
  'use strict';

  /* ── Nav: sticky shadow ── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ── */
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('mobileMenu');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    // Close on any mobile link click
    drawer.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !drawer.contains(e.target)) {
        drawer.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );
    revealEls.forEach(el => io.observe(el));
  }

  /* ── Animated number counters ── */
  function animateCounter(el) {
    const raw    = el.dataset.target;
    const suffix = raw.replace(/[\d,]/g, ''); // e.g. '+', '%', ' Years'
    const target = parseInt(raw.replace(/\D/g, ''), 10);
    const dur    = 1600; // ms
    const start  = performance.now();

    (function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // Ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const val = Math.floor(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    })(start);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length) {
    const counterIo = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(el => counterIo.observe(el));
  }

  /* ── Contact form ── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      btn.disabled = true;

      /* -------------------------------------------------------
         FORM ACTION:
         Replace this timeout with your real form handler.
         Options:
           • Formspree: set action="https://formspree.io/f/XXXXX"
             and remove preventDefault / success logic
           • Netlify Forms: add netlify attribute to <form>
           • Custom endpoint: fetch('/api/contact', { method:'POST', body: new FormData(form) })
         ------------------------------------------------------- */
      setTimeout(() => {
        if (success) success.classList.add('active');
        form.reset();
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        setTimeout(() => success && success.classList.remove('active'), 5000);
      }, 1400);
    });
  }

  /* ── Dynamic copyright year ── */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
