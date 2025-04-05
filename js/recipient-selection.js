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

// Initialize app on page load - using both event handlers to ensure it runs
function initApp() {
  debugInPage('Recipient selection script starting...');
  
  try {
    // Get the selected emotion from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    selectedEmotion = urlParams.get('emotion') || localStorage.getItem('selectedEmotion') || 'default';
    debugInPage('Selected emotion: ' + selectedEmotion);
    
    // Initialize UI components regardless of auth status
    debugInPage('Initializing UI components...');
    initializeRelationshipSelection();
    initializeSaveOptions();
    initNavigationButtons();
    
    // Initialize the selection page for basic functionality
    initializeSelectionPage();
    
    // Force display of the main form container
    const newConnectionForm = document.getElementById('new-connection-form');
    if (newConnectionForm) {
      newConnectionForm.style.display = 'block';
      debugInPage('Forced new connection form to display');
    }
    
    // Check authentication status - but don't block the page on it
    if (window.firebase && firebase.auth) {
      debugInPage('Firebase auth found, checking login status...');
      
      // Set a timeout to prevent hanging on auth
      const authTimeout = setTimeout(() => {
        debugInPage('AUTH TIMEOUT - proceeding without waiting for Firebase');
        document.getElementById('debug-output').innerHTML += '<div style="color:orange">⚠️ Auth timed out - continuing anyway</div>';
      }, 3000);
      
      firebase.auth().onAuthStateChanged(function(user) {
        clearTimeout(authTimeout);
        
        if (user) {
          debugInPage('User authenticated: ' + user.uid);
          currentUser = user;
          
          // Try to load user connections, but don't block if it fails
          try {
            loadUserConnections();
          } catch (error) {
            debugInPage('Error loading connections: ' + error.message);
          }
        } else {
          debugInPage('No user logged in, continuing in guest mode');
          document.getElementById('debug-output').innerHTML += '<div style="color:yellow">ℹ️ Not logged in - running in limited mode</div>';
          
          // Hide save options that require authentication
          const saveConnectionOption = document.getElementById('save-connection');
          if (saveConnectionOption) {
            saveConnectionOption.disabled = true;
            saveConnectionOption.parentElement.parentElement.style.opacity = '0.5';
          }
        }
      });
    } else {
      debugInPage('Firebase auth not available - continuing in offline mode');
      document.getElementById('debug-output').innerHTML += '<div style="color:orange">⚠️ Firebase not initialized - continuing without authentication</div>';
    }
  } catch (error) {
    debugInPage('INITIALIZATION ERROR: ' + error.message);
    console.error('App init error:', error);
    
    // Even if there's an error, try to make the form usable
    const newConnectionForm = document.getElementById('new-connection-form');
    if (newConnectionForm) {
      newConnectionForm.style.display = 'block';
    }
  }
}

// Run initialization using both event handlers to ensure it runs
window.addEventListener('load', function() {
  debugInPage('Window load event received');
  initApp();
});

document.addEventListener('DOMContentLoaded', function() {
  debugInPage('DOMContentLoaded event received');
  initApp();
});

// Force init after a short delay as a fallback
setTimeout(function() {
  debugInPage('Timeout initialization triggered');
  initApp();
}, 1000);

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

