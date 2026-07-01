const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\1749f81f-a12c-4c97-a7d1-fe34e5b3690d\\.system_generated\\steps\\408\\content.md', 'utf8');

const regex = /(Aper(?:ç|&ccedil;|&amp;ccedil;)?u|Inclus|Exclus|Non Inclus|Ce qui est inclus).*?<\/div>/gi;
let match;
while ((match = regex.exec(html)) !== null) {
    console.log("---- MATCH ----");
    console.log(html.substring(match.index, match.index + 800));
}

// Just output text stripped of html
const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const words = ['aperçu', 'apercu', 'inclus', 'exclus'];
for (const w of words) {
    const idx = clean.toLowerCase().indexOf(w);
    if (idx !== -1) {
        console.log(`\n\n--- TEXT MATCH for ${w} ---`);
        console.log(clean.substring(Math.max(0, idx - 50), idx + 800));
    }
}
