const fs = require('fs');
const path = require('path');

const files = [
    "c:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html",
    "c:\\Users\\hp\\Desktop\\ASSA TRANS\\excursions\\index.html",
    "c:\\Users\\hp\\Desktop\\ASSA TRANS\\activites\\index.html",
    "c:\\Users\\hp\\Desktop\\ASSA TRANS\\circuits\\index.html"
];

const basePath = "c:\\Users\\hp\\Desktop\\ASSA TRANS";

function refactorFile(filepath) {
    if (!fs.existsSync(filepath)) {
        console.log(`Not found: ${filepath}`);
        return;
    }
    let content = fs.readFileSync(filepath, 'utf8');

    // Add CSS and JS if not present
    let relPath = path.relative(basePath, path.dirname(filepath));
    let assets_prefix = relPath === "" ? "assets/" : "../assets/";
    
    const css_link1 = `<link rel="stylesheet" href="${assets_prefix}css/elite-cards.css">`;
    const css_link2 = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@23/build/css/intlTelInput.css">`;
    
    if (!content.includes('elite-cards.css')) {
        content = content.replace('</head>', `${css_link1}\n${css_link2}\n</head>`);
    }
        
    const js_link1 = `<script src="${assets_prefix}js/elite-modal.js"></script>`;
    const js_link2 = `<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@23/build/js/intlTelInput.min.js"></script>`;
    
    if (!content.includes('elite-modal.js')) {
        content = content.replace('</body>', `${js_link2}\n${js_link1}\n</body>`);
    }

    const pattern = /<div class="tour-card(.*?)">[\s\S]*?<div class="tour-gallery.*?<img src="(.*?)"[\s\S]*?<span class="card-badge-cat">(.*?)<\/span>[\s\S]*?<span class="card-badge-duration">.*?<\/span>[\s\S]*?<div class="card-body">[\s\S]*?<h3 class="card-title"><a.*?>([\s\S]*?)<\/a><\/h3>[\s\S]*?<p class="card-excerpt">([\s\S]*?)<\/p>[\s\S]*?<div class="card-price">.*?<strong[^>]*>([\s\S]*?)<\/strong>.*?<\/div>[\s\S]*?<div class="card-rating">[\s\S]*?<\/div>[\s\S]*?<div class="card-actions">[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/g;
    
    let count = 0;
    content = content.replace(pattern, (match, reveal_class, image, category, title, desc, price) => {
        count++;
        
        // Try to get duration
        let durationMatch = match.match(/<span class="card-badge-duration">[\s\S]*?<polyline[^>]*\/>([\s\S]*?)<\/(?:span|svg)>/);
        let duration = durationMatch ? durationMatch[1].trim() : "1 journée";
        
        let type_str = "excursion";
        let dLow = duration.toLowerCase();
        let catLow = category.toLowerCase();
        if (dLow.includes("jours") || dLow.includes("j")) type_str = "circuit";
        else if (catLow.includes("nautique") || catLow.includes("dans les airs") || catLow.includes("terrestre") || match.includes("activites")) type_str = "activite";

        let safe_title = title.trim().replace(/'/g, "\\'").replace(/"/g, "&quot;");
        let safe_desc = desc.trim().replace(/'/g, "\\'").replace(/"/g, "&quot;").replace(/\n/g, ' ');
        let safe_img = image.trim().replace(/'/g, "\\'");
        category = category.trim();
        price = price.trim();

        return `      <div class="card${reveal_class}">
        <img class="card-img" src="${image}" alt="${title}" loading="lazy" />
        <div class="card-body">
          <span class="card-tag">${category}</span>
          <h3 class="card-title">${title}</h3>
          <p class="card-desc">${desc}</p>
          <div class="card-meta">
            <span><svg viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg> ${duration}</span>
            <span><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg> Tous niveaux</span>
          </div>
          <div class="card-price">À partir de ${price} <span>/ pers.</span></div>
          <div class="card-actions">
            <button class="btn-em btn-em-outline-gold btn-em-sm" onclick="openModal({type:'${type_str}',tag:'${category}',title:'${safe_title}',duration:'${duration}',difficulty:'Tous niveaux',price:'À partir de ${price} / pers.',description:'${safe_desc}',image:'${safe_img}',included:['Transport aller/retour', 'Chauffeur/Guide professionnel', 'Assurance transport'],excluded:['Dépenses personnelles', 'Pourboires']}, this)">
              Détails
            </button>
            <button class="btn-em btn-em-gold btn-em-sm" onclick="openModal({type:'${type_str}',tag:'${category}',title:'${safe_title}',duration:'${duration}',difficulty:'Tous niveaux',price:'À partir de ${price} / pers.',description:'${safe_desc}',image:'${safe_img}',included:['Transport aller/retour', 'Chauffeur/Guide professionnel', 'Assurance transport'],excluded:['Dépenses personnelles', 'Pourboires']}, this)">Réserver</button>
          </div>
        </div>
      </div>`;
    });

    console.log(`Replaced ${count} cards in ${filepath}`);
    
    // Also un-hide the circuits section if it was hidden
    content = content.replace('<div style="display:none"><div class="grid-3">', '<div class="grid-3">');
    
    fs.writeFileSync(filepath, content, 'utf8');
}

files.forEach(f => refactorFile(f));
