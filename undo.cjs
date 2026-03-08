const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const absolutePath = path.join(dir, file);
            const stat = fs.statSync(absolutePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(walk(absolutePath));
            } else if (absolutePath.endsWith('.jsx')) {
                results.push(absolutePath);
            }
        });
    } catch (e) { }
    return results;
}

const files = walk('./src/pages');
let restoredCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace {isAdmin && (\n ... \n)} exactly. We can do it by replacing "{isAdmin && (\n" with "" and "\n)}" with "".
    // To be perfectly safe, we undo the exact string modifications.
    content = content.replace(/\{isAdmin && \(\n/g, '');
    content = content.replace(/\n\)\}/g, '');

    const injected = `
    const authData = JSON.parse(localStorage.getItem('blogData') || '{}');
    const isAdmin = authData?.role === 'admin';
`;
    content = content.replace(injected, '');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        restoredCount++;
        console.log("Restored:", file);
    }
});
console.log(`Restored ${restoredCount} files.`);
