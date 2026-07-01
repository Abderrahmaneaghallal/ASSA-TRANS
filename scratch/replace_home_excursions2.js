const fs = require('fs');

const excHtml = fs.readFileSync('C:/Users/hp/Desktop/ASSA TRANS/excursions/index.html', 'utf8');
const titlesToFind = [
  "visite de ville Agadir 1/2 j",
  "Balade à Cheval",
  "Excursion Plage Legzira (1j)",
  "Visite souk & Crocopark agadir (1j)",
  "Excursion paradise valley et Taghazout",
  "Excursion marrakech via Essouira"
];

// Extract cards using regex
const cards = [...excHtml.matchAll(/<div class="tour-card reveal[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)].map(m => m[0]);

const selectedCards = [];

titlesToFind.forEach(title => {
    const card = cards.find(c => c.includes(`<h3 class="card-title">${title}</h3>`));
    if (card) {
        selectedCards.push(card);
    } else {
        console.log(`Could not find card for: ${title}`);
    }
});

if (selectedCards.length === 6) {
    let indexHtml = fs.readFileSync('C:/Users/hp/Desktop/ASSA TRANS/index.html', 'utf8');
    
    // Find the excursions section in index.html
    const secStart = indexHtml.indexOf('<!-- ══════════════ EXCURSIONS ══════════════ -->');
    const secEnd = indexHtml.indexOf('<!-- ══════════════ ACTIVITÉS (6 cards) ══════════════ -->');
    
    if (secStart === -1 || secEnd === -1) {
        console.log("Could not find excursions section markers in index.html");
        process.exit(1);
    }
    
    const sectionBlock = indexHtml.substring(secStart, secEnd);
    const gridStart = sectionBlock.indexOf('<div class="grid-3">');
    const gridEnd = sectionBlock.lastIndexOf('</div>');
    // Actually the grid is closed before the section is closed, so let's find the closing tag of the grid.
    // Let's just replace the content inside the FIRST <div class="grid-3"> in that block up to the LAST </div> that closes the grid.
    
    // Format the selected cards for the homepage
    let newGridContent = '';
    const delays = ['', ' delay-1', ' delay-2', '', ' delay-1', ' delay-2'];
    
    selectedCards.forEach((card, i) => {
        // Adjust delays
        card = card.replace(/class="tour-card reveal[^"]*"/, 'class="tour-card reveal"');
        if (delays[i]) {
            card = card.replace('class="tour-card reveal"', `class="tour-card reveal${delays[i]}"`);
        }
        
        // Adjust image paths
        card = card.replace(/src="\/excursions\//g, 'src="excursions/');
        card = card.replace(/src="\.\.\//g, '');
        
        // Fix openModal image paths
        card = card.replace(/image:'\/excursions\//g, "image:'excursions/");
        card = card.replace(/image:'\.\.\//g, "image:'");
        
        newGridContent += '      ' + card + '\n\n';
    });
    
    const newSectionBlock = sectionBlock.substring(0, gridStart + 20) + '\n\n' + newGridContent + '    </div>\n  </div>\n</section>\n\n';
    
    indexHtml = indexHtml.substring(0, secStart) + newSectionBlock + indexHtml.substring(secEnd);
    
    fs.writeFileSync('C:/Users/hp/Desktop/ASSA TRANS/index.html', indexHtml);
    console.log("SUCCESS");
} else {
    console.log("Failed to find all 6 cards.");
}
