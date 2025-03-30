/**
 * Firebase Authentication Handler for Learn Page
 * This script ensures authentication is properly initialized before any API calls
 */

// Create a Promise that resolves with the user object or null when auth state is known
let authStatePromiseResolver;
window.authStatePromise = new Promise((resolve) => {
  authStatePromiseResolver = resolve;
});

// Initialize authentication checking on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('learn-auth.js: Initializing authentication checks');

  // Function to set up the auth state listener once Firebase is ready
  const setupAuthListener = function() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      // Firebase is loaded, set up auth state listener
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log('User authenticated on page load:', user.uid);
          authStatePromiseResolver(user); // Resolve the promise with the user object
          hideLoginPrompt(); // Hide login prompt if it was somehow shown
        } else {
          console.log('No user authenticated on page load');
          authStatePromiseResolver(null); // Resolve the promise with null
          // Don't automatically show login - wait for an action that requires auth
        }
        // Listener established, clear the interval if it's still running
        if (authCheckInterval) clearInterval(authCheckInterval);
      });
      return true; // Indicate listener was set up
    }
    return false; // Indicate Firebase not ready yet
  };

  // Try setting up the listener immediately
  if (!setupAuthListener()) {
    // If Firebase wasn't ready, check repeatedly
    const authCheckInterval = setInterval(() => {
      if (setupAuthListener()) {
        clearInterval(authCheckInterval); // Stop checking once listener is set up
      }
    }, 100);

    // Safety timeout for the interval
    setTimeout(() => {
        if(authCheckInterval) {
            clearInterval(authCheckInterval);
            // If auth state is still unknown after timeout, resolve with null
            // Check if promise is still pending before resolving
             window.authStatePromise.then(result => {
                 if(result === undefined) { // Check if resolver was ever called
                     console.warn("Firebase auth check timed out after 5s.");
                     authStatePromiseResolver(null);
                 }
             });
        }
    }, 5000); // 5 seconds timeout
  }
});

// Removed the forceAuthentication function as it's replaced by awaiting authStatePromise

// Show login prompt - modified to return a promise that resolves on successful login
function showLoginPrompt() {
  return new Promise((resolve, reject) => {
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
        <button id="learn-login-cancel" style="background:#555;color:#fff;border:none;padding:12px 20px;border-radius:4px;margin:10px;cursor:pointer;">Cancel</button>
      `;
      
      loginPrompt.appendChild(loginBox);
      document.body.appendChild(loginPrompt);
      
      // Add event listeners
      document.getElementById('learn-login-google').addEventListener('click', function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
          console.log('Google sign-in successful:', result.user.uid);
          hideLoginPrompt();
          authStatePromiseResolver(result.user); // Re-resolve the main promise
          resolve(result.user); // Resolve the prompt promise
        }).catch(error => {
          console.error('Google sign-in error:', error);
          // Show error message in the prompt
          let errorMsg = loginBox.querySelector('.error-message');
          if (!errorMsg) {
            errorMsg = document.createElement('p');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#ff5555';
            loginBox.appendChild(errorMsg);
          }
          errorMsg.textContent = 'Sign-in failed: ' + error.message;
          // Do not reject here, let the user try again or cancel
        });
      });
      
      document.getElementById('learn-login-cancel').addEventListener('click', function() {
        hideLoginPrompt();
        reject(new Error('User cancelled login')); // Reject the prompt promise
        // Do NOT redirect here - let the calling function decide
      });
    } else {
       // Clear any previous error messages if the prompt is being reused
       const errorMsg = loginPrompt.querySelector('.error-message');
       if (errorMsg) errorMsg.remove();
    }
    
    loginPrompt.style.display = 'flex';
  });
}

// Hide login prompt
function hideLoginPrompt() {
  const loginPrompt = document.getElementById('learn-login-prompt');
  if (loginPrompt) {
    loginPrompt.style.display = 'none';
  }
} 