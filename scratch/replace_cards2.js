const fs = require('fs');

const indexFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html';
let content = fs.readFileSync(indexFile, 'utf8');

const target1 = `      <!-- 1 — Montgolfière -->
      <div class="tour-card reveal">
        <div class="tour-gallery" data-gallery>
          <div class="tour-gallery-track">
            <div class="tour-gallery-slide"><img src="https://marrakechbestof.com/wp-content/uploads/2018/10/DSC09175-1024x683.jpg" alt="Montgolfière Marrakech" loading="lazy"></div>
          </div>
          <button class="gallery-prev">&#8249;</button><button class="gallery-next">&#8250;</button>
          <div class="gallery-dots"><button class="gallery-dot active"></button></div>
          <span class="card-badge-cat">Dans les airs</span>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>1h30</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Marrakech</span></div>
          <h3 class="card-title"><a href="activites/index.html">Montgolfière à Marrakech</a></h3>
          <p class="card-excerpt">Survol magique de la palmeraie et des plaines de Marrakech au lever du soleil. Une expérience inoubliable en toute sécurité.</p>
          <div class="card-price">à partir de <strong data-price-eur="170">€170</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.9</span><span class="rating-count">(112)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Montgolfière à Marrakech&quot;, &quot;price&quot;: 170, &quot;category&quot;: &quot;Dans les airs&quot;, &quot;duration&quot;: &quot;1h30&quot;, &quot;image&quot;: &quot;https://marrakechbestof.com/wp-content/uploads/2018/10/DSC09175-1024x683.jpg&quot;, &quot;desc&quot;: &quot;Survol magique de la palmeraie et des plaines de Marrakech au lever du soleil. Une expérience inoubliable en toute sécurité.&quot;}')" href="reservation.html" class="btn-commander">Commander</a>
          </div>
        </div>
      </div>`;

const replace1 = `      <!-- 1 — Sortie en Mer à agadir -->
      <div class="tour-card reveal">
        <div class="tour-gallery" data-gallery>
          <div class="tour-gallery-track">
            <div class="tour-gallery-slide"><img src="activites/images/Sortie%20en%20Mer%20%C3%A0%20agadir.png" alt="Sortie en Mer à agadir" loading="lazy"></div>
          </div>
          <button class="gallery-prev">&#8249;</button><button class="gallery-next">&#8250;</button>
          <div class="gallery-dots"><button class="gallery-dot active"></button></div>
          <span class="card-badge-cat">Nautique</span>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>5 heures</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Agadir</span></div>
          <h3 class="card-title"><a href="activites/index.html">Sortie en Mer à agadir</a></h3>
          <p class="card-excerpt">Profitez d'une excursion en mer d'une demi-journée à Agadir. Navigation depuis la Marina, détente, baignade, et déjeuner à bord inclus.</p>
          <div class="card-price">à partir de <strong data-price-eur="50">€50</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.9</span><span class="rating-count">(30)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Sortie en Mer à agadir&quot;, &quot;price&quot;: 50, &quot;category&quot;: &quot;Nautique&quot;, &quot;duration&quot;: &quot;5 heures&quot;, &quot;image&quot;: &quot;activites/images/Sortie%20en%20Mer%20%C3%A0%20agadir.png&quot;, &quot;desc&quot;: &quot;Profitez d\\'une excursion en mer d\\'une demi-journée à Agadir. Navigation depuis la Marina, détente, baignade, et déjeuner à bord inclus.&quot;}')" href="reservation.html" class="btn-commander">Commander</a>
          </div>
        </div>
      </div>`;

const target2 = `      <!-- 6 — Shooting Romantique -->
      <div class="tour-card reveal delay-2">
        <div class="tour-gallery" data-gallery>
          <div class="tour-gallery-track">
            <div class="tour-gallery-slide"><img src="https://marrakechbestof.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-12-at-15.03.42-1-819x1024.jpeg" alt="Shooting romantique poterie Marrakech" loading="lazy"></div>
          </div>
          <button class="gallery-prev">&#8249;</button><button class="gallery-next">&#8250;</button>
          <div class="gallery-dots"><button class="gallery-dot active"></button></div>
          <span class="card-badge-cat">Découverte</span>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>2 heures</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Marrakech</span></div>
          <h3 class="card-title"><a href="activites/index.html">Shooting Romantique à la Poterie</a></h3>
          <p class="card-excerpt">Séance photo inoubliable dans un atelier de poterie traditionnel de Marrakech. Décor authentique, tenues berbères et souvenirs uniques.</p>
          <div class="card-price">à partir de <strong data-price-eur="30">€30</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.9</span><span class="rating-count">(61)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Shooting Romantique à la Poterie&quot;, &quot;price&quot;: 30, &quot;category&quot;: &quot;Découverte&quot;, &quot;duration&quot;: &quot;2 heures&quot;, &quot;image&quot;: &quot;https://marrakechbestof.com/wp-content/uploads/2024/02/WhatsApp-Image-2024-02-12-at-15.03.42-1-819x1024.jpeg&quot;, &quot;desc&quot;: &quot;Séance photo inoubliable dans un atelier de poterie traditionnel de Marrakech. Décor authentique, tenues berbères et souvenirs uniques.&quot;}')" href="reservation.html" class="btn-commander">Commander</a>
          </div>
        </div>
      </div>`;

const replace2 = `      <!-- 6 — Hammam & massage à agadir -->
      <div class="tour-card reveal delay-2">
        <div class="tour-gallery" data-gallery>
          <div class="tour-gallery-track">
            <div class="tour-gallery-slide"><img src="activites/images/Hammam%20&%20massage%20%C3%A0%20agadir.jpg" alt="Hammam & massage à agadir" loading="lazy"></div>
          </div>
          <button class="gallery-prev">&#8249;</button><button class="gallery-next">&#8250;</button>
          <div class="gallery-dots"><button class="gallery-dot active"></button></div>
          <span class="card-badge-cat">Bien-être</span>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>2 heures</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Agadir</span></div>
          <h3 class="card-title"><a href="activites/index.html">Hammam & massage à agadir</a></h3>
          <p class="card-excerpt">Offrez-vous un moment de relaxation avec des soins marocains envoûtants : un gommage corporel authentique et un massage à base d'huile d'argane.</p>
          <div class="card-price">à partir de <strong data-price-eur="40">€40</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.9</span><span class="rating-count">(30)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Hammam & massage à agadir&quot;, &quot;price&quot;: 40, &quot;category&quot;: &quot;Bien-être&quot;, &quot;duration&quot;: &quot;2 heures&quot;, &quot;image&quot;: &quot;activites/images/Hammam%20&%20massage%20%C3%A0%20agadir.jpg&quot;, &quot;desc&quot;: &quot;Offrez-vous un moment de relaxation avec des soins marocains envoûtants : un gommage corporel authentique et un massage à base d\\'huile d\\'argane.&quot;}')" href="reservation.html" class="btn-commander">Commander</a>
          </div>
        </div>
      </div>`;

content = content.replace(target1, replace1);
content = content.replace(target1.replace(/\\r\\n/g, '\\n'), replace1);

content = content.replace(target2, replace2);
content = content.replace(target2.replace(/\\r\\n/g, '\\n'), replace2);

fs.writeFileSync(indexFile, content, 'utf8');
console.log('Replaced cards successfully. Check 2.');
