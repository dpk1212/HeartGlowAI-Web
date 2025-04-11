const fs = require('fs');
const path = require('path');

console.log('Restoring original index file after root build...');

// Define paths
const indexPath = path.join(__dirname, 'src/pages/index.tsx');
const backupPath = path.join(__dirname, 'src/pages/index.tsx.original');
const rootIndexPath = path.join(__dirname, 'src/pages/root-index.tsx');

// First, save the current index.tsx (root version) back to root-index.tsx
console.log('Preserving the current root index file...');
fs.copyFileSync(indexPath, rootIndexPath);

// Restore the original index.tsx if the backup exists
if (fs.existsSync(backupPath)) {
  console.log('Restoring the original index.tsx from backup...');
  fs.renameSync(backupPath, indexPath);
  console.log('Original index.tsx restored successfully.');
} else {
  console.log('No backup file found. The index file will remain as the root version.');
}

console.log('Restoration complete.'); 