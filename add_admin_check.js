const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src/pages');

let filesModified = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Check if it already has isAdmin
    if (content.includes('const isAdmin =')) return;

    // We only care if there's a FaTrash or Delete button that calls a delete handler
    const hasFaTrash = content.includes('<FaTrash');
    const hasDeleteBtn = content.includes('Delete') && content.includes('handleDelete');

    if (!hasFaTrash && !hasDeleteBtn) return;

    // Inject isAdmin definition at the start of the component body
    // Find the first `useNavigate` or `useState` inside the component
    const injectionStr = `
  const authData = JSON.parse(localStorage.getItem('blogData') || '{}');
  const isAdmin = authData?.role === 'admin';
`;

    if (content.match(/const navigate = useNavigate\(\);/)) {
        content = content.replace(/const navigate = useNavigate\(\);/, `const navigate = useNavigate();${injectionStr}`);
    } else if (content.match(/const \[search/)) {
        content = content.replace(/const \[search/, `${injectionStr}  const [search`);
    } else {
        // Fallback: search for 'const [loading'
        content = content.replace(/const \[loading/, `${injectionStr}  const [loading`);
    }

    // Now wrap FaTrash buttons
    // The FaTrash buttons usually look like:
    // <button
    //    onClick={(e) => handleDelete...(e, ...)}
    //    style={{...}}
    //    title="Delete ..."
    // >
    //    <FaTrash />
    // </button>
    // We can use a regex to replace these blocks
    const faTrashRegex = /(<button[\s\S]*?(?:onClick=\{.*?handleDelete.*?\})[\s\S]*?<FaTrash \/>[\s\S]*?<\/button>)/g;
    if (faTrashRegex.test(content)) {
        content = content.replace(faTrashRegex, '{isAdmin && (\n$1\n)}');
        modified = true;
    }

    // Also handle CategoryList Delete button
    // <button
    //   className="button"
    //   onClick={() => handleDelete(category._id)}
    // >
    //   Delete
    // </button>
    const textDeleteRegex = /(<button\s+className="button"\s+onClick=\{.*?handleDelete.*?\}\s*>\s*Delete\s*<\/button>)/g;
    if (textDeleteRegex.test(content)) {
        content = content.replace(textDeleteRegex, '{isAdmin && (\n$1\n)}');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        filesModified++;
        console.log(`Modified: ${file}`);
    }
});

console.log(`Finished modifying ${filesModified} files.`);
