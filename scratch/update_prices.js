const fs = require('fs');
const path = require('path');

const newPrices = {
    "Balade en Dromadaire à Agadir": 30,
    "Balade en Quad à Agadir": 40,
    "visite de ville Agadir 1/2 j": 15,
    "Soirée Dîner Spectacle et Fantasia Agadir": 50,
    "Excursion paradise valley et Taghazout": 30
};

function updatePricesInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    for (const [title, price] of Object.entries(newPrices)) {
        const safeTitle = title.replace(/([()])/g, '\\$1').replace(/[éÃ©©]/g, '.').replace(/[àÃ ]/g, '.');
        
        const blockRegex = new RegExp(`(<h3 class="card-title">${safeTitle}</h3>[\\s\\S]*?</div>\\s*</div>\\s*</div>)`, 'gi');
        
        content = content.replace(blockRegex, (match) => {
            let newMatch = match;
            newMatch = newMatch.replace(/(price:['"][^'"]*?(?:€|â‚¬))(\d+)/g, `$1${price}`);
            newMatch = newMatch.replace(/(<strong[^>]*>(?:€|â‚¬))(\d+)(<\/strong>)/gi, `$1${price}$3`);
            newMatch = newMatch.replace(/(data-price-eur=")\d+(")/g, `$1${price}$2`);
            return newMatch;
        });
        
        // Also catch any openModal calls for this title that might not be in a card-title block
        const modalRegex = new RegExp(`(openModal\\({[^}]*?title:'${safeTitle}'[^}]*?price:['"][^'"]*?(?:€|â‚¬))\\d+`, 'gi');
        content = content.replace(modalRegex, `$1${price}`);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
}

function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!['scratch', '.git', 'node_modules', 'brain'].includes(file)) {
                processHtmlFiles(filePath);
            }
        } else if (filePath.endsWith('.html')) {
            updatePricesInFile(filePath);
        }
    }
}

processHtmlFiles('c:\\Users\\hp\\Desktop\\ASSA TRANS');
