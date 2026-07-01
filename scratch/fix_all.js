const fs = require('fs');

const origHtml = fs.readFileSync('C:\\Users\\hp\\Desktop\\ASSA TRANS\\scratch\\orig_index.html', 'utf16le');
const currentHtml = fs.readFileSync('C:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html', 'utf8');
const activitesHtml = fs.readFileSync('C:\\Users\\hp\\Desktop\\ASSA TRANS\\activites\\index.html', 'utf8');

// 1. Extract bodyBlock from origHtml
const startExcursions = origHtml.indexOf('<!-- ══════════════ EXCURSIONS ══════════════ -->');
const startTrustStrip = origHtml.indexOf('<!-- ══════════════ TRUST STRIP ══════════════ -->');

if (startExcursions === -1 || startTrustStrip === -1) {
    console.log("Could not find boundaries in origHtml");
    process.exit(1);
}

let bodyBlock = origHtml.substring(startExcursions, startTrustStrip);

// Clean up any weird characters if any, but since we parsed as utf16le it should be a clean JS string.
// Let's ensure bodyBlock looks right
if (!bodyBlock.includes('grid-3')) {
    console.log("bodyBlock is corrupted");
    process.exit(1);
}

// 2. Extract 6 Activities from activitesHtml
const actMatches = [...activitesHtml.matchAll(/<!-- \d+ [—-] .*? -->[\s\S]*?<div class="tour-card reveal[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g)];
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

if (actMatches.length !== 6) {
    console.log("WARNING: Found " + actMatches.length + " activities instead of 6.");
}

// 3. Replace the third grid in bodyBlock (which is the Activités grid) with newActivitiesGrid
const actStart = bodyBlock.indexOf('<section class="section-pad" id="activites"');
if (actStart !== -1) {
    const gridStart = bodyBlock.indexOf('<div class="grid-3">', actStart);
    const gridEnd = bodyBlock.indexOf('</div><!-- /grid-3 -->', gridStart);
    if (gridStart !== -1 && gridEnd !== -1) {
        bodyBlock = bodyBlock.substring(0, gridStart + 20) + '\n\n' + newActivitiesGrid + bodyBlock.substring(gridEnd);
    } else {
        console.log("Could not find grid bounds in activities section");
    }
} else {
    console.log("Could not find activities section in bodyBlock");
}

// 4. Update the remaining sessionStorage.setItem links in bodyBlock
bodyBlock = bodyBlock.replace(/<a onclick="sessionStorage\.setItem\('mtResData', '(.*?)'\)" href="reservation\.html" class="btn-commander">Commander<\/a>/g, (match, jsonString) => {
    let cleanJson = jsonString.replace(/&quot;/g, '"');
    try {
        let data = JSON.parse(cleanJson);
        let type = 'excursion';
        if (data.category && data.category.includes('jours')) type = 'circuit';
        
        let modalData = {
            type: type,
            tag: data.category || '',
            title: data.name,
            duration: data.duration || '',
            difficulty: 'Tous niveaux',
            price: 'À partir de €' + data.price + ' / pers.',
            description: data.desc || '',
            image: data.image || '',
            included: [],
            excluded: []
        };
        let stringified = JSON.stringify(modalData).replace(/"/g, "'").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<button class="btn-commander" onclick="openModal(${stringified}, this)">Commander</button>`;
    } catch(e) {
        return match;
    }
});

// Remove any remaining `<a>` tags in card titles for Excursions and Circuits so they don't have hover effects if not wanted, or keep them if they go to a details page.
// The user didn't ask to remove links from Excursions, so we'll leave them.

// 5. Inject bodyBlock into currentHtml
const curStartExcursions = currentHtml.indexOf('<!-- ══════════════ EXCURSIONS ══════════════ -->');
const curStartTrustStrip = currentHtml.indexOf('<!-- ══════════════ TRUST STRIP ══════════════ -->');

if (curStartExcursions !== -1 && curStartTrustStrip !== -1) {
    let finalHtml = currentHtml.substring(0, curStartExcursions) + bodyBlock + currentHtml.substring(curStartTrustStrip);
    fs.writeFileSync('C:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html', finalHtml);
    console.log("ALL FIXED SUCCESSFULLY!");
} else {
    console.log("Could not find boundaries in currentHtml");
}
