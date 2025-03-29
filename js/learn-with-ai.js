// Learn with AI functionality
document.addEventListener('DOMContentLoaded', function() {
  const learnWithAiBtn = document.getElementById('learn-with-ai-btn');
  
  if (learnWithAiBtn) {
    console.log('Learn with AI button found - adding click handler');
    
    learnWithAiBtn.addEventListener('click', async function() {
      console.log('Learn with AI button clicked');
      // Show loading state
      const originalText = learnWithAiBtn.innerHTML;
      learnWithAiBtn.innerHTML = '<span class="btn-loading-spinner"></span> Connecting...';
      learnWithAiBtn.disabled = true;
      
      try {
        // Try to call Perplexity API without relying on shared functions
        const apiKey = await getApiKey();
        const result = await callDirectAPI(apiKey);
        
        if (result && result.choices && result.choices[0]) {
          // Create a modal to display the result
          showResponseModal(result.choices[0].message.content);
        } else {
          throw new Error('Invalid response from AI service');
        }
      } catch (error) {
        console.error('Learn with AI error:', error);
        showErrorAlert(error.message);
      } finally {
        // Restore button state
        learnWithAiBtn.innerHTML = originalText;
        learnWithAiBtn.disabled = false;
      }
    });
  } else {
    console.error('Learn with AI button not found in the DOM');
  }
  
  // Helper functions
  async function getApiKey() {
    // Try localStorage first
    const storedKey = localStorage.getItem('perplexity_api_key');
    if (storedKey) return storedKey;
    
    // If no key in storage, use a temporary demo key or ask the user
    return prompt('Enter your Perplexity API key (or use the demo key by leaving this blank)') || 'pplx-xxxxxxxx';
  }
  
  async function callDirectAPI(apiKey) {
    console.log('Calling Perplexity API directly');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-7b-instruct",
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'What are three effective communication strategies for difficult conversations?' }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }
    
    return await response.json();
  }
  
  function showResponseModal(content) {
    // Create overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
      background-color: #fff;
      border-radius: 12px;
      padding: 20px;
      max-width: 90%;
      max-height: 80%;
      overflow: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;
    
    // Add content
    modalContent.innerHTML = `
      <h2 style="color: #333; margin-top: 0;">Learn with AI</h2>
      <div style="margin-bottom: 20px; line-height: 1.6; color: #333;">${content.replace(/\n/g, '<br>')}</div>
      <button id="close-modal-btn" style="background: linear-gradient(135deg, #6e8efb, #a777e3); border: none; color: white; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">Close</button>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Close functionality
    document.getElementById('close-modal-btn').addEventListener('click', () => {
      document.body.removeChild(modalOverlay);
    });
    
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });
  }
  
  function showErrorAlert(message) {
    const alertEl = document.createElement('div');
    alertEl.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #f44336;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      text-align: center;
      max-width: 90%;
    `;
    
    alertEl.textContent = `AI Learning failed: ${message}`;
    document.body.appendChild(alertEl);
    
    setTimeout(() => {
      alertEl.style.opacity = '0';
      alertEl.style.transform = 'translateX(-50%) translateY(-20px)';
      alertEl.style.transition = 'all 0.3s ease-out';
      
      setTimeout(() => {
        document.body.removeChild(alertEl);
      }, 300);
    }, 5000);
  }
}); 