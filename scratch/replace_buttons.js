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
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Find all <button class="btn-commander" ...> or <a ... class="btn-commander">...</a>
    // We want to standardise btn-commander to be an <a> tag and btn-details to be a <button> with openModal
    
    // Step 1: Find openModal data
    const regex = /<button[^>]*class="btn-commander"[^>]*onclick="openModal\((.*?),\s*this\)"[^>]*>.*?<\/button>/g;
    
    content = content.replace(regex, (match, jsonStr) => {
        // Parse the jsonStr loosely
        // jsonStr looks like {type:'excursion',tag:'Côte',title:'...',price:'À partir de €60 / pers.',...}
        // Let's extract title, price, tag, duration
        const titleMatch = jsonStr.match(/title\s*:\s*'([^']*)'/);
        const priceMatch = jsonStr.match(/price\s*:\s*'[^0-9]*([0-9]+)/);
        const tagMatch = jsonStr.match(/tag\s*:\s*'([^']*)'/);
        const durationMatch = jsonStr.match(/duration\s*:\s*'([^']*)'/);
        
        const title = titleMatch ? titleMatch[1] : '';
        const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;
        const category = tagMatch ? tagMatch[1] : '';
        const duration = durationMatch ? durationMatch[1] : '';
        
        const resData = {
            name: title,
            price: price,
            category: category,
            duration: duration
        };
        
        const resDataStr = JSON.stringify(resData).replace(/"/g, '&quot;');
        
        const href = file === 'index.html' ? 'reservation.html' : '../reservation.html';
        
        return `<a onclick="sessionStorage.setItem('mtResData', '${resDataStr}')" href="${href}" class="btn-commander">Commander</a>`;
    });
    
    // Note: circuits/index.html already has btn-commander as <a> tags, so they won't be touched by the above regex 
    // unless they use the <button class="btn-commander" onclick="openModal..."> structure, which they don't based on previous logs.
    // Let's verify btn-details in circuits/index.html
    // It's already: <button class="btn-details" onclick="openModal({...}, this)">Détails →</button>
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
});
