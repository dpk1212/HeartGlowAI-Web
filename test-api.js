#!/usr/bin/env node

/**
 * HeartGlowAI API Server Test Script
 * 
 * This script runs a series of tests against the API server to verify
 * that it's working correctly after the security upgrade.
 */

const axios = require('axios');
const colors = require('colors/safe');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default API URL
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Test results counter
let passed = 0;
let failed = 0;
let total = 0;

// Function to prompt for credentials
function promptCredentials() {
  return new Promise((resolve) => {
    rl.question(colors.cyan('Email: '), (email) => {
      rl.question(colors.cyan('Password: '), (password) => {
        resolve({ email, password });
      });
    });
  });
}

// Function to run a test
async function runTest(name, testFunction) {
  total++;
  try {
    console.log(colors.yellow(`Running test: ${name}`));
    await testFunction();
    passed++;
    console.log(colors.green(`✓ PASSED: ${name}\n`));
    return true;
  } catch (error) {
    failed++;
    console.log(colors.red(`✗ FAILED: ${name}`));
    console.log(colors.red(`Error: ${error.message}`));
    if (error.response) {
      console.log(colors.red(`Status: ${error.response.status}`));
      console.log(colors.red(`Data: ${JSON.stringify(error.response.data, null, 2)}`));
    }
    console.log('\n');
    return false;
  }
}

// Test functions
async function testServerStatus() {
  // Simply test if server responds
  const response = await axios.get(`${API_URL}/`);
  if (response.status !== 200) {
    throw new Error(`Server responded with status ${response.status}`);
  }
}

async function testUserRegistration(email, password) {
  // Test user registration
  const response = await axios.post(`${API_URL}/api/auth/signup`, {
    email,
    password
  }, {
    validateStatus: function (status) {
      // Accept 200-299 status codes or 400 (user already exists)
      return (status >= 200 && status < 300) || status === 400;
    }
  });
  
  // If user already exists, that's fine
  if (response.status === 400 && response.data.error === 'Email already in use') {
    console.log(colors.yellow('  (User already exists, continuing with login test)'));
    return;
  }
  
  if (response.status !== 200 || !response.data.success) {
    throw new Error(`User registration failed: ${response.data.error || 'Unknown error'}`);
  }
}

async function testUserLogin(email, password) {
  // Test user login
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password
  }, {
    withCredentials: true
  });
  
  if (response.status !== 200 || !response.data.success) {
    throw new Error(`User login failed: ${response.data.error || 'Unknown error'}`);
  }
  
  // Save the cookie for subsequent requests
  const cookies = response.headers['set-cookie'];
  if (!cookies) {
    throw new Error('No session cookie received');
  }
  
  // Set cookies for future requests
  axios.defaults.withCredentials = true;
  
  return response.data;
}

async function testAuthStatus() {
  // Test auth status check
  const response = await axios.get(`${API_URL}/api/auth/status`);
  
  if (response.status !== 200) {
    throw new Error(`Auth status check failed: ${response.statusText}`);
  }
  
  if (!response.data.isAuthenticated) {
    throw new Error('User is not authenticated');
  }
  
  return response.data;
}

async function testMessageGeneration() {
  // Test message generation
  const response = await axios.post(`${API_URL}/api/generate-message`, {
    scenario: 'Test message scenario',
    relationshipType: 'Friend',
    tone: 'Friendly',
    toneIntensity: 'Medium',
    relationshipDuration: 'Years',
    specialCircumstances: 'Just testing the API'
  });
  
  if (response.status !== 200 || !response.data.success) {
    throw new Error(`Message generation failed: ${response.data.error || 'Unknown error'}`);
  }
  
  if (!response.data.message) {
    throw new Error('No message received');
  }
  
  return response.data;
}

async function testMessageSaving() {
  // Test saving a message
  const response = await axios.post(`${API_URL}/api/messages/save`, {
    scenario: 'Test message scenario',
    relationshipType: 'Friend',
    message: 'This is a test message for API verification.'
  });
  
  if (response.status !== 200 || !response.data.success) {
    throw new Error(`Message saving failed: ${response.data.error || 'Unknown error'}`);
  }
  
  return response.data;
}

async function testMessageHistory() {
  // Test getting message history
  const response = await axios.get(`${API_URL}/api/messages/history`);
  
  if (response.status !== 200 || !response.data.success) {
    throw new Error(`Message history failed: ${response.data.error || 'Unknown error'}`);
  }
  
  if (!Array.isArray(response.data.messages)) {
    throw new Error('No messages array received');
  }
  
  return response.data;
}

async function testUserLogout() {
  // Test user logout
  const response = await axios.post(`${API_URL}/api/auth/logout`);
  
  if (response.status !== 200 || !response.data.success) {
    throw new Error(`User logout failed: ${response.data.error || 'Unknown error'}`);
  }
  
  return response.data;
}

// Main function
async function main() {
  console.log(colors.cyan('\n=================================='));
  console.log(colors.cyan('HeartGlowAI API Server Test Script'));
  console.log(colors.cyan('==================================\n'));
  
  console.log(colors.yellow(`Testing API at: ${API_URL}`));
  console.log(colors.yellow('Please make sure the API server is running.\n'));
  
  // Ask for test user credentials
  console.log(colors.cyan('Please enter test user credentials:'));
  const { email, password } = await promptCredentials();
  console.log('\n');
  
  // Run tests
  await runTest('Server Status', testServerStatus);
  await runTest('User Registration', () => testUserRegistration(email, password));
  await runTest('User Login', () => testUserLogin(email, password));
  await runTest('Auth Status', testAuthStatus);
  await runTest('Message Generation', testMessageGeneration);
  await runTest('Message Saving', testMessageSaving);
  await runTest('Message History', testMessageHistory);
  await runTest('User Logout', testUserLogout);
  
  // Print summary
  console.log(colors.cyan('\n=================================='));
  console.log(colors.cyan('Test Summary'));
  console.log(colors.cyan('=================================='));
  console.log(colors.yellow(`Total tests: ${total}`));
  console.log(colors.green(`Passed: ${passed}`));
  console.log(colors.red(`Failed: ${failed}`));
  console.log('\n');
  
  if (failed > 0) {
    console.log(colors.red('Some tests failed. Please check the output above for details.'));
    process.exit(1);
  } else {
    console.log(colors.green('All tests passed! The API server is working correctly.'));
    process.exit(0);
  }
}

// Run the main function
main()
  .catch(error => {
    console.error(colors.red(`Error: ${error.message}`));
    process.exit(1);
  })
  .finally(() => {
    rl.close();
  }); 