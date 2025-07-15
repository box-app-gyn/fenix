const fs = require('fs');
const path = require('path');

function scanDirectory(dir, level = 0) {
  const items = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      items.push({
        id: fullPath,
        name: file,
        type: 'folder',
        level: level,
        children: scanDirectory(fullPath, level + 1)
      });
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js')) {
      items.push({
        id: fullPath,
        name: file,
        type: 'file',
        level: level
      });
    }
  });
  
  return items;
}

const structure = scanDirectory('./src');
fs.writeFileSync('3d-structure.json', JSON.stringify(structure, null, 2));
console.log('Dados 3D gerados em 3d-structure.json');
