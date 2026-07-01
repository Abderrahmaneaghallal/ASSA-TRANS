const fs = require('fs');
const buf = fs.readFileSync('index.html');
let nulls = [];
for (let i = 0; i < buf.length; i++) {
    if (buf[i] === 0) {
        nulls.push(i);
        if (nulls.length >= 20) break;
    }
}
console.log('Total length:', buf.length);
console.log('First 20 null byte indices:', nulls);
