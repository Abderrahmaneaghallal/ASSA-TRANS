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
    
    // Find the excursions grid in index.html
    const gridStart = indexHtml.indexOf('<div class="grid-3" id="excursionsGrid">');
    if (gridStart === -1) {
        console.log("Could not find excursions grid in index.html");
        process.exit(1);
    }
    const gridEnd = indexHtml.indexOf('</div><!-- /grid-3 -->', gridStart);
    
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
        // Replace src="/excursions/images/... " with src="excursions/images/..."
        card = card.replace(/src="\/excursions\//g, 'src="excursions/');
        // Replace src="../activites/images/... " with src="activites/images/..."
        card = card.replace(/src="\.\.\//g, ''); // Wait, ../ removes the dot dot slash, turning it into relative to index.html.
        
        // Fix openModal image paths
        card = card.replace(/image:'\/excursions\//g, "image:'excursions/");
        card = card.replace(/image:'\.\.\//g, "image:'");
        
        newGridContent += '      ' + card + '\n\n';
    });
    
    indexHtml = indexHtml.substring(0, gridStart + 43) + '\n\n' + newGridContent + indexHtml.substring(gridEnd);
    
    fs.writeFileSync('C:/Users/hp/Desktop/ASSA TRANS/index.html', indexHtml);
    console.log("SUCCESS");
} else {
    console.log("Failed to find all 6 cards.");
}
