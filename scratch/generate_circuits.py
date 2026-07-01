import re
import os

src_path = r"c:\Users\hp\Desktop\ASSA TRANS\activites\index.html"
dest_dir = r"c:\Users\hp\Desktop\ASSA TRANS\circuits"
dest_path = os.path.join(dest_dir, "index.html")

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

with open(src_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Title & Meta
html = html.replace('<title>Activités au Maroc — Assa Trans</title>', '<title>Circuits au Maroc — Assa Trans</title>')
html = html.replace('Activités à Agadir & Marrakech', 'Circuits & Excursions longues au Maroc')

# 2. Update Nav
html = html.replace('<a href="index.html" class="nav-link active">Activités</a>', '<a href="../activites/index.html" class="nav-link">Activités</a>')
html = html.replace('<li class="nav-item"><a href="../blog/index.html" class="nav-link">Blog</a></li>', '<li class="nav-item"><a href="index.html" class="nav-link active">Circuits</a></li>\n          <li class="nav-item"><a href="../blog/index.html" class="nav-link">Blog</a></li>')
html = html.replace('<a href="index.html" class="mobile-nav-link">Activités</a>', '<a href="../activites/index.html" class="mobile-nav-link">Activités</a>\n  <a href="index.html" class="mobile-nav-link">Circuits</a>')

# 3. Hero Section
html = re.sub(r'<div class="act-hero-label">.*?</div>', '<div class="act-hero-label">Assa Trans — Découverte & Aventure</div>', html)
html = re.sub(r'<h1 class="act-hero-title">.*?</h1>', '<h1 class="act-hero-title">Circuits au Maroc</h1>', html)
html = re.sub(r'<p class="act-hero-sub">.*?</p>', '<p class="act-hero-sub">Explorez les villes impériales et le Grand Sud marocain à travers nos circuits de plusieurs jours. Des paysages exceptionnels vous attendent.</p>', html)

html = re.sub(r'<span class="act-hero-stat-num">23</span>', '<span class="act-hero-stat-num">4</span>', html)
html = re.sub(r'<span class="act-hero-stat-label">Activités disponibles</span>', '<span class="act-hero-stat-label">Circuits disponibles</span>', html)

# 4. Filters
filters_html = """
<div class="act-filters">
  <div class="container">
    <div class="act-filters-inner">
      <button class="act-filter-btn active" data-filter="all">
        Tous <span class="act-filter-count">4</span>
      </button>
      <button class="act-filter-btn" data-filter="villes-imperiales">
        Villes Impériales
      </button>
      <button class="act-filter-btn" data-filter="grand-sud">
        Grand Sud
      </button>
    </div>
  </div>
</div>
"""
html = re.sub(r'<div class="act-filters">.*?</div>\s*</div>\s*</div>', filters_html, html, flags=re.DOTALL)

# 5. Grid Header
html = re.sub(r'<strong id="actCount">23</strong> activités trouvées', '<strong id="actCount">4</strong> circuits trouvés', html)

# 6. Grid Items
cards_html = """
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
          <h3 class="card-title"><a href="#">Circuit Villes Impériales</a></h3>
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
          <h3 class="card-title"><a href="#">Grand Sud 4x4 - Zagora</a></h3>
          <p class="card-excerpt">Un circuit superbe à Zagora de 6 jours, partez en 4X4 à la découverte des paysages superbes, des traditions... La Kasbah Amridil a été etc...</p>
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
          <span class="card-badge-cat">Mix</span>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>9 jours</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>Maroc</span></div>
          <h3 class="card-title"><a href="#">Villes Impériales & Sud Marocain</a></h3>
          <p class="card-excerpt">Explore the imperial cities and southern Morocco in 9 days: history, culture, diverse landscapes, and unforgettable discoveries.</p>
          <div class="card-price">à partir de <strong data-price-eur="750">€750</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.9</span><span class="rating-count">(42)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Villes Impériales & Sud Marocain&quot;, &quot;price&quot;: 750, &quot;category&quot;: &quot;Mix&quot;, &quot;duration&quot;: &quot;9 jours&quot;}')" href="../reservation.html" class="btn-commander">Commander</a>
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
          <h3 class="card-title"><a href="#">Circuit Grand Sud – Zagora</a></h3>
          <p class="card-excerpt">Zagora, circuit à découvrir, Grand Sud Marocain, Kasbahs, Dunes dorées du désert, paysage exceptionnel, panneau indiquant, Tombouctou 52 jours.</p>
          <div class="card-price">à partir de <strong data-price-eur="280">€280</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.7</span><span class="rating-count">(112)</span></div>
          <div class="card-actions">
            <a onclick="sessionStorage.setItem('mtResData', '{&quot;name&quot;: &quot;Circuit Grand Sud – Zagora&quot;, &quot;price&quot;: 280, &quot;category&quot;: &quot;Grand Sud&quot;, &quot;duration&quot;: &quot;3 jours&quot;}')" href="../reservation.html" class="btn-commander">Commander</a>
          </div>
        </div>
      </div>
"""
# Find the start and end of the grid items
start_idx = html.find('<!-- 1 — Balade à Cheval en Palmeraie -->')
end_idx = html.find('</div><!-- /act-grid -->')

if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + cards_html + html[end_idx:]

with open(dest_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Generated circuits/index.html")
