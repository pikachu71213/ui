/**
 * KALYAAN UJWALA FOUNDATION - Main JavaScript
 * Handles: Preloader, Navbar, Scroll animations, Counters, Slider, Forms
 */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPreloader();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initGallerySlider();
    initBackToTop();
    initContactForm();
    initParticles();
    setActiveNavLink();
  }

  /* ==========================================
     PRELOADER
     ========================================== */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const minDisplay = 2200;
    const startTime = Date.now();
    let hidden = false;

    document.body.style.overflow = 'hidden';

    function hidePreloader() {
      if (hidden) return;
      hidden = true;
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }

    function scheduleHide() {
      const remaining = Math.max(0, minDisplay - (Date.now() - startTime));
      setTimeout(hidePreloader, remaining);
    }

    if (document.readyState === 'complete') {
      scheduleHide();
    } else {
      window.addEventListener('load', scheduleHide);
    }

    // Fallback if load never fires
    setTimeout(hidePreloader, 5000);
  }

  /* ==========================================
     STICKY NAVBAR
     ========================================== */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ==========================================
     MOBILE MENU
     ========================================== */
  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target) && menu.classList.contains('open')) {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ==========================================
     ACTIVE NAV LINK (current page)
     ========================================== */
  function setActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ==========================================
     SCROLL REVEAL ANIMATIONS
     ========================================== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ==========================================
     ANIMATED COUNTERS
     ========================================== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const start = performance.now();

      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + suffix;
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  /* ==========================================
     GALLERY SLIDER / CAROUSEL
     ========================================== */
  function initGallerySlider() {
    const slider = document.querySelector('.slider-wrap');
    if (!slider) return;

    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.slider-btn.prev');
    const nextBtn = slider.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!track || !slides.length) return;

    let current = 0;
    let autoTimer;
    const total = slides.length;
    const interval = 5000;

    // Build dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      resetAuto();
    }

    function next() {
      goTo(current + 1);
    }

    function prev() {
      goTo(current - 1);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, interval);
    }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
      }
    }, { passive: true });

    resetAuto();

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.addEventListener('mouseleave', resetAuto);
  }

  /* ==========================================
     BACK TO TOP
     ========================================== */
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
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
  }

  /* ==========================================
     CONTACT FORM (EmailJS)
     ========================================== */
  function initContactForm() {
    const forms = document.querySelectorAll('.contact-form form, #contactForm');
    const emailConfig = {
      serviceId: 'service_eqpqgfk',
      templateId: 'template_ops2ygd',
      publicKey: '9qMCwGOYx0Nseh27Q'
    };

    if (window.emailjs) {
      window.emailjs.init({ publicKey: emailConfig.publicKey });
    }

    forms.forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn ? btn.innerHTML : '';
        const data = new FormData(form);
        const params = {
          fullname: data.get('fullname') || data.get('name') || '',
          name: data.get('fullname') || data.get('name') || '',
          from_name: data.get('fullname') || data.get('name') || '',
          user_name: data.get('fullname') || data.get('name') || '',
          email: data.get('email') || '',
          from_email: data.get('email') || '',
          user_email: data.get('email') || '',
          reply_to: data.get('email') || '',
          phone: data.get('phone') || '',
          user_phone: data.get('phone') || '',
          contact_number: data.get('phone') || '',
          subject: data.get('subject') || '',
          message: data.get('message') || ''
        };

        if (btn) {
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
          btn.disabled = true;
        }

        try {
          if (!window.emailjs) {
            throw new Error('EmailJS library is not loaded.');
          }
          await window.emailjs.send(
            emailConfig.serviceId,
            emailConfig.templateId,
            params
          );
          form.reset();
          showFormPopup('success', 'Message sent successfully!', 'Thank you for reaching out. Our team will contact you soon.');
        } catch (error) {
          console.error('EmailJS send failed:', error);
          showFormPopup('error', 'Message could not be sent', 'Please try again or contact us directly on WhatsApp.');
        } finally {
          if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
          }
        }
      });
    });
  }

  function showFormPopup(type, title, message) {
    const existing = document.querySelector('.form-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.className = `form-popup ${type}`;
    popup.setAttribute('role', 'status');
    popup.setAttribute('aria-live', 'polite');
    popup.innerHTML = `
      <div class="form-popup-card">
        <button class="form-popup-close" type="button" aria-label="Close message">
          <i class="fas fa-xmark"></i>
        </button>
        <div class="form-popup-icon">
          <i class="fas ${type === 'success' ? 'fa-check' : 'fa-triangle-exclamation'}"></i>
        </div>
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    `;

    document.body.appendChild(popup);
    requestAnimationFrame(() => popup.classList.add('visible'));

    const close = () => {
      popup.classList.remove('visible');
      setTimeout(() => popup.remove(), 250);
    };

    popup.querySelector('.form-popup-close').addEventListener('click', close);
    popup.addEventListener('click', (event) => {
      if (event.target === popup) close();
    });
    setTimeout(close, 4500);
  }

  /* ==========================================
     HERO PARTICLES
     ========================================== */
  function initParticles() {
    const container = document.querySelector('.hero-particles');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
      const p = document.createElement('span');
      p.classList.add('particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 5 + 's';
      p.style.animationDuration = 5 + Math.random() * 5 + 's';
      p.style.width = p.style.height = 4 + Math.random() * 6 + 'px';
      container.appendChild(p);
    }
  }
})();
