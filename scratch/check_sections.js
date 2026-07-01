const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\hp\\Desktop\\ASSA TRANS\\scratch\\orig_index.html', 'utf16le');
console.log(content.indexOf('TRUST STRIP'));
console.log(content.indexOf('ACTIVITÉS'));
console.log(content.indexOf('CIRCUITS'));
