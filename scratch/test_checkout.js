const fs = require('fs');
const execSync = require('child_process').execSync;

execSync('git checkout -- index.html');
const buf = fs.readFileSync('index.html');
console.log('Clean checkout file size:', buf.length);
console.log('Clean checkout first 20 bytes:', buf.slice(0, 20));
console.log('Read as UTF-8 (first 50 chars):', buf.toString('utf8').slice(0, 50));
console.log('Read as UTF-16LE (first 50 chars):', buf.toString('utf16le').slice(0, 50));
console.log('Read as UTF-16BE (first 50 chars):', buf.toString('utf16be').slice(0, 50));
