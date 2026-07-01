window.updateModalTotal = function() {
  const data = window.mtCurrentModalData;
  if (!data) return;
  const qtyEl = document.getElementById('modal-persons');
  if (!qtyEl) return;
  const qty = parseInt(qtyEl.value, 10) || 1;
  const total = data.isPack ? data.price : (data.price * qty);
  document.getElementById('modal-total').textContent = total + ' ' + data.currency;
};

window.qtyStep = function(btn, dir) {
  const input = btn.parentElement.querySelector('input');
  const min = parseInt(input.min) || 1;
  const max = parseInt(input.max) || 20;
  const newVal = Math.min(max, Math.max(min, parseInt(input.value) + dir));
  input.value = newVal;
  btn.parentElement.querySelector('.qty-minus').disabled = newVal <= min;
  btn.parentElement.querySelector('.qty-plus').disabled  = newVal >= max;
  window.updateModalTotal();
};

window.submitModalWhatsApp = function() {
  const data = window.mtCurrentModalData;
  if (!data) return;
  
  const nom = document.getElementById('modal-nom').value.trim();
  const tel = document.getElementById('modal-tel').value.trim();
  const date = document.getElementById('modal-date').value;
  const persons = document.getElementById('modal-persons').value;
  const total = document.getElementById('modal-total').textContent;
  
  if(!nom) { alert('Veuillez entrer votre nom.'); return; }
  if(!tel) { alert('Veuillez entrer votre téléphone.'); return; }
  
  const msg = encodeURIComponent(
    `🌍 Nouvelle réservation — AssaTrans\n\n` +
    `📌 Service : ${data.title}\n` +
    `📅 Date : ${date}\n` +
    `👥 Personnes : ${persons}\n` +
    `💰 Total : ${total}\n\n` +
    `👤 Nom : ${nom}\n` +
    `📞 Tél : +212 ${tel}`
  );
  window.open('https://wa.me/212662130626?text=' + msg, '_blank');
};

function openModal(data, btn) {
  if (!data.image && btn) {
    const card = btn.closest('.tour-card') || btn.closest('.card');
    if (card) {
      const img = card.querySelector('img');
      if (img) data.image = img.src;
    }
  }

  const priceRaw = String(data.price || '');
  const numericMatch = priceRaw.match(/\d+/g);
  let basePrice = 0;
  if (numericMatch) {
    basePrice = parseInt(numericMatch.join(''), 10);
  }
  const isPack = priceRaw.toLowerCase().includes('pack');
  const currency = priceRaw.includes('€') ? '€' : 'MAD';
  
  window.mtCurrentModalData = { title: data.title, price: basePrice, currency, isPack };

  let existing = document.getElementById('modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.className = 'modal-overlay';
  
  let incHTML = '';
  if(data.included && data.included.length) {
    incHTML = `<div><div class="modal-list-title included">Inclus</div><ul class="modal-list">` + data.included.map(i => `<li><span class="check">✓</span> ${i}</li>`).join('') + `</ul></div>`;
  }
  let excHTML = '';
  if(data.excluded && data.excluded.length) {
    excHTML = `<div><div class="modal-list-title excluded">Non Inclus</div><ul class="modal-list">` + data.excluded.map(e => `<li><span class="cross">✕</span> ${e}</li>`).join('') + `</ul></div>`;
  }

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Fermer" onclick="closeModal()">✕</button>
      <div class="modal-img-wrap">
        <img src="${data.image || ''}" alt="${data.title}" class="modal-img" />
      </div>
      <div class="modal-body">
        <div class="card-tag">${data.tag || data.type}</div>
        <h2 class="modal-title">${data.title}</h2>
        <div class="modal-meta">
          <span class="modal-meta-item">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
            ${data.duration}
          </span>
          ${data.difficulty ? `<span class="modal-meta-item">
            <svg viewBox="0 0 24 24"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V14h2V9.6l1.8 7.4 2.2-2z"/></svg>
            ${data.difficulty}
          </span>` : ''}
        </div>
        <div class="modal-price">${data.price}</div>
        <div class="modal-desc">${data.description}</div>
        <div class="modal-lists">
          ${incHTML}
          ${excHTML}
        </div>
        
        <hr style="border:none; border-top:1px solid #333; margin: 32px 0;">
        <div style="font-size:12px; font-weight:700; color:#aaa; margin-bottom:16px;">RÉSERVER VIA WHATSAPP</div>
        <div class="modal-form">
          <div class="form-field">
            <label>Nom complet</label>
            <input type="text" id="modal-nom" placeholder="Votre nom">
          </div>
          <div class="form-field">
            <label>Téléphone</label>
            <div style="display:flex; border:1px solid #333; border-radius:10px; background:#1a1a1a; padding:12px; gap:8px;">
              <span style="display:flex; align-items:center; gap:4px; font-size:14px; font-weight:600;"><img src="https://flagcdn.com/w20/ma.png" width="16" alt="MA"> +212</span>
              <input type="tel" id="modal-tel" placeholder="6XX XXX XXX" style="background:transparent; border:none; outline:none; color:#fff; width:100%; font-size:14px; padding:0;">
            </div>
          </div>
          <div class="form-field">
            <label>Date souhaitée</label>
            <input type="date" id="modal-date">
          </div>
          <div class="form-field">
            <label>Nombre de personnes</label>
            <div class="qty-stepper">
              <button class="qty-btn qty-minus" onclick="qtyStep(this, -1)">-</button>
              <input type="number" id="modal-persons" value="2" min="1" max="20" onchange="updateModalTotal()">
              <button class="qty-btn qty-plus" onclick="qtyStep(this, 1)">+</button>
            </div>
          </div>
          
          <div class="form-field full">
            <div style="border:1px solid #C9A84C; border-radius:10px; padding:16px; text-align:center; background:rgba(201,168,76,0.05);">
              <div style="font-size:12px; color:#aaa; text-transform:uppercase; font-weight:700; margin-bottom:4px;">Total estimé</div>
              <div id="modal-total" style="font-size:18px; font-weight:800; color:#C9A84C;"></div>
            </div>
          </div>
        </div>
        <button onclick="submitModalWhatsApp()" class="btn btn-primary" style="display:flex; align-items:center; justify-content:center; gap:8px; width:100%; margin-top:16px; background:#C9A84C; color:#000; font-weight:700; padding:16px; border-radius:12px; border:none; cursor:pointer; font-size:15px; transition: background 0.3s;">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Confirmer via WhatsApp
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  
  const today = new Date();
  const dateStr = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
  const dateEl = document.getElementById('modal-date');
  if(dateEl) {
    dateEl.min = dateStr;
    dateEl.value = dateStr;
  }
  
  window.updateModalTotal();
  
  setTimeout(() => overlay.classList.add('open'), 10);
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 300);
  }
  document.body.style.overflow = '';
}

