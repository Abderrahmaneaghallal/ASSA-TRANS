const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'circuits_data.json');
const circuitsData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const outDir = path.join(__dirname, '..', 'circuits');

const files = [
  'villes-imperiales-6j.html',
  'grand-sud-zagora-6j.html',
  'villes-imperiales-sud-9j.html',
  'grand-sud-zagora-3j.html'
];

// Read header and footer from the existing circuits/index.html
const indexFile = path.join(outDir, 'index.html');
const indexContent = fs.readFileSync(indexFile, 'utf8');

// A simple way to grab header/nav and footer
const headerEnd = indexContent.indexOf('<!-- ══════════════ HERO ══════════════ -->');
const footerStart = indexContent.indexOf('<!-- ══════════════ FOOTER ══════════════ -->');

const headerHTML = indexContent.substring(0, headerEnd);
const footerHTML = indexContent.substring(footerStart);

function generateTemplate(circuit) {
  let daysHTML = '';
  circuit.itinerary.forEach((dayObj, i) => {
    daysHTML += `
      <div class="itinerary-day">
        <div class="day-number">Jour ${dayObj.day}</div>
        <div class="day-content">
          <p>${dayObj.description}</p>
        </div>
      </div>
    `;
  });

  let includedHTML = '';
  if (circuit.included && circuit.included.length > 0) {
    circuit.included.forEach(item => {
      includedHTML += `<li>✓ ${item}</li>`;
    });
  }

  let excludedHTML = '';
  if (circuit.excluded && circuit.excluded.length > 0) {
    circuit.excluded.forEach(item => {
      excludedHTML += `<li>✗ ${item}</li>`;
    });
  }

  return `
${headerHTML}

<style>
/* DETAIL PAGE STYLES */
.cd-hero {
  position: relative;
  background: var(--black);
  padding: 80px 0 60px;
  text-align: center;
  border-bottom: 1px solid rgba(201,168,76,0.15);
}
.cd-hero::before {
  content: ''; position: absolute; inset: 0;
  background-image: url('../marrakech.jpg');
  background-size: cover; background-position: center;
  opacity: 0.2;
}
.cd-hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; padding: 0 20px;}
.cd-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 5vw, 42px);
  color: var(--white);
  margin-bottom: 14px;
  line-height: 1.15;
}

.cd-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}
@media (max-width: 960px) {
  .cd-container {
    grid-template-columns: 1fr;
  }
}

.cd-left h2 {
  font-family: var(--font-display);
  font-size: 28px;
  margin-bottom: 20px;
  color: var(--black);
}

.itinerary-day {
  margin-bottom: 30px;
  padding-left: 20px;
  border-left: 2px solid var(--gold);
  position: relative;
}
.itinerary-day::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 0;
  width: 12px;
  height: 12px;
  background: var(--gold);
  border-radius: 50%;
}
.day-number {
  font-weight: 700;
  font-size: 18px;
  color: var(--black);
  margin-bottom: 8px;
}
.day-content {
  font-size: 15px;
  color: var(--grey-2);
  line-height: 1.6;
}

.inc-exc-section {
  margin-top: 40px;
  padding: 30px;
  background: var(--grey-6);
  border-radius: var(--radius-md);
}
.inc-exc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 600px) {
  .inc-exc-grid { grid-template-columns: 1fr; }
}
.inc-exc-box h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: var(--black);
}
.inc-exc-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.inc-exc-box li {
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--grey-2);
}

.cd-sidebar {
  position: sticky;
  top: 100px;
  background: var(--white);
  border: 1px solid var(--grey-5);
  padding: 30px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  height: max-content;
}
.cd-price {
  font-family: var(--font-display);
  font-size: 32px;
  color: var(--gold);
  margin-bottom: 20px;
  text-align: center;
}
.cd-btn {
  display: block;
  width: 100%;
  text-align: center;
  background: var(--gold);
  color: var(--white);
  padding: 15px;
  border-radius: 30px;
  font-weight: 700;
  text-decoration: none;
  transition: all var(--transition);
}
.cd-btn:hover {
  background: var(--gold-dark);
}
</style>

<div class="cd-hero">
  <div class="cd-hero-inner">
    <h1 class="cd-title">${circuit.title}</h1>
  </div>
</div>

<div class="cd-container">
  <div class="cd-left">
    <h2>Itinéraire</h2>
    <div class="itinerary-list">
      ${daysHTML}
    </div>

    <div class="inc-exc-section">
      <div class="inc-exc-grid">
        <div class="inc-exc-box">
          <h3>Inclus</h3>
          <ul>${includedHTML}</ul>
        </div>
        <div class="inc-exc-box">
          <h3>Non Inclus</h3>
          <ul>${excludedHTML}</ul>
        </div>
      </div>
    </div>
  </div>
  
  <div class="cd-right">
    <div class="cd-sidebar">
      <div class="cd-price">Sur Devis</div>
      <p style="text-align:center; color:var(--grey-3); font-size:14px; margin-bottom:20px;">Contactez-nous pour réserver ce circuit sur mesure.</p>
      <a href="javascript:void(0)" class="cd-btn" onclick="openBooking('${circuit.title}')">Commander</a>
    </div>
  </div>
</div>

<script>
function openBooking(title) {
  sessionStorage.setItem('selectedExcursion', title);
  window.location.href = '../reservation.html';
}
</script>

${footerHTML}
  `;
}

circuitsData.forEach((circuit, index) => {
  const content = generateTemplate(circuit);
  fs.writeFileSync(path.join(outDir, files[index]), content);
  console.log('Generated', files[index]);
});

