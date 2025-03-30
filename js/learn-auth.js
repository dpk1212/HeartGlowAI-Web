/**
 * Firebase Authentication Handler for Learn Page
 * This script ensures authentication is properly initialized before any API calls
 */

// Initialize Firebase
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing learn-auth.js');
  
  // Check if user is signed in
  if (firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('User is signed in:', user.uid);
      } else {
        console.log('No user is signed in');
        // Show login prompt
        showLoginPrompt();
      }
    });
  } else {
    console.error('Firebase not initialized properly');
  }
});

// Force re-authentication when making API calls
window.forceAuthentication = async function() {
  return new Promise((resolve, reject) => {
    if (firebase && firebase.auth && firebase.auth().currentUser) {
      resolve(firebase.auth().currentUser);
      return;
    }
    
    // Show login prompt
    showLoginPrompt();
    
    // Set timeout for user to login
    const timeout = setTimeout(() => {
      unsubscribe();
      reject(new Error('Authentication timed out'));
    }, 30000);
    
    // Wait for user to sign in
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        clearTimeout(timeout);
        unsubscribe();
        hideLoginPrompt();
        resolve(user);
      }
    });
  });
};

// Show login prompt
function showLoginPrompt() {
  let loginPrompt = document.getElementById('learn-login-prompt');
  if (!loginPrompt) {
    loginPrompt = document.createElement('div');
    loginPrompt.id = 'learn-login-prompt';
    loginPrompt.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;';
    
    const loginBox = document.createElement('div');
    loginBox.style.cssText = 'background:#222;padding:30px;border-radius:10px;max-width:400px;width:90%;text-align:center;';
    loginBox.innerHTML = `
      <h2 style="margin-top:0;color:#fff;">Sign In Required</h2>
      <p style="color:#ccc;">Please sign in to use research functionality.</p>
      <button id="learn-login-google" style="background:#4285F4;color:#fff;border:none;padding:12px 20px;border-radius:4px;margin:10px;cursor:pointer;">Sign in with Google</button>
      <button id="learn-login-retry" style="background:#555;color:#fff;border:none;padding:12px 20px;border-radius:4px;margin:10px;cursor:pointer;">Go back to Home</button>
    `;
    
    loginPrompt.appendChild(loginBox);
    document.body.appendChild(loginPrompt);
    
    // Add event listeners
    document.getElementById('learn-login-google').addEventListener('click', function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    });
    
    document.getElementById('learn-login-retry').addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  loginPrompt.style.display = 'flex';
}

// Hide login prompt
function hideLoginPrompt() {
  const loginPrompt = document.getElementById('learn-login-prompt');
  if (loginPrompt) {
    loginPrompt.style.display = 'none';
  }
} 