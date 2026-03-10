const fs = require('fs');

const svgData = fs.readFileSync('public/dfd (1).svg', 'utf8');

const paths = [];
let searchString = '<path d="';
let currentIndex = 0;

while (true) {
    let index = svgData.indexOf(searchString, currentIndex);
    if (index === -1) break;
    
    let pathStart = index + searchString.length;
    let pathEnd = svgData.indexOf('"', pathStart);
    
    if (pathEnd !== -1) {
        // Replace newlines inside the 'd' attribute with spaces so TS string literal is valid
        let pathData = svgData.substring(pathStart, pathEnd).replace(/\r?\n|\r/g, ' ');
        paths.push(pathData);
        currentIndex = pathEnd + 1;
    } else {
        break;
    }
}

const tsContent = 'export const handPaths = [\n' + paths.map(p => '  \"' + p + '\"').join(',\n') + '\n];\n';
fs.writeFileSync('src/components/HandPaths.ts', tsContent);
console.log('Saved ' + paths.length + ' paths from dfd (1).svg to src/components/HandPaths.ts');
