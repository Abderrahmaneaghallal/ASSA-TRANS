/* ═══════════════════════════════════════════════
   ÉLITE MOGADOR – main.js
   ═══════════════════════════════════════════════ */

/* ── HERO CAROUSEL ── */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  startAuto();
})();

/* ── NAV SCROLL ── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── MOBILE DRAWER ── */
const hamburger = document.querySelector('.nav-hamburger');
const drawer    = document.querySelector('.nav-drawer');
const overlay   = document.querySelector('.drawer-overlay');
const drawerClose = document.querySelector('.drawer-close');

function openDrawer() {
  drawer?.classList.add('open');
  overlay?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer?.classList.remove('open');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
overlay?.addEventListener('click', closeDrawer);

/* ── LANG DROPDOWN ── */
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    btn.nextElementSibling?.classList.toggle('open');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.lang-dropdown').forEach(d => d.classList.remove('open'));
});

/* ── TESTIMONIALS CAROUSEL ── */
function initCarousel() {
  const track = document.querySelector('.testimonials-track');
  const dots  = document.querySelectorAll('.carousel-dot');
  if (!track || !dots.length) return;

  let current = 0;
  const slides = track.querySelectorAll('.testimonial-slide');

  function goTo(idx) {
    current = idx;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // auto-play
  setInterval(() => goTo((current + 1) % slides.length), 5000);
}
initCarousel();

/* ── BLOG CAROUSEL – seamless infinite, one card at a time ── */
function initBlogCarousel() {
  const wrap    = document.querySelector('.blog-carousel-track-wrap');
  const track   = document.querySelector('.blog-carousel-track');
  if (!track || !wrap) return;

  const GAP           = 24;
  const TRANSITION    = 'transform 0.65s cubic-bezier(0.4,0,0.2,1)';
  const AUTO_DELAY    = 3500;

  /* Grab the 6 original cards before any cloning */
  const realCards = Array.from(track.querySelectorAll('.blog-carousel-card'));
  const N = realCards.length; // 6

  const dotsWrap = document.querySelector('.blog-carousel-dots');
  const prevBtn  = document.querySelector('.blog-carousel-prev');
  const nextBtn  = document.querySelector('.blog-carousel-next');

  let perPage   = 3;
  let rawIndex  = 0; // set after buildTrack
  let busy      = false;
  let autoTimer = null;

  function getPerPage() {
    return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
  }

  function cw() {
    return (wrap.offsetWidth - GAP * (perPage - 1)) / perPage;
  }

  /*
   * Track layout:
   *   [perPage clones of last perPage real cards]  ← prepend buffer
   *   [all N real cards]
   *   [perPage clones of first perPage real cards] ← append buffer
   *
   * rawIndex starts at `perPage` (first real card is leftmost).
   * Jump forward:  rawIndex === perPage + N  → rawIndex = perPage  (same visual)
   * Jump backward: rawIndex === 0            → rawIndex = N        (same visual)
   */
  function buildTrack() {
    perPage = getPerPage();
    track.innerHTML = '';

    // prepend: last perPage real cards
    for (let i = N - perPage; i < N; i++) {
      const cl = realCards[i].cloneNode(true);
      cl.setAttribute('aria-hidden', 'true');
      track.appendChild(cl);
    }
    // real cards
    realCards.forEach(c => track.appendChild(c.cloneNode(true)));
    // append: first perPage real cards
    for (let i = 0; i < perPage; i++) {
      const cl = realCards[i].cloneNode(true);
      cl.setAttribute('aria-hidden', 'true');
      track.appendChild(cl);
    }

    rawIndex = perPage; // start on real card 0
    sizeCards();
    setPos(false);
    buildDots();
    updateDots();
  }

  function sizeCards() {
    const w = cw();
    Array.from(track.children).forEach(c => {
      c.style.flexBasis = w + 'px';
      c.style.width     = w + 'px';
    });
  }

  function setPos(animate) {
    const offset = rawIndex * (cw() + GAP);
    track.style.transition = animate ? TRANSITION : 'none';
    track.style.transform  = `translateX(-${offset}px)`;
  }

  /* Which real card (0-based) is currently leftmost */
  function realIdx() {
    return ((rawIndex - perPage) % N + N) % N;
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < N; i++) {
      const btn = document.createElement('button');
      btn.className = 'dot' + (i === 0 ? ' active' : '');
      btn.addEventListener('click', () => {
        if (busy) return;
        rawIndex = perPage + i;
        setPos(true);
        resetTimer();
        setTimeout(() => { updateDots(); busy = false; }, 700);
      });
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    const ri = realIdx();
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === ri));
  }

  function onEnd() {
    /* Seamless loop: silently snap to the real equivalent position */
    if (rawIndex >= perPage + N) { rawIndex = perPage;  setPos(false); }
    if (rawIndex <= 0)            { rawIndex = N;        setPos(false); }
    updateDots();
    busy = false;
  }

  function step(dir) {
    if (busy) return;
    busy = true;
    rawIndex += dir;
    setPos(true);
    updateDots();
    track.addEventListener('transitionend', onEnd, { once: true });
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => step(1), AUTO_DELAY);
  }

  prevBtn?.addEventListener('click', () => { step(-1); resetTimer(); });
  nextBtn?.addEventListener('click', () => { step(1);  resetTimer(); });

  buildTrack();
  resetTimer();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { buildTrack(); resetTimer(); }, 150);
  });
}
initBlogCarousel();

