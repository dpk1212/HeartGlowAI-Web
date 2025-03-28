#!/usr/bin/env node

/**
 * HeartGlowAI Secure API Deployment Script
 * 
 * This script handles the deployment process for the secure API server.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

// Get user confirmation
function confirm(message) {
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${message} (y/n) ${colors.reset}`, (answer) => {
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Create backup
function createBackup() {
  console.log(`\n${colors.cyan}Creating backup of current deployment...${colors.reset}`);
  
  // Create backup directory with timestamp
  const backupDir = `deploy-backup-${new Date().toISOString().replace(/:/g, '-')}`;
  fs.mkdirSync(backupDir, { recursive: true });
  
  // Files to backup
  const filesToBackup = [
    'web-build/index.html', 
    '.env'
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
  return backupDir;
}

// Check environment
function checkEnvironment() {
  console.log(`\n${colors.cyan}Checking environment...${colors.reset}`);
  
  // Check for required files
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
  
  // Check if .env file has required variables
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const requiredVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_PRIVATE_KEY'
    ];
    
    for (const varName of requiredVars) {
      if (!envContent.includes(varName + '=')) {
        console.log(`${colors.red}✗ Missing required environment variable: ${varName}${colors.reset}`);
        allFilesExist = false;
      }
    }
  }
  
  if (!allFilesExist) {
    console.log(`${colors.red}✗ Environment check failed. Please fix the issues and try again.${colors.reset}`);
    return false;
  }
  
  console.log(`${colors.green}✓ Environment check passed.${colors.reset}`);
  return true;
}

// Install dependencies
function installDependencies() {
  console.log(`\n${colors.cyan}Installing dependencies...${colors.reset}`);
  return runCommand('npm install --production', 'Dependencies installed successfully');
}

// Build for production
function buildForProduction() {
  console.log(`\n${colors.cyan}Building for production...${colors.reset}`);
  
  // Ensure NODE_ENV is set to production
  process.env.NODE_ENV = 'production';
  
  // Create a production-ready version of the .env file
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const prodEnvContent = envContent
      .replace(/NODE_ENV=development/g, 'NODE_ENV=production')
      .replace(/PORT=3000/g, 'PORT=80');
    
    fs.writeFileSync('.env.production', prodEnvContent);
    console.log(`${colors.green}✓ Created production environment file: .env.production${colors.reset}`);
  }
  
  return true;
}

// Deploy to server
async function deployToServer() {
  console.log(`\n${colors.cyan}Preparing to deploy to server...${colors.reset}`);
  
  // This would typically involve:
  // 1. Creating a git branch
  // 2. Committing changes
  // 3. Pushing to the server

  // For demonstration, we'll just create a deployment package
  const deployDir = 'deployment-package';
  fs.mkdirSync(deployDir, { recursive: true });
  
  // Copy required files
  const filesToCopy = [
    'api-server.js',
    'package.json',
    'package-lock.json',
    '.env.production',
    'web-build'
  ];
  
  for (const file of filesToCopy) {
    if (fs.existsSync(file)) {
      if (fs.statSync(file).isDirectory()) {
        // Copy directory
        runCommand(`cp -r ${file} ${deployDir}/`);
      } else {
        // Copy file
        runCommand(`cp ${file} ${deployDir}/`);
      }
    }
  }
  
  // Rename .env.production to .env in the deployment package
  if (fs.existsSync(`${deployDir}/.env.production`)) {
    fs.renameSync(`${deployDir}/.env.production`, `${deployDir}/.env`);
  }
  
  console.log(`${colors.green}✓ Deployment package created: ${deployDir}${colors.reset}`);
  
  // In a real deployment, you might run:
  // - rsync to copy files to server
  // - SSH commands to restart services
  // - Docker commands to build and deploy containers
  
  const useRealDeployment = await confirm('Do you want to deploy to the actual server? (This requires proper server configuration)');
  
  if (useRealDeployment) {
    console.log(`${colors.cyan}Starting actual deployment...${colors.reset}`);
    
    // Get deployment target
    const deployTarget = await new Promise((resolve) => {
      rl.question(`${colors.cyan}Enter deployment target (e.g., user@server:/path or server-name): ${colors.reset}`, (answer) => {
        resolve(answer.trim());
      });
    });
    
    if (!deployTarget) {
      console.log(`${colors.red}✗ No deployment target specified. Aborting.${colors.reset}`);
      return false;
    }
    
    // Copy files to server
    const rsyncResult = runCommand(
      `rsync -avz --delete ${deployDir}/ ${deployTarget}`,
      'Files copied to server'
    );
    
    if (!rsyncResult) {
      return false;
    }
    
    // Restart server (assuming it's running with PM2)
    const restartResult = await confirm('Do you want to restart the server process?');
    
    if (restartResult) {
      const processName = await new Promise((resolve) => {
        rl.question(`${colors.cyan}Enter the process name or ID to restart: ${colors.reset}`, (answer) => {
          resolve(answer.trim());
        });
      });
      
      if (processName) {
        runCommand(`ssh ${deployTarget.split(':')[0]} 'cd ${deployTarget.split(':')[1]} && pm2 restart ${processName}'`);
      }
    }
  } else {
    console.log(`${colors.yellow}✓ Skipping actual server deployment. Deployment package is available at: ${deployDir}${colors.reset}`);
  }
  
  return true;
}

// Main function
async function main() {
  console.log(`${colors.magenta}======================================${colors.reset}`);
  console.log(`${colors.magenta}  HeartGlowAI Secure API Deployment${colors.reset}`);
  console.log(`${colors.magenta}======================================${colors.reset}`);
  
  // Confirm deployment
  const shouldContinue = await confirm('This script will deploy the HeartGlowAI Secure API. Continue?');
  
  if (!shouldContinue) {
    console.log(`${colors.yellow}Deployment canceled.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Create backup
  const backupDir = createBackup();
  console.log(`${colors.green}✓ Backup created at ${backupDir}${colors.reset}`);
  
  // Check environment
  if (!checkEnvironment()) {
    console.log(`${colors.red}✗ Environment check failed. Aborting deployment.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Install dependencies
  if (!installDependencies()) {
    console.log(`${colors.red}✗ Failed to install dependencies. Aborting deployment.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Build for production
  if (!buildForProduction()) {
    console.log(`${colors.red}✗ Failed to build for production. Aborting deployment.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Deploy to server
  if (!await deployToServer()) {
    console.log(`${colors.red}✗ Failed to deploy to server. Please check the logs for errors.${colors.reset}`);
    console.log(`${colors.yellow}You can restore from backup at ${backupDir} if needed.${colors.reset}`);
    rl.close();
    return;
  }
  
  console.log(`\n${colors.green}✓ Deployment completed successfully!${colors.reset}`);
  console.log(`\n${colors.cyan}What's next?${colors.reset}`);
  console.log(`${colors.cyan}1. Verify the deployment by accessing your server${colors.reset}`);
  console.log(`${colors.cyan}2. Run tests to ensure everything is working correctly${colors.reset}`);
  console.log(`${colors.cyan}3. Monitor server logs for any issues${colors.reset}`);
  
  rl.close();
}

// Run the main function
main().catch(error => {
  console.error(`${colors.red}Deployment failed: ${error.message}${colors.reset}`);
  rl.close();
  process.exit(1);
}); 