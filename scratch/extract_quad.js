const fs = require('fs');
try {
    const html = fs.readFileSync('scratch/quad_scrape.html', 'utf8');
    const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const words = ['inclus', 'exclus', 'aperçu', 'apercu'];
    for (const w of words) {
        const idx = clean.toLowerCase().indexOf(w);
        if (idx !== -1) {
            console.log(`\n\n--- TEXT MATCH for ${w} ---`);
            console.log(clean.substring(Math.max(0, idx - 50), idx + 600));
        }
    }
} catch (err) {
    console.error(err);
}
