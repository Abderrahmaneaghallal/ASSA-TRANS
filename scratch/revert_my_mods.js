const fs = require('fs');

const files = [
    'index.html',
    'excursions/index.html',
    'activites/index.html',
    'circuits/index.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // We look for:
    // <a onclick="sessionStorage.setItem('mtResData', '{...}')" href="..." class="btn-commander">Commander</a>
    // and replace it with:
    // <button class="btn-commander" onclick="openModal({...}, this)">Commander</button>
    // To do this reliably, we can find `<button class="btn-details" onclick="openModal({...}, this)">`
    // and use its payload to construct the `btn-commander` button.

    const regex = /<button[^>]*class="btn-details"[^>]*onclick="openModal\((\{[\s\S]*?\}),\s*this\)"[^>]*>.*?<\/button>/g;
    
    let matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        matches.push({
            fullText: match[0],
            jsonStr: match[1],
            index: match.index
        });
    }

    matches.forEach(m => {
        const newCommander = `<button class="btn-commander" onclick="openModal(${m.jsonStr}, this)">Commander</button>`;
        
        // Find the `a.btn-commander` around this match
        const searchRegionStart = Math.max(0, m.index - 400);
        const searchRegion = content.substring(searchRegionStart, m.index);
        
        const replaceCommanderRegex = /<a[^>]*class="btn-commander"[^>]*>Commander<\/a>/;
        
        if (replaceCommanderRegex.test(searchRegion)) {
            const newSearchRegion = searchRegion.replace(replaceCommanderRegex, newCommander);
            content = content.substring(0, searchRegionStart) + newSearchRegion + content.substring(m.index);
        } else {
           const afterRegionEnd = Math.min(content.length, m.index + m.fullText.length + 400);
           const afterRegion = content.substring(m.index + m.fullText.length, afterRegionEnd);
           if (replaceCommanderRegex.test(afterRegion)) {
               const newAfterRegion = afterRegion.replace(replaceCommanderRegex, newCommander);
               content = content.substring(0, m.index + m.fullText.length) + newAfterRegion + content.substring(afterRegionEnd);
           }
        }
    });

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Reverted ${file}`);
});
