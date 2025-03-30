/**
 * Firebase Authentication Handler for Learn Page
 * This script ensures authentication is properly initialized before any API calls
 */

// Create a Promise that resolves with the user object or null when auth state is known
let authStatePromiseResolver;
window.authStatePromise = new Promise((resolve) => {
  authStatePromiseResolver = resolve;
});
let authStateResolved = false; // Flag to ensure we only resolve once

// Declare interval variable in a higher scope
let authCheckInterval = null;

// Initialize authentication checking on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('learn-auth.js: DOMContentLoaded. Initializing authentication checks.');

  // Function to set up the auth state listener once Firebase is ready
  const setupAuthListener = function() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      console.log('learn-auth.js: Firebase detected. Setting up onAuthStateChanged listener.');
      // Firebase is loaded, set up auth state listener
      firebase.auth().onAuthStateChanged(function(user) {
        console.log('learn-auth.js: onAuthStateChanged triggered. User object:', user);
        let initialUser = user;
        if (!authStateResolved) {
            if (user) {
              console.log('learn-auth.js: User authenticated via listener:', user.uid);
              authStatePromiseResolver(user); // Resolve the promise with the user object
              hideLoginPrompt(); // Hide login prompt if it was somehow shown
              authStateResolved = true;
            } else {
              console.log('learn-auth.js: Initial listener trigger reported NULL user. Waiting briefly for persisted state...');
              // Wait a short period. Firebase might fire again quickly with the persisted user.
              setTimeout(() => {
                  if (!authStateResolved) {
                      // Check the *very latest* user status after the delay
                      const currentUserAfterDelay = firebase.auth().currentUser;
                      console.log('learn-auth.js: State after brief delay:', currentUserAfterDelay ? currentUserAfterDelay.uid : 'null');
                      if (currentUserAfterDelay) {
                          authStatePromiseResolver(currentUserAfterDelay);
                      } else {
                           authStatePromiseResolver(null); // Resolve with null if still no user
                      }
                      authStateResolved = true;
                  }
              }, 250); // Wait 250ms
              // Don't automatically show login - wait for an action that requires auth
            }
        } else {
            console.log('learn-auth.js: onAuthStateChanged triggered again, but promise already resolved. Current user:', user ? user.uid : 'null');
            // Handle potential subsequent changes if needed (e.g., user logs out later)
            // For now, we mostly care about the initial state resolution.
        }

        // Listener established, clear the interval if it's still running
        // Check interval variable exists before clearing
        if (authCheckInterval) {
            console.log('learn-auth.js: Clearing authCheckInterval.');
            clearInterval(authCheckInterval);
            authCheckInterval = null; // Reset variable
        }
      });
      return true; // Indicate listener was set up
    }
    console.log('learn-auth.js: Firebase not detected yet.');
    return false; // Indicate Firebase not ready yet
  };

  // Try setting up the listener immediately
  if (!setupAuthListener()) {
    console.log('learn-auth.js: Firebase not ready on first check. Starting interval.');
    // If Firebase wasn't ready, check repeatedly
    authCheckInterval = setInterval(() => { // Assign to the higher-scoped variable
        console.log('learn-auth.js: Checking for Firebase via interval...');
      if (setupAuthListener()) {
        // Interval is cleared inside setupAuthListener now
      }
    }, 100);

    // Safety timeout for the interval
    setTimeout(() => {
        if(authCheckInterval) {
            console.warn("learn-auth.js: Firebase auth check interval timed out after 5s. Clearing interval.");
            clearInterval(authCheckInterval);
            authCheckInterval = null;
            // If auth state is still unknown after timeout, resolve with null
             if (!authStateResolved) {
                 console.warn("learn-auth.js: Resolving authStatePromise with null due to timeout.");
                 authStatePromiseResolver(null);
                 authStateResolved = true;
             }
        }
    }, 5000); // 5 seconds timeout
  }
});

// Removed the forceAuthentication function as it's replaced by awaiting authStatePromise

// Show login prompt - modified to return a promise that resolves on successful login
function showLoginPrompt() {
  console.log("learn-auth.js: showLoginPrompt called.");
  return new Promise((resolve, reject) => {
    let loginPrompt = document.getElementById('learn-login-prompt');
    if (!loginPrompt) {
      console.log("learn-auth.js: Creating login prompt element.");
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
        console.log("learn-auth.js: Google Sign-in button clicked.");
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
          console.log('learn-auth.js: Google sign-in successful via popup:', result.user.uid);
          hideLoginPrompt();
          // We need to ensure the main promise knows about this user *if* it hadn't resolved yet
          if (!authStateResolved) {
              console.log("learn-auth.js: Resolving main authStatePromise after popup success.");
              authStatePromiseResolver(result.user);
              authStateResolved = true;
          }
          resolve(result.user); // Resolve the prompt promise
        }).catch(error => {
          console.error('learn-auth.js: Google sign-in error:', error);
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
        console.log("learn-auth.js: Cancel button clicked in login prompt.");
        hideLoginPrompt();
        reject(new Error('User cancelled login')); // Reject the prompt promise
        // Do NOT redirect here - let the calling function decide
      });
    } else {
       console.log("learn-auth.js: Reusing existing login prompt element.");
       // Clear any previous error messages if the prompt is being reused
       const errorMsg = loginPrompt.querySelector('.error-message');
       if (errorMsg) errorMsg.remove();
    }
    
    loginPrompt.style.display = 'flex';
  });
}

// Hide login prompt
function hideLoginPrompt() {
  console.log("learn-auth.js: Hiding login prompt.");
  const loginPrompt = document.getElementById('learn-login-prompt');
  if (loginPrompt) {
    loginPrompt.style.display = 'none';
  }
} 