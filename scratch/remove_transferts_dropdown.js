const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\hp\\Desktop\\ASSA TRANS';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['.git', 'assets', 'scratch'].includes(file)) {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const regex = /<li class="nav-item nav-dropdown">\s*<a href="([^"]+)" class="([^"]*)">Transferts[\s\S]*?<\/a>\s*<ul class="nav-dropdown-menu">[\s\S]*?<\/ul>\s*<\/li>/g;
      
      let updated = false;
      content = content.replace(regex, (match, href, className) => {
        updated = true;
        return `<li class="nav-item"><a href="${href}" class="${className}">Transferts</a></li>`;
      });
      
      if (updated) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDirectory(dir);
