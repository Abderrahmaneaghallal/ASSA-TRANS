const fs = require('fs');
const html = fs.readFileSync('C:/Users/hp/Desktop/ASSA TRANS/excursions/index.html', 'utf8');
const titles = [...html.matchAll(/<h3 class="card-title"><a[^>]*>(.*?)<\/a><\/h3>/g)].map(m => m[1]);
console.log(titles.join('\n'));
