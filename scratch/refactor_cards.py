import re
import os
import glob

# The script updates index.html, excursions/index.html, activites/index.html, circuits/index.html
files = [
    r"c:\Users\hp\Desktop\ASSA TRANS\index.html",
    r"c:\Users\hp\Desktop\ASSA TRANS\excursions\index.html",
    r"c:\Users\hp\Desktop\ASSA TRANS\activites\index.html",
    r"c:\Users\hp\Desktop\ASSA TRANS\circuits\index.html"
]

def refactor_file(filepath):
    if not os.path.exists(filepath):
        print(f"Not found: {filepath}")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add CSS and JS if not present
    depth = filepath.count('\\') - r"c:\Users\hp\Desktop\ASSA TRANS".count('\\')
    assets_prefix = "../" * depth + "assets/"
    
    css_link1 = f'<link rel="stylesheet" href="{assets_prefix}css/elite-cards.css">'
    css_link2 = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@23/build/css/intlTelInput.css">'
    
    if "elite-cards.css" not in content:
        content = content.replace('</head>', f'{css_link1}\n{css_link2}\n</head>')
        
    js_link1 = f'<script src="{assets_prefix}js/elite-modal.js"></script>'
    js_link2 = '<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@23/build/js/intlTelInput.min.js"></script>'
    
    if "elite-modal.js" not in content:
        content = content.replace('</body>', f'{js_link2}\n{js_link1}\n</body>')

    # Regex to find tour-cards
    pattern = re.compile(
        r'<div class="tour-card(.*?)">.*?<div class="tour-gallery.*?<img src="(.*?)".*?<span class="card-badge-cat">(.*?)</span>.*?<span class="card-badge-duration">.*?</span>.*?<div class="card-body">.*?<h3 class="card-title"><a.*?>(.*?)</a></h3>.*?<p class="card-excerpt">(.*?)</p>.*?<div class="card-price">.*?<strong[^>]*>(.*?)</strong>.*?</div>',
        re.DOTALL
    )

    def replace_card(m):
        reveal_class = m.group(1)
        image = m.group(2)
        category = m.group(3)
        title = m.group(4)
        desc = m.group(5)
        price = m.group(6)
        
        # We need duration, difficulty, included, excluded, type.
        # We can extract duration from the original HTML but regex is tricky. Let's provide defaults based on category.
        # Or parse duration:
        duration_match = re.search(r'<span class="card-badge-duration">.*?<polyline[^>]*/>(.*?)</(?:span|svg)>', m.group(0), re.DOTALL)
        duration = duration_match.group(1).strip() if duration_match else "1 journée"
        
        type_str = "circuit" if "jours" in duration.lower() or "j" in duration.lower() else ("activite" if "Nautique" in category or "Dans les airs" in category else "excursion")

        # Escaping single quotes and newlines for JS
        safe_title = title.replace("'", "\\'").replace('"', '&quot;')
        safe_desc = desc.replace("'", "\\'").replace('"', '&quot;').replace('\n', ' ')
        safe_img = image.replace("'", "\\'")

        new_html = f'''      <div class="card{reveal_class}">
        <img class="card-img" src="{image}" alt="{title}" loading="lazy" />
        <div class="card-body">
          <span class="card-tag">{category}</span>
          <h3 class="card-title">{title}</h3>
          <p class="card-desc">{desc}</p>
          <div class="card-meta">
            <span><svg viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg> {duration}</span>
            <span><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg> Tous niveaux</span>
          </div>
          <div class="card-price">À partir de {price} <span>/ pers.</span></div>
          <div class="card-actions">
            <button class="btn-em btn-em-outline-gold btn-em-sm" onclick="openModal({{type:'{type_str}',tag:'{category}',title:'{safe_title}',duration:'{duration}',difficulty:'Tous niveaux',price:'À partir de {price} / pers.',description:'{safe_desc}',image:'{safe_img}',included:['Transport aller/retour', 'Chauffeur/Guide professionnel', 'Assurance transport'],excluded:['Dépenses personnelles', 'Pourboires']}}, this)">
              Détails
            </button>
            <button class="btn-em btn-em-gold btn-em-sm" onclick="openModal({{type:'{type_str}',tag:'{category}',title:'{safe_title}',duration:'{duration}',difficulty:'Tous niveaux',price:'À partir de {price} / pers.',description:'{safe_desc}',image:'{safe_img}',included:['Transport aller/retour', 'Chauffeur/Guide professionnel', 'Assurance transport'],excluded:['Dépenses personnelles', 'Pourboires']}}, this)">Réserver</button>
          </div>
        </div>
      </div>'''
        return new_html

    # We need to replace the whole tour-card block. 
    # Because there's a card-rating and card-actions at the end, the regex above stops at card-price.
    # Let's fix the regex to include the rest of the tour-card until the closing div.
    pattern = re.compile(
        r'<div class="tour-card(.*?)">.*?<div class="tour-gallery.*?<img src="(.*?)".*?<span class="card-badge-cat">(.*?)</span>.*?<span class="card-badge-duration">.*?</span>.*?<div class="card-body">.*?<h3 class="card-title"><a.*?>(.*?)</a></h3>.*?<p class="card-excerpt">(.*?)</p>.*?<div class="card-price">.*?<strong[^>]*>(.*?)</strong>.*?</div>.*?<div class="card-rating">.*?</div>.*?<div class="card-actions">.*?</div>.*?</div>.*?</div>',
        re.DOTALL
    )
    
    new_content, count = pattern.subn(replace_card, content)
    print(f"Replaced {count} cards in {filepath}")
    
    # Also we should un-hide the circuits section in index.html if it was hidden
    new_content = new_content.replace('<div style="display:none"><div class="grid-3">', '<div class="grid-3">')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

for f in files:
    refactor_file(f)