// Inject CSS
(function() {
  if (document.getElementById('mogadorModalStyles')) return;
  const style = document.createElement('style');
  style.id = 'mogadorModalStyles';
  style.innerHTML = `
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px);
      z-index: 3000; display: flex; align-items: center; justify-content: center;
      padding: 20px; opacity: 0; pointer-events: none; transition: opacity 0.3s;
    }
    .modal-overlay.open { opacity: 1; pointer-events: all; }
    .modal {
      background: #111; border: 1px solid #333; border-radius: 20px;
      max-width: 760px; width: 100%; max-height: 90vh; overflow-y: auto;
      transform: scale(0.95) translateY(20px); transition: transform 0.3s;
      position: relative; color: #fff; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .modal-overlay.open .modal { transform: scale(1) translateY(0); }
    .modal-close {
      position: absolute; top: 16px; right: 16px; width: 36px; height: 36px;
      background: rgba(0,0,0,0.6); border-radius: 50%; display: flex;
      align-items: center; justify-content: center; color: #fff; font-size: 18px;
      cursor: pointer; border: 1px solid #333; transition: background 0.2s; z-index: 10;
    }
    .modal-close:hover { background: rgba(201, 168, 76, 0.1); }
    .modal-img-wrap { position: relative; }
    .modal-img {
      width: 100%; aspect-ratio: 16/7; object-fit: cover;
      border-radius: 20px 20px 0 0; display: block;
    }
    .modal-body { padding: 36px; }
    .card-tag { 
      display: inline-block; background: rgba(201, 168, 76, 0.1); 
      color: #C9A84C; padding: 4px 10px; border-radius: 6px; 
      font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px;
    }
    .modal-title { font-size: 26px; font-weight: 800; margin-bottom: 8px; color: #fff; font-family: 'DM Serif Display', serif;}
    .modal-meta { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
    .modal-meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #aaa; }
    .modal-meta-item svg { width: 14px; height: 14px; fill: #C9A84C; }
    .modal-desc { font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.75; margin-bottom: 28px; }
    .modal-lists { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
    .modal-list-title { font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 12px; }
    .modal-list-title.included { color: #C9A84C; }
    .modal-list-title.excluded { color: #e07070; }
    .modal-list { list-style: none; padding: 0; margin: 0; }
    .modal-list li { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #aaa; margin-bottom: 8px; }
    .check { color: #C9A84C; font-size: 15px; font-weight: bold; }
    .cross { color: #e07070; font-size: 15px; font-weight: bold; }
    .modal-price { font-size: 20px; font-weight: 800; color: #C9A84C; margin-bottom: 24px; }
    
    .modal-form { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-field { display: flex; flex-direction: column; gap: 6px; }
    .form-field.full { grid-column: span 2; }
    .form-field label { font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #aaa; }
    .form-field input, .form-field select { background: #1a1a1a; border: 1px solid #333; border-radius: 10px; padding: 12px 16px; font-family: inherit; font-size: 14px; color: #fff; outline: none; transition: border-color 0.2s; }
    .form-field input:focus { border-color: #C9A84C; }
    .form-field input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }
    .qty-stepper { display: flex; align-items: center; border: 1px solid #333; border-radius: 10px; overflow: hidden; background: #1a1a1a; height: 44px; }
    .qty-btn { width: 44px; height: 100%; flex-shrink: 0; background: transparent; border: none; color: #C9A84C; font-size: 20px; font-weight: 300; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
    .qty-btn:hover { background: rgba(201, 168, 76, 0.1); }
    .qty-btn:disabled { color: #555; cursor: default; background: transparent; }
    .qty-stepper input[type="number"] { flex: 1; border: none; border-left: 1px solid #333; border-right: 1px solid #333; background: transparent; color: #fff; font-size: 14px; font-weight: 600; text-align: center; -moz-appearance: textfield; outline: none; padding: 0; height: 100%; border-radius: 0; }
    .qty-stepper input[type="number"]::-webkit-inner-spin-button, .qty-stepper input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
    .btn-primary:hover { background: #b08d36 !important; }
    
    @media (max-width: 600px) {
      .modal-lists { grid-template-columns: 1fr; gap: 16px; }
      .modal-form { grid-template-columns: 1fr; }
      .form-field.full { grid-column: span 1; }
      .modal-body { padding: 24px; }
      .modal-title { font-size: 22px; }
      .modal-img { aspect-ratio: 16/9; }
    }
  `;
  document.head.appendChild(style);
})();

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

document.addEventListener('click', (e) => {
  if (e.target && e.target.id === 'modal-overlay') closeModal();
});