// Initialize relationship type selection
function initializeRelationshipSelection() {
  const relationshipTypes = document.querySelectorAll('.relationship-type');
  relationshipTypes.forEach(type => {
    type.addEventListener('click', function() {
      // Remove selected class from all types
      relationshipTypes.forEach(t => t.classList.remove('selected'));
      
      // Add selected class to clicked type
      this.classList.add('selected');
      
      // Save selected relation
      selectedRelation = this.getAttribute('data-relation');
      console.log('Selected relationship:', selectedRelation);
    });
  });
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

// Validate form inputs before proceeding
function validateForm() {
  // If a saved connection is selected, no need to validate other fields
  if (selectedConnection) {
    return true;
  }
  
  const nameInput = document.getElementById('recipient-name');
  const name = nameInput ? nameInput.value.trim() : '';
  
  if (!name) {
    showAlert('Please enter a name for your recipient.', 'error');
    if (nameInput) nameInput.focus();
    return false;
  }
  
  if (!selectedRelation) {
    showAlert('Please select your relationship with this person.', 'error');
    return false;
  }
  
  return true;
}

// Save recipient information and navigate to the next page
function saveRecipientAndNavigate() {
  let recipientData = {};
  
  // If using a saved connection
  if (selectedConnection) {
    recipientData = {
      id: selectedConnection.id,
      name: selectedConnection.name,
      relationship: selectedConnection.relationship,
      isExisting: true
    };
  } 
  // If creating a new connection
  else {
    const nameInput = document.getElementById('recipient-name');
    const name = nameInput ? nameInput.value.trim() : '';
    
    recipientData = {
      name: name,
      relationship: selectedRelation,
      isExisting: false
    };
    
    // Only try to save to Firebase if we're authenticated
    const saveConnectionCheckbox = document.getElementById('save-connection');
    if (saveConnectionCheckbox && saveConnectionCheckbox.checked && currentUser && window.firebase) {
      try {
        // Save to Firestore
        debugInPage('Saving connection to Firestore...');
        firebase.firestore()
          .collection('users')
          .doc(currentUser.uid)
          .collection('connections')
          .add({
            name: name,
            relationship: selectedRelation,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then((docRef) => {
            debugInPage('Connection saved with ID: ' + docRef.id);
            recipientData.id = docRef.id;
            
            // Set reminder if requested
            setReminderIfNeeded(docRef.id, name);
          })
          .catch((error) => {
            debugInPage('Error saving connection: ' + error.message);
            console.error('Error saving connection:', error);
            // Continue to next page despite the error
          });
      } catch (error) {
        debugInPage('Failed to save connection: ' + error.message);
        // Continue despite errors
      }
    } else if (saveConnectionCheckbox && saveConnectionCheckbox.checked) {
      debugInPage('Cannot save connection - user not authenticated or Firebase unavailable');
    }
  }
  
  // Store recipient data for next page
  try {
    localStorage.setItem('recipientData', JSON.stringify(recipientData));
    debugInPage('Recipient data saved to localStorage');
  } catch (error) {
    debugInPage('Error saving to localStorage: ' + error.message);
  }
  
  // Navigate to message intent page
  debugInPage('Navigating to message intent page...');
  window.location.href = `message-intent.html?emotion=${selectedEmotion}`;
}

// Set reminder if the checkbox is checked
function setReminderIfNeeded(connectionId, recipientName) {
  const setReminderCheckbox = document.getElementById('set-reminder');
  
  if (setReminderCheckbox && setReminderCheckbox.checked && currentUser) {
    const reminderTimeframe = document.getElementById('reminder-timeframe');
    const customDateInput = document.getElementById('custom-reminder-date');
    
    let reminderDate = new Date();
    
    // Calculate reminder date based on selection
    if (reminderTimeframe) {
      const timeframeValue = reminderTimeframe.value;
      
      if (timeframeValue === 'custom' && customDateInput && customDateInput.value) {
        reminderDate = new Date(customDateInput.value);
      } else {
        switch (timeframeValue) {
          case '1-week':
            reminderDate.setDate(reminderDate.getDate() + 7);
            break;
          case '2-weeks':
            reminderDate.setDate(reminderDate.getDate() + 14);
            break;
          case '1-month':
            reminderDate.setMonth(reminderDate.getMonth() + 1);
            break;
          case '3-months':
            reminderDate.setMonth(reminderDate.getMonth() + 3);
            break;
          default:
            reminderDate.setMonth(reminderDate.getMonth() + 1);
        }
      }
    }
    
    // Save reminder to Firestore
    firebase.firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('reminders')
      .add({
        connectionId: connectionId,
        recipientName: recipientName,
        reminderDate: reminderDate,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        isComplete: false
      })
      .then((docRef) => {
        console.log('Reminder set with ID:', docRef.id);
      })
      .catch((error) => {
        console.error('Error setting reminder:', error);
      });
  }
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