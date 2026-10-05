/* =====================================================
   AUTHENTIC GREEK CORBY — script.js
   ===================================================== */

(function () {
  'use strict';

  /* ─── HEADER SCROLL ──────────────────────── */
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── MOBILE MENU ────────────────────────── */
  const burgerBtn  = document.getElementById('burger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.removeAttribute('hidden');
    mobileMenu.setAttribute('aria-modal', 'true');
    burgerBtn.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';
    // Focus first link
    setTimeout(() => {
      const first = mobileMenu.querySelector('a');
      if (first) first.focus();
    }, 100);
  }

  function closeMenu() {
    mobileMenu.setAttribute('hidden', '');
    burgerBtn.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    burgerBtn.focus();
  }

  burgerBtn.addEventListener('click', function () {
    if (mobileMenu.hasAttribute('hidden')) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  // Close on nav link click
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !mobileMenu.hasAttribute('hidden')) {
      closeMenu();
    }
  });

  /* ─── ACTIVE NAV LINK ────────────────────── */
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.desktop-nav a');

  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ─── REVEAL ON SCROLL ───────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ─── GENERIC SCROLL FADE-IN ─────────────── */
  // Any element with data-reveal attribute
  const fadeEls = document.querySelectorAll(
    '.menu-category, .why-card, .visit-card, .review-card, .social-item, .gallery-item, .info-item'
  );

  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(function () {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        fadeObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.55s ease ' + (i % 4) * 80 + 'ms, transform 0.55s ease ' + (i % 4) * 80 + 'ms';
    fadeObserver.observe(el);
  });

  /* ─── HERO IMAGE PARALLAX (subtle) ──────── */
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    // Trigger ken-burns load
    heroBgImg.addEventListener('load', function () {
      heroBgImg.classList.add('loaded');
    });
    if (heroBgImg.complete) {
      heroBgImg.classList.add('loaded');
    }

    // Subtle parallax on scroll
    function heroParallax() {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBgImg.style.transform = 'translateY(' + scrollY * 0.15 + 'px) scale(1)';
      }
    }
    window.addEventListener('scroll', heroParallax, { passive: true });
  }

  /* ─── SMOOTH ANCHOR SCROLL ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── GALLERY LIGHTBOX (minimal) ────────── */
  const galleryItems = document.querySelectorAll('.gallery-item img');

  galleryItems.forEach(function (img) {
    img.setAttribute('tabindex', '0');
    img.addEventListener('click', openLightbox);
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox.call(this, e);
      }
    });
  });

  function openLightbox(e) {
    const src = e.currentTarget ? e.currentTarget.src : this.src;
    const alt = e.currentTarget ? e.currentTarget.alt : this.alt;

    const lb = document.createElement('div');
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Image lightbox');
    lb.setAttribute('aria-modal', 'true');
    lb.style.cssText = [
      'position:fixed;inset:0;z-index:9999;',
      'background:rgba(12,40,50,0.95);',
      'display:flex;align-items:center;justify-content:center;',
      'cursor:zoom-out;padding:2rem;'
    ].join('');

    const lbImg = document.createElement('img');
    lbImg.src = src;
    lbImg.alt = alt;
    lbImg.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:4px;';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close image');
    closeBtn.style.cssText = [
      'position:absolute;top:1.5rem;right:1.5rem;',
      'background:rgba(247,241,229,0.15);border:none;color:#F7F1E5;',
      'font-size:2rem;width:48px;height:48px;border-radius:50%;',
      'cursor:pointer;display:flex;align-items:center;justify-content:center;',
      'transition:background 0.2s;'
    ].join('');
    closeBtn.addEventListener('mouseover', function () {
      this.style.background = 'rgba(247,241,229,0.3)';
    });
    closeBtn.addEventListener('mouseout', function () {
      this.style.background = 'rgba(247,241,229,0.15)';
    });

    lb.appendChild(lbImg);
    lb.appendChild(closeBtn);
    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';
    closeBtn.focus();

    function closeLb() {
      document.body.removeChild(lb);
      document.body.style.overflow = '';
    }

    lb.addEventListener('click', function (ev) {
      if (ev.target === lb) closeLb();
    });
    closeBtn.addEventListener('click', closeLb);
    document.addEventListener('keydown', function escHandler(ev) {
      if (ev.key === 'Escape') {
        closeLb();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  /* ─── MOBILE BAR HIDE ON SCROLL UP ─────── */
  const mobileBar = document.querySelector('.mobile-bottom-bar');
  if (mobileBar) {
    let prevY = window.scrollY;
    window.addEventListener('scroll', function () {
      const curY = window.scrollY;
      // Keep bar always visible on mobile for UX
      mobileBar.style.transform = 'translateY(0)';
      prevY = curY;
    }, { passive: true });
  }

  /* ─── SKIP LINK ──────────────────────────── */
  // Dynamically inject skip link for keyboard users
  const skipLink = document.createElement('a');
  skipLink.href = '#hero';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);

})();
