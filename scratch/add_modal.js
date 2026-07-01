const fs = require('fs');
const indexFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html';
let html = fs.readFileSync(indexFile, 'utf8');

if (!html.includes('elite-modal.js')) {
    html = html.replace('</body>', '<script src="assets/js/elite-modal.js"></script>\n</body>');
    fs.writeFileSync(indexFile, html);
    console.log("Added elite-modal.js to index.html");
} else {
    console.log("elite-modal.js already exists in index.html");
}
