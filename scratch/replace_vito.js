const fs = require('fs');

const filePath = 'c:\\Users\\hp\\Desktop\\ASSA TRANS\\index.html';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('Véhicule/Mercedes Vito.png', 'Véhicule/renault-trafic.jpg');
content = content.replace('alt="Mercedes Vito"', 'alt="Renault Trafic"');
content = content.replace('<h3 class="fleet-vehicle-name">Mercedes Vito</h3>', '<h3 class="fleet-vehicle-name">Renault Trafic</h3>');
content = content.replace(
  "sessionStorage.setItem('mtVehicle','vito');sessionStorage.setItem('mtVehicleName','Mercedes Vito')",
  "sessionStorage.setItem('mtVehicle','trafic');sessionStorage.setItem('mtVehicleName','Renault Trafic')"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done');
