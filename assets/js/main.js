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

  /* ── Contact form — Formspree via fetch ── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const btn          = form.querySelector('[type="submit"]');
      const originalHTML = btn.innerHTML;
      const endpoint     = form.dataset.action;   // set by Jekyll from _data/general.yml

      /* Loading state */
      btn.innerHTML = 'Sending…';
      btn.disabled  = true;

      /* ── No endpoint configured — demo mode ── */
      if (!endpoint || endpoint.trim() === '') {
        console.warn('PHS: No Formspree endpoint set. Add it via CMS → Site Settings → General → Contact Form.');
        setTimeout(() => {
          showSuccess();
          btn.innerHTML = originalHTML;
          btn.disabled  = false;
        }, 800);
        return;
      }

      /* ── Live submission to Formspree ── */
      try {
        const res = await fetch(endpoint, {
          method:  'POST',
          headers: { 'Accept': 'application/json' },
          body:    new FormData(form),
        });

        if (res.ok) {
          showSuccess();
          form.reset();
        } else {
          /* Formspree returned an error — surface it to the user */
          const data = await res.json().catch(() => ({}));
          const msg  = (data.errors || []).map(err => err.message).join(', ')
                       || 'Something went wrong. Please try again or call us directly.';
          showError(msg);
        }
      } catch (_) {
        /* Network error */
        showError('Could not send your message. Please check your connection or call us directly.');
      } finally {
        btn.innerHTML = originalHTML;
        btn.disabled  = false;
      }
    });
  }

  function showSuccess() {
    if (!success) return;
    success.classList.add('active');
    setTimeout(() => success.classList.remove('active'), 6000);
  }

  function showError(msg) {
    /* Reuse the subtitle slot under the form title for the error message */
    const sub = form && form.closest('.contact-form-card')
                          .querySelector('.form-subtitle');
    if (sub) {
      sub.textContent = msg;
      sub.style.color = '#f87171';
      setTimeout(() => {
        sub.textContent = "We'll respond within one business day.";
        sub.style.color  = '';
      }, 6000);
    }
  }

  /* ── Dynamic copyright year ── */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
