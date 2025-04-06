// Global variable to store currently viewed message ID
let currentMessageId = null;

function viewMessage(messageId) {
    // Get the message data
    const message = savedMessages.find(m => m.id === messageId);
    if (!message) {
        console.error('Message not found');
        return;
    }

    // Store the current message ID
    currentMessageId = messageId;

    // Log the message data for debugging
    console.log('Viewing message:', message);

    // Set up the modal
    const modal = document.getElementById('message-view-modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Clear previous content
    document.getElementById('message-recipient-display').textContent = message.recipientName || 'Unknown Recipient';
    document.getElementById('message-intent-display').textContent = message.intent || 'Not specified';
    document.getElementById('message-tone-display').textContent = message.tone || 'Not specified';
    document.getElementById('message-date-display').textContent = formatDate(message.timestamp);
    
    // Apply appropriate color class based on message type
    let borderColor = '#8a57de'; // Default purple
    if (message.intent) {
        const intent = message.intent.toLowerCase();
        if (intent.includes('romantic') || intent.includes('love')) {
            borderColor = '#f06292'; // Pink for romantic
        } else if (intent.includes('professional') || intent.includes('business')) {
            borderColor = '#4fc3f7'; // Blue for professional
        } else if (intent.includes('friendly') || intent.includes('casual')) {
            borderColor = '#66bb6a'; // Green for friendly/casual
        }
    }
    document.getElementById('message-content-container').style.borderLeftColor = borderColor;
    
    // Display the message content
    const messageDisplay = document.getElementById('message-content-display');
    messageDisplay.textContent = message.content || 'No message content available';
    
    // Display insights if available
    const insightsList = document.getElementById('message-insights-list');
    insightsList.innerHTML = '';
    const insightsContainer = document.getElementById('message-insights-container');
    
    if (message.insights && message.insights.length > 0) {
        message.insights.forEach(insight => {
            const li = document.createElement('li');
            li.textContent = insight;
            insightsList.appendChild(li);
        });
        insightsContainer.style.display = 'block';
    } else {
        insightsContainer.style.display = 'none';
    }
    
    // Show the modal
    modal.classList.add('show');
    document.body.classList.add('modal-open');
}

// Function to copy the message content to clipboard
function copyMessage() {
    if (!currentMessageId) return;
    
    const message = savedMessages.find(m => m.id === currentMessageId);
    if (!message) return;
    
    const content = message.content;
    
    // Create temporary textarea to copy from
    const textarea = document.createElement('textarea');
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            // Show success feedback
            const copyBtn = document.querySelector('.copy-action');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        }
    } catch (err) {
        console.error('Unable to copy message', err);
    }
    
    document.body.removeChild(textarea);
}

// Function to navigate to message edit page
function editMessage() {
    if (!currentMessageId) return;
    
    // Navigate to edit page or open edit modal
    // This will depend on your application's structure
    window.location.href = `message-edit.html?id=${currentMessageId}`;
}

// Function to confirm message deletion
function confirmDeleteMessage() {
    if (!currentMessageId) return;
    
    if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
        deleteMessage(currentMessageId);
    }
}

// Function to delete a message
function deleteMessage(messageId) {
    const index = savedMessages.findIndex(m => m.id === messageId);
    if (index === -1) return;
    
    // Remove from array
    savedMessages.splice(index, 1);
    
    // Update local storage
    localStorage.setItem('savedMessages', JSON.stringify(savedMessages));
    
    // Close the modal
    closeMessageModal();
    
    // Refresh the messages list
    displaySavedMessages();
    
    // Show feedback
    showNotification('Message deleted successfully', 'success');
}

// Function to close the message modal
function closeMessageModal() {
    const modal = document.getElementById('message-view-modal');
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
    currentMessageId = null;
}

// Event listener for close button and backdrop
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when the close button is clicked
    const closeButtons = document.querySelectorAll('[data-dismiss="modal"]');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeMessageModal);
    });
    
    // Close modal when clicking outside the modal content
    document.getElementById('message-view-modal').addEventListener('click', function(event) {
        if (event.target === this) {
            closeMessageModal();
        }
    });
});

// Simple notification function
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification style and content
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
} 