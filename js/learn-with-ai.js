// Learn with AI functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize research topic cards
  initializeResearchCards();
  
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
  
  // Create research cards that use Perplexity for different topics
  function initializeResearchCards() {
    // Define the research topics with prompts and metadata
    const researchTopics = [
      {
        id: 'boundaries',
        title: 'Tell me about healthy boundaries in relationships',
        description: 'What boundaries are, how to set them, and examples or language you can use.',
        category: 'Relationships',
        icon: '💬',
        prompt: 'Provide a comprehensive guide on healthy boundaries in relationships. Include: 1) What boundaries are and why they matter, 2) How to identify when boundaries are needed, 3) Specific examples of healthy boundaries, 4) Practical phrases and language to use when setting boundaries, and 5) How to maintain boundaries once established. Include evidence-based research and cite relevant psychological sources.'
      },
      {
        id: 'emotional-intimacy',
        title: 'Tell me about emotional intimacy',
        description: 'Understanding emotional intimacy and how to build it.',
        category: 'Psychology',
        icon: '❤️',
        prompt: 'Explain emotional intimacy in relationships in detail. Cover: 1) The definition and components of emotional intimacy, 2) The psychological basis for emotional connection, 3) Practical steps to build emotional intimacy, 4) Common barriers to emotional intimacy and how to overcome them, 5) The difference between emotional and physical intimacy. Include research from relationship psychology studies and cite relevant sources.'
      },
      {
        id: 'stonewalling',
        title: 'What is stonewalling?',
        description: 'Explaining stonewalling and how to deal with it.',
        category: 'Conflict',
        icon: '🚫',
        prompt: 'Provide a detailed explanation of stonewalling in relationships. Include: 1) Definition and identifying behaviors, 2) Psychological mechanisms behind stonewalling, 3) Its effects on relationships according to research, 4) How to recognize when you or your partner is stonewalling, 5) Evidence-based strategies to address and prevent stonewalling. Cite relevant research, especially from Gottman\'s work and other relationship studies.'
      },
      {
        id: 'attachment-styles',
        title: 'Explain attachment styles',
        description: 'The four attachment styles and how they affect relationships.',
        category: 'Psychology',
        icon: '📋',
        prompt: 'Provide a comprehensive explanation of attachment styles and their impact on adult relationships. Include: 1) The four main attachment styles (secure, anxious, avoidant, and disorganized), 2) How each attachment style typically behaves in relationships, 3) The psychological origins of attachment styles, 4) How to identify your own attachment style, 5) Evidence-based strategies for developing more secure attachment patterns. Cite relevant research from attachment theory and modern psychology studies.'
      },
      {
        id: 'express-needs',
        title: 'How do I express needs clearly?',
        description: 'Strategies for expressing your needs and wants effectively.',
        category: 'Communication',
        icon: '🔊',
        prompt: 'Provide a detailed guide on how to express personal needs clearly and effectively in relationships. Include: 1) The psychology of needs expression, 2) Common barriers to expressing needs, 3) Specific language templates and examples for expressing different types of needs, 4) How to express needs without triggering defensiveness, 5) How to handle rejection of expressed needs. Base your response on communication research and psychological studies, with proper citations.'
      },
      {
        id: 'meaningful-apology',
        title: 'What makes an apology meaningful?',
        description: 'The key elements of an effective apology and common pitfalls to avoid.',
        category: 'Conflict Resolution',
        icon: '👋',
        prompt: 'Explain what makes an apology truly meaningful and effective. Include: 1) The essential components of an effective apology based on research, 2) Common pitfalls and non-apologies to avoid, 3) The psychological impact of proper apologies on relationships, 4) Cultural differences in apology expectations, 5) Specific examples and templates for different situations requiring apologies. Cite relevant psychological research and relationship studies.'
      }
    ];
    
    // Set up click handlers for all research topic cards
    researchTopics.forEach(topic => {
      const card = document.getElementById(topic.id);
      if (card) {
        card.addEventListener('click', () => handleTopicCardClick(topic));
      } else {
        // If explicit IDs aren't set, try to find by title
        const possibleCards = document.querySelectorAll('.research-card, .topic-card, .learning-card');
        possibleCards.forEach(possibleCard => {
          const titleElement = possibleCard.querySelector('h3, h4, .card-title');
          if (titleElement && titleElement.textContent.includes(topic.title)) {
            possibleCard.addEventListener('click', () => handleTopicCardClick(topic));
          }
        });
      }
    });
    
    // Add click handler for the Browse All Topics button
    const browseAllButton = document.querySelector('button:contains("Browse All Topics")') || 
                           document.querySelector('[class*="browse"],[id*="browse"]') ||
                           document.querySelector('a:contains("Browse")');
    
    if (browseAllButton) {
      browseAllButton.addEventListener('click', showAllTopics);
    }
    
    // Handle research card clicks - using event delegation as a fallback
    document.addEventListener('click', function(e) {
      if (!e.target) return;
      
      // Check if click is on a research card or its child
      const card = e.target.closest('.research-card, .topic-card, .learning-card');
      if (!card) return;
      
      // Find which topic this is
      const cardTitle = card.querySelector('h3, h4, .card-title')?.textContent;
      if (!cardTitle) return;
      
      const matchedTopic = researchTopics.find(topic => 
        cardTitle.includes(topic.title) || topic.title.includes(cardTitle)
      );
      
      if (matchedTopic) {
        handleTopicCardClick(matchedTopic);
      }
    });
  }
  
  // Handle a research topic card click
  async function handleTopicCardClick(topic) {
    console.log(`Research topic clicked: ${topic.title}`);
    
    // Create or get the research results container
    let resultsContainer = document.getElementById('research-results-container');
    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.id = 'research-results-container';
      resultsContainer.className = 'research-results-container';
      document.querySelector('#learning-screen .dashboard-container').appendChild(resultsContainer);
    }
    
    // Show the results container with a loading message
    resultsContainer.innerHTML = `
      <div class="research-results-header">
        <h2>${topic.title}</h2>
        <span class="research-category">${topic.category}</span>
        <button class="close-results-btn">&times;</button>
      </div>
      <div class="research-results-content">
        <div class="research-loading">
          <div class="perplexity-spinner"></div>
          <p>Researching ${topic.title.toLowerCase()}...</p>
        </div>
      </div>
    `;
    resultsContainer.style.display = 'block';
    
    // Add close button functionality
    const closeBtn = resultsContainer.querySelector('.close-results-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        resultsContainer.style.display = 'none';
      });
    }
    
    // Get the content container where we'll put the research results
    const contentContainer = resultsContainer.querySelector('.research-results-content');
    
    try {
      // Call the Perplexity API using our handler
      if (window.perplexityHandler && typeof window.perplexityHandler.research === 'function') {
        // Use the enhanced perplexity handler
        await window.perplexityHandler.research(topic.prompt, contentContainer);
      } else {
        // Fallback to basic API call
        const apiKey = await getApiKey();
        const result = await callDirectAPI(apiKey, topic.prompt);
        
        if (result && result.choices && result.choices[0]) {
          contentContainer.innerHTML = `<div class="research-response">${result.choices[0].message.content.replace(/\n/g, '<br>')}</div>`;
        } else {
          throw new Error('Invalid response from AI service');
        }
      }
      
      // Scroll to the results container
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
    } catch (error) {
      console.error(`Research error for topic "${topic.title}":`, error);
      contentContainer.innerHTML = `
        <div class="research-error">
          <h3>Research Error</h3>
          <p>${error.message || 'Failed to retrieve research on this topic'}</p>
          <button class="retry-btn">Try Again</button>
        </div>
      `;
      
      // Add retry button functionality
      const retryBtn = contentContainer.querySelector('.retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => handleTopicCardClick(topic));
      }
    }
  }
  
  // Show all topics in a modal
  function showAllTopics() {
    // Implementation for the browse all topics functionality
    console.log("Browse All Topics clicked");
    // This could show a modal with all topics or expand the view
  }
  
  // Helper functions
  async function getApiKey() {
    // Use the perplexity handler if available
    if (window.perplexityHandler && typeof window.perplexityHandler.getApiKey === 'function') {
      return window.perplexityHandler.getApiKey();
    }
    
    // Fallback implementation
    const storedKey = localStorage.getItem('perplexity_api_key');
    if (storedKey) return storedKey;
    
    // If no key in storage, use a temporary demo key or ask the user
    return prompt('Enter your Perplexity API key (or use the demo key by leaving this blank)') || 'pplx-xxxxxxxx';
  }
  
  async function callDirectAPI(apiKey, promptText = 'What are the top 3 benefits of meditation?') {
    console.log('Calling Perplexity API directly');
    
    // Use the perplexity handler if available
    if (window.perplexityHandler && typeof window.perplexityHandler.call === 'function') {
      return window.perplexityHandler.call(promptText);
    }
    
    // Fallback implementation
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
          { role: 'user', content: promptText }
        ],
        temperature: 0.7,
        max_tokens: 800
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
    alert(`Error: ${message}`);
  }
}); 