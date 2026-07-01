const fs = require('fs');
const path = require('path');

const srcPath = 'c:\\Users\\hp\\Desktop\\ASSA TRANS\\activites\\index.html';
const destDir = 'c:\\Users\\hp\\Desktop\\ASSA TRANS\\circuits';
const destPath = path.join(destDir, 'index.html');

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir);
}

let html = fs.readFileSync(srcPath, 'utf-8');

// 1. Title & Meta
html = html.replace('<title>Activités au Maroc — Assa Trans</title>', '<title>Circuits au Maroc — Assa Trans</title>');
html = html.replace('Activités à Agadir & Marrakech', 'Circuits & Excursions longues au Maroc');

// 2. Update Nav
html = html.replace('<a href="index.html" class="nav-link active">Activités</a>', '<a href="../activites/index.html" class="nav-link">Activités</a>');
html = html.replace('<li class="nav-item"><a href="../circuits/index.html" class="nav-link">Circuits</a></li>', '<li class="nav-item"><a href="index.html" class="nav-link active">Circuits</a></li>');
html = html.replace('<a href="index.html" class="mobile-nav-link">Activités</a>', '<a href="../activites/index.html" class="mobile-nav-link">Activités</a>');
html = html.replace('<a href="../circuits/index.html" class="mobile-nav-link">Circuits</a>', '<a href="index.html" class="mobile-nav-link">Circuits</a>');

// 3. Hero Section
html = html.replace(/<div class="act-hero-label">.*?<\/div>/, '<div class="act-hero-label">Assa Trans — Découverte & Aventure</div>');
html = html.replace(/<h1 class="act-hero-title">.*?<\/h1>/, '<h1 class="act-hero-title">Circuits au Maroc</h1>');
html = html.replace(/<p class="act-hero-sub">.*?<\/p>/, '<p class="act-hero-sub">Explorez les villes impériales et le Grand Sud marocain à travers nos circuits de plusieurs jours. Des paysages exceptionnels vous attendent.</p>');

html = html.replace('<span class="act-hero-stat-num">23</span>', '<span class="act-hero-stat-num">4</span>');
html = html.replace('<span class="act-hero-stat-label">Activités disponibles</span>', '<span class="act-hero-stat-label">Circuits disponibles</span>');

// 4. Filters
const filtersHtml = `
<div class="act-filters">
  <div class="container">
    <div class="act-filters-inner">
      <button class="act-filter-btn active" data-filter="all">
        Tous <span class="act-filter-count">4</span>
      </button>
      <button class="act-filter-btn" data-filter="villes-imperiales">
        Villes Impériales <span class="act-filter-count">2</span>
      </button>
      <button class="act-filter-btn" data-filter="grand-sud">
        Grand Sud <span class="act-filter-count">2</span>
      </button>
    </div>
  </div>
</div>
`;
html = html.replace(/<div class="act-filters">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, filtersHtml.trim());

// 5. Grid Header
html = html.replace('<strong id="actCount">23</strong> activités trouvées', '<strong id="actCount">4</strong> circuits trouvés');

