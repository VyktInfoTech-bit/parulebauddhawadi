/* ============================================================
   PARULE VILLAGE - Premium Community Portal
   js/script.js
   ============================================================ */

'use strict';

/* ========================
   AOS INITIALIZATION
   ======================== */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
    delay: 0,
  });
});

/* ========================
   NAVBAR SCROLL BEHAVIOR - transparent → white on scroll - active link highlight
   ======================== */
(function initNavbar() {
  const navbar = document.getElementById('mainNavbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  function onScroll() {
    // Scrolled state
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlighting
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 90;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();

/* ========================
   SMOOTH SCROLL - for all anchor links
   ======================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Close mobile menu if open
      const navCollapse = document.getElementById('navMenu');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }

      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ========================
   HERO PARALLAX - subtle background parallax
   ======================== */
(function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  // Trigger the CSS scale-in animation
  setTimeout(() => heroBg.classList.add('loaded'), 100);

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  function parallaxScroll() {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${scrollY * 0.35}px)`;
    }
  }

  window.addEventListener('scroll', parallaxScroll, { passive: true });
})();

/* ========================
   ANIMATED COUNTERS - triggers when stat cards enter viewport
   ======================== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = prefersReduced ? 0 : 1800;
    const start = performance.now();

    function update(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(update);
    }

    if (duration === 0) {
      el.textContent = target.toLocaleString('en-IN');
    } else {
      requestAnimationFrame(update);
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
})();

/* ========================
   GALLERY FILTER - category filter with animation
   ======================== */
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          // Animate in
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 260);
        }
      });
    });
  });
})();

/* ========================
   GLIGHTBOX INIT
   ======================== */
(function initLightbox() {
  if (typeof GLightbox === 'undefined') return;

  GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
    skin: 'clean',
    zoomable: true,
    draggable: true,
    openEffect: 'zoom',
    closeEffect: 'fade',
  });
})();

/* ========================
   BACK TO TOP BUTTON
   ======================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ========================
   FOOTER YEAR
   ======================== */
(function setFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();

/* ========================
   CONTACT FORM - client-side validation + feedback
   ======================== */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('contactName');
    const email   = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    const btn     = form.querySelector('button[type="submit"]');

    // Simple validation
    let valid = true;
    [name, email, message].forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');
        valid = false;
      } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
      }
    });

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value && !emailRegex.test(email.value)) {
      email.classList.add('is-invalid');
      email.classList.remove('is-valid');
      valid = false;
    }

    if (!valid) return;

    // Simulate submission
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

    setTimeout(() => {
      btn.innerHTML = '<i class="bi bi-check-circle me-2" aria-hidden="true"></i>Message Sent!';
      btn.classList.add('btn-success');
      btn.classList.remove('btn-cta');
      form.reset();
      [name, email, message].forEach(f => f.classList.remove('is-valid', 'is-invalid'));

      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-cta');
      }, 4000);
    }, 1500);
  });

  // Real-time validation feedback
  form.querySelectorAll('.contact-input').forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      }
    });
  });
})();

/* ========================
   NEWSLETTER FORM
   ======================== */
(function initNewsletterForm() {
  const forms = document.querySelectorAll('.footer-newsletter form');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button[type="submit"]');
      if (!input || !btn) return;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.style.borderColor = '#ef4444';
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
        return;
      }

      const orig = btn.textContent;
      btn.textContent = '✓ Done!';
      btn.disabled = true;
      input.value = '';

      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
      }, 3000);
    });
  });
})();

/* ========================
   PERSONALITY CARD TILT - subtle 3D hover (mouse tracking)
   ======================== */
(function initCardTilt() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const cards = document.querySelectorAll('.personality-card, .festival-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      const tiltX = -(y / rect.height) * 6;
      const tiltY =  (x / rect.width)  * 6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ========================
   NAVBAR COLLAPSE ON LINK CLICK (mobile)
   ======================== */
(function initMobileNavClose() {
  const navLinks = document.querySelectorAll('#navMenu .nav-link');
  const navCollapse = document.getElementById('navMenu');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
})();
