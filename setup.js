#!/usr/bin/env node

/**
 * HeartGlowAI Security Upgrade Setup Script
 * 
 * This script helps set up the secure API server infrastructure
 * and prepares the project for deployment.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

// Helper function to execute shell commands
function runCommand(command, successMessage) {
  try {
    console.log(`${colors.blue}Running: ${command}${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    if (successMessage) {
      console.log(`${colors.green}✓ ${successMessage}${colors.reset}`);
    }
    return true;
  } catch (error) {
    console.error(`${colors.red}✗ Command failed: ${command}${colors.reset}`);
    console.error(`${colors.red}${error.message}${colors.reset}`);
    return false;
  }
}

// Check for required files
function checkRequiredFiles() {
  console.log(`\n${colors.cyan}Checking required files...${colors.reset}`);
  
  const requiredFiles = [
    '.env',
    'api-server.js',
    'package.json'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`${colors.green}✓ ${file} exists${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${file} is missing${colors.reset}`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

// Install dependencies
function installDependencies() {
  console.log(`\n${colors.cyan}Installing dependencies...${colors.reset}`);
  return runCommand('npm install', 'Dependencies installed successfully');
}

// Create fallback backup
function createBackup() {
  console.log(`\n${colors.cyan}Creating backup of critical files...${colors.reset}`);
  
  const backupDir = 'backup-' + new Date().toISOString().replace(/:/g, '-');
  fs.mkdirSync(backupDir, { recursive: true });
  
  const filesToBackup = [
    'web-build/index.html'
  ];
  
  for (const file of filesToBackup) {
    if (fs.existsSync(file)) {
      const destFile = path.join(backupDir, file.replace(/\//g, '_'));
      fs.copyFileSync(file, destFile);
      console.log(`${colors.green}✓ Backed up ${file} to ${destFile}${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ Could not back up ${file} (file not found)${colors.reset}`);
    }
  }
  
  console.log(`${colors.green}✓ Backup created in ${backupDir}${colors.reset}`);
  return true;
}

// Set up environment
function setupEnvironment() {
  console.log(`\n${colors.cyan}Setting up environment...${colors.reset}`);
  
  // Check if .env file exists
  if (!fs.existsSync('.env')) {
    console.log(`${colors.yellow}⚠ .env file not found. Please create it with your Firebase credentials.${colors.reset}`);
    console.log(`${colors.yellow}  See .env.example for required variables.${colors.reset}`);
    return false;
  }
  
  return true;
}

// Setup Git hooks for security
function setupGitHooks() {
  console.log(`\n${colors.cyan}Setting up Git hooks for security...${colors.reset}`);
  
  // Create .gitignore if it doesn't exist
  if (!fs.existsSync('.gitignore')) {
    fs.writeFileSync('.gitignore', '');
  }
  
  // Make sure .env is in .gitignore
  let gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (!gitignore.includes('.env')) {
    gitignore += '\n# Environment variables\n.env\n';
    fs.writeFileSync('.gitignore', gitignore);
    console.log(`${colors.green}✓ Added .env to .gitignore${colors.reset}`);
  } else {
    console.log(`${colors.green}✓ .env already in .gitignore${colors.reset}`);
  }
  
  return true;
}

// Main function to run all setup steps
async function main() {
  console.log(`\n${colors.magenta}=== HeartGlowAI Security Upgrade Setup ===${colors.reset}`);
  
  // Check for required files
  if (!checkRequiredFiles()) {
    console.log(`${colors.red}Some required files are missing. Please make sure all files are present.${colors.reset}`);
    process.exit(1);
  }
  
  // Create backup
  if (!createBackup()) {
    console.log(`${colors.red}Failed to create backup. Aborting setup.${colors.reset}`);
    process.exit(1);
  }
  
  // Set up environment
  if (!setupEnvironment()) {
    console.log(`${colors.red}Failed to set up environment. Aborting setup.${colors.reset}`);
    process.exit(1);
  }
  
  // Install dependencies
  if (!installDependencies()) {
    console.log(`${colors.red}Failed to install dependencies. Aborting setup.${colors.reset}`);
    process.exit(1);
  }
  
  // Setup Git hooks
  if (!setupGitHooks()) {
    console.log(`${colors.red}Failed to set up Git hooks. Aborting setup.${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`\n${colors.green}Setup completed successfully!${colors.reset}`);
  console.log(`\n${colors.cyan}Next steps:${colors.reset}`);
  console.log(`${colors.cyan}1. Start the server in development mode:${colors.reset} npm run dev`);
  console.log(`${colors.cyan}2. Test the server thoroughly${colors.reset}`);
  console.log(`${colors.cyan}3. Deploy to staging/production${colors.reset}`);
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Setup failed: ${error.message}${colors.reset}`);
  process.exit(1);
}); 