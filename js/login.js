// Global variables
let currentUser = null;
let isLogin = true; // Toggle between login and registration views

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Login page loaded, initializing...');
  
  // Initialize Firebase - Using existing configuration from HTML
  try {
    console.log('Firebase initialization check');
    // Firebase is already initialized in the HTML header
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
  
  // Set up authentication listeners
  initAuthListeners();
  
  // Check if user is already logged in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User already logged in:', user.uid);
      redirectToHome();
    } else {
      console.log('No user logged in');
    }
  });
});

// Initialize auth form listeners
function initAuthListeners() {
  // Auth form submission
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (!email || !password) {
        showAlert('Please enter both email and password', 'error');
        return;
      }
      
      showLoading('Authenticating...');
      
      if (isLogin) {
        // Login
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            console.log('Login successful');
            redirectToHome();
          })
          .catch((error) => {
            console.error('Login error:', error);
            showAlert(`Login error: ${error.message}`, 'error');
            hideLoading();
          });
      } else {
        // Register
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Create user document in Firestore
            return firebase.firestore().collection('users').doc(userCredential.user.uid).set({
              email: email,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              messageCount: 0,
              hasFeedbackSubmitted: false,
              lastFeedbackSubmittedAt: null,
              feedbackData: null
            }).then(() => {
              console.log('Account created successfully');
              showAlert('Account created successfully!', 'success');
              redirectToHome();
            });
          })
          .catch((error) => {
            console.error('Registration error:', error);
            showAlert(`Registration error: ${error.message}`, 'error');
            hideLoading();
          });
      }
    });
  } else {
    console.warn('Auth form not found');
  }
  
  // Handle Google Sign In
  const googleSignIn = document.getElementById('google-sign-in');
  if (googleSignIn) {
    googleSignIn.addEventListener('click', function() {
      console.log('Google sign-in button clicked');
      showLoading('Authenticating with Google...');
      
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
          console.log('Google sign-in successful');
          // Check if it's a new user
          const isNewUser = result.additionalUserInfo.isNewUser;
          
          if (isNewUser) {
            // Create user document in Firestore
            return firebase.firestore().collection('users').doc(result.user.uid).set({
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              messageCount: 0,
              hasFeedbackSubmitted: false,
              lastFeedbackSubmittedAt: null,
              feedbackData: null,
              authProvider: 'google'
            }).then(() => {
              showAlert('Account created successfully!', 'success');
              redirectToHome();
            });
          } else {
            redirectToHome();
          }
        })
        .catch((error) => {
          console.error('Google Sign In Error:', error);
          showAlert(`Error: ${error.message}`, 'error');
          hideLoading();
        });
    });
  }
  
  // Toggle between login and registration
  const authToggleLink = document.getElementById('auth-toggle-link');
  if (authToggleLink) {
    authToggleLink.addEventListener('click', function(e) {
      e.preventDefault();
      const authToggleText = document.getElementById('auth-toggle-text');
      const authToggleLink = document.getElementById('auth-toggle-link');
      const authSubmitBtn = document.getElementById('auth-submit-btn');
      
      isLogin = !isLogin;
      if (isLogin) {
        if (authToggleText) authToggleText.textContent = "Don't have an account?";
        if (authToggleLink) authToggleLink.textContent = "Sign up";
        if (authSubmitBtn) authSubmitBtn.textContent = "Continue";
      } else {
        if (authToggleText) authToggleText.textContent = "Already have an account?";
        if (authToggleLink) authToggleLink.textContent = "Log in";
        if (authSubmitBtn) authSubmitBtn.textContent = "Create Account";
      }
    });
  }
  
  // Handle forgot password
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      const email = prompt("Please enter your email address to reset your password:");
      if (email) {
        showLoading('Sending reset email...');
        firebase.auth().sendPasswordResetEmail(email)
          .then(() => {
            showAlert('Password reset email sent!', 'success');
            hideLoading();
          })
          .catch((error) => {
            showAlert(`Error: ${error.message}`, 'error');
            hideLoading();
          });
      }
    });
  }
}

// Redirect to home page after successful login
function redirectToHome() {
  console.log('Redirecting to home page...');
  showLoading('Redirecting to your dashboard...');
  window.location.href = 'index.html'; // Redirect to main app
}

// Show loading overlay
function showLoading(message) {
  const loadingOverlay = document.getElementById('loadingOverlay');
  const loadingContext = document.getElementById('loadingContext');
  
  if (loadingContext && message) {
    loadingContext.textContent = message;
  }
  
  if (loadingOverlay) {
    loadingOverlay.classList.add('visible');
  }
}

// Hide loading overlay
function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('visible');
  }
}

// Show alert
function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alertContainer');
  
  if (!alertContainer) return;
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'alert-close-btn';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    alert.classList.add('alert-hiding');
    setTimeout(() => {
      alertContainer.removeChild(alert);
    }, 300);
  });
  
  alert.appendChild(closeBtn);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (alert.parentNode === alertContainer) {
      alert.classList.add('alert-hiding');
      setTimeout(() => {
        if (alert.parentNode === alertContainer) {
          alertContainer.removeChild(alert);
        }
      }, 300);
    }
  }, 5000);
  
  alertContainer.appendChild(alert);
  
  // Slide in animation
  setTimeout(() => {
    alert.classList.add('alert-visible');
  }, 10);
} 