/* ═══════════════════════════════════════════════════════════════
   MoroccanTransfer.com — Main JavaScript
   Version 3.0 — Avril 2026
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── STICKY HEADER ── */
(function() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── SCROLL TO TOP ── */
(function() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── MOBILE NAV ── */
(function() {
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay   = document.querySelector('.mobile-nav-overlay');
  const closeBtn  = document.querySelector('.mobile-nav-close button');
  if (!hamburger || !mobileNav) return;

  const open  = () => { mobileNav.classList.add('open'); overlay?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { mobileNav.classList.remove('open'); overlay?.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();



/* ── CURRENCY SWITCHER ── */
(function() {
  const rates   = { EUR: 1, USD: 1.08, GBP: 0.86, CHF: 0.97, MAD: 10.85, CAD: 1.47 };
  const symbols = { EUR: '€', USD: '$', GBP: '£', CHF: 'CHF ', MAD: 'MAD ', CAD: 'CA$' };
  let current = localStorage.getItem('mt_currency') || 'EUR';

  function updatePrices() {
    document.querySelectorAll('[data-price-eur]').forEach(el => {
      const base = parseFloat(el.dataset.priceEur);
      el.textContent = symbols[current] + (base * rates[current]).toFixed(0);
    });
    document.querySelectorAll('.currency-switch').forEach(btn => {
      btn.textContent = current;
    });
  }

  document.querySelectorAll('.currency-switch').forEach(btn => {
    btn.addEventListener('click', () => {
      const keys = Object.keys(rates);
      current = keys[(keys.indexOf(current) + 1) % keys.length];
      localStorage.setItem('mt_currency', current);
      updatePrices();
    });
  });

  updatePrices();
})();

/* ── HERO SLIDER ── */
(function() {
  const slider  = document.getElementById('heroSlider');
  const dotsWrap = document.getElementById('heroDots');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  if (!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const dots   = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.hero-dot')) : [];
  let current  = 0;
  let timer    = null;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(parseInt(dot.dataset.slide)); startAuto(); });
  });

  // Touch / swipe
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { goTo(dx < 0 ? current + 1 : current - 1); startAuto(); }
  }, { passive: true });

  startAuto();
})();

/* ── CARD GALLERY CAROUSELS ── */
(function() {
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const track  = gallery.querySelector('.tour-gallery-track');
    const slides = track ? Array.from(track.querySelectorAll('.tour-gallery-slide')) : [];
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    const dotsWrap = gallery.querySelector('.gallery-dots');
    if (!track || slides.length < 2) return;

    let current = 0;

    // Build dots dynamically if container exists but dots not yet created
    if (dotsWrap && !dotsWrap.children.length) {
      slides.forEach((_, i) => {
        const d = document.createElement('button');
        d.className = 'gallery-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Image ' + (i + 1));
        dotsWrap.appendChild(d);
      });
    }
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.gallery-dot')) : [];

    function goTo(idx) {
      current = (idx + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); goTo(current - 1); });
    nextBtn?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); goTo(current + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); goTo(i); }));

    // Touch swipe on gallery
    let tx = 0;
    gallery.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
    gallery.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 30) goTo(dx < 0 ? current + 1 : current - 1);
    }, { passive: true });
  });
})();

/* ── SCROLL REVEAL ── */
(function() {
  if (!window.IntersectionObserver) {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => el.classList.add('revealed'));
    return;
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
})();

/* ── COUNT-UP ANIMATION ── */
(function() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  function animate(el) {
    const target   = parseInt(el.dataset.counter, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = performance.now();

    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  if (window.IntersectionObserver) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  } else {
    counters.forEach(animate);
  }
})();

/* ── SEARCH TABS ── */
(function() {
  const tabs  = document.querySelectorAll('.search-tab');
  const forms = document.querySelectorAll('.search-form-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      forms.forEach(f => {
        f.style.display = f.dataset.panel === target ? 'flex' : 'none';
      });
    });
  });
})();

/* ── DATE PICKER — min date today ── */
(function() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(input => {
    input.min = today;
    if (!input.value) input.value = today;
  });
})();

