const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir, files_) {
  files_ = files_ || [];
  let files = fs.readdirSync(dir);
  for (let i in files) {
      let name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()) {
          // ignore .git and similar
          if(!name.includes('.git') && !name.includes('.claude') && !name.includes('scratch')){
              getHtmlFiles(name, files_);
          }
      } else {
          if (name.endsWith('.html')) {
              files_.push(name);
          }
      }
  }
  return files_;
}

const dir = 'c:\\Users\\hp\\Desktop\\ASSA TRANS';
const htmlFiles = getHtmlFiles(dir);

for (const file of htmlFiles) {
  // Skip circuits/index.html because it's already updated
  if (file.includes('circuits\\index.html') || file.includes('circuits/index.html')) continue;

  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Desktop Nav Replacements
  if (content.includes('<li class="nav-item"><a href="blog/index.html" class="nav-link">Blog</a></li>')) {
      content = content.replace(
          '<li class="nav-item"><a href="blog/index.html" class="nav-link">Blog</a></li>',
          '<li class="nav-item"><a href="circuits/index.html" class="nav-link">Circuits</a></li>\n          <li class="nav-item"><a href="blog/index.html" class="nav-link">Blog</a></li>'
      );
      changed = true;
  } else if (content.includes('<li class="nav-item"><a href="../blog/index.html" class="nav-link">Blog</a></li>')) {
      content = content.replace(
          '<li class="nav-item"><a href="../blog/index.html" class="nav-link">Blog</a></li>',
          '<li class="nav-item"><a href="../circuits/index.html" class="nav-link">Circuits</a></li>\n          <li class="nav-item"><a href="../blog/index.html" class="nav-link">Blog</a></li>'
      );
      changed = true;
  } else if (content.includes('<li class="nav-item"><a href="index.html" class="nav-link active">Blog</a></li>')) {
      content = content.replace(
          '<li class="nav-item"><a href="index.html" class="nav-link active">Blog</a></li>',
          '<li class="nav-item"><a href="../circuits/index.html" class="nav-link">Circuits</a></li>\n          <li class="nav-item"><a href="index.html" class="nav-link active">Blog</a></li>'
      );
      changed = true;
  }

  // Mobile Nav Replacements
  if (content.includes('<a href="blog/index.html" class="mobile-nav-link">Blog</a>')) {
      content = content.replace(
          '<a href="blog/index.html" class="mobile-nav-link">Blog</a>',
          '<a href="circuits/index.html" class="mobile-nav-link">Circuits</a>\n  <a href="blog/index.html" class="mobile-nav-link">Blog</a>'
      );
      changed = true;
  } else if (content.includes('<a href="../blog/index.html" class="mobile-nav-link">Blog</a>')) {
      content = content.replace(
          '<a href="../blog/index.html" class="mobile-nav-link">Blog</a>',
          '<a href="../circuits/index.html" class="mobile-nav-link">Circuits</a>\n  <a href="../blog/index.html" class="mobile-nav-link">Blog</a>'
      );
      changed = true;
  } else if (content.includes('<a href="index.html" class="mobile-nav-link">Blog</a>')) {
      // In blog/index.html
      content = content.replace(
          '<a href="index.html" class="mobile-nav-link">Blog</a>',
          '<a href="../circuits/index.html" class="mobile-nav-link">Circuits</a>\n  <a href="index.html" class="mobile-nav-link">Blog</a>'
      );
      changed = true;
  }

  if (changed) {
      fs.writeFileSync(file, content);
      console.log('Updated: ' + file);
  }
}
