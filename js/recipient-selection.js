/**
 * Recipient Selection Page
 * Handles user selection of message recipients and relationship types
 */

// Global variables
let currentUser = null;
let selectedRelation = null;
let selectedConnection = null;
let selectedEmotion = null;

// Debug logging
function debugInPage(message) {
  console.log('DEBUG JS:', message);
  const debugOutput = document.getElementById('debug-output');
  if (debugOutput) {
    const logEntry = document.createElement('div');
    logEntry.textContent = `[JS ${new Date().toLocaleTimeString()}] ${message}`;
    debugOutput.appendChild(logEntry);
  }
}

// Simplified initApp function - runs immediately and focuses on core functionality
(function() {
  console.log('DIRECT EXECUTION: Forcing recipient-selection.js to run');
  
  try {
    // Get the selected emotion from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const emotion = urlParams.get('emotion') || localStorage.getItem('selectedEmotion') || 'default';
    console.log('Selected emotion:', emotion);
    
    // Force UI to display
    document.body.style.display = 'block';
    document.body.style.visibility = 'visible';
    
    // Initialize form elements
    initBasicFunctionality(emotion);
  } catch (e) {
    console.error('Critical initialization error:', e);
  }
})();

// Core functionality without Firebase dependency
function initBasicFunctionality(emotion) {
  console.log('Initializing basic functionality...');
  
  // Store emotion for later use
  window.selectedEmotion = emotion;
  
  // Initialize relationship selection
  initRelationshipSelection();
  
  // Set up buttons
  const backButton = document.getElementById('back-btn');
  if (backButton) {
    backButton.addEventListener('click', function() {
      window.location.href = 'emotional-entry.html';
    });
  }
  
  const nextButton = document.getElementById('next-btn');
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      if (validateForm()) {
        proceedToNextPage();
      }
    });
  }
  
  // Navigation buttons
  const dashboardBtn = document.getElementById('dashboard-btn');
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', function() {
      window.location.href = 'home.html';
    });
  }
  
  const historyBtn = document.getElementById('history-btn');
  if (historyBtn) {
    historyBtn.addEventListener('click', function() {
      window.location.href = 'history.html';
    });
  }
  
  const learnBtn = document.getElementById('learn-btn');
  if (learnBtn) {
    learnBtn.addEventListener('click', function() {
      window.location.href = 'learn.html';
    });
  }
  
  console.log('Basic functionality initialized successfully');
}

// Initialize relationship type selection
function initRelationshipSelection() {
  const relationshipTypes = document.querySelectorAll('.relationship-type');
  if (!relationshipTypes.length) {
    console.error('Relationship type elements not found');
    return;
  }
  
  relationshipTypes.forEach(type => {
    type.addEventListener('click', function() {
      // Remove selected class from all types
      relationshipTypes.forEach(t => t.classList.remove('selected'));
      
      // Add selected class to clicked type
      this.classList.add('selected');
      
      // Save selected relation
      window.selectedRelation = this.getAttribute('data-relation');
      console.log('Selected relationship:', window.selectedRelation);
    });
  });
  
  console.log('Relationship selection initialized with', relationshipTypes.length, 'options');
}

// Basic form validation
function validateForm() {
  const nameInput = document.getElementById('recipient-name');
  if (!nameInput) {
    console.error('Recipient name input not found');
    return false;
  }
  
  const name = nameInput.value.trim();
  if (!name) {
    alert('Please enter a name for your recipient.');
    nameInput.focus();
    return false;
  }
  
  if (!window.selectedRelation) {
    alert('Please select your relationship with this person.');
    return false;
  }
  
  return true;
}

// Navigate to next page with recipient data
function proceedToNextPage() {
  try {
    const nameInput = document.getElementById('recipient-name');
    const name = nameInput.value.trim();
    
    // Prepare recipient data
    const recipientData = {
      name: name,
      relationship: window.selectedRelation,
      isExisting: false
    };
    
    // Store data for next page
    localStorage.setItem('recipientData', JSON.stringify(recipientData));
    
    // Navigate to next page
    window.location.href = `message-intent.html?emotion=${window.selectedEmotion}`;
  } catch (e) {
    console.error('Error navigating to next page:', e);
    // As fallback, try to navigate anyway
    window.location.href = 'message-intent.html';
  }
}

