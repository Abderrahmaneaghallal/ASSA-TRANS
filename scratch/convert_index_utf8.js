const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf16le');
fs.writeFileSync('index.html', content, 'utf8');
console.log('Converted index.html to UTF-8!');
