const fs = require('fs');
let content = fs.readFileSync('public/interactive-hands.ts', 'utf8');

const paths = [];
let searchString = '<path d="';
let currentIndex = 0;

while (true) {
    let index = content.indexOf(searchString, currentIndex);
    if (index === -1) break;
    
    let pathStart = index + searchString.length;
    let pathEnd = content.indexOf('"', pathStart);
    
    if (pathEnd !== -1) {
        paths.push(content.substring(pathStart, pathEnd));
        currentIndex = pathEnd + 1;
    } else {
        break;
    }
}

const tsContent = 'export const handPaths = [\n' + paths.map(p => '  \"' + p + '\"').join(',\n') + '\n];\n';
fs.writeFileSync('src/components/HandPaths.ts', tsContent);
console.log('Saved ' + paths.length + ' paths to src/components/HandPaths.ts');