/* ── QTY STEPPER ── */
function qtyStep(btn, dir) {
  const input = btn.parentElement.querySelector('input');
  const min = parseInt(input.min) || 1;
  const max = parseInt(input.max) || 20;
  const newVal = Math.min(max, Math.max(min, parseInt(input.value) + dir));
  input.value = newVal;
  btn.parentElement.querySelector('.qty-minus').disabled = newVal <= min;
  btn.parentElement.querySelector('.qty-plus').disabled  = newVal >= max;
}

/* ── MODAL ── */
function openModal(data, btn) {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  /* Auto-grab the card image if not provided */
  if (!data.image && btn) {
    const card = btn.closest('.card');
    if (card) {
      const img = card.querySelector('.card-img');
      if (img) data.image = img.src;
    }
  }

  const waText = encodeURIComponent(
    `Bonjour, je souhaite réserver ${data.type === 'activite' ? "l'activité" : "l'excursion"} "${data.title}". Pouvez-vous me contacter ?`
  );
  const waLink = `https://wa.me/21266331750?text=${waText}`;

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Fermer" onclick="closeModal()">✕</button>
      <div class="modal-img-wrap">
        ${data.image
          ? `<img src="${data.image}" alt="${data.title}" style="width:100%;aspect-ratio:16/7;object-fit:cover;border-radius:20px 20px 0 0;display:block;" />`
          : `<div style="width:100%;aspect-ratio:16/7;background:linear-gradient(135deg,#111,#222);display:flex;align-items:center;justify-content:center;font-size:64px;border-radius:20px 20px 0 0">${data.emoji || '🌍'}</div>`
        }
      </div>
      <div class="modal-body">
        <div class="card-tag">${data.tag}</div>
        <h2 class="modal-title">${data.title}</h2>
        <div class="modal-meta">
          <span class="modal-meta-item">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
            ${data.duration}
          </span>
          ${data.difficulty ? `<span class="modal-meta-item">
            <svg viewBox="0 0 24 24"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>
            ${data.difficulty}
          </span>` : ''}
          <span class="modal-meta-item" style="color:var(--gold);font-weight:700">
            ${data.price}
          </span>
        </div>
        <p class="modal-desc">${data.description}</p>
        <div class="modal-lists">
          <div>
            <div class="modal-list-title included">Inclus</div>
            <ul class="modal-list">
              ${data.included.map(i => `<li><span class="check">✓</span> ${i}</li>`).join('')}
            </ul>
          </div>
          <div>
            <div class="modal-list-title excluded">Non inclus</div>
            <ul class="modal-list">
              ${data.excluded.map(i => `<li><span class="cross">✗</span> ${i}</li>`).join('')}
            </ul>
          </div>
        </div>
        <hr style="border:none;border-top:1px solid var(--border);margin-bottom:28px">
        <p style="font-size:14px;font-weight:600;color:var(--gray);margin-bottom:16px;text-transform:uppercase;letter-spacing:.5px">Réserver via WhatsApp</p>
        <form class="modal-form" onsubmit="submitModalForm(event, '${data.title}', '${data.type}')">
          <div class="form-field">
            <label>Nom complet</label>
            <input type="text" name="nom" placeholder="Votre nom" required />
          </div>
          <div class="form-field">
            <label>Téléphone</label>
            <input type="tel" id="modal-phone-input" name="tel" placeholder="6XX XXX XXX" autocomplete="tel" required />
          </div>
          <div class="form-field">
            <label>Date souhaitée</label>
            <input type="date" name="date" required />
          </div>
          <div class="form-field">
            <label>Nombre de personnes</label>
            <div class="qty-stepper">
              <button type="button" class="qty-btn qty-minus" onclick="qtyStep(this,-1)">−</button>
              <input type="number" name="nb" min="1" max="20" value="2" required readonly />
              <button type="button" class="qty-btn qty-plus" onclick="qtyStep(this,1)">+</button>
            </div>
          </div>
          <div class="form-field full">
            <button type="submit" class="btn btn-gold" style="width:100%;justify-content:center">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Confirmer via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* init phone input with country selector */
  const phoneEl = document.getElementById('modal-phone-input');
  if (phoneEl && window.intlTelInput) {
    window._modalIti = window.intlTelInput(phoneEl, {
      initialCountry: 'ma',
      separateDialCode: true,
      loadUtilsOnInit: 'https://cdn.jsdelivr.net/npm/intl-tel-input@23/build/js/utils.js',
      preferredCountries: ['ma', 'fr', 'es', 'gb', 'us'],
    });
    const updateMaxLength = () => {
      const isMorocco = window._modalIti.getSelectedCountryData().iso2 === 'ma';
      phoneEl.maxLength = isMorocco ? 9 : 15;
      phoneEl.pattern   = isMorocco ? '\\d{9}' : '\\d+';
    };
    updateMaxLength();
    phoneEl.addEventListener('input', () => {
      phoneEl.value = phoneEl.value.replace(/\D/g, '');
      updateMaxLength();
    });
    phoneEl.addEventListener('countrychange', updateMaxLength);
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay?.classList.remove('open');
  document.body.style.overflow = '';
}

function submitModalForm(e, title, type) {
  e.preventDefault();
  const form    = e.target;
  const nom     = form.nom.value;
  const iti     = window._modalIti;
  const phoneEl = document.getElementById('modal-phone-input');
  const isMorocco = iti && iti.getSelectedCountryData().iso2 === 'ma';

  if (isMorocco && phoneEl.value.replace(/\D/g, '').length !== 9) {
    phoneEl.setCustomValidity('Le numéro marocain doit contenir exactement 9 chiffres.');
    phoneEl.reportValidity();
    return;
  }
  phoneEl?.setCustomValidity('');

  const tel  = iti ? iti.getNumber() : form.tel.value;
  const date = form.date.value;
  const nb   = form.nb.value;
  const typeLabel = type === 'activite' ? "l'activité" : "l'excursion";
  const text = encodeURIComponent(
    `Bonjour Élite Mogador, je souhaite réserver ${typeLabel} "${title}".\nNom : ${nom}\nTéléphone : ${tel}\nDate : ${date}\nNombre de personnes : ${nb}\nMerci de me contacter.`
  );
  window.open(`https://wa.me/21266331750?text=${text}`, '_blank');
}

/* ── REVEAL ON SCROLL ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── ACTIVE NAV LINK on scroll ── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
});

/* ── KEYBOARD ESC closes modal/drawer ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeDrawer(); }
});
