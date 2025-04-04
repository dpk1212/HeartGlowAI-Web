// Global variables
let currentUser = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Home page loaded, initializing...');
  
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
      initializeHomePage();
      loadUserMessages();
    } else {
      console.log('No user logged in, redirecting to login page');
      window.location.href = 'login.html';
    }
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
          showAlert(`Logout error: ${error.message}`, 'error');
          hideLoading();
        });
    });
  }
  
  // Initialize navigation buttons
  initNavigationButtons();
});

// Initialize the home page functionality
function initializeHomePage() {
  console.log('Initializing home page functionality');
  
  // Initialize new conversation button
  const newConversationBtn = document.getElementById('new-conversation-btn');
  if (newConversationBtn) {
    newConversationBtn.addEventListener('click', function() {
      window.location.href = 'generator.html';
    });
  }
  
  // Initialize template cards
  const templateCards = document.querySelectorAll('.template-card');
  templateCards.forEach(card => {
    card.addEventListener('click', function() {
      const templateType = this.getAttribute('data-template');
      if (templateType) {
        window.location.href = `generator.html?template=${templateType}`;
      }
    });
  });
  
  // Initialize feedback button
  const feedbackButton = document.getElementById('feedbackButton');
  if (feedbackButton) {
    feedbackButton.addEventListener('click', function() {
      window.location.href = 'feedback.html';
    });
  }
}

// Initialize navigation buttons
function initNavigationButtons() {
  // Dashboard button
  const dashboardBtn = document.getElementById('dashboard-btn');
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', function() {
      window.location.href = 'dashboard.html';
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
  
  // Manage blueprints button
  const manageBlueprintsBtn = document.getElementById('manage-blueprints-btn');
  if (manageBlueprintsBtn) {
    manageBlueprintsBtn.addEventListener('click', function() {
      window.location.href = 'blueprints.html';
    });
  }
}

// Load user's recent messages
function loadUserMessages() {
  if (!currentUser) return;
  
  const messageHistory = document.getElementById('message-history');
  if (!messageHistory) return;
  
  // Show loading indicator
  messageHistory.innerHTML = '<li class="loading-item">Loading recent messages...</li>';
  
  // Query Firestore for user's messages
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('messages')
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        messageHistory.innerHTML = '<li class="empty-item">No recent messages found</li>';
        return;
      }
      
      // Clear loading indicator
      messageHistory.innerHTML = '';
      
      // Add messages to the list
      querySnapshot.forEach((doc) => {
        const messageData = doc.data();
        const messageItem = document.createElement('li');
        messageItem.className = 'message-item';
        
        // Format date
        let dateText = 'Recently';
        if (messageData.createdAt) {
          const messageDate = messageData.createdAt.toDate();
          dateText = formatDate(messageDate);
        }
        
        // Create message preview (truncate if too long)
        let messagePreview = messageData.content || '';
        if (messagePreview.length > 100) {
          messagePreview = messagePreview.substring(0, 100) + '...';
        }
        
        // Set message HTML
        messageItem.innerHTML = `
          <div class="message-date">${dateText}</div>
          <div class="message-preview">${messagePreview}</div>
        `;
        
        // Add click event to view full message
        messageItem.addEventListener('click', function() {
          window.location.href = `message.html?id=${doc.id}`;
        });
        
        messageHistory.appendChild(messageItem);
      });
    })
    .catch((error) => {
      console.error('Error loading messages:', error);
      messageHistory.innerHTML = '<li class="error-item">Error loading messages</li>';
    });
}

// Format date helper
function formatDate(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
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