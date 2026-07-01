const fs = require('fs');

const indexFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html';
const excursionsFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\excursions\\index.html';
const activitesFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\activites\\index.html';

let indexHtml = fs.readFileSync(indexFile, 'utf8');
let excursionsHtml = fs.readFileSync(excursionsFile, 'utf8');
let activitesHtml = fs.readFileSync(activitesFile, 'utf8');

// Get first 6 Excursions from excursions grid
const excursionsGridStart = excursionsHtml.indexOf('class="grid-3"');
if (excursionsGridStart === -1) {
    console.error("Could not find grid-3 in excursions page");
    process.exit(1);
}
const excursionsGridContent = excursionsHtml.substring(excursionsGridStart);
const excMatches = [...excursionsGridContent.matchAll(/<div class="tour-card reveal[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)].slice(0, 6);

let excGridContent = '';
const delays = ['', ' delay-1', ' delay-2', '', ' delay-1', ' delay-2'];
excMatches.forEach((match, i) => {
    let cardHtml = match[0];
    cardHtml = cardHtml.replace(/class="tour-card reveal[^"]*"/, 'class="tour-card reveal"');
    if (delays[i]) {
        cardHtml = cardHtml.replace('class="tour-card reveal"', `class="tour-card reveal${delays[i]}"`);
    }
    
    // Ensure titles for excursions do not have the custom styling we added for activities
    cardHtml = cardHtml.replace(/style="color: #C9A84C; pointer-events: none;"/g, '');
    
    excGridContent += '      ' + cardHtml + '\n\n';
});

// Get 6 Activities from activities grid
const activitesGridStart = activitesHtml.indexOf('class="act-grid"');
if (activitesGridStart === -1) {
    console.error("Could not find act-grid in activities page");
    process.exit(1);
}
const activitesGridContent = activitesHtml.substring(activitesGridStart);
const actMatches = [...activitesGridContent.matchAll(/<div class="tour-card reveal[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)].slice(0, 6);

let actGridContent = '';
actMatches.forEach((match, i) => {
    let cardHtml = match[0];
    cardHtml = cardHtml.replace(/class="tour-card reveal[^"]*"/, 'class="tour-card reveal"');
    if (delays[i]) {
        cardHtml = cardHtml.replace('class="tour-card reveal"', `class="tour-card reveal${delays[i]}"`);
    }
    cardHtml = cardHtml.replace(/<h3 class="card-title">(.*?)<\/h3>/, 
        '<h3 class="card-title" style="color: #C9A84C; pointer-events: none;">$1</h3>');
    cardHtml = cardHtml.replace(/<h3 class="card-title" style="color: #C9A84C; pointer-events: none;"><a href=".*?">(.*?)<\/a><\/h3>/, 
        '<h3 class="card-title" style="color: #C9A84C; pointer-events: none;">$1</h3>');
    actGridContent += '      ' + cardHtml + '\n\n';
});

// Split index.html by <div class="grid-3">
let parts = indexHtml.split('<div class="grid-3">');

console.log("Splitting index.html by grid-3. Parts count:", parts.length);

if (parts.length >= 4) {
    // parts[1] is excursions grid
    let endExcursions = parts[1].indexOf('</div><!-- /grid-3 -->');
    if (endExcursions === -1) {
        const match = parts[1].match(/<\/div>\s*<\/div>\s*<\/section>/);
        if (match) endExcursions = match.index;
    }
    if (endExcursions !== -1) {
        parts[1] = '\n\n' + excGridContent + parts[1].substring(endExcursions);
    } else {
        console.warn("Could not find end of excursions grid");
    }
    
    // parts[3] is activities grid (since parts[2] is hidden circuits grid)
    let endActivities = parts[3].indexOf('</div><!-- /grid-3 -->');
    if (endActivities === -1) {
        const match = parts[3].match(/<\/div>\s*<\/div>\s*<\/section>/);
        if (match) endActivities = match.index;
    }
    if (endActivities !== -1) {
        parts[3] = '\n\n' + actGridContent + parts[3].substring(endActivities);
    } else {
        console.warn("Could not find end of activities grid");
    }
    
    indexHtml = parts.join('<div class="grid-3">');
    fs.writeFileSync(indexFile, indexHtml);
    console.log("Successfully fixed homepage sections!");
} else {
    console.log("Could not find enough grids in index.html, parts length:", parts.length);
}
