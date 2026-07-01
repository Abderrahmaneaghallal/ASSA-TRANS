const fs = require('fs');

const indexFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html';
const activitesFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\activites\\index.html';

let html = fs.readFileSync(indexFile, 'utf8');

// 1. Meta / Head
html = html.replace(/MoroccanTransfer — Transferts/g, 'AssaTrans — Transferts');
html = html.replace(/<title>MoroccanTransfer/g, '<title>AssaTrans');
html = html.replace(/"name":"MoroccanTransfer"/g, '"name":"AssaTrans"');
html = html.replace(/"url":"https:\/\/moroccan-transfer\.com"/g, '"url":"https://assa-trans.com"');

// 2. Header / Footer links & WhatsApp numbers
html = html.replace(/\+212 707-473742/g, '+212 662-130626');
html = html.replace(/212707473742/g, '212662130626');
html = html.replace(/contact@moroccantransfert\.com/g, 'contact@assatrans.com');
html = html.replace(/contact@AssaTranst\.com/g, 'contact@assatrans.com');

// 3. Logo
html = html.replace(/Moroccan Transfer\.png/g, 'ASSA TRANS LOGO.png');
html = html.replace(/Moroccan<span>Transfer<\/span>/g, 'Assa<span>Trans</span>');

// 4. Navbar fixes (flatten dropdowns)
html = html.replace(/<li class="nav-item nav-dropdown">[\s\S]*?<a href="excursions\/index\.html"[\s\S]*?<\/ul>\s*<\/li>/, '<li class="nav-item"><a href="excursions/index.html" class="nav-link">Excursions</a></li>');
html = html.replace(/<li class="nav-item nav-dropdown">[\s\S]*?<a href="transferts\/index\.html"[\s\S]*?<\/ul>\s*<\/li>/, '<li class="nav-item"><a href="transferts/index.html" class="nav-link">Transferts</a></li>');

// 5. Inject elite-modal.js script tag if not present
if (!html.includes('assets/js/elite-modal.js')) {
    html = html.replace('<script src="assets/js/main.js"></script>', '<script src="assets/js/elite-modal.js"></script>\n<script src="assets/js/main.js"></script>');
}

// 6. Replace Activities grid with the 6 new activities
let activitesHtml = fs.readFileSync(activitesFile, 'utf8');
const actMatches = [...activitesHtml.matchAll(/<div class="tour-card reveal[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)].slice(0, 6);
let newActivitiesGrid = '';
const delays = ['', ' delay-1', ' delay-2', '', ' delay-1', ' delay-2'];
actMatches.forEach((match, i) => {
    let cardHtml = match[0];
    cardHtml = cardHtml.replace(/class="tour-card reveal[^"]*"/, 'class="tour-card reveal"');
    if (delays[i]) {
        cardHtml = cardHtml.replace('class="tour-card reveal"', `class="tour-card reveal${delays[i]}"`);
    }
    cardHtml = cardHtml.replace(/<h3 class="card-title">(.*?)<\/h3>/, 
        '<h3 class="card-title" style="color: #C9A84C; pointer-events: none;">$1</h3>');
    cardHtml = cardHtml.replace(/<h3 class="card-title"><a href=".*?">(.*?)<\/a><\/h3>/, 
        '<h3 class="card-title" style="color: #C9A84C; pointer-events: none;">$1</h3>');
    newActivitiesGrid += '      ' + cardHtml + '\n\n';
});

// Find the Activités section in html and replace its grid
const actStart = html.indexOf('<section class="section-pad" id="activites"');
if (actStart !== -1) {
    const gridStart = html.indexOf('<div class="grid-3">', actStart);
    const gridEnd = html.indexOf('</div><!-- /grid-3 -->', gridStart);
    if (gridStart !== -1 && gridEnd !== -1) {
        html = html.substring(0, gridStart + 20) + '\n\n' + newActivitiesGrid + html.substring(gridEnd);
        fs.writeFileSync(indexFile, html);
        console.log("index.html fully fixed!");
    } else {
        // Fallback if closing comment not found
        const match = html.substring(gridStart).match(/<\/div>\s*<\/div>\s*<\/section>/);
        if (match) {
            const gridEndIndex = gridStart + match.index;
            html = html.substring(0, gridStart + 20) + '\n\n' + newActivitiesGrid + html.substring(gridEndIndex);
            fs.writeFileSync(indexFile, html);
            console.log("index.html fully fixed!");
        } else {
            console.log("Grid bounds not found in Activités section.");
        }
    }
} else {
    console.log("Activités section not found!");
}
