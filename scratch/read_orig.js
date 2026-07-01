const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\hp\\Desktop\\ASSA TRANS\\scratch\\orig_index.html', 'utf16le');
const lines = content.split('\n');
const oasiriaIndex = lines.findIndex(l => l.includes('Oasiria'));
for (let i = oasiriaIndex - 30; i < oasiriaIndex + 5; i++) {
    console.log(i + ": " + lines[i]);
}
