const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'activites', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

const titlesToRemove = [
  "Balade à Cheval en Palmeraie",
  "Balade en Dromadaire – Palmeraie",
  "Atelier de Poterie",
  "Wake Board – Waky",
  "Oasiria — Parc Aquatique",
  "O'Atlas – Journée Piscine",
  "Ferme Pédagogique Bled Ouladi",
  "Hammam & Massage à Marrakech",
  "Tyrolienne & Parcours Aérien",
  "Dîner in the Sky",
  "Quad dans la Palmeraie",
  "Balade en Quad au Désert d'Agafay",
  "Balade à Cheval – Les Écuries",
  "Balade en Buggy à Agafay",
  "Balade en Dromadaire à Agafay",
  "Jump Park – Parc de Trampolines",
  "Atelier de Broderie",
  "Atelier Création de Parfum"
];

let removedCount = 0;

// The blocks look like:
// <!-- 1 — Balade à Cheval en Palmeraie -->
// <div class="tour-card reveal" data-cat="terrestre">
// ...
// </div>
//
// We will match <!-- NUMBER — Title --> and the following <div class="tour-card"...>...</div>
// Since regex matching nested divs is hard, we can split the grid by `<!-- `

const gridStartIdx = html.indexOf('<div class="act-grid" id="actGrid">');
if (gridStartIdx === -1) {
  console.error("Could not find grid start");
  process.exit(1);
}

const beforeGrid = html.substring(0, gridStartIdx + '<div class="act-grid" id="actGrid">\n'.length);
const gridAndAfter = html.substring(beforeGrid.length);

const parts = gridAndAfter.split('<!-- ');

let newGridContent = parts[0]; // Anything before the first comment

const categoryCounts = {
  'all': 0,
  'dans-les-airs': 0,
  'terrestre': 0,
  'nautique': 0,
  'decouverte': 0,
  'bien-etre': 0
};

for (let i = 1; i < parts.length; i++) {
  const part = parts[i];
  // Extract title from comment. E.g., "1 — Balade à Cheval en Palmeraie -->"
  const commentEnd = part.indexOf('-->');
  if (commentEnd === -1) {
    newGridContent += '<!-- ' + part;
    continue;
  }
  
  const commentText = part.substring(0, commentEnd).trim();
  // Strip number and dash if present
  let title = commentText.replace(/^\d+\s*—\s*/, '').trim();

  // If this part is not an activity card (like a different comment), just keep it
  if (!part.includes('class="tour-card')) {
     newGridContent += '<!-- ' + part;
     continue;
  }

  // Check if we should remove
  const shouldRemove = titlesToRemove.some(t => {
      // Allow slight variations like dashes or spaces
      const t1 = t.replace(/–/g, '-').replace(/\s+/g, '').toLowerCase();
      const t2 = title.replace(/–/g, '-').replace(/\s+/g, '').toLowerCase();
      return t1 === t2 || part.includes(t);
  });

  if (shouldRemove) {
    removedCount++;
    console.log(`Removed: ${title}`);
    // But wait, the part might contain the closing </div> of the grid if it's the last card!
    // We need to be careful. The split is by `<!-- `. The last card will have the closing tags of the grid and page.
    // Let's find where the tour-card ends.
    // Actually, a safer way to parse is finding the boundaries of tour-card.
  }
}

// Safer approach: use regex to match the tour-card divs.
// A tour-card starts with <div class="tour-card" ...> and we can find its end by counting divs.
function removeCards(htmlStr, titles) {
    let result = htmlStr;
    let totalRemoved = 0;
    
    for (const title of titles) {
        // Try to find the comment
        const commentRegex = new RegExp(`<!--\\s*\\d+\\s*—\\s*${title.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}\\s*-->`, 'i');
        let match = commentRegex.exec(result);
        
        if (!match) {
            // Try to find title in h3
            const h3Regex = new RegExp(`<h3 class="card-title">${title.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\$&')}</h3>`, 'i');
            match = h3Regex.exec(result);
            if (!match) {
                console.log(`Could not find ${title}`);
                continue;
            }
        }
        
        // Find the preceding <!-- if matched by h3, or start from comment
        let startIndex = match.index;
        if (result.substring(startIndex, startIndex + 4) !== '<!--') {
           // search backward for tour-card
           const cardStart = result.lastIndexOf('<div class="tour-card', startIndex);
           // search backward for comment before card
           const commentStart = result.lastIndexOf('<!--', cardStart);
           if (commentStart !== -1 && cardStart - commentStart < 100) {
               startIndex = commentStart;
           } else {
               startIndex = cardStart;
           }
        }

        // Now find the end of the tour-card div
        // We know it starts with `<div class="tour-card`
        const cardStartIdx = result.indexOf('<div class="tour-card', startIndex);
        if (cardStartIdx === -1) continue;

        let depth = 0;
        let endIndex = -1;
        
        // Regex to find all div opens and closes
        const divRegex = /<\/?div[^>]*>/g;
        divRegex.lastIndex = cardStartIdx;
        
        let tagMatch;
        while ((tagMatch = divRegex.exec(result)) !== null) {
            if (tagMatch[0].startsWith('</div')) {
                depth--;
                if (depth === 0) {
                    endIndex = tagMatch.index + tagMatch[0].length;
                    break;
                }
            } else {
                depth++;
            }
        }
        
        if (endIndex !== -1) {
            result = result.substring(0, startIndex) + result.substring(endIndex);
            totalRemoved++;
            console.log(`Successfully removed: ${title}`);
        }
    }
    return result;
}

let newHtml = removeCards(html, titlesToRemove);

// Now recount the remaining cards and update categories
let allCount = 0;
const catMatches = newHtml.matchAll(/<div class="tour-card[^>]*data-cat="([^"]+)"/g);
for (const match of catMatches) {
    allCount++;
    const cat = match[1];
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
}
categoryCounts['all'] = allCount;

console.log('New counts:', categoryCounts);

// Update HTML with new counts
// Hero stats
newHtml = newHtml.replace(/<span class="act-hero-stat-num">\d+<\/span>\s*<span class="act-hero-stat-label">Activités disponibles<\/span>/, `<span class="act-hero-stat-num">${allCount}</span>\n          <span class="act-hero-stat-label">Activités disponibles</span>`);

// Filters
for (const cat in categoryCounts) {
    const filterRegex = new RegExp(`data-filter="${cat}">\\s*([A-Za-zÀ-ÿ\\s-]+) <span class="act-filter-count">\\d+<\\/span>`, 'g');
    newHtml = newHtml.replace(filterRegex, `data-filter="${cat}">\n        $1 <span class="act-filter-count">${categoryCounts[cat]}</span>`);
}

// Result bar
newHtml = newHtml.replace(/<strong id="actCount">\d+<\/strong> activités trouvées/, `<strong id="actCount">${allCount}</strong> activités trouvées`);

fs.writeFileSync(targetPath, newHtml, 'utf8');
console.log('File updated successfully.');
