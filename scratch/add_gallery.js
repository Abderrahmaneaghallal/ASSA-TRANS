const fs = require('fs');

const galleryCss = `
/* ══════════════ NEW BENTO GALLERY SECTION ══════════════ */
.gallery-section {
  background-color: #121a2f; /* Dark navy */
  padding: 80px 0;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
}
.gallery-header {
  text-align: center;
  margin-bottom: 50px;
}
.gallery-label {
  color: #d4af37;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 15px;
}
.gallery-title {
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 15px;
}
.gallery-title em {
  font-family: 'DM Serif Display', serif;
  color: #d4af37;
  font-style: italic;
}
.gallery-subtitle {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 20px;
}
.gallery-divider {
  width: 40px;
  height: 2px;
  background-color: #d4af37;
  margin: 0 auto;
}
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 240px;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.bento-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background-color: #192543;
}
.bento-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.bento-item:hover img {
  transform: scale(1.05);
}
.bento-tall {
  grid-column: span 1;
  grid-row: span 2;
}
.bento-wide-2 {
  grid-column: span 2;
  grid-row: span 1;
}
.bento-square {
  grid-column: span 1;
  grid-row: span 1;
}
.bento-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #fff;
  z-index: 2;
}
.bento-badge-left {
  left: 12px;
  right: auto;
}
.bento-stats {
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: #192543;
}
.stat-row {
  margin: 15px 0;
}
.stat-score {
  font-family: 'DM Serif Display', serif;
  font-size: 2rem;
  color: #d4af37;
  line-height: 1;
  margin-bottom: 5px;
}
.stat-stars {
  color: #d4af37;
  font-size: 0.8rem;
  letter-spacing: 2px;
  margin-bottom: 5px;
}
.stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #94a3b8;
}
.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 auto;
}
.gallery-footer {
  text-align: center;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}
.btn-gallery {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  text-decoration: none;
}
.btn-gallery:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #fff;
}
.btn-gallery svg {
  width: 14px;
  height: 14px;
}
.btn-gallery-gold {
  color: #d4af37;
  border-color: rgba(212, 175, 55, 0.3);
}
.btn-gallery-gold:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: #d4af37;
}
.gallery-footer-sep {
  color: rgba(255, 255, 255, 0.2);
}

@media (max-width: 991px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 200px;
  }
  .bento-tall, .bento-wide-2, .bento-square {
    grid-column: span 1;
  }
  .bento-wide-2 {
    grid-column: span 2;
  }
  .bento-tall {
    grid-column: span 1;
    grid-row: span 1;
  }
}
@media (max-width: 576px) {
  .bento-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 250px;
  }
  .bento-tall, .bento-wide-2, .bento-square {
    grid-column: span 1;
    grid-row: span 1;
  }
  .gallery-footer {
    flex-direction: column;
    gap: 15px;
  }
  .gallery-footer-sep {
    display: none;
  }
}
`;

fs.appendFileSync('assets/css/style.css', galleryCss, 'utf8');
console.log('Appended CSS to style.css');
