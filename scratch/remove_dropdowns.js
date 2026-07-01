const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const stat = fs.statSync(path.join(dir, file));
        if (stat.isDirectory() && file !== 'scratch' && file !== '.git' && file !== '.gemini' && file !== 'node_modules') {
            findHtmlFiles(path.join(dir, file), fileList);
        } else if (file.endsWith('.html') && !dir.includes('scratch')) {
            fileList.push(path.join(dir, file));
        }
    }
    return fileList;
}

const filePaths = findHtmlFiles('c:\\Users\\hp\\Desktop\\ASSA TRANS');

const regexExcursions = /<li class="nav-item nav-dropdown">\s*<a href="([^"]*)" class="nav-link(.*?)">\s*Excursions\s*<svg[\s\S]*?<\/svg>\s*<\/a>\s*<ul class="nav-dropdown-menu">[\s\S]*?<\/ul>\s*<\/li>/g;
const regexTransferts = /<li class="nav-item nav-dropdown">\s*<a href="([^"]*)" class="nav-link(.*?)">\s*Transferts\s*<svg[\s\S]*?<\/svg>\s*<\/a>\s*<ul class="nav-dropdown-menu">[\s\S]*?<\/ul>\s*<\/li>/g;

let count = 0;
filePaths.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    const before = content;
    content = content.replace(regexExcursions, '<li class="nav-item"><a href="$1" class="nav-link$2">Excursions</a></li>');
    content = content.replace(regexTransferts, '<li class="nav-item"><a href="$1" class="nav-link$2">Transferts</a></li>');
    
    if (before !== content) {
        console.log('Modified:', filePath);
        fs.writeFileSync(filePath, content, 'utf8');
        count++;
    }
});
console.log(`Done! Modified ${count} files.`);
