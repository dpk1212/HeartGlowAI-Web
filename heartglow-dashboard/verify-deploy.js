/**
 * Dashboard deployment verification script
 * 
 * Verifies that the Next.js output directory has been correctly generated
 * and contains all required files for deployment.
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

// Verify paths in HTML files
const indexContent = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');

// Check if the base path is set correctly
if (!indexContent.includes('/dashboard/')) {
  console.warn('⚠️ WARNING: Base path "/dashboard/" not found in index.html.');
  console.warn('   This may cause path resolution issues in production.');
}

console.log('✅ Verification successful! Build output looks correct.');
console.log('   The dashboard is ready for deployment.');
process.exit(0); 