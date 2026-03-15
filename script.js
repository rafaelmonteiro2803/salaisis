/* ============================================================
   SALA ÍSIS — Script
   Interactions, Animations & UX Enhancements
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAVBAR: scroll state ---- */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ---- MOBILE MENU ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click / escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ---- SCROLL REVEAL (IntersectionObserver) ---- */
  const revealEls = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right'
  );

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---- SERVICES TABS ---- */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = btn.getAttribute('data-tab');

      // Update button states
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // Update panel visibility
      tabPanels.forEach(function (panel) {
        panel.classList.remove('active');
      });

      const targetPanel = document.getElementById('tab-' + target);
      if (targetPanel) {
        targetPanel.classList.add('active');

        // Re-trigger fade-in animations for newly visible cards
        const cards = targetPanel.querySelectorAll('.fade-in');
        cards.forEach(function (card) {
          card.classList.remove('visible');
          // Small delay to allow CSS transition to reset
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.classList.add('visible');
            });
          });
        });
      }
    });
  });

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ---- ACTIVE NAV LINK on scroll ---- */
  const sections    = document.querySelectorAll('section[id]');
  const navLinkEls  = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNavLink() {
    const scrollY = window.pageYOffset;
    const navH    = navbar.offsetHeight + 24;

    let currentId = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - navH;
      if (scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinkEls.forEach(function (link) {
      link.classList.remove('nav-active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('nav-active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });

  /* ---- WHATSAPP FLOAT: hide/show based on scroll position ---- */
  const waFloat = document.querySelector('.whatsapp-float');

  function toggleWaFloat() {
    if (window.scrollY > 400) {
      waFloat.style.opacity = '1';
      waFloat.style.pointerEvents = 'auto';
      waFloat.style.transform = '';
    } else {
      waFloat.style.opacity = '0';
      waFloat.style.pointerEvents = 'none';
      waFloat.style.transform = 'translateY(20px)';
    }
  }

  // Initial state
  if (waFloat) {
    waFloat.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.35s ease';
    toggleWaFloat();
    window.addEventListener('scroll', toggleWaFloat, { passive: true });
  }

  /* ---- HERO: subtle parallax on scroll ---- */
  const heroBg = document.querySelector('.hero-bg');

  if (heroBg && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', function () {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + scrolled * 0.35 + 'px)';
      }
    }, { passive: true });
  }

  /* ---- COUNTER ANIMATION for the badge ---- */
  const badge = document.querySelector('.badge-number');

  if (badge && 'IntersectionObserver' in window) {
    const badgeObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          animateCounter(badge, 0, 5, 1200);
          badgeObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    badgeObserver.observe(badge);
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    const prefix = el.textContent.replace(/\d+/, '').split(/\d/)[0] || '';
    const suffix = el.textContent.replace(/.*\d/, '').trim() || '';

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const value    = Math.round(start + (end - start) * eased);

      el.textContent = prefix + '+' + value;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + '+' + end;
      }
    }

    requestAnimationFrame(update);
  }

  /* ---- CARD TILT on mouse move (desktop only) ---- */
  if (window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
    const tiltCards = document.querySelectorAll('.jornada-card, .depo-card');

    tiltCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect   = card.getBoundingClientRect();
        const centerX = rect.left + rect.width  / 2;
        const centerY = rect.top  + rect.height / 2;
        const rotateY = ((e.clientX - centerX) / rect.width)  *  6;
        const rotateX = ((e.clientY - centerY) / rect.height) * -6;

        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ---- LAZY: set current year in footer if needed ---- */
  const yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- PAGE LOADED ---- */
  document.documentElement.classList.add('js-loaded');

  console.log('%c✦ Sala Ísis — Estética e Bem-Estar', 'color: #D4A574; font-family: serif; font-size: 14px;');
  console.log('%cSite desenvolvido com cuidado e sofisticação.', 'color: #8C7B6E; font-size: 11px;');

})();
