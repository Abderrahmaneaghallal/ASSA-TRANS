const fs = require('fs');


const files = [
  'c:/Users/hp/Desktop/ASSA TRANS/index.html',
  'c:/Users/hp/Desktop/ASSA TRANS/excursions/index.html',
  'c:/Users/hp/Desktop/ASSA TRANS/activites/index.html'
];

function getDuration(title, description) {
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  
  if (d.includes('demi journée') || d.includes('demi-journée') || t.includes('demi-journée')) return 'Demi-journée';
  if (d.includes('1 journée') || d.includes('une journée') || t.includes('1 journée') || t.includes('ouzoud') || t.includes('ourika') || t.includes('essaouira')) return '1 journée';
  if (t.includes('cheval') || t.includes('dromadaire') && !d.includes('demi')) return '2 heures';
  if (t.includes('buggy') || t.includes('quad')) return 'Demi-journée';
  if (t.includes('montgolfière')) return 'Demi-journée';
  if (t.includes('oasiria') || t.includes('parc')) return '1 journée';
  if (t.includes('poterie') || t.includes('wake')) return '2 heures';
  if (t.includes('jet ski')) return '30 min';
  if (t.includes('bateau')) return 'Demi-journée';
  if (t.includes('surf')) return 'Demi-journée';
  if (t.includes('hammam') || t.includes('spa')) return '2 heures';
  if (t.includes('massage')) return '1 heure';
  if (t.includes('agadir') && t.includes('visite')) return 'Demi-journée';

  return '1 journée'; // Default
}

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;

  // We need to match the tour-card blocks
  // Regex to match a card block and extract its title and description
  // It's safer to just do string replacements for the badge and openModal separately.
  
  // Actually, let's parse it somewhat robustly.
  const cardRegex = /<div class="tour-card[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*(?=<!--|$)/g;
  
  content = content.replace(cardRegex, (match) => {
    // Extract title
    const titleMatch = match.match(/<h3 class="card-title">([^<]+)<\/h3>/);
    const descMatch = match.match(/<p class="card-excerpt">([^<]+)<\/p>/);
    if (!titleMatch) return match;

    const title = titleMatch[1];
    const desc = descMatch ? descMatch[1] : '';
    const duration = getDuration(title, desc);

    // Replace the empty badge
    let newMatch = match.replace(
      /(<span class="card-badge-duration"><svg[^>]+><circle[^>]+><polyline[^>]+><\/svg>)(<\/span>)/g, 
      `$1${duration}$2`
    );

    // Replace the openModal duration parameter
    newMatch = newMatch.replace(/duration:''/g, `duration:'${duration}'`);

    count++;
    return newMatch;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${count} cards in ${file}`);
});
