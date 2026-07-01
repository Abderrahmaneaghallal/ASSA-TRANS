const fs = require('fs');

const indexFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html';
const excursionsFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\excursions\\index.html';
const activitesFile = 'C:\\Users\\hp\\Desktop\\ASSA TRANS\\activites\\index.html';

// index.html
let indexHtml = fs.readFileSync(indexFile, 'utf8');
indexHtml = indexHtml.replace(/Excursions depuis Marrakech/g, 'Excursions depuis Agadir');
indexHtml = indexHtml.replace(/Des escapades inoubliables vers les plus beaux sites autour de Marrakech\./g, "Des escapades inoubliables vers les plus beaux sites autour d'Agadir.");
indexHtml = indexHtml.replace(/Activités à Marrakech/g, 'Activités à Agadir');
indexHtml = indexHtml.replace(/Balade à cheval, wake board, poterie, calèche\.\.\. des expériences uniques au cœur de la ville ocre\./g, 'Dromadaire, quad, buggy, hammam, massage... des expériences de loisir et bien-être uniques à Agadir.');
fs.writeFileSync(indexFile, indexHtml);
console.log('Updated headings in index.html');

// excursions/index.html
let excursionsHtml = fs.readFileSync(excursionsFile, 'utf8');
excursionsHtml = excursionsHtml.replace(/Excursions depuis Marrakech/g, 'Excursions depuis Agadir');
excursionsHtml = excursionsHtml.replace(/Palmeraie, désert d'Agafay, Atlas, cascades d'Ouzoud — explorez les merveilles autour de Marrakech avec un chauffeur privé\./g, "Oasis de Tiout, Taroudant, Massa, Legzira, Essaouira, Marrakech — explorez le Sud et la côte Atlantique du Maroc.");
fs.writeFileSync(excursionsFile, excursionsHtml);
console.log('Updated headings in excursions/index.html');

// activites/index.html
let activitesHtml = fs.readFileSync(activitesFile, 'utf8');
activitesHtml = activitesHtml.replace(/Activités à Marrakech/g, 'Activités à Agadir');
activitesHtml = activitesHtml.replace(/Balade à cheval, dromadaire, parc aquatique, wakeboard, poterie, calèche… Des expériences uniques pour des souvenirs inoubliables\./g, "Balade en dromadaire, quad, buggy, jet ski, hammam, massage… Des expériences de loisir et bien-être inoubliables à Agadir.");
fs.writeFileSync(activitesFile, activitesHtml);
console.log('Updated headings in activites/index.html');