// Initialize the recipient selection page
function initializeSelectionPage() {
  debugInPage('Initializing recipient selection page');
  
  // Back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.location.href = 'emotional-entry.html';
    });
  } else {
    debugInPage('Back button not found');
  }
  
  // Next button
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (validateForm()) {
        saveRecipientAndNavigate();
      }
    });
  } else {
    debugInPage('Next button not found');
  }
  
  // Toggle between saved and new connection
  const newConnectionLink = document.getElementById('new-connection-link');
  if (newConnectionLink) {
    newConnectionLink.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('saved-connections-container').style.display = 'none';
      document.getElementById('new-connection-form').style.display = 'block';
      selectedConnection = null;
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
          debugInPage('Logout error: ' + error.message);
        });
    });
  }
}

// Initialize save options
function initializeSaveOptions() {
  const setReminderToggle = document.getElementById('set-reminder');
  const reminderOptions = document.getElementById('reminder-options');
  const reminderTimeframe = document.getElementById('reminder-timeframe');
  const customDateContainer = document.getElementById('custom-date-container');
  
  if (setReminderToggle && reminderOptions) {
    setReminderToggle.addEventListener('change', function() {
      if (this.checked) {
        reminderOptions.classList.add('active');
      } else {
        reminderOptions.classList.remove('active');
      }
    });
  }
  
  if (reminderTimeframe && customDateContainer) {
    reminderTimeframe.addEventListener('change', function() {
      if (this.value === 'custom') {
        customDateContainer.style.display = 'block';
      } else {
        customDateContainer.style.display = 'none';
      }
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

// Load user's saved connections
function loadUserConnections() {
  if (!currentUser) return;
  
  // References
  const connectionsContainer = document.getElementById('saved-connections-container');
  const connectionsList = document.getElementById('connections-list');
  
  // Reset list
  if (connectionsList) {
    connectionsList.innerHTML = '<div style="text-align: center; padding: 20px;">Loading your connections...</div>';
  }
  
  // Query Firestore for user's connections
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('connections')
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        if (connectionsContainer) connectionsContainer.style.display = 'none';
        return;
      }
      
      // Clear loading indicator
      if (connectionsList) connectionsList.innerHTML = '';
      
      // Show connections container
      if (connectionsContainer) connectionsContainer.style.display = 'block';
      
      // Add connections to the list
      querySnapshot.forEach((doc) => {
        const connectionData = doc.data();
        const connectionItem = document.createElement('div');
        connectionItem.className = 'connection-item';
        connectionItem.setAttribute('data-id', doc.id);
        
        // Get initials for avatar
        const initials = getInitials(connectionData.name);
        
        // Set connection HTML
        connectionItem.innerHTML = `
          <div class="connection-avatar">${initials}</div>
          <div class="connection-details">
            <div class="connection-name">${connectionData.name}</div>
            <div class="connection-relation">${capitalizeFirstLetter(connectionData.relationship || 'Contact')}</div>
          </div>
        `;
        
        // Add click event to select connection
        connectionItem.addEventListener('click', function() {
          // Remove selected class from all connections
          const allConnections = document.querySelectorAll('.connection-item');
          allConnections.forEach(c => c.classList.remove('selected'));
          
          // Add selected class to clicked connection
          this.classList.add('selected');
          
          // Store selected connection
          selectedConnection = {
            id: doc.id,
            name: connectionData.name,
            relationship: connectionData.relationship
          };
          
          console.log('Selected connection:', selectedConnection);
        });
        
        if (connectionsList) connectionsList.appendChild(connectionItem);
      });
    })
    .catch((error) => {
      console.error('Error loading connections:', error);
      if (connectionsContainer) connectionsContainer.style.display = 'none';
    });
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