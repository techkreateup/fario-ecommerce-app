const fs = require('fs');
const path = 'C:/Users/A-MATRIX/Downloads/fario-ecommerce-app-main/fario-ecommerce-app-main/components/home/HomeGallery.tsx';

let content = fs.readFileSync(path, 'utf8');

// Fix 1: The corrupted cls prop on line 74
// The \u0007 (BEL char) replaced the backtick+a of `absolute
content = content.replace(
    /cls=\{[\x07\u0007]bsolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out \}/,
    "cls={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-150 grayscale-[0.3]'}`}"
);

// Fix 2: The corrupted animate background on lines 122-123
// The backslash-newline form corrupted the template literal
content = content.replace(
    /animate=\{\{ background: \\\nadial-gradient\(ellipse at bottom right, \\ 0%, transparent 70%\)\\ \}\}/,
    'animate={{ background: `radial-gradient(ellipse at bottom right, ${activeCat.accent} 0%, transparent 70%)` }}'
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed! Lines changed:');

// Verify fix
const lines = content.split('\n');
console.log('Line 74:', lines[73]);
console.log('Line 122:', lines[121]);
