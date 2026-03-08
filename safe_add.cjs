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
let filesModified = 0;

function wrapString(content, searchStr) {
    let index = 0;
    let modified = false;
    while ((index = content.indexOf(searchStr, index)) !== -1) {
        let buttonStart = content.lastIndexOf('<button', index);
        let buttonEnd = content.indexOf('</button>', index);
        // Ensure that buttonStart and buttonEnd are valid bounds
        if (buttonStart !== -1 && buttonEnd !== -1 && buttonStart < index && buttonEnd > index) {
            buttonEnd += '</button>'.length;
            let buttonContent = content.substring(buttonStart, buttonEnd);

            // Re-validate that this button contains handleDelete
            if (buttonContent.includes('handleDelete') && !content.substring(Math.max(0, buttonStart - 30), buttonStart).includes('isAdmin &&')) {
                let spacingMatch = content.substring(0, buttonStart).match(/(\s+)$/);
                let spacing = spacingMatch ? spacingMatch[1] : '';

                let wrapped = `{isAdmin && (\n${spacing}${buttonContent}\n${spacing})}`;
                content = content.substring(0, buttonStart) + wrapped + content.substring(buttonEnd);
                modified = true;
                index = buttonStart + wrapped.length;
            } else {
                index = buttonEnd;
            }
        } else {
            index += searchStr.length;
        }
    }
    return { content, modified };
}

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    const injectionStr = `
    const authData = JSON.parse(localStorage.getItem('blogData') || '{}');
    const isAdmin = authData?.role === 'admin';
`;

    let injected = false;
    if (!content.includes('const isAdmin = authData?.role === \'admin\';')) {
        if (content.match(/const navigate = useNavigate\(\);/)) {
            content = content.replace(/const navigate = useNavigate\(\);/, `const navigate = useNavigate();${injectionStr}`);
            injected = true;
        } else if (content.match(/const \[search/)) {
            content = content.replace(/const \[search/, `${injectionStr}    const [search`);
            injected = true;
        } else if (content.match(/const \[loading/)) {
            content = content.replace(/const \[loading/, `${injectionStr}    const [loading`);
            injected = true;
        } else if (content.includes("const [categories, setCategories] = useState([]);")) {
            content = content.replace(/const \[categories, setCategories\] = useState\(\[\]\);/, `const [categories, setCategories] = useState([]);${injectionStr}`);
            injected = true;
        }
    } else {
        injected = true;
    }

    if (!injected) return;

    let totalModified = false;

    // Wrap FaTrash
    let res1 = wrapString(content, '<FaTrash');
    if (res1.modified) {
        content = res1.content;
        totalModified = true;
    }

    // Wrap textual delete
    let res2 = wrapString(content, 'Delete');
    if (res2.modified) {
        content = res2.content;
        totalModified = true;
    }

    if (totalModified && content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        filesModified++;
    }
});

console.log(`Finished safely modifying ${filesModified} files.`);
