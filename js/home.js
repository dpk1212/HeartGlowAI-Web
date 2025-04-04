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
      // Instead of navigating to generator.html, show a message
      showAlert('Starting a new conversation...', 'info');
      
      // Scroll to the templates section - this allows users to select a template
      const templatesSection = document.getElementById('templates-section');
      if (templatesSection) {
        templatesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  
  // Initialize template cards
  const templateCards = document.querySelectorAll('.template-card');
  templateCards.forEach(card => {
    card.addEventListener('click', function() {
      const templateType = this.getAttribute('data-template');
      const templateName = this.querySelector('.template-name').textContent;
      
      if (templateType) {
        // Instead of navigating to generator.html, show a message about the selected template
        showAlert(`Creating a ${templateName} message...`, 'success');
        
        // Create directly on the home page
        createMessageFromTemplate(templateType, templateName);
      }
    });
  });
  
  // Initialize feedback button
  const feedbackButton = document.getElementById('feedbackButton');
  if (feedbackButton) {
    feedbackButton.addEventListener('click', function() {
      // Instead of navigating to a non-existent page, show a simple feedback form
      showFeedbackForm();
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

// New function to create a message from a template
function createMessageFromTemplate(templateType, templateName) {
  // Show loading indicator
  showLoading('Preparing your message...');
  
  // Create a mock generation process - in a real app, this would call an API
  setTimeout(() => {
    hideLoading();
    
    // Create a sample message based on template type
    let sampleMessage = '';
    let sampleInsights = [];
    
    switch(templateType) {
      case 'checkin':
        sampleMessage = "Hey there! It's been a while since we caught up. I've been thinking about you and wondering how you're doing. Would love to hear what's new in your life when you have a moment.";
        sampleInsights = ["Opens with warm greeting", "Acknowledges time apart without guilt", "Expresses genuine interest", "Leaves room for response without pressure"];
        break;
      case 'encouragement':
        sampleMessage = "I know you've been facing some challenges lately, and I just wanted to say I believe in you. Your resilience and determination have always inspired me, and I have no doubt you'll find your way through this too.";
        sampleInsights = ["Acknowledges challenges without dwelling", "Offers specific positive attributes", "Shows genuine belief in capabilities", "Gives support without advice"];
        break;
      case 'apology':
        sampleMessage = "I've been reflecting on our conversation yesterday, and I realize my words came across harshly. I'm truly sorry for how I spoke to you. Your feelings are important to me, and I'd like to make things right.";
        sampleInsights = ["Takes ownership without excuses", "Acknowledges impact on feelings", "Expresses genuine regret", "Shows desire to repair the relationship"];
        break;
      case 'tough':
        sampleMessage = "I value our relationship, which is why I'd like to have an open conversation about something that's been on my mind. When we're both able to talk, I'd appreciate the chance to share my perspective and hear yours too.";
        sampleInsights = ["Begins by affirming relationship", "Sets positive, collaborative tone", "Avoids blame language", "Creates space for two-way dialogue"];
        break;
      case 'romantic':
        sampleMessage = "The little moments with you are what I cherish most—the way you laugh at your own jokes, how you always remember my favorite things, and the feeling of comfort I find in your presence. You've become my favorite part of every day.";
        sampleInsights = ["Focuses on specific, unique qualities", "Balances emotional depth with sincerity", "Shows appreciation for daily moments", "Expresses feelings without pressure"];
        break;
      case 'gratitude':
        sampleMessage = "I want you to know how much your support meant to me this past month. You stepped up without hesitation, offered practical help, and somehow knew exactly what to say. Thank you for being someone I can truly count on.";
        sampleInsights = ["Names specific actions to show authenticity", "Acknowledges both practical and emotional support", "Expresses personal impact", "Focuses on qualities rather than obligations"];
        break;
      case 'celebration':
        sampleMessage = "Congratulations on your achievement! Seeing your dedication finally recognized makes me so happy. Your commitment to excellence and the way you've stayed true to your values throughout this journey is truly inspiring.";
        sampleInsights = ["Leads with genuine enthusiasm", "Acknowledges both achievement and journey", "Highlights personal qualities beyond the achievement", "Shows authentic pride without making it about self"];
        break;
      case 'sympathy':
        sampleMessage = "I'm deeply sorry to hear about your loss. There are no words that can ease this pain, but please know I'm here for you—whether you need someone to talk to, a shoulder to lean on, or just someone to sit with you in silence.";
        sampleInsights = ["Acknowledges the depth of loss without platitudes", "Offers specific ways of supporting", "Gives space for all emotions", "Focuses on presence rather than fixing"];
        break;
      default:
        sampleMessage = "I've been thinking about you and wanted to reach out. How have you been lately?";
        sampleInsights = ["Simple and direct", "Shows thoughtfulness", "Opens conversation naturally"];
    }
    
    // Show the generated message in a modal or popup
    showMessageResult(templateName, sampleMessage, sampleInsights);
  }, 1500);
}

// Function to display the generated message
function showMessageResult(templateName, message, insights) {
  // Create modal container
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100%';
  modalOverlay.style.height = '100%';
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '1000';
  modalOverlay.style.backdropFilter = 'blur(5px)';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.backgroundColor = 'var(--card-bg)';
  modalContent.style.borderRadius = '12px';
  modalContent.style.padding = '24px';
  modalContent.style.maxWidth = '600px';
  modalContent.style.width = '90%';
  modalContent.style.maxHeight = '90vh';
  modalContent.style.overflowY = 'auto';
  modalContent.style.boxShadow = 'var(--card-shadow)';
  modalContent.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  modalContent.style.position = 'relative';
  
  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.style.marginBottom = '20px';
  modalHeader.style.display = 'flex';
  modalHeader.style.justifyContent = 'space-between';
  modalHeader.style.alignItems = 'center';
  
  const modalTitle = document.createElement('h2');
  modalTitle.textContent = `${templateName} Message`;
  modalTitle.style.margin = '0';
  modalTitle.style.background = 'var(--heading-gradient)';
  modalTitle.style.webkitBackgroundClip = 'text';
  modalTitle.style.backgroundClip = 'text';
  modalTitle.style.color = 'transparent';
  
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'var(--text-primary)';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0';
  closeButton.style.lineHeight = '1';
  closeButton.style.opacity = '0.7';
  closeButton.style.transition = 'opacity 0.2s';
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.opacity = '1';
  });
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.opacity = '0.7';
  });
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
  });
  
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  
  // Create message content
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
  messageContent.style.borderRadius = '8px';
  messageContent.style.padding = '16px';
  messageContent.style.marginBottom = '20px';
  messageContent.style.fontSize = '16px';
  messageContent.style.lineHeight = '1.6';
  messageContent.style.color = 'var(--text-primary)';
  messageContent.textContent = message;
  
  // Create insights section
  const insightsSection = document.createElement('div');
  insightsSection.className = 'insights-section';
  
  const insightsTitle = document.createElement('h3');
  insightsTitle.textContent = 'Why This Works:';
  insightsTitle.style.fontSize = '18px';
  insightsTitle.style.marginBottom = '12px';
  insightsTitle.style.color = 'var(--accent-pink)';
  
  const insightsList = document.createElement('ul');
  insightsList.style.paddingLeft = '20px';
  insightsList.style.margin = '0';
  
  insights.forEach(insight => {
    const insightItem = document.createElement('li');
    insightItem.textContent = insight;
    insightItem.style.marginBottom = '8px';
    insightItem.style.color = 'var(--text-secondary)';
    insightsList.appendChild(insightItem);
  });
  
  insightsSection.appendChild(insightsTitle);
  insightsSection.appendChild(insightsList);
  
  // Create action buttons
  const actionButtons = document.createElement('div');
  actionButtons.style.display = 'flex';
  actionButtons.style.gap = '12px';
  actionButtons.style.marginTop = '24px';
  
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy to Clipboard';
  copyButton.style.background = 'var(--primary-gradient)';
  copyButton.style.border = 'none';
  copyButton.style.color = 'white';
  copyButton.style.padding = '10px 20px';
  copyButton.style.borderRadius = '8px';
  copyButton.style.cursor = 'pointer';
  copyButton.style.fontWeight = '500';
  copyButton.style.flex = '1';
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(message).then(() => {
      showAlert('Message copied to clipboard!', 'success');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      showAlert('Failed to copy message', 'error');
    });
  });
  
  const regenerateButton = document.createElement('button');
  regenerateButton.textContent = 'Create Another';
  regenerateButton.style.background = 'rgba(255, 255, 255, 0.1)';
  regenerateButton.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  regenerateButton.style.color = 'var(--text-primary)';
  regenerateButton.style.padding = '10px 20px';
  regenerateButton.style.borderRadius = '8px';
  regenerateButton.style.cursor = 'pointer';
  regenerateButton.style.fontWeight = '500';
  regenerateButton.style.flex = '1';
  regenerateButton.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
    // Scroll to templates section
    const templatesSection = document.getElementById('templates-section');
    if (templatesSection) {
      templatesSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  actionButtons.appendChild(copyButton);
  actionButtons.appendChild(regenerateButton);
  
  // Assemble the modal
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(messageContent);
  modalContent.appendChild(insightsSection);
  modalContent.appendChild(actionButtons);
  
  modalOverlay.appendChild(modalContent);
  
  // Add to body
  document.body.appendChild(modalOverlay);
  
  // Save to history if user is logged in
  if (currentUser) {
    saveMessageToHistory(templateType, message);
  }
}

