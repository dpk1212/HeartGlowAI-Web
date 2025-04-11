/**
 * Root deployment verification script
 * 
 * Verifies that the Next.js output directory has been correctly generated
 * for the root deployment and contains all required files.
 */

const fs = require('fs');
const path = require('path');

// Check if the out directory exists
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  console.error('❌ ERROR: The "out" directory does not exist.');
  console.error('   This likely means the build process failed.');
  console.error('   Try running "npm run build" to generate the output files.');
  process.exit(1);
}

// Check for essential files
const requiredFiles = [
  'index.html',
  '_next/static',
  '.nojekyll'
];

let missingFiles = [];
for (const file of requiredFiles) {
  const filePath = path.join(outDir, file);
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
  }
}

if (missingFiles.length > 0) {
  console.error('❌ ERROR: The following required files/directories are missing:');
  missingFiles.forEach(file => console.error(`   - ${file}`));
  process.exit(1);
}

console.log('✅ Verification successful! Build output for root looks correct.');
console.log('   The root deployment is ready for GitHub Pages.');
process.exit(0); 