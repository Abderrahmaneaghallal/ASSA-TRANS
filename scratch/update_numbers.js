const fs = require('fs');
const path = require('path');

function updatePhoneNumbers(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Ignore scratch, assets, etc. just doing HTML files mostly, but let's do all
            if (!['scratch', '.git', 'node_modules', 'brain'].includes(file)) {
                updatePhoneNumbers(filePath);
            }
        } else if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let updated = content
                .replace(/212707473742/g, '212662130626')
                .replace(/\+212 707-473742/g, '+212 662-130626')
                .replace(/707-473742/g, '662-130626');
            
            if (updated !== content) {
                fs.writeFileSync(filePath, updated, 'utf8');
                console.log(`Updated numbers in ${filePath}`);
            }
        }
    }
}

updatePhoneNumbers('c:\\Users\\hp\\Desktop\\ASSA TRANS');
