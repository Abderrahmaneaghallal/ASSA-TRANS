const fs = require('fs');

const path = 'C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\6ec4891c-04cf-4dd1-a814-08ebb3dfe01a\\.system_generated\\steps\\103\\content.md';
const content = fs.readFileSync(path, 'utf8');

console.log("Length:", content.length);
console.log("Includes Marrakech?", content.toLowerCase().includes("marrakech"));
console.log("Includes Jour 1?", content.toLowerCase().includes("jour 1"));
