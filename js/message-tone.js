/**
 * Message Tone Page
 * Handles selection of message tone and emotional intensity
 */

// Global variables
let currentUser = null;
let selectedTone = null;
let intensityValue = 3; // Default to medium
let recipientData = null;
let intentData = null;
let selectedEmotion = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Message tone page loaded, initializing...');
  
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
  
  // Load intent data from localStorage
  try {
    const storedIntentData = localStorage.getItem('intentData');
    if (storedIntentData) {
      intentData = JSON.parse(storedIntentData);
      console.log('Loaded intent data:', intentData);
      updateIntentInfo();
    } else {
      console.error('No intent data found');
      showAlert('No intent data found. Please go back and select your message intent.', 'error');
    }
  } catch (error) {
    console.error('Error parsing intent data:', error);
  }
  
  // Check authentication status
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User authenticated:', user.uid);
      currentUser = user;
      initializeTonePage();
    } else {
      console.log('No user logged in, redirecting to login page');
      window.location.href = 'login.html';
    }
  });
});

// Initialize the message tone page
function initializeTonePage() {
  console.log('Initializing message tone page');
  
  // Initialize tone selection
  initializeToneSelection();
  
  // Initialize intensity slider
  initializeIntensitySlider();
  
  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 'message-intent.html?emotion=' + selectedEmotion;
    });
  }
  
  // Next button
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (validateSelection()) {
        saveToneAndGenerateMessage();
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
  
  // Choose tone based on emotion and intent
  preSelectToneBasedOnContext();
}

// Initialize tone selection
function initializeToneSelection() {
  const tonePills = document.querySelectorAll('.tone-pill');
  const nextBtn = document.getElementById('next-btn');
  
  tonePills.forEach(pill => {
    pill.addEventListener('click', function() {
      // Remove selected class from all pills
      tonePills.forEach(p => p.classList.remove('selected'));
      
      // Add selected class to clicked pill
      this.classList.add('selected');
      
      // Store selected tone
      selectedTone = this.getAttribute('data-tone');
      console.log('Selected tone:', selectedTone);
      
      // Enable next button
      if (nextBtn) {
        nextBtn.disabled = false;
      }
    });
  });
}

// Initialize intensity slider
function initializeIntensitySlider() {
  const intensitySlider = document.getElementById('intensity-slider');
  const intensityValueDisplay = document.getElementById('intensity-value');
  
  if (intensitySlider && intensityValueDisplay) {
    // Set initial value
    intensityValue = parseInt(intensitySlider.value);
    updateIntensityDisplay(intensityValue, intensityValueDisplay);
    
    // Update on change
    intensitySlider.addEventListener('input', function() {
      intensityValue = parseInt(this.value);
      updateIntensityDisplay(intensityValue, intensityValueDisplay);
    });
  }
}

// Update intensity display
function updateIntensityDisplay(value, display) {
  let intensityText = 'Medium';
  
  switch (value) {
    case 1:
      intensityText = 'Very Soft';
      break;
    case 2:
      intensityText = 'Soft';
      break;
    case 3:
      intensityText = 'Medium';
      break;
    case 4:
      intensityText = 'Strong';
      break;
    case 5:
      intensityText = 'Very Strong';
      break;
  }
  
  if (display) {
    display.textContent = intensityText;
  }
}

// Pre-select tone based on emotion and intent
function preSelectToneBasedOnContext() {
  if (!selectedEmotion || !intentData) return;
  
  let toneToSelect = null;
  
  // Logic to determine appropriate tone
  if (selectedEmotion === 'vulnerability') {
    toneToSelect = 'vulnerable';
  } else if (selectedEmotion === 'reconnect') {
    toneToSelect = 'warm';
  } else if (selectedEmotion === 'appreciation') {
    toneToSelect = 'appreciative';
  } else {
    // Intent-based fallbacks
    switch (intentData.type) {
      case 'care':
        toneToSelect = 'warm';
        break;
      case 'apologize':
        toneToSelect = 'sincere';
        break;
      case 'gratitude':
        toneToSelect = 'appreciative';
        break;
      case 'reconnect':
        toneToSelect = 'encouraging';
        break;
      default:
        toneToSelect = 'gentle';
    }
  }
  
  // Find and click the matching tone pill
  const tonePill = document.querySelector(`.tone-pill[data-tone="${toneToSelect}"]`);
  if (tonePill) {
    tonePill.click();
  }
}

// Update recipient info display
function updateRecipientInfo() {
  if (!recipientData) return;
  
  const recipientNameElement = document.getElementById('recipient-name');
  const recipientAvatarElement = document.getElementById('recipient-avatar');
  
  if (recipientNameElement) {
    recipientNameElement.textContent = recipientData.name || 'Unknown';
  }
  
  if (recipientAvatarElement) {
    recipientAvatarElement.textContent = getInitials(recipientData.name);
  }
}

// Update intent info display
function updateIntentInfo() {
  if (!intentData) return;
  
  const intentNameElement = document.getElementById('intent-name');
  
  if (intentNameElement) {
    let intentDisplay = 'Expressing thoughts';
    
    switch (intentData.type) {
      case 'care':
        intentDisplay = 'Expressing care';
        break;
      case 'apologize':
        intentDisplay = 'Making an apology';
        break;
      case 'gratitude':
        intentDisplay = 'Showing gratitude';
        break;
      case 'reconnect':
        intentDisplay = 'Reconnecting';
        break;
      case 'custom':
        intentDisplay = 'Custom message';
        break;
    }
    
    intentNameElement.textContent = intentDisplay;
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

// Validate tone selection before proceeding
function validateSelection() {
  if (!selectedTone) {
    showAlert('Please select a tone for your message.', 'error');
    return false;
  }
  
  return true;
}

// Save tone data and navigate to message generation
function saveToneAndGenerateMessage() {
  // Prepare tone data
  const toneData = {
    tone: selectedTone,
    intensity: intensityValue
  };
  
  // Get additional notes if provided
  const additionalNotesElement = document.getElementById('additional-notes');
  if (additionalNotesElement) {
    const additionalNotes = additionalNotesElement.value.trim();
    if (additionalNotes) {
      toneData.additionalNotes = additionalNotes;
    }
  }
  
  // Store tone data for message generation
  localStorage.setItem('toneData', JSON.stringify(toneData));
  
  // Show loading state
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
  }
  
  // Navigate to message result page
  window.location.href = 'message-result.html';
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