/**
 * Emotional Entry Point Functionality
 * This file handles the emotion-first approach for HeartGlowAI
 */

// Global variables
let currentUser = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Emotional entry page loaded, initializing...');
  
  // Check if Firebase is already initialized
  if (!firebase.apps.length) {
    console.error("Firebase not initialized properly. Please refresh the page.");
    showAlert("Error initializing Firebase. Please refresh the page.", "error");
    return;
  }
  
  // Check authentication status on load
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User authenticated:', user.uid);
      currentUser = user;
      initializeEntryPage();
    } else {
      console.log('No user logged in, redirecting to login page');
      window.location.href = 'login.html';
    }
  });
  
  // Initialize navigation buttons
  initNavigationButtons();
});

// Initialize the emotional entry page
function initializeEntryPage() {
  console.log('Initializing emotional entry page');
  
  // Add event listeners to emotion buttons
  const emotionButtons = document.querySelectorAll('.emotion-button');
  emotionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const emotionType = this.getAttribute('data-emotion');
      console.log('Selected emotion:', emotionType);
      
      // Navigate to the next step with the selected emotion
      navigateToMessageCreation(emotionType);
    });
    
    // Add hover effect for glow position
    button.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const glowEffect = this.querySelector('.glow-effect');
      if (glowEffect) {
        glowEffect.style.left = `${x}px`;
        glowEffect.style.top = `${y}px`;
      }
    });
  });
  
  // Initialize logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      showLoading('Logging out...');
      firebase.auth().signOut()
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error('Logout error:', error);
          hideLoading();
          showAlert(`Logout error: ${error.message}`, 'error');
        });
    });
  }
}

// Initialize navigation buttons
function initNavigationButtons() {
  // Dashboard button
  const dashboardBtn = document.getElementById('dashboard-btn');
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', function() {
      window.location.href = 'home.html';
    });
  }
  
  // History button
  const historyBtn = document.getElementById('history-btn');
  if (historyBtn) {
    historyBtn.addEventListener('click', function() {
      window.location.href = 'history.html';
    });
  }
  
  // Learn button
  const learnBtn = document.getElementById('learn-btn');
  if (learnBtn) {
    learnBtn.addEventListener('click', function() {
      window.location.href = 'learn.html';
    });
  }
}

// Navigate to message creation page with the selected emotion
function navigateToMessageCreation(emotionType) {
  // Store the selected emotion in localStorage for use in the next page
  localStorage.setItem('selectedEmotion', emotionType);
  
  // Navigate to the appropriate next step based on emotion
  switch(emotionType) {
    case 'vulnerability':
      window.location.href = 'recipient-selection.html?emotion=vulnerability';
      break;
    case 'reconnect':
      window.location.href = 'recipient-selection.html?emotion=reconnect';
      break;
    case 'appreciation':
      window.location.href = 'recipient-selection.html?emotion=appreciation';
      break;
    case 'explore':
      window.location.href = 'home.html';
      break;
    default:
      window.location.href = 'recipient-selection.html';
  }
}

// Show loading message
function showLoading(message = 'Loading...') {
  // Create loading element if it doesn't exist
  let loadingElement = document.getElementById('loading-overlay');
  
  if (!loadingElement) {
    loadingElement = document.createElement('div');
    loadingElement.id = 'loading-overlay';
    loadingElement.innerHTML = `
      <div class="loading-spinner"></div>
      <div class="loading-message">${message}</div>
    `;
    document.body.appendChild(loadingElement);
  } else {
    loadingElement.querySelector('.loading-message').textContent = message;
    loadingElement.style.display = 'flex';
  }
}

// Hide loading message
function hideLoading() {
  const loadingElement = document.getElementById('loading-overlay');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
}

// Show alert message
function showAlert(message, type = 'info') {
  // Create alert element
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type}`;
  alertElement.innerHTML = `
    <div class="alert-message">${message}</div>
    <button class="alert-close">&times;</button>
  `;
  
  // Add to document
  document.body.appendChild(alertElement);
  
  // Animate in
  setTimeout(() => {
    alertElement.classList.add('show');
  }, 10);
  
  // Add close button handler
  const closeBtn = alertElement.querySelector('.alert-close');
  closeBtn.addEventListener('click', () => {
    alertElement.classList.remove('show');
    setTimeout(() => {
      alertElement.remove();
    }, 300);
  });
  
  // Auto remove after 5 seconds for non-error alerts
  if (type !== 'error') {
    setTimeout(() => {
      if (document.body.contains(alertElement)) {
        alertElement.classList.remove('show');
        setTimeout(() => {
          alertElement.remove();
        }, 300);
      }
    }, 5000);
  }
} 