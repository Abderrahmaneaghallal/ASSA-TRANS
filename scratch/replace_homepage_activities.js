const fs = require('fs');

const indexFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html';
const activitesFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\activites\\index.html';

let indexHtml = fs.readFileSync(indexFile, 'utf8');
let activitesHtml = fs.readFileSync(activitesFile, 'utf8');

// Extract the 6 cards from activitesHtml
const actMatches = [...activitesHtml.matchAll(/<div class="tour-card reveal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)];

console.log("Found cards in activites:", actMatches.length);

if (actMatches.length === 6) {
    let newGridContent = '';
    const delays = ['', ' delay-1', ' delay-2', '', ' delay-1', ' delay-2'];
    
    actMatches.forEach((match, i) => {
        let cardHtml = match[0];
        // Add delay classes
        if (delays[i]) {
            cardHtml = cardHtml.replace('class="tour-card reveal"', `class="tour-card reveal${delays[i]}"`);
        }
        
        // Change heading color to #C9A84C and disable hover
        // The title is in <h3 class="card-title">Title</h3>
        cardHtml = cardHtml.replace(/<h3 class="card-title">(.*?)<\/h3>/, 
            '<h3 class="card-title" style="color: #C9A84C;">$1</h3>');
        
        // Remove the href inside h3 if it existed in the past
        cardHtml = cardHtml.replace(/<h3 class="card-title" style="color: #C9A84C;"><a href=".*?">(.*?)<\/a><\/h3>/, 
            '<h3 class="card-title" style="color: #C9A84C;">$1</h3>');

        newGridContent += cardHtml + '\n\n';
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
}