// Function to save message to user's history
function saveMessageToHistory(templateType, content) {
  if (!currentUser) return;
  
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('messages')
    .add({
      templateType: templateType,
      content: content,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log('Message saved to history');
      // Refresh the message history
      loadUserMessages();
    })
    .catch(error => {
      console.error('Error saving message:', error);
    });
}

// Function to show a simple feedback form
function showFeedbackForm() {
  // Create modal container
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100%';
  modalOverlay.style.height = '100%';
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '1000';
  modalOverlay.style.backdropFilter = 'blur(5px)';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  modalContent.style.backgroundColor = 'var(--card-bg)';
  modalContent.style.borderRadius = '12px';
  modalContent.style.padding = '24px';
  modalContent.style.maxWidth = '500px';
  modalContent.style.width = '90%';
  modalContent.style.maxHeight = '90vh';
  modalContent.style.overflowY = 'auto';
  modalContent.style.boxShadow = 'var(--card-shadow)';
  modalContent.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  
  // Create header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '20px';
  
  const title = document.createElement('h2');
  title.textContent = 'Submit Feedback';
  title.style.margin = '0';
  title.style.background = 'var(--heading-gradient)';
  title.style.webkitBackgroundClip = 'text';
  title.style.backgroundClip = 'text';
  title.style.color = 'transparent';
  
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'var(--text-primary)';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0';
  closeButton.style.lineHeight = '1';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
  });
  
  header.appendChild(title);
  header.appendChild(closeButton);
  
  // Create form
  const form = document.createElement('form');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '16px';
  
  const feedbackLabel = document.createElement('label');
  feedbackLabel.textContent = 'How can we improve HeartGlowAI?';
  feedbackLabel.style.color = 'var(--text-primary)';
  feedbackLabel.style.fontSize = '16px';
  feedbackLabel.style.fontWeight = '500';
  
  const feedbackTextarea = document.createElement('textarea');
  feedbackTextarea.placeholder = 'Share your thoughts, suggestions, or report issues...';
  feedbackTextarea.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
  feedbackTextarea.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  feedbackTextarea.style.borderRadius = '8px';
  feedbackTextarea.style.padding = '12px';
  feedbackTextarea.style.color = 'var(--text-primary)';
  feedbackTextarea.style.fontSize = '14px';
  feedbackTextarea.style.minHeight = '120px';
  feedbackTextarea.style.resize = 'vertical';
  
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Submit Feedback';
  submitButton.type = 'submit';
  submitButton.style.background = 'var(--primary-gradient)';
  submitButton.style.border = 'none';
  submitButton.style.color = 'white';
  submitButton.style.padding = '12px';
  submitButton.style.borderRadius = '8px';
  submitButton.style.cursor = 'pointer';
  submitButton.style.fontWeight = '500';
  submitButton.style.marginTop = '8px';
  
  form.appendChild(feedbackLabel);
  form.appendChild(feedbackTextarea);
  form.appendChild(submitButton);
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!feedbackTextarea.value.trim()) {
      showAlert('Please enter your feedback before submitting', 'error');
      return;
    }
    
    // Here you would typically send the feedback to your server
    // For now, we'll just show a success message
    showAlert('Thank you for your feedback!', 'success');
    document.body.removeChild(modalOverlay);
    
    // If user is logged in, save feedback to their profile
    if (currentUser) {
      firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .collection('feedback')
        .add({
          content: feedbackTextarea.value.trim(),
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          console.log('Feedback saved to user profile');
        })
        .catch(error => {
          console.error('Error saving feedback:', error);
        });
    }
  });
  
  modalContent.appendChild(header);
  modalContent.appendChild(form);
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
} 