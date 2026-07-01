const fs = require('fs');

const content = fs.readFileSync('circuits/index.html', 'utf8');
const regex = /<button[^>]*class="btn-details"[^>]*onclick="openModal\((\{[\s\S]*?\}),\s*this\)"[^>]*>.*?<\/button>/g;

let matches = [];
let match;
while ((match = regex.exec(content)) !== null) {
    matches.push({
        fullText: match[0],
        objStr: match[1],
        index: match.index
    });
}

matches.forEach((m, idx) => {
    let obj = (new Function('return ' + m.objStr))();
    let image = obj.image || '';
    if (!image) {
        const searchRegionStart = Math.max(0, m.index - 3000);
        const searchRegion = content.substring(searchRegionStart, m.index);
        const imgMatches = [...searchRegion.matchAll(/<img[^>]+src=["']([^"']+)["']/g)];
        if (imgMatches.length > 0) {
            image = imgMatches[imgMatches.length - 1][1];
        }
    }
    console.log(`Circuit ${idx} "${obj.title}": image = "${image}"`);
});
