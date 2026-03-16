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
    const tiltCards = document.querySelectorAll('.jornada-card');

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

  /* ---- ISYS CHAT ---- */
  var ISYS_ENDPOINT = window.ISYS_ENDPOINT || '';

  var isysForm     = document.getElementById('isysForm');
  var isysInput    = document.getElementById('isysInput');
  var isysMessages = document.getElementById('isysMessages');
  var isysSend     = document.getElementById('isysSend');
  var isysStatus   = document.getElementById('isysStatus');
  var isysHistorico = [];

  function isysAppendMessage(role, text) {
    var div    = document.createElement('div');
    div.className = 'isys-message ' + role;
    var bubble = document.createElement('div');
    bubble.className = 'isys-bubble';
    var p = document.createElement('p');
    // preserve line breaks from Claude response
    p.style.whiteSpace = 'pre-wrap';
    p.textContent = text;
    bubble.appendChild(p);
    div.appendChild(bubble);
    isysMessages.appendChild(div);
    isysMessages.scrollTop = isysMessages.scrollHeight;
  }

  function isysSetLoading(loading) {
    isysSend.disabled  = loading;
    isysInput.disabled = loading;
    isysStatus.textContent = loading ? 'Isys está digitando...' : '';
  }

  if (isysForm && ISYS_ENDPOINT) {
    // Auto-resize textarea
    isysInput.addEventListener('input', function () {
      isysInput.style.height = 'auto';
      isysInput.style.height = Math.min(isysInput.scrollHeight, 120) + 'px';
    });

    // Send on Enter (Shift+Enter for newline)
    isysInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        isysForm.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });

    isysForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var pergunta = isysInput.value.trim();
      if (!pergunta) return;

      isysAppendMessage('user', pergunta);
      isysInput.value = '';
      isysInput.style.height = 'auto';
      isysHistorico.push({ role: 'user', text: pergunta });

      isysSetLoading(true);

      fetch(ISYS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: pergunta, historico: isysHistorico })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.ok && data.resposta) {
            isysAppendMessage('bot', data.resposta);
            isysHistorico.push({ role: 'assistant', text: data.resposta });
          } else {
            isysAppendMessage('bot', 'Desculpe, não consegui processar sua mensagem. Tente novamente.');
          }
        })
        .catch(function () {
          isysAppendMessage('bot', 'Houve um problema de conexão. Por favor, tente novamente.');
        })
        .finally(function () {
          isysSetLoading(false);
        });
    });
  }

  /* ---- DEPOIMENTOS CARROSSEL ---- */
  (function () {
    var slider  = document.getElementById('depoSlider');
    var track   = document.getElementById('depoTrack');
    var prevBtn = document.getElementById('depoPrev');
    var nextBtn = document.getElementById('depoNext');
    var dotsEl  = document.getElementById('depoDots');

    if (!slider || !track) return;

    var cards       = track.querySelectorAll('.depo-card');
    var total       = cards.length;
    var perView     = window.innerWidth >= 768 ? 3 : 1;
    var current     = 0;
    var autoTimer   = null;
    var INTERVAL    = 5000;

    function getPerView() {
      return window.innerWidth >= 768 ? 3 : 1;
    }

    function maxIndex() {
      return total - perView;
    }

    function goTo(index) {
      perView = getPerView();
      current = Math.max(0, Math.min(index, maxIndex()));
      var cardWidth = cards[0].offsetWidth + 16; // width + margin*2
      track.style.transform = 'translateX(-' + (current * cardWidth) + 'px)';
      updateDots();
    }

    function buildDots() {
      dotsEl.innerHTML = '';
      var count = maxIndex() + 1;
      for (var i = 0; i < count; i++) {
        var btn = document.createElement('button');
        btn.className = 'depo-dot' + (i === current ? ' active' : '');
        btn.setAttribute('aria-label', 'Ir para depoimento ' + (i + 1));
        (function (idx) {
          btn.addEventListener('click', function () { goTo(idx); resetTimer(); });
        })(i);
        dotsEl.appendChild(btn);
      }
    }

    function updateDots() {
      var dots = dotsEl.querySelectorAll('.depo-dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function next() { goTo(current >= maxIndex() ? 0 : current + 1); }
    function prev() { goTo(current <= 0 ? maxIndex() : current - 1); }

    function startTimer() {
      autoTimer = setInterval(next, INTERVAL);
    }

    function resetTimer() {
      clearInterval(autoTimer);
      startTimer();
    }

    // Init
    perView = getPerView();
    buildDots();
    goTo(0);
    startTimer();

    prevBtn.addEventListener('click', function () { prev(); resetTimer(); });
    nextBtn.addEventListener('click', function () { next(); resetTimer(); });

    // Pause on hover
    slider.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    slider.addEventListener('mouseleave', startTimer);

    // Touch swipe
    var touchStartX = 0;
    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
      clearInterval(autoTimer);
    }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      resetTimer();
    }, { passive: true });

    // Rebuild on resize
    window.addEventListener('resize', function () {
      perView = getPerView();
      buildDots();
      goTo(Math.min(current, maxIndex()));
    }, { passive: true });
  }());

  /* ---- PAGE LOADED ---- */
  document.documentElement.classList.add('js-loaded');

  console.log('%c✦ Sala Ísis — Estética e Bem-Estar', 'color: #D4A574; font-family: serif; font-size: 14px;');
  console.log('%cSite desenvolvido com cuidado e sofisticação.', 'color: #8C7B6E; font-size: 11px;');

})();