/* ── WISHLIST (localStorage) ── */
(function() {
  const KEY      = 'mt_wishlist';
  const getList  = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const saveList = l  => localStorage.setItem(KEY, JSON.stringify(l));

  document.querySelectorAll('.card-wishlist').forEach(btn => {
    const id = btn.dataset.tourId;
    if (!id) return;
    if (getList().includes(id)) btn.classList.add('wishlisted');

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const l   = getList();
      const idx = l.indexOf(id);
      if (idx === -1) { l.push(id); btn.classList.add('wishlisted'); }
      else            { l.splice(idx, 1); btn.classList.remove('wishlisted'); }
      saveList(l);
    });
  });
})();

/* ── FAQ ACCORDION ── */
(function() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

/* ── NAV DROPDOWNS (hover accessible via keyboard too) ── */
(function() {
  document.querySelectorAll('.has-dropdown').forEach(item => {
    const link     = item.querySelector(':scope > a');
    const dropdown = item.querySelector('.dropdown');
    if (!link || !dropdown) return;

    link.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const expanded = item.classList.toggle('open');
        link.setAttribute('aria-expanded', expanded);
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(item => {
        item.classList.remove('open');
        item.querySelector(':scope > a')?.setAttribute('aria-expanded', 'false');
      });
    }
  });
})();

/* ── SMOOTH SCROLL for ANCHOR LINKS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── GALLERY LIGHTBOX ── */
(function() {
  const gallery = document.querySelectorAll('[data-lightbox]');
  if (!gallery.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Fermer">✕</button>
    <button class="lightbox-prev" aria-label="Précédent">&#8249;</button>
    <button class="lightbox-next" aria-label="Suivant">&#8250;</button>
    <div class="lightbox-img-wrap"><img class="lightbox-img" src="" alt=""></div>
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(overlay);

  let currentIndex = 0;
  const items = Array.from(gallery);

  const open  = idx => {
    currentIndex = idx;
    const item = items[idx];
    overlay.querySelector('.lightbox-img').src = item.href || item.dataset.src || item.src;
    overlay.querySelector('.lightbox-caption').textContent = item.dataset.caption || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };
  const prev  = () => open((currentIndex - 1 + items.length) % items.length);
  const next  = () => open((currentIndex + 1) % items.length);

  items.forEach((item, idx) => item.addEventListener('click', e => { e.preventDefault(); open(idx); }));
  overlay.querySelector('.lightbox-close').addEventListener('click', close);
  overlay.querySelector('.lightbox-prev').addEventListener('click', prev);
  overlay.querySelector('.lightbox-next').addEventListener('click', next);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
})();

/* ── BOOKING FORM VALIDATION ── */
(function() {
  const form = document.querySelector('.booking-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const departure   = form.querySelector('[name="departure"]')?.value;
    const destination = form.querySelector('[name="destination"]')?.value;
    const date        = form.querySelector('[name="travel_date"]')?.value;
    const time        = form.querySelector('[name="travel_time"]')?.value;

    const errors = [];
    if (!departure)   errors.push('Veuillez indiquer le lieu de départ.');
    if (!destination) errors.push('Veuillez indiquer la destination.');
    if (!date)        errors.push('Veuillez sélectionner une date.');
    if (!time)        errors.push('Veuillez sélectionner une heure.');

    const errContainer = form.querySelector('.form-errors');
    if (errContainer) {
      errContainer.innerHTML = errors.map(m => `<li>${m}</li>`).join('');
      errContainer.style.display = errors.length ? 'block' : 'none';
    }

    if (!errors.length) {
      window.showToast('Merci ! Votre demande a bien été envoyée. Nous vous contactons sous 2 heures.', 'success');
      form.reset();
    }
  });
})();

/* ── PHONE REVEAL ── */
document.querySelectorAll('.phone-reveal').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = btn.dataset.phone;
    btn.style.pointerEvents = 'none';
  });
});

/* ── TOAST NOTIFICATION ── */
window.showToast = function(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

/* ── NEWSLETTER FORM ── */
(function() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value;
    if (email) {
      window.showToast('Merci ! Vous êtes bien inscrit(e) à notre newsletter.', 'success');
      form.reset();
    }
  });
})();

/* ── STICKY BOOKING SIDEBAR ── */
(function() {
  const sidebar  = document.querySelector('.booking-sidebar');
  const sentinel = document.querySelector('.booking-sidebar-sentinel');
  if (!sidebar || !sentinel) return;

  const obs = new IntersectionObserver(([entry]) => {
    sidebar.classList.toggle('sticky-active', !entry.isIntersecting);
  });
  obs.observe(sentinel);
})();

