const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const absolutePath = path.join(dir, file);
        const stat = fs.statSync(absolutePath);
        if (stat.isDirectory()) {
            results = results.concat(walk(absolutePath));
        } else if (absolutePath.endsWith('.jsx')) {
            results.push(absolutePath);
        }
    });
    return results;
}

const files = walk('./src/pages');
let fixedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Loop to remove nested {isAdmin && (
    let previous;
    do {
        previous = content;
        content = content.replace(/\{isAdmin && \(\s*\{isAdmin && \(/g, '{isAdmin && (');
    } while (content !== previous);

    // Loop to remove nested )} that exist literally next to each other (allowing for whitespace/newlines)
    // Be careful not to remove single )}
    // This regex looks for )} followed by whitespace and then another )}
    do {
        previous = content;
        content = content.replace(/\)\}\s*\)\}/g, ')}');
    } while (content !== previous);

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        fixedCount++;
        console.log("Fixed duplicates in:", file);
    }
});

console.log(`Fixed ${fixedCount} files.`);
