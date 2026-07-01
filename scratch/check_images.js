const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'excursions/index.html',
    'activites/index.html',
    'circuits/index.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    
    // Find all decodable base64 strings in the file
    const regex = /decodeURIComponent\(escape\(atob\('([A-Za-z0-9+/=]+)'\)\)\)/g;
    let match;
    console.log(`Checking file: ${file}`);
    while ((match = regex.exec(content)) !== null) {
        const base64 = match[1];
        let decoded;
        try {
            decoded = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
        } catch(e) {
            console.error(`  Failed to decode base64 string: ${base64.substring(0, 20)}...`);
            continue;
        }
        
        const image = decoded.image;
        if (!image) {
            console.warn(`  [WARN] No image for "${decoded.name}"`);
            continue;
        }
        
        if (image.startsWith('http')) {
            console.log(`  [OK] External image URL: "${image}" for "${decoded.name}"`);
            continue;
        }
        
        // Decode URI component (e.g. %20 -> space)
        const decodedPath = decodeURIComponent(image);
        // The path should be relative to the workspace root (where reservation.html is)
        const fullPathOnDisk = path.join(__dirname, '..', decodedPath);
        
        if (fs.existsSync(fullPathOnDisk)) {
            console.log(`  [OK] Local image exists: "${decodedPath}" for "${decoded.name}"`);
        } else {
            console.error(`  [ERROR] Local image DOES NOT EXIST: "${decodedPath}" for "${decoded.name}" (Resolved path: ${fullPathOnDisk})`);
        }
    }
});
