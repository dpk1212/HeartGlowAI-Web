/**
 * Message Result Page
 * Handles generation, display, and interaction with the final message
 */

// Global variables
let currentUser = null;
let recipientData = null;
let intentData = null;
let toneData = null;
let generatedMessage = null;
let messageInsights = null;
let selectedEmotion = null;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Message result page loaded, initializing...');
  
  // Get the selected emotion from localStorage
  selectedEmotion = localStorage.getItem('selectedEmotion') || 'default';
  console.log('Selected emotion:', selectedEmotion);
  
  // Load all necessary data from localStorage
  loadStoredData();
  
  // Check authentication status
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User authenticated:', user.uid);
      currentUser = user;
      initializeResultPage();
    } else {
      console.log('No user logged in, redirecting to login page');
      window.location.href = 'login.html';
    }
  });
});

// Load all stored data needed for message generation
function loadStoredData() {
  // Load recipient data
  try {
    const storedRecipientData = localStorage.getItem('recipientData');
    if (storedRecipientData) {
      recipientData = JSON.parse(storedRecipientData);
      console.log('Loaded recipient data:', recipientData);
      updateRecipientInfo();
    } else {
      console.error('No recipient data found');
    }
  } catch (error) {
    console.error('Error parsing recipient data:', error);
  }
  
  // Load intent data
  try {
    const storedIntentData = localStorage.getItem('intentData');
    if (storedIntentData) {
      intentData = JSON.parse(storedIntentData);
      console.log('Loaded intent data:', intentData);
    } else {
      console.error('No intent data found');
    }
  } catch (error) {
    console.error('Error parsing intent data:', error);
  }
  
  // Load tone data
  try {
    const storedToneData = localStorage.getItem('toneData');
    if (storedToneData) {
      toneData = JSON.parse(storedToneData);
      console.log('Loaded tone data:', toneData);
    } else {
      console.error('No tone data found');
    }
  } catch (error) {
    console.error('Error parsing tone data:', error);
  }
}

// Initialize the message result page
function initializeResultPage() {
  console.log('Initializing message result page');
  
  // Generate the message
  generateMessage();
  
  // Initialize action buttons (copy, edit, regenerate, save)
  initializeActionButtons();
  
  // Initialize navigation buttons
  initNavigationButtons();
}

// Generate the message based on collected data
function generateMessage() {
  // Check if we have all required data
  if (!recipientData || !intentData || !toneData) {
    showError('Unable to generate message: Missing required data');
    return;
  }
  
  // First, select a message template based on intent and relationship
  const messageTemplate = selectMessageTemplate();
  
  // Generate the message with simulated delay for better UX
  setTimeout(() => {
    // Apply recipient name, intent, tone, and additional notes to template
    generatedMessage = personalizeTemplate(messageTemplate);
    
    // Set tone display
    updateToneDisplay();
    
    // Hide loading state and show the message
    document.getElementById('loading-container').style.display = 'none';
    document.getElementById('message-card').style.display = 'block';
    document.getElementById('action-buttons').style.display = 'grid';
    document.getElementById('insights-section').style.display = 'block';
    document.getElementById('next-steps').style.display = 'flex';
    
    // Display the message with a typewriter effect
    const messageElement = document.getElementById('message-text');
    if (messageElement) {
      messageElement.textContent = generatedMessage;
    }
    
    // Generate and display message insights
    generateInsights();
    
    // Save the message to history
    saveMessageToHistory();
  }, 2000); // 2 second delay for loading effect
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
  
  if (recipientRelationElement && recipientData.relationship) {
    recipientRelationElement.textContent = capitalizeFirstLetter(recipientData.relationship);
  }
  
  if (recipientAvatarElement) {
    recipientAvatarElement.textContent = getInitials(recipientData.name);
  }
}

