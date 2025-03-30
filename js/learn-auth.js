/**
 * Firebase Authentication Handler for Learn Page
 * This script ensures authentication is properly initialized before any API calls
 */

// Add a global auth state variable for easy checking
window.isAuthenticated = false;

// Initialize authentication checking on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('learn-auth.js: Initializing authentication checks');
  
  // Add a global auth state listener that runs once Firebase is ready
  // This approach fixes the timing issue with Firebase initialization
  const checkAuthState = function() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      // Firebase is loaded, set up auth state listener
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log('User authenticated on page load:', user.uid);
          window.isAuthenticated = true;
          hideLoginPrompt(); // Hide login prompt if it's showing
        } else {
          console.log('No user authenticated on page load');
          window.isAuthenticated = false;
          // Don't automatically show login - wait for an action that requires auth
        }
      });
      
      // Clear the interval once we've set up the listener
      clearInterval(authCheckInterval);
    }
  };
  
  // Check repeatedly until Firebase is fully loaded
  const authCheckInterval = setInterval(checkAuthState, 100);
  
  // Also run immediately
  checkAuthState();
});

// Force re-authentication when making API calls
window.forceAuthentication = async function() {
  return new Promise((resolve, reject) => {
    // First check if we already have a user - this avoids unnecessary prompts
    if (window.isAuthenticated && firebase && firebase.auth && firebase.auth().currentUser) {
      console.log('Already authenticated as:', firebase.auth().currentUser.uid);
      resolve(firebase.auth().currentUser);
      return;
    }
    
    console.log('No current user found, checking auth state...');
    
    // Show login prompt immediately - we already know user isn't authenticated
    showLoginPrompt();
    
    // Set a longer timeout for the entire operation
    const operationTimeout = setTimeout(() => {
      if (unsubscribe) unsubscribe();
      reject(new Error('Authentication timed out'));
    }, 60000); // 60 seconds total timeout
    
    // Wait for user to sign in
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User found! Clear timeout and resolve
        clearTimeout(operationTimeout);
        unsubscribe();
        window.isAuthenticated = true;
        hideLoginPrompt();
        console.log('User authenticated via state change:', user.uid);
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
      firebase.auth().signInWithPopup(provider).then(result => {
        console.log('Google sign-in successful:', result.user.uid);
        window.isAuthenticated = true;
        hideLoginPrompt();
      }).catch(error => {
        console.error('Google sign-in error:', error);
        // Show error message in the prompt
        const errorMsg = document.createElement('p');
        errorMsg.style.color = '#ff5555';
        errorMsg.textContent = 'Sign-in failed: ' + error.message;
        loginBox.appendChild(errorMsg);
      });
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