const fs = require('fs');
const buf = fs.readFileSync('index.html');
console.log('File size:', buf.length);
console.log('First 20 bytes:', buf.slice(0, 20));
console.log('Read as UTF-8 (first 100 chars):', buf.toString('utf8').slice(0, 100));
console.log('Read as UTF-16LE (first 100 chars):', buf.toString('utf16le').slice(0, 100));
