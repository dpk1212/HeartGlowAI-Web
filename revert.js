#!/usr/bin/env node

/**
 * HeartGlowAI Emergency Rollback Script
 * 
 * This script quickly reverts to the backup version of critical files
 * in case of deployment issues.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.magenta}======================================${colors.reset}`);
console.log(`${colors.magenta}  HeartGlowAI Emergency Rollback${colors.reset}`);
console.log(`${colors.magenta}======================================${colors.reset}`);

// Check if backup directory exists
const backupDir = 'backup-' + fs.readdirSync('.').filter(f => f.startsWith('backup-')).sort().pop();

if (!backupDir) {
  console.log(`${colors.red}No backup directory found! Cannot roll back.${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.green}Found backup directory: ${backupDir}${colors.reset}`);

// Restore the web-build/index.html file
try {
  const backupFile = path.join(backupDir, 'web-build_index.html');
  const targetFile = 'web-build/index.html';

  if (fs.existsSync(backupFile)) {
    // Create a backup of the current file before replacing it
    const emergencyBackup = `web-build/index.html.emergency-${Date.now()}`;
    fs.copyFileSync(targetFile, emergencyBackup);
    console.log(`${colors.yellow}Created emergency backup: ${emergencyBackup}${colors.reset}`);

    // Restore from backup
    fs.copyFileSync(backupFile, targetFile);
    console.log(`${colors.green}Successfully restored ${targetFile} from backup${colors.reset}`);

    // Git checkout original version if needed
    console.log(`${colors.blue}Reverting Git changes...${colors.reset}`);
    try {
      execSync('git checkout main -- web-build/index.html', { stdio: 'inherit' });
      console.log(`${colors.green}Git checkout successful${colors.reset}`);
    } catch (err) {
      console.log(`${colors.yellow}Git checkout failed. Manual file restore completed anyway.${colors.reset}`);
    }
  } else {
    console.log(`${colors.red}Backup file ${backupFile} not found!${colors.reset}`);
  }
} catch (err) {
  console.error(`${colors.red}Error during rollback: ${err.message}${colors.reset}`);
  process.exit(1);
}

console.log(`${colors.green}Rollback completed successfully.${colors.reset}`);
console.log(`${colors.cyan}Please restart your server for changes to take effect.${colors.reset}`); 