// Update the tone display
function updateToneDisplay() {
  if (!toneData) return;
  
  const tonePillElement = document.getElementById('message-tone');
  if (tonePillElement) {
    let intensityText = 'Medium';
    
    switch (toneData.intensity) {
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
    
    tonePillElement.textContent = `${capitalizeFirstLetter(toneData.tone)} • ${intensityText}`;
  }
}

// Initialize action buttons
function initializeActionButtons() {
  // Copy button
  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      copyMessageToClipboard();
    });
  }
  
  // Edit button
  const editBtn = document.getElementById('edit-btn');
  const editTextarea = document.getElementById('edit-textarea');
  const editButtons = document.getElementById('edit-buttons');
  const messageText = document.getElementById('message-text');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const saveEditBtn = document.getElementById('save-edit-btn');
  
  if (editBtn && editTextarea && editButtons && messageText) {
    editBtn.addEventListener('click', function() {
      // Show edit mode
      messageText.style.display = 'none';
      editTextarea.style.display = 'block';
      editButtons.style.display = 'flex';
      
      // Set textarea value to current message
      editTextarea.value = messageText.textContent;
      editTextarea.focus();
    });
    
    // Cancel edit button
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', function() {
        // Hide edit mode
        messageText.style.display = 'block';
        editTextarea.style.display = 'none';
        editButtons.style.display = 'none';
      });
    }
    
    // Save edit button
    if (saveEditBtn) {
      saveEditBtn.addEventListener('click', function() {
        // Update message text
        const editedMessage = editTextarea.value.trim();
        if (editedMessage) {
          messageText.textContent = editedMessage;
          generatedMessage = editedMessage;
          
          // Save edited message to history
          updateMessageInHistory(editedMessage);
        }
        
        // Hide edit mode
        messageText.style.display = 'block';
        editTextarea.style.display = 'none';
        editButtons.style.display = 'none';
        
        // Show success message
        showAlert('Message updated successfully!', 'success');
      });
    }
  }
  
  // Regenerate button
  const regenerateBtn = document.getElementById('regenerate-btn');
  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', function() {
      regenerateMessage();
    });
  }
  
  // Save button
  const saveBtn = document.getElementById('save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      // The message is already saved to history on generation
      // So we just show a confirmation
      showAlert('Message saved to your history!', 'success');
      
      // Update button to show it's saved
      saveBtn.querySelector('.action-label').textContent = 'Saved';
      saveBtn.querySelector('.action-description').textContent = 'Stored in your history';
      saveBtn.querySelector('.action-icon i').className = 'fas fa-check';
    });
  }
  
  // Home button
  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', function() {
      window.location.href = 'home.html';
    });
  }
  
  // New message button
  const newMessageBtn = document.getElementById('new-message-btn');
  if (newMessageBtn) {
    newMessageBtn.addEventListener('click', function() {
      window.location.href = 'emotional-entry.html';
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
}

// Copy message to clipboard
function copyMessageToClipboard() {
  if (!generatedMessage) return;
  
  navigator.clipboard.writeText(generatedMessage)
    .then(() => {
      showAlert('Message copied to clipboard!', 'success');
    })
    .catch(err => {
      console.error('Error copying to clipboard:', err);
      showAlert('Failed to copy message.', 'error');
    });
}

// Regenerate message with different wording
function regenerateMessage() {
  // Show loading state
  document.getElementById('message-text').style.opacity = '0.5';
  
  // Simulated delay for better UX
  setTimeout(() => {
    // Re-select a template and personalize it
    const newTemplate = selectMessageTemplate(true); // Force different template
    const newMessage = personalizeTemplate(newTemplate);
    generatedMessage = newMessage;
    
    // Update the UI with the new message
    const messageElement = document.getElementById('message-text');
    if (messageElement) {
      messageElement.style.opacity = '1';
      messageElement.textContent = newMessage;
    }
    
    // Update insights for the new message
    generateInsights();
    
    // Update in history
    updateMessageInHistory(newMessage);
    
    // Show success message
    showAlert('Message regenerated with a fresh perspective!', 'success');
  }, 1000);
}

// Save message to user's history in Firestore
function saveMessageToHistory() {
  if (!currentUser || !generatedMessage || !recipientData) return;
  
  // Prepare message data
  const messageData = {
    content: generatedMessage,
    recipientName: recipientData.name,
    recipientId: recipientData.id || null,
    relationship: recipientData.relationship || null,
    intent: intentData ? intentData.type : null,
    tone: toneData ? toneData.tone : null,
    intensity: toneData ? toneData.intensity : 3,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    insights: messageInsights || []
  };
  
  // Save to Firestore
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('messages')
    .add(messageData)
    .then((docRef) => {
      console.log('Message saved to history with ID:', docRef.id);
      // Store the message ID in local storage for potential updates
      localStorage.setItem('lastMessageId', docRef.id);
    })
    .catch((error) => {
      console.error('Error saving message to history:', error);
    });
}

// Update an existing message in history
function updateMessageInHistory(updatedMessage) {
  if (!currentUser || !updatedMessage) return;
  
  // Get the message ID from localStorage
  const messageId = localStorage.getItem('lastMessageId');
  if (!messageId) return;
  
  // Update in Firestore
  firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('messages')
    .doc(messageId)
    .update({
      content: updatedMessage,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log('Message updated in history');
    })
    .catch((error) => {
      console.error('Error updating message in history:', error);
    });
}

// Generate insights about the message
function generateInsights() {
  // Generate insights based on intent, tone, and relationship
  messageInsights = [];
  
  // Add common insight about emotional honesty
  messageInsights.push('Reflects emotional honesty without overwhelming the recipient');
  
  // Add intent-specific insights
  if (intentData) {
    switch (intentData.type) {
      case 'care':
        messageInsights.push('Expresses genuine care while respecting boundaries');
        messageInsights.push('Balances vulnerability with emotional space for the recipient');
        break;
      case 'apologize':
        messageInsights.push('Takes responsibility without making excuses');
        messageInsights.push('Avoids putting emotional burden on the recipient');
        break;
      case 'gratitude':
        messageInsights.push('Includes specific appreciation rather than generic thanks');
        messageInsights.push('Acknowledges their impact on you in a meaningful way');
        break;
      case 'reconnect':
        messageInsights.push('Opens the door for connection without pressure');
        messageInsights.push('Acknowledges the passage of time without dwelling on it');
        break;
      case 'custom':
        messageInsights.push('Communicates your personal thoughts in an authentic way');
        messageInsights.push('Creates space for the relationship to evolve naturally');
        break;
    }
  }
  
  // Add tone-specific insights
  if (toneData) {
    switch (toneData.tone) {
      case 'gentle':
        messageInsights.push('Uses a gentle tone that invites without demanding');
        break;
      case 'encouraging':
        messageInsights.push('Offers encouragement that uplifts without pressuring');
        break;
      case 'honest':
        messageInsights.push('Communicates with clarity and directness while maintaining warmth');
        break;
      case 'warm':
        messageInsights.push('Creates a feeling of emotional closeness and comfort');
        break;
      case 'vulnerable':
        messageInsights.push('Shows authentic vulnerability which builds trust');
        break;
    }
  }
  
  // Display insights
  displayInsights(messageInsights);
}

// Display insights in the UI
function displayInsights(insights) {
  const insightsList = document.getElementById('insights-list');
  
  if (insightsList) {
    insightsList.innerHTML = ''; // Clear any existing insights
    
    insights.forEach(insight => {
      const li = document.createElement('li');
      li.className = 'insight-item';
      li.innerHTML = `
        <div class="insight-bullet">●</div>
        <div class="insight-text">${insight}</div>
      `;
      insightsList.appendChild(li);
    });
  }
}

// Select an appropriate message template based on context
function selectMessageTemplate(forceAlternative = false) {
  // This is a simplified version - in production you'd likely have a more robust algorithm
  // or integrate with an AI service
  
  // Default templates for different intents
  let templates = {
    care: [
      "I've been thinking about you lately, {{name}}. Our last conversation has really stayed with me, and I wanted to reach out to let you know how much your perspective means to me. There's something special about the way you see the world that always helps me gain clarity.",
      "{{name}}, I wanted to take a moment to tell you that you've been on my mind. I value our connection and the way you always bring such thoughtfulness to our conversations. I hope you know how much I appreciate having you in my life.",
      "The other day something reminded me of you, {{name}}, and I realized I hadn't expressed how much I care about our relationship. I'm grateful for the space we create together and wanted you to know that you make a difference in my life."
    ],
    apologize: [
      "{{name}}, I've been reflecting on our last interaction, and I realize I wasn't at my best. I want to sincerely apologize for how I handled things. You deserve better, and I'm committed to making it right and learning from this moment.",
      "I owe you an apology, {{name}}. I've had time to think about what happened, and I understand now how my actions affected you. I'm truly sorry, and I want you to know that I value our relationship too much to let this stand between us.",
      "{{name}}, I wanted to reach out because I've been thinking about how I responded to you recently. I was wrong, and I'm sorry. Your feelings are important to me, and I hope we can move forward with better understanding."
    ],
    gratitude: [
      "{{name}}, I've been meaning to express my gratitude for everything you've done. Your support during these past few months has meant more than you know. The way you listened and offered perspective helped me find my way through a difficult time.",
      "I wanted to take a moment to thank you, {{name}}. Your thoughtfulness and generosity have made such a difference in my life. I especially appreciate how you always show up with such authenticity and care.",
      "{{name}}, I'm not sure if I've properly expressed how thankful I am for your presence in my life. The way you've supported me, especially with your wisdom and patience, has been a true gift that I don't take for granted."
    ],
    reconnect: [
      "{{name}}, it's been a while since we last connected, and I've missed our conversations. I've been thinking about you and wondering how you've been. I'd love to catch up whenever you have time - no pressure, just wanted to reach out and say hello.",
      "I realized today how much time has passed since we last spoke, {{name}}. So many things have happened that I'd love to share with you, and I'm curious about your journey too. I hope this message finds you well, and I'd be happy to reconnect.",
      "{{name}}, I know it's been some time since we've been in touch. Life has a way of moving quickly, but you've stayed in my thoughts. I value our connection and would love to rebuild it if you're open to that. How have you been?"
    ],
    custom: [
      "{{name}}, I wanted to reach out and share what's been on my mind. Our connection is important to me, and I believe in the value of expressing what matters. I hope this message finds you well and open to continuing our relationship in a meaningful way.",
      "I've been reflecting on our relationship lately, {{name}}, and felt compelled to reach out. Sometimes the most important things are the hardest to say, but I wanted to make the effort because you matter to me. I hope we can continue to grow our understanding of each other.",
      "{{name}}, sometimes words feel inadequate for expressing what's in our hearts, but I wanted to try anyway. Our connection has its own unique meaning to me, and I hope this message conveys the authenticity of my feelings."
    ]
  };
  
  // Determine which intent to use
  const intent = intentData ? intentData.type : 'custom';
  
  // If it's a custom intent with specific text, use that as guidance
  if (intent === 'custom' && intentData && intentData.customText) {
    // In a real implementation, you might pass the custom text to an AI service
    // For now, we'll just use it to select from custom templates
  }
  
  // Get the appropriate templates for the intent
  const intentTemplates = templates[intent] || templates.custom;
  
  // Select a random template from the available ones
  // If forceAlternative is true, choose a different one than before
  let selectedTemplate;
  
  if (forceAlternative && generatedMessage) {
    // Find available templates that don't match the current message
    const availableTemplates = intentTemplates.filter(template => {
      const tempMessage = personalizeTemplate(template);
      return tempMessage !== generatedMessage;
    });
    
    // Select a random template from available ones
    const randomIndex = Math.floor(Math.random() * availableTemplates.length);
    selectedTemplate = availableTemplates[randomIndex] || intentTemplates[0];
  } else {
    // Just select a random template
    const randomIndex = Math.floor(Math.random() * intentTemplates.length);
    selectedTemplate = intentTemplates[randomIndex];
  }
  
  return selectedTemplate;
}

// Personalize a template with recipient name and other details
function personalizeTemplate(template) {
  if (!template) return '';
  
  // Replace recipient name
  let personalizedMessage = template.replace(/{{name}}/g, recipientData.name);
  
  // Add additional notes if provided
  if (toneData && toneData.additionalNotes) {
    const additionalNotesText = toneData.additionalNotes.trim();
    if (additionalNotesText) {
      // Check if additional notes make sense in the context of the message
      if (!personalizedMessage.toLowerCase().includes(additionalNotesText.toLowerCase())) {
        const noteReference = getContextualReference(additionalNotesText);
        personalizedMessage += ` ${noteReference}`;
      }
    }
  }
  
  // Adjust tone based on intensity
  if (toneData) {
    personalizedMessage = adjustMessageTone(personalizedMessage, toneData.tone, toneData.intensity);
  }
  
  return personalizedMessage;
}

// Get contextual reference for additional notes
function getContextualReference(notes) {
  const referenceStarters = [
    "I was also thinking about",
    "I've been meaning to mention",
    "By the way,",
    "On another note,",
    "I'd also like to share that"
  ];
  
  const randomIndex = Math.floor(Math.random() * referenceStarters.length);
  return `${referenceStarters[randomIndex]} ${notes}`;
}

// Adjust message tone based on selected tone and intensity
function adjustMessageTone(message, tone, intensity) {
  // This is a simplified implementation
  // In production, you might use NLP or AI services to adjust tone more precisely
  
  // For now, we'll focus on adjusting a few characteristics:
  // 1. Sentence length and complexity
  // 2. Emotional words and phrases
  
  let adjustedMessage = message;
  
  // Adjust based on intensity (1-5 scale)
  if (intensity <= 2) {
    // Softer intensity: more tentative, less direct
    adjustedMessage = adjustedMessage
      .replace(/I feel strongly/g, 'I think')
      .replace(/I know/g, 'I believe')
      .replace(/definitely/g, 'perhaps')
      .replace(/always/g, 'often')
      .replace(/so much/g, 'quite a bit')
      .replace(/very/g, 'somewhat');
  } else if (intensity >= 4) {
    // Stronger intensity: more direct, more emphatic
    adjustedMessage = adjustedMessage
      .replace(/I think/g, 'I feel strongly')
      .replace(/I believe/g, 'I know')
      .replace(/perhaps/g, 'definitely')
      .replace(/sometimes/g, 'consistently')
      .replace(/a bit/g, 'so much')
      .replace(/somewhat/g, 'very');
  }
  
  // Adjust based on tone
  switch (tone) {
    case 'gentle':
      adjustedMessage = adjustedMessage
        .replace(/demanding/g, 'asking')
        .replace(/need/g, 'appreciate')
        .replace(/must/g, 'might consider');
      break;
    case 'encouraging':
      adjustedMessage = adjustedMessage
        .replace(/difficult/g, 'challenging')
        .replace(/problem/g, 'opportunity')
        .replace(/worried/g, 'concerned');
      break;
    case 'honest':
      adjustedMessage = adjustedMessage
        .replace(/perhaps/g, 'truthfully')
        .replace(/might/g, 'will')
        .replace(/kind of/g, 'definitely');
      break;
    case 'warm':
      adjustedMessage = adjustedMessage
        .replace(/think/g, 'feel')
        .replace(/know/g, 'sense')
        .replace(/appreciate/g, 'cherish');
      break;
    case 'vulnerable':
      adjustedMessage = adjustedMessage
        .replace(/feel/g, 'feel deeply')
        .replace(/important/g, 'meaningful to me')
        .replace(/like/g, 'love');
      break;
  }
  
  return adjustedMessage;
}

// Show error message when something goes wrong
function showError(message) {
  // Hide loading container
  const loadingContainer = document.getElementById('loading-container');
  if (loadingContainer) {
    loadingContainer.innerHTML = `
      <div style="text-align: center;">
        <i class="fas fa-exclamation-circle" style="font-size: 40px; color: #ff6b9d; margin-bottom: 20px;"></i>
        <div style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">Something went wrong</div>
        <div style="color: var(--text-secondary); margin-bottom: 20px;">${message}</div>
        <button id="error-home-btn" class="btn btn-home" style="margin: 0 auto; display: inline-block;">
          Return to Dashboard
        </button>
      </div>
    `;
    
    // Add event listener to the button
    setTimeout(() => {
      const errorHomeBtn = document.getElementById('error-home-btn');
      if (errorHomeBtn) {
        errorHomeBtn.addEventListener('click', function() {
          window.location.href = 'home.html';
        });
      }
    }, 0);
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