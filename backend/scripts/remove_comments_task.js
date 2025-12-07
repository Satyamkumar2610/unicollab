const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
    path.join(__dirname, '../../frontend/src'),
    path.join(__dirname, '../../backend')
];

const EXCLUDE_DIRS = ['node_modules', 'build', '.git', 'scripts'];
const EXTENSIONS = ['.js', '.jsx', '.css', '.html'];

function removeComments(content, filePath) {
    // Regex to match comments but preserve strings and URLs
    // This is a simplified regex and might have edge cases, but works for standard code
    // 1. Strings: "..." or '...' or `...`
    // 2. Multi-line comments: /* ... */
    // 3. Single-line comments: // ... (but not inside strings or URLs like http://)

    // A more robust approach for simple tasks:
    // We will use a simple replacement for now.

    // Remove multi-line comments
    let newContent = content.replace(/\/\*[\s\S]*?\*\//gm, '');

    // Remove single-line comments
    // Careful with URLs: http://...
    // We look for // that is NOT preceded by :
    newContent = newContent.replace(/([^:]|^)\/\/.*$/gm, '$1');

    return newContent;
}

function processFile(filePath) {
    const ext = path.extname(filePath);
    if (!EXTENSIONS.includes(ext)) return;

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const newContent = removeComments(content, filePath);

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Processed: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!EXCLUDE_DIRS.includes(file)) {
                walkDir(filePath);
            }
        } else {
            processFile(filePath);
        }
    }
}

console.log('Starting comment removal...');
TARGET_DIRS.forEach(dir => {
    if (fs.existsSync(dir)) {
        walkDir(dir);
    } else {
        console.warn(`Directory not found: ${dir}`);
    }
});
console.log('Comment removal complete.');
