const fs = require('fs');

const svgData = fs.readFileSync('public/interactive-hands.ts', 'utf8');
const viewBoxMatch = svgData.match(/viewBox="([^"]+)"/);
let vbX = 0, vbY = 0, vbW = 1000, vbH = 1000;
if (viewBoxMatch) {
  const vb = viewBoxMatch[1].split(' ');
  vbX = parseFloat(vb[0]);
  vbY = parseFloat(vb[1]);
  vbW = parseFloat(vb[2]);
  vbH = parseFloat(vb[3]);
}
console.log(`ViewBox: ${vbX} ${vbY} ${vbW} ${vbH}`);
