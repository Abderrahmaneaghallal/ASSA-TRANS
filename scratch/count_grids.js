const fs = require('fs');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const parts = indexHtml.split('<div class="grid-3">');
console.log('Parts length:', parts.length);
parts.forEach((p, idx) => {
    console.log(`Part ${idx} length: ${p.length}`);
    console.log(`Part ${idx} start:`, p.substring(0, 100).replace(/\r?\n/g, '\\n'));
    console.log(`Part ${idx} end:`, p.substring(p.length - 100).replace(/\r?\n/g, '\\n'));
    console.log('---');
});
