const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'excursions/index.html',
    'activites/index.html',
    'circuits/index.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Using a more robust regex that just captures the whole object string for openModal
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

    matches.forEach(m => {
        let obj;
        try {
            // Evaluates the JS object literal safely
            obj = (new Function('return ' + m.objStr))();
        } catch(e) {
            console.error("Failed to parse", m.objStr);
            return;
        }
        
        const title = obj.title || '';
        const priceStr = obj.price ? String(obj.price).replace(/[^0-9]/g, '') : '0';
        const price = parseInt(priceStr, 10) || 0;
        const category = obj.tag || obj.type || '';
        const duration = obj.duration || '';
        const desc = obj.description || '';
        let image = obj.image || '';
        
        // Fix image path to be absolute from root so reservation.html finds it
        if (image.startsWith('../')) {
            image = image.substring(3);
        } else if (image.startsWith('./')) {
            const dir = path.dirname(file).replace(/\\/g, '/');
            if(dir !== '.') image = dir + '/' + image.substring(2);
        } else if (!image.startsWith('/') && !image.startsWith('http')) {
            const dir = path.dirname(file).replace(/\\/g, '/');
            if(dir !== '.') image = dir + '/' + image;
        }

        const resData = {
            name: title,
            price: price,
            category: category,
            duration: duration,
            desc: desc,
            image: image
        };
        
        const resDataStr = JSON.stringify(resData).replace(/"/g, '&quot;');
        const href = file === 'index.html' ? 'reservation.html' : '../reservation.html';
        const newCommander = `<a onclick="sessionStorage.setItem('mtResData', '${resDataStr}')" href="${href}" class="btn-commander">Commander</a>`;
        
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
    console.log(`Updated ${file}`);
});
