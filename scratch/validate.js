const fs = require('fs');
['index.html', 'excursions/index.html', 'activites/index.html', 'circuits/index.html'].forEach(f => {
    if(fs.existsSync(f)) {
        const content = fs.readFileSync(f, 'utf8');
        if(content.includes('<button class="btn-commander"')) {
            console.log(f + ' still has button commander');
        } else {
            console.log(f + ' is clean');
        }
    }
});
