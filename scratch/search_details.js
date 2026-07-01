const fs=require('fs'); 
['index.html', 'excursions/index.html', 'activites/index.html', 'circuits/index.html'].forEach(f => { 
  if(fs.existsSync(f)) { 
    const lines=fs.readFileSync(f, 'utf8').split('\n'); 
    lines.forEach((l,i) => { 
      if(l.includes('btn-commander') || l.includes('btn-details')) {
        console.log(`${f}:${i+1}: ${l.trim()}`); 
      }
    }); 
  } 
});
