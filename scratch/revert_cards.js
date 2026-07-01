const fs = require('fs');

const files = [
    "c:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html",
    "c:\\Users\\hp\\Desktop\\ASSA TRANS\\excursions\\index.html",
    "c:\\Users\\hp\\Desktop\\ASSA TRANS\\activites\\index.html",
    "c:\\Users\\hp\\Desktop\\ASSA TRANS\\circuits\\index.html"
];

function revertCards(filepath) {
    if (!fs.existsSync(filepath)) {
        console.log(`Not found: ${filepath}`);
        return;
    }
    let content = fs.readFileSync(filepath, 'utf8');

    // The regex to find the current `.card`
    const pattern = /<div class="card(.*?)">[\s\S]*?<img class="card-img" src="(.*?)" alt="(.*?)" loading="lazy" \/>[\s\S]*?<div class="card-body">[\s\S]*?<span class="card-tag">(.*?)<\/span>[\s\S]*?<h3 class="card-title">([\s\S]*?)<\/h3>[\s\S]*?<p class="card-desc">([\s\S]*?)<\/p>[\s\S]*?<div class="card-meta">[\s\S]*?<svg.*?<\/svg>\s*(.*?)<\/span>[\s\S]*?<\/div>[\s\S]*?<div class="card-price">À partir de (.*?) <span>.*?<\/span><\/div>[\s\S]*?<div class="card-actions">[\s\S]*?onclick="openModal\(({[\s\S]*?}), this\)"[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;

    let count = 0;
    content = content.replace(pattern, (match, reveal_class, image, title, category, title2, desc, duration, price, modalDataStr) => {
        count++;
        
        let type_str = "excursion";
        let dLow = duration.toLowerCase();
        let catLow = category.toLowerCase();
        if (dLow.includes("jours") || dLow.includes("j")) type_str = "circuit";
        else if (catLow.includes("nautique") || catLow.includes("dans les airs") || catLow.includes("terrestre")) type_str = "activite";

        let modalData = modalDataStr.trim();
        // Just directly reuse the modalData payload

        return `      <div class="tour-card${reveal_class}">
        <div class="tour-gallery" data-gallery>
          <div class="tour-gallery-track">
            <div class="tour-gallery-slide"><img src="${image}" alt="${title}" loading="lazy"></div>
          </div>
          <span class="card-badge-cat">${category}</span>
          <button class="card-wishlist"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></button>
          <span class="card-badge-duration"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${duration}</span>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>${category}</span>
            <span class="card-meta-item"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>Tous niveaux</span>
          </div>
          <h3 class="card-title">${title2}</h3>
          <p class="card-excerpt">${desc}</p>
          <div class="card-price">à partir de <strong>${price}</strong></div>
          <div class="card-rating"><span class="stars">★★★★★</span><span class="rating-num">4.8</span><span class="rating-count">(85)</span></div>
          <div class="card-actions">
            <button class="btn-commander" onclick="openModal(${modalData}, this)">Commander</button>
            <button class="btn-details" onclick="openModal(${modalData}, this)">Détails →</button>
          </div>
        </div>
      </div>`;
    });

    console.log(`Reverted ${count} cards in ${filepath}`);
    fs.writeFileSync(filepath, content, 'utf8');
}

files.forEach(f => revertCards(f));
