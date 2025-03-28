#!/usr/bin/env node

/**
 * HeartGlowAI Secure API Server Startup Script
 * 
 * This script checks if everything is properly configured before starting the server.
 */

const fs = require('fs');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
try {
  dotenv.config();
} catch (err) {
  console.error('Error loading .env file:', err.message);
}

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

// Print with color
function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if required files exist
function checkRequiredFiles() {
  print('\nChecking required files...', 'cyan');
  
  const requiredFiles = [
    '.env',
    'api-server.js',
    'package.json',
    'web-build/index.html'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      print(`✓ ${file} exists`, 'green');
    } else {
      print(`✗ ${file} is missing`, 'red');
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

// Check if required environment variables are set
function checkEnvironmentVariables() {
  print('\nChecking environment variables...', 'cyan');
  
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];
  
  let allVarsSet = true;
  
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      print(`✓ ${varName} is set`, 'green');
    } else {
      print(`✗ ${varName} is not set`, 'red');
      allVarsSet = false;
    }
  }
  
  return allVarsSet;
}

// Start the server
function startServer() {
  print('\nStarting server...', 'cyan');
  
  // Set production environment if not already set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
    print('NODE_ENV not set, defaulting to production', 'yellow');
  }
  
  // Set port if not already set
  if (!process.env.PORT) {
    process.env.PORT = '3000';
    print('PORT not set, defaulting to 3000', 'yellow');
  }
  
  print(`Starting server in ${process.env.NODE_ENV} mode on port ${process.env.PORT}...`, 'blue');
  
  try {
    // Start the server
    require('./api-server');
  } catch (err) {
    print(`Failed to start server: ${err.message}`, 'red');
    process.exit(1);
  }
}

// Main function
function main() {
  print('=================================================', 'magenta');
  print('  HeartGlowAI Secure API Server Startup Script', 'magenta');
  print('=================================================', 'magenta');
  
  // Check if required files exist
  const filesExist = checkRequiredFiles();
  if (!filesExist) {
    print('\n✗ Some required files are missing. Please fix these issues before starting the server.', 'red');
    process.exit(1);
  }
  
  // Check if required environment variables are set
  const varsSet = checkEnvironmentVariables();
  if (!varsSet) {
    print('\n✗ Some required environment variables are not set. Please check your .env file.', 'red');
    process.exit(1);
  }
  
  // Check if dependencies are installed
  print('\nChecking dependencies...', 'cyan');
  if (!fs.existsSync('node_modules')) {
    print('Dependencies not installed. Installing now...', 'yellow');
    try {
      execSync('npm install --production', { stdio: 'inherit' });
    } catch (err) {
      print('Failed to install dependencies. Please run npm install manually.', 'red');
      process.exit(1);
    }
  } else {
    print('✓ Dependencies are installed', 'green');
  }
  
  // Start the server
  startServer();
}

// Run the main function
main(); 