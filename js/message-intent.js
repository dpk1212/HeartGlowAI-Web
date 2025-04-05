/**
 * Message Intent Page
 * Handles selection of message intents and core message purpose
 */

// Global variables
let currentUser = null;
let selectedIntent = null;
let recipientData = null;
let selectedEmotion = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Message intent page loaded, initializing...');
  
  // Get the selected emotion from URL params or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  selectedEmotion = urlParams.get('emotion') || localStorage.getItem('selectedEmotion') || 'default';
  console.log('Selected emotion:', selectedEmotion);
  
  // Load recipient data from localStorage
  try {
    const storedRecipientData = localStorage.getItem('recipientData');
    if (storedRecipientData) {
      recipientData = JSON.parse(storedRecipientData);
      console.log('Loaded recipient data:', recipientData);
      updateRecipientInfo();
    } else {
      console.error('No recipient data found');
      showAlert('No recipient data found. Please go back and select a recipient.', 'error');
    }
  } catch (error) {
    console.error('Error parsing recipient data:', error);
  }
  
  // Check authentication status
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User authenticated:', user.uid);
      currentUser = user;
      initializeIntentPage();
    } else {
      console.log('No user logged in, redirecting to login page');
      window.location.href = 'login.html';
    }
  });
});

// Initialize the message intent page
function initializeIntentPage() {
  console.log('Initializing message intent page');
  
  // Initialize intent card selection
  initializeIntentSelection();
  
  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 'recipient-selection-new.html?emotion=' + selectedEmotion;
    });
  }
  
  // Next button
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (validateSelection()) {
        saveIntentAndNavigate();
      }
    });
  }
  
  // Initialize logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      firebase.auth().signOut()
        .then(() => {
          window.location.href = 'index.html';
        })
        .catch((error) => {
          console.error('Logout error:', error);
          showAlert(`Logout error: ${error.message}`, 'error');
        });
    });
  }
  
  // Initialize navigation buttons
  initNavigationButtons();
  
  // Choose the appropriate intent based on emotion
  preSelectIntentBasedOnEmotion();
}

// Initialize intent selection
function initializeIntentSelection() {
  const intentCards = document.querySelectorAll('.intent-card');
  const nextBtn = document.getElementById('next-btn');
  const customIntentForm = document.getElementById('custom-intent-form');
  
  intentCards.forEach(card => {
    card.addEventListener('click', function() {
      // Remove selected class from all cards
      intentCards.forEach(c => c.classList.remove('selected'));
      
      // Add selected class to clicked card
      this.classList.add('selected');
      
      // Store selected intent
      selectedIntent = this.getAttribute('data-intent');
      console.log('Selected intent:', selectedIntent);
      
      // Show/hide custom intent form
      if (selectedIntent === 'custom' && customIntentForm) {
        customIntentForm.classList.add('active');
      } else if (customIntentForm) {
        customIntentForm.classList.remove('active');
      }
      
      // Enable next button
      if (nextBtn) {
        nextBtn.disabled = false;
      }
    });
  });
}

// Pre-select intent based on emotion
function preSelectIntentBasedOnEmotion() {
  if (!selectedEmotion) return;
  
  let intentToSelect = null;
  
  switch (selectedEmotion) {
    case 'vulnerability':
      intentToSelect = 'care';
      break;
    case 'reconnect':
      intentToSelect = 'reconnect';
      break;
    case 'appreciation':
      intentToSelect = 'gratitude';
      break;
    default:
      // Don't pre-select anything
      return;
  }
  
  // Find and click the matching intent card
  const intentCard = document.querySelector(`.intent-card[data-intent="${intentToSelect}"]`);
  if (intentCard) {
    intentCard.click();
  }
}

// Update recipient info display
function updateRecipientInfo() {
  if (!recipientData) return;
  
  const recipientNameElement = document.getElementById('recipient-name');
  const recipientRelationElement = document.getElementById('recipient-relation');
  const recipientAvatarElement = document.getElementById('recipient-avatar');
  
  if (recipientNameElement) {
    recipientNameElement.textContent = recipientData.name || 'Unknown';
  }
  
  if (recipientRelationElement) {
    recipientRelationElement.textContent = capitalizeFirstLetter(recipientData.relationship || 'Contact');
  }
  
  if (recipientAvatarElement) {
    recipientAvatarElement.textContent = getInitials(recipientData.name);
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

// Validate intent selection before proceeding
function validateSelection() {
  if (!selectedIntent) {
    showAlert('Please select what you want to express.', 'error');
    return false;
  }
  
  if (selectedIntent === 'custom') {
    const customIntentInput = document.getElementById('custom-intent');
    const customIntent = customIntentInput ? customIntentInput.value.trim() : '';
    
    if (!customIntent) {
      showAlert('Please describe what you want to express.', 'error');
      if (customIntentInput) customIntentInput.focus();
      return false;
    }
  }
  
  return true;
}

// Save intent data and navigate to tone selection
function saveIntentAndNavigate() {
  let intentData = {
    type: selectedIntent
  };
  
  // Add custom intent text if applicable
  if (selectedIntent === 'custom') {
    const customIntentInput = document.getElementById('custom-intent');
    intentData.customText = customIntentInput ? customIntentInput.value.trim() : '';
  }
  
  // Store intent data for next page
  localStorage.setItem('intentData', JSON.stringify(intentData));
  
  // Navigate to message tone page
  window.location.href = `message-tone.html?emotion=${selectedEmotion}`;
}

// Utility function to get initials from a name
function getInitials(name) {
  if (!name) return '?';
  
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Utility function to capitalize first letter
function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Show alert message
function showAlert(message, type = 'info') {
  // Create alert element if it doesn't exist
  let alertElement = document.querySelector('.alert');
  
  if (!alertElement) {
    alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    document.body.appendChild(alertElement);
  } else {
    alertElement.className = `alert alert-${type}`;
  }
  
  // Set message
  alertElement.innerHTML = `
    <div class="alert-content">
      <span class="alert-message">${message}</span>
      <button class="alert-close">&times;</button>
    </div>
  `;
  
  // Show alert
  setTimeout(() => {
    alertElement.classList.add('show');
  }, 10);
  
  // Add close button handler
  const closeBtn = alertElement.querySelector('.alert-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      alertElement.classList.remove('show');
      
      setTimeout(() => {
        if (document.body.contains(alertElement)) {
          document.body.removeChild(alertElement);
        }
      }, 300);
    });
  }
  
  // Auto remove for non-error alerts
  if (type !== 'error') {
    setTimeout(() => {
      if (document.body.contains(alertElement)) {
        alertElement.classList.remove('show');
        
        setTimeout(() => {
          if (document.body.contains(alertElement)) {
            document.body.removeChild(alertElement);
          }
        }, 300);
      }
    }, 5000);
  }
} 