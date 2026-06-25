const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('\\${import.meta')) {
    const newContent = content.replace(/\\\$\{import\.meta/g, '${import.meta');
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed ' + file);
    changedCount++;
  }
});

console.log('Total files fixed: ' + changedCount);
