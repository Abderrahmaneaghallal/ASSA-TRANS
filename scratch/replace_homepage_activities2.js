const fs = require('fs');

const indexFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html';
const activitesFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\activites\\index.html';

let indexHtml = fs.readFileSync(indexFile, 'utf8');
let activitesHtml = fs.readFileSync(activitesFile, 'utf8');

// Use a better regex to extract all 6 cards
const actMatches = [...activitesHtml.matchAll(/<!-- \d+ — .*? -->[\s\S]*?<div class="tour-card reveal[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)];

console.log("Found cards in activites:", actMatches.length);

if (actMatches.length === 6) {
    let newGridContent = '';
    const delays = ['', ' delay-1', ' delay-2', '', ' delay-1', ' delay-2'];
    
    actMatches.forEach((match, i) => {
        let cardHtml = match[0];
        
        // Remove existing delays
        cardHtml = cardHtml.replace(/class="tour-card reveal[^"]*"/, 'class="tour-card reveal"');
        
        // Add new delays
        if (delays[i]) {
            cardHtml = cardHtml.replace('class="tour-card reveal"', `class="tour-card reveal${delays[i]}"`);
        }
        
        // Change heading color to #C9A84C and disable hover
        cardHtml = cardHtml.replace(/<h3 class="card-title">(.*?)<\/h3>/, 
            '<h3 class="card-title" style="color: #C9A84C; pointer-events: none;">$1</h3>');
        
        cardHtml = cardHtml.replace(/<h3 class="card-title" style="color: #C9A84C; pointer-events: none;"><a href=".*?">(.*?)<\/a><\/h3>/, 
            '<h3 class="card-title" style="color: #C9A84C; pointer-events: none;">$1</h3>');

        newGridContent += '      ' + cardHtml + '\n\n';
    });

    // Replace the grid-3 content in index.html
    const gridStart = indexHtml.indexOf('<div class="grid-3">');
    const gridEnd = indexHtml.indexOf('</div><!-- /grid-3 -->');

    if (gridStart !== -1 && gridEnd !== -1) {
        indexHtml = indexHtml.substring(0, gridStart + 20) + '\n\n' + newGridContent + indexHtml.substring(gridEnd);
        fs.writeFileSync(indexFile, indexHtml);
        console.log("index.html updated successfully!");
    } else {
        console.log("Could not find grid-3 bounds in index.html");
    }
} else {
    console.log("Expected 6 cards, found", actMatches.length);
    actMatches.forEach((m, i) => console.log(i, m[0].substring(0, 80)));
}