// 6. Grid Items
const cardsHtml = `
      <!-- 1 — Circuit Villes Impériales Maroc -->
      <div class="tour-card reveal" data-cat="villes-imperiales">
        <div class="tour-gallery" data-gallery>
          <div class="tour-gallery-track">
            <div class="tour-gallery-slide"><img src="https://agadir-visite.com/wp-content/uploads/2022/11/Medresa-Ben-Youssef-patrimoine-traditionnel-e1737716699463.webp" alt="Circuit Villes Impériales" loading="lazy"></div>
          </div>
          <button class="gallery-prev">&#8249;</button><button class="gallery-next">&#8250;</button>
          <div class="gallery-dots"><button class="gallery-dot active"></button></div>
          <span class="card-badge-cat">Villes Impériales</span>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>6 jours</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Maroc</span></div>
          <h3 class="card-title"><a href="villes-imperiales-6j.html">Circuit Villes Impériales</a></h3>
          <p class="card-excerpt">Les villes impériales du Maroc. Marrakech, Rabat, Meknès, Fés, découverte du patrimoine, des monuments prestigieux, l’histoire, la culture ...</p>
          <div class="card-price">à partir de <strong data-price-eur="450">€450</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.9</span><span class="rating-count">(85)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Circuit Villes Impériales&quot;, &quot;price&quot;: 450, &quot;category&quot;: &quot;Villes Impériales&quot;, &quot;duration&quot;: &quot;6 jours&quot;}')" href="../reservation.html" class="btn-commander">Commander</a>
          </div>
        </div>
      </div>

      <!-- 2 — Grand Sud 4x4 Zagora 6 jours -->
      <div class="tour-card reveal delay-1" data-cat="grand-sud">
        <div class="tour-gallery" data-gallery>
          <div class="tour-gallery-track">
            <div class="tour-gallery-slide"><img src="https://agadir-visite.com/wp-content/uploads/2022/11/5c6872be34794011725075.jpg" alt="Grand Sud 4x4 - Zagora" loading="lazy"></div>
          </div>
          <button class="gallery-prev">&#8249;</button><button class="gallery-next">&#8250;</button>
          <div class="gallery-dots"><button class="gallery-dot active"></button></div>
          <span class="card-badge-cat">Grand Sud</span>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>6 jours</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Zagora</span></div>
          <h3 class="card-title"><a href="grand-sud-zagora-6j.html">Grand Sud 4x4 - Zagora</a></h3>
          <p class="card-excerpt">Un circuit superbe à Zagora de 6 jours, partez en 4X4 à la découverte des paysages superbes, des traditions... La Kasbah Amridil etc...</p>
          <div class="card-price">à partir de <strong data-price-eur="420">€420</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.8</span><span class="rating-count">(64)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Grand Sud 4x4 - Zagora&quot;, &quot;price&quot;: 420, &quot;category&quot;: &quot;Grand Sud&quot;, &quot;duration&quot;: &quot;6 jours&quot;}')" href="../reservation.html" class="btn-commander">Commander</a>
          </div>
        </div>
      </div>

      <!-- 3 — Le grand circuit des villes impériales et le sud -->
      <div class="tour-card reveal delay-2" data-cat="villes-imperiales">
        <div class="tour-gallery" data-gallery>
          <div class="tour-gallery-track">
            <div class="tour-gallery-slide"><img src="https://travelplansmarrakech.com/wp-content/uploads/2024/10/5-3.jpeg" alt="9 JOURS GRAND TOUR" loading="lazy"></div>
          </div>
          <button class="gallery-prev">&#8249;</button><button class="gallery-next">&#8250;</button>
          <div class="gallery-dots"><button class="gallery-dot active"></button></div>
          <span class="card-badge-cat">Villes Impériales</span>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>9 jours</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Maroc</span></div>
          <h3 class="card-title"><a href="villes-imperiales-sud-9j.html">Villes Impériales & Sud Marocain</a></h3>
          <p class="card-excerpt">Explore the imperial cities and southern Morocco in 9 days: history, culture, diverse landscapes, and unforgettable discoveries.</p>
          <div class="card-price">à partir de <strong data-price-eur="750">€750</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.9</span><span class="rating-count">(42)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Villes Impériales & Sud Marocain&quot;, &quot;price&quot;: 750, &quot;category&quot;: &quot;Villes Impériales&quot;, &quot;duration&quot;: &quot;9 jours&quot;}')" href="../reservation.html" class="btn-commander">Commander</a>
          </div>
        </div>
      </div>

      <!-- 4 — Circuit grand sud marocain zagora 3 jours -->
      <div class="tour-card reveal" data-cat="grand-sud">
        <div class="tour-gallery" data-gallery>
          <div class="tour-gallery-track">
            <div class="tour-gallery-slide"><img src="https://agadir-visite.com/wp-content/uploads/2022/11/5c6af99240fcc811796346.jpg" alt="Circuit Grand Sud Marocain – Zagora" loading="lazy"></div>
          </div>
          <button class="gallery-prev">&#8249;</button><button class="gallery-next">&#8250;</button>
          <div class="gallery-dots"><button class="gallery-dot active"></button></div>
          <span class="card-badge-cat">Grand Sud</span>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>3 jours</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Zagora</span></div>
          <h3 class="card-title"><a href="grand-sud-zagora-3j.html">Circuit Grand Sud – Zagora</a></h3>
          <p class="card-excerpt">Zagora, circuit à découvrir, Grand Sud Marocain, Kasbahs, Dunes dorées du désert, paysage exceptionnel, panneau indiquant, Tombouctou 52 jours.</p>
          <div class="card-price">à partir de <strong data-price-eur="280">€280</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.7</span><span class="rating-count">(112)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Circuit Grand Sud – Zagora&quot;, &quot;price&quot;: 280, &quot;category&quot;: &quot;Grand Sud&quot;, &quot;duration&quot;: &quot;3 jours&quot;}')" href="../reservation.html" class="btn-commander">Commander</a>
          </div>
        </div>
      </div>
`;

const startIdx = html.indexOf('<!-- 1 — Balade à Cheval en Palmeraie -->');
const endIdx = html.indexOf('</div><!-- /act-grid -->');

if (startIdx !== -1 && endIdx !== -1) {
    html = html.substring(0, startIdx) + cardsHtml + html.substring(endIdx);
} else {
    console.error("Could not find start/end indices for grid");
}

fs.writeFileSync(destPath, html);
console.log("Generated circuits/index.html");
