const fs = require('fs');
const path = require('path');

console.log('Preparing for root deployment build...');

// Rename root-index.tsx to index.tsx temporarily
const rootIndexPath = path.join(__dirname, 'src/pages/root-index.tsx');
const indexPath = path.join(__dirname, 'src/pages/index.tsx');
const backupPath = path.join(__dirname, 'src/pages/index.tsx.original');

// Backup the original index.tsx if it exists
if (fs.existsSync(indexPath)) {
  console.log('Backing up the original index.tsx...');
  fs.renameSync(indexPath, backupPath);
}

// Move root-index.tsx to become the new index.tsx
console.log('Setting root-index.tsx as the main index file...');
fs.renameSync(rootIndexPath, indexPath);

console.log('Root index file prepared for build. The original index file has been backed up.'); 