/* ── PASSENGER COUNT SELECTOR ── */
(function() {
  document.querySelectorAll('.pax-selector').forEach(selector => {
    const minusBtn = selector.querySelector('[data-action="minus"]');
    const plusBtn  = selector.querySelector('[data-action="plus"]');
    const display  = selector.querySelector('.pax-count');
    const input    = selector.querySelector('input[type="hidden"]');
    let count = parseInt(input?.value || '1');

    const update = () => {
      if (display)  display.textContent = count;
      if (input)    input.value = count;
      if (minusBtn) minusBtn.disabled = count <= 1;
    };

    minusBtn?.addEventListener('click', () => { if (count > 1)  { count--; update(); } });
    plusBtn?.addEventListener('click',  () => { if (count < 16) { count++; update(); } });
    update();
  });
})();

/* ── GOOGLE MAP PLACEHOLDER ── */
(function() {
  const mapEl = document.querySelector('[data-map]');
  if (!mapEl) return;
  mapEl.innerHTML = `
    <div style="width:100%;height:100%;background:#1C1C1C;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      <span style="font-size:11px;color:rgba(255,255,255,0.35);letter-spacing:2px;text-transform:uppercase;">Carte interactive</span>
    </div>`;
})();

/* ── BLOG CAROUSEL (infinite loop) ── */
(function() {
  const track  = document.getElementById('blogCarousel');
  const nextBtn = document.getElementById('blogNext');
  if (!track || !nextBtn) return;
  const prevBtn = document.getElementById('blogPrev');

  /* Clone cards for seamless loop */
  const origCards = Array.from(track.querySelectorAll('.blog-carousel-card'));
  origCards.forEach(c => track.appendChild(c.cloneNode(true)));

  let idx = 0;
  let busy = false;

  const getVisible = () => window.innerWidth < 600 ? 1 : window.innerWidth < 960 ? 2 : 3;
  const getCardW   = () => { const c = track.querySelector('.blog-carousel-card'); return c ? c.offsetWidth + 24 : 0; };

  function goTo(n, animate) {
    track.style.transition = animate ? 'transform .55s cubic-bezier(.25,.46,.45,.94)' : 'none';
    track.style.transform  = `translateX(-${n * getCardW()}px)`;
    idx = n;
  }

  function next() { if(busy) return; busy=true; goTo(idx+1, true); }
  function prev() { if(busy) return; busy=true; goTo(idx-1, true); }

  track.addEventListener('transitionend', () => {
    busy = false;
    const total = origCards.length;
    if (idx >= total) goTo(idx - total, false);
    else if (idx < 0) goTo(idx + total, false);
  });

  nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  window.addEventListener('resize', () => goTo(0, false));

  setInterval(next, 3800);
  goTo(0, false);
})();

/* ── TripAdvisor Reviews Carousel (infinite loop) ── */
(function(){
  const track = document.getElementById('taTrack');
  if(!track) return;
  const prevBtn = document.querySelector('.ta-prev');
  const nextBtn = document.querySelector('.ta-next');

  /* Clone all cards and append for seamless loop */
  const origCards = Array.from(track.querySelectorAll('.ta-card'));
  origCards.forEach(c => track.appendChild(c.cloneNode(true)));
  const allCards = track.querySelectorAll('.ta-card');

  let idx = 0;
  let isTransitioning = false;

  function visibleCount(){
    const w = window.innerWidth;
    if(w <= 600) return 1;
    if(w <= 960) return 2;
    if(w <= 1200) return 3;
    return 5;
  }

  function cardWidth(){
    return allCards[0].offsetWidth + 16;
  }

  function goTo(n, animate){
    track.style.transition = animate ? 'transform .5s cubic-bezier(.25,.46,.45,.94)' : 'none';
    track.style.transform = `translateX(-${n * cardWidth()}px)`;
    idx = n;
  }

  function next(){
    if(isTransitioning) return;
    isTransitioning = true;
    goTo(idx + 1, true);
  }
  function prev(){
    if(isTransitioning) return;
    isTransitioning = true;
    goTo(idx - 1, true);
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;
    const total = origCards.length;
    const vis = visibleCount();
    if(idx >= total){
      goTo(idx - total, false);
    } else if(idx < 0){
      goTo(idx + total, false);
    }
  });

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  window.addEventListener('resize', () => { goTo(0, false); });

  const autoTimer = setInterval(next, 3500);

  goTo(0, false);
})();
