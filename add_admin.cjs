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
    } catch (e) {
        console.error("Error reading dir:", dir, e);
    }
    return results;
}

const files = walk('./src/pages');
let filesModified = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    let modified = false;

    // Skip if already applied
    if (content.includes('const isAdmin = authData?.role === \'admin\';')) {
        return;
    }

    const hasFaTrash = content.includes('<FaTrash');
    const hasCategoryDelete = content.includes('Delete') && content.includes('<button') && content.includes('handleDelete');

    if (!hasFaTrash && !hasCategoryDelete) return;

    // Inject isAdmin definition at the start of the component body
    const injectionStr = `
    const authData = JSON.parse(localStorage.getItem('blogData') || '{}');
    const isAdmin = authData?.role === 'admin';
`;

    if (content.match(/const navigate = useNavigate\(\);/)) {
        content = content.replace(/const navigate = useNavigate\(\);/, `const navigate = useNavigate();${injectionStr}`);
    } else if (content.match(/const \[search/)) {
        content = content.replace(/const \[search/, `${injectionStr}    const [search`);
    } else if (content.match(/const \[loading/)) {
        content = content.replace(/const \[loading/, `${injectionStr}    const [loading`);
    } else {
        if (content.includes("const [categories, setCategories] = useState([]);")) {
            content = content.replace(/const \[categories, setCategories\] = useState\(\[\]\);/, `const [categories, setCategories] = useState([]);${injectionStr}`);
        }
    }

    // Now wrap FaTrash buttons
    const faTrashRegex = /(<button[\s\S]*?onClick=\{[\s\S]*?handleDelete[\s\S]*?\}[^>]*>[\s\S]*?<FaTrash \/>[\s\S]*?<\/button>)/g;

    if (faTrashRegex.test(content)) {
        content = content.replace(faTrashRegex, '{isAdmin && (\n$1\n)}');
        modified = true;
    }

    // Also handle text 'Delete' buttons (e.g., CategoryList)
    const textDeleteRegex = /(<button[\s\S]*?onClick=\{[\s\S]*?handleDelete[\s\S]*?\}[^>]*>\s*Delete\s*<\/button>)/g;
    if (textDeleteRegex.test(content)) {
        content = content.replace(textDeleteRegex, '{isAdmin && (\n$1\n)}');
        modified = true;
    }

    if (modified && content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        filesModified++;
        console.log(`Modified: ${file}`);
    }
});

console.log(`Finished modifying ${filesModified} files.`);
