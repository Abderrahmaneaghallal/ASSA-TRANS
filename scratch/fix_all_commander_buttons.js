const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'excursions/index.html',
    'activites/index.html',
    'circuits/index.html',
    'excursions_6.html',
    'activites_6.html'
];

function findNearestCommander(content, detailsIndex) {
    let nearest = null;
    let minDiff = Infinity;
    
    let idx = detailsIndex;
    const limitBack = Math.max(0, detailsIndex - 2000);
    while (idx > limitBack) {
        idx = content.lastIndexOf('<', idx - 1);
        if (idx === -1 || idx < limitBack) break;
        const tagCloseIndex = content.indexOf('>', idx);
        if (tagCloseIndex === -1 || tagCloseIndex > detailsIndex) continue;
        const tagText = content.substring(idx, tagCloseIndex + 1);
        if ((tagText.startsWith('<a') || tagText.startsWith('<button')) && tagText.includes('class="btn-commander"')) {
            const isAnchor = tagText.startsWith('<a');
            const endTag = isAnchor ? '</a>' : '</button>';
            const endTagIndex = content.indexOf(endTag, tagCloseIndex);
            if (endTagIndex !== -1) {
                const diff = detailsIndex - idx;
                if (diff < minDiff) {
                    minDiff = diff;
                    nearest = {
                        start: idx,
                        end: endTagIndex + endTag.length,
                        tagText: content.substring(idx, endTagIndex + endTag.length)
                    };
                }
                break;
            }
        }
    }

    idx = detailsIndex;
    const limitForward = Math.min(content.length, detailsIndex + 2000);
    while (idx < limitForward) {
        idx = content.indexOf('<', idx + 1);
        if (idx === -1 || idx > limitForward) break;
        const tagCloseIndex = content.indexOf('>', idx);
        if (tagCloseIndex === -1 || tagCloseIndex > limitForward) continue;
        const tagText = content.substring(idx, tagCloseIndex + 1);
        if ((tagText.startsWith('<a') || tagText.startsWith('<button')) && tagText.includes('class="btn-commander"')) {
            const isAnchor = tagText.startsWith('<a');
            const endTag = isAnchor ? '</a>' : '</button>';
            const endTagIndex = content.indexOf(endTag, tagCloseIndex);
            if (endTagIndex !== -1) {
                const diff = idx - detailsIndex;
                if (diff < minDiff) {
                    minDiff = diff;
                    nearest = {
                        start: idx,
                        end: endTagIndex + endTag.length,
                        tagText: content.substring(idx, endTagIndex + endTag.length)
                    };
                }
                break;
            }
        }
    }
    return nearest;
}

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Using a robust regex to find openModal calls inside btn-details
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

    // Sort backwards so string replacements don't offset subsequent indices
    matches.sort((a, b) => b.index - a.index);

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
        if (!image) {
            const searchRegionStart = Math.max(0, m.index - 3000);
            const searchRegion = content.substring(searchRegionStart, m.index);
            const imgMatches = [...searchRegion.matchAll(/<img[^>]+src=["']([^"']+)["']/g)];
            if (imgMatches.length > 0) {
                image = imgMatches[imgMatches.length - 1][1];
            }
        }
        
        const included = obj.included || [];
        const excluded = obj.excluded || [];
        
        // Fix image path to be absolute from root so reservation.html finds it
        if (image) {
            if (image.startsWith('../')) {
                image = image.substring(3);
            } else if (image.startsWith('./')) {
                const dir = path.dirname(file).replace(/\\/g, '/');
                if(dir !== '.') image = dir + '/' + image.substring(2);
            } else if (!image.startsWith('/') && !image.startsWith('http')) {
                const dir = path.dirname(file).replace(/\\/g, '/');
                if(dir !== '.') image = dir + '/' + image;
            }
        }

        const resData = {
            name: title,
            price: price,
            category: category,
            duration: duration,
            desc: desc,
            image: image,
            included: included,
            excluded: excluded
        };
        
        const jsonStr = JSON.stringify(resData);
        const base64 = Buffer.from(jsonStr, 'utf8').toString('base64');
        const href = file === 'index.html' ? 'reservation.html' : '../reservation.html';
        const newCommander = `<a onclick="sessionStorage.setItem('mtResData', decodeURIComponent(escape(atob('${base64}'))))" href="${href}" class="btn-commander">Commander</a>`;
        
        const comm = findNearestCommander(content, m.index);
        if (comm) {
            content = content.substring(0, comm.start) + newCommander + content.substring(comm.end);
        } else {
            console.warn(`Could not find preceding/succeeding Commander button for "${title}" in ${file}`);
        }
    });
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
});
