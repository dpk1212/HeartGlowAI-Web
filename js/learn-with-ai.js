// Learn with AI functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize topic cards
  initializeTopicCards();
  
  // Set up the explore topics button
  const exploreTopicsBtn = document.getElementById('explore-topics-btn');
  if (exploreTopicsBtn) {
    exploreTopicsBtn.addEventListener('click', function() {
      // Smooth scroll to the topics grid
      const topicsGrid = document.querySelector('.topics-grid');
      if (topicsGrid) {
        topicsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  
  // Set up the custom question submission
  const submitQuestionBtn = document.getElementById('submit-question-btn');
  const customQuestionInput = document.getElementById('custom-question-input');
  
  if (submitQuestionBtn && customQuestionInput) {
    submitQuestionBtn.addEventListener('click', function() {
      const question = customQuestionInput.value.trim();
      if (question) {
        handleCustomQuestion(question);
      } else {
        // Show validation message
        customQuestionInput.classList.add('error');
        setTimeout(() => {
          customQuestionInput.classList.remove('error');
        }, 2000);
      }
    });

    // Also enable pressing Enter to submit
    customQuestionInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const question = this.value.trim();
        if (question) {
          handleCustomQuestion(question);
        }
      }
    });
  }
  
  // Handle back to topics button
  const backToTopicsBtn = document.getElementById('back-to-topics-btn');
  if (backToTopicsBtn) {
    backToTopicsBtn.addEventListener('click', function() {
      const resultsContainer = document.getElementById('research-results-container');
      if (resultsContainer) {
        resultsContainer.style.display = 'none';
      }
    });
  }
  
  // Handle close results button (X button)
  const closeResultsBtn = document.querySelector('.close-results-btn');
  if (closeResultsBtn) {
    closeResultsBtn.addEventListener('click', function() {
      const resultsContainer = document.getElementById('research-results-container');
      if (resultsContainer) {
        resultsContainer.style.display = 'none';
      }
    });
  }
  
  // Set up copy results button
  const copyResultsBtn = document.getElementById('copy-results-btn');
  if (copyResultsBtn) {
    copyResultsBtn.addEventListener('click', function() {
      const responseContent = document.querySelector('.response-content');
      if (responseContent) {
        // Create a temporary element to hold the text without HTML tags
        const tempElement = document.createElement('div');
        tempElement.innerHTML = responseContent.innerHTML;
        const textContent = tempElement.textContent || tempElement.innerText;
        
        navigator.clipboard.writeText(textContent).then(() => {
          // Show success indication
          copyResultsBtn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            copyResultsBtn.innerHTML = '<i class="fas fa-copy"></i>';
          }, 2000);
        }).catch(err => {
          console.error('Failed to copy text: ', err);
        });
      }
    });
  }
  
  // Set up share results button
  const shareResultsBtn = document.getElementById('share-results-btn');
  if (shareResultsBtn) {
    shareResultsBtn.addEventListener('click', function() {
      const title = document.querySelector('.research-results-header h2')?.textContent || 'Relationship Insights';
      const text = 'Check out this relationship insight from HeartGlowAI';
      const url = window.location.href;
      
      if (navigator.share) {
        navigator.share({
          title: title,
          text: text,
          url: url
        }).catch(err => {
          console.error('Share failed:', err);
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        prompt('Copy this link to share:', url);
      }
    });
  }
  
  // Initialize the topic cards with data attributes and click handlers
  function initializeTopicCards() {
    // Define the mapping between data-topic attributes and research prompts
    const topicPrompts = {
      'communication-styles': {
        title: 'Communication Styles in Relationships',
        category: 'Communication',
        prompt: 'Provide a comprehensive guide on communication styles in relationships. Include: 1) The main communication styles identified in research, 2) How to identify your own and your partner\'s communication style, 3) How different styles interact and potential challenges, 4) Evidence-based strategies for improving communication between different styles, 5) Practical exercises for developing better communication habits. Include research from psychology and relationship studies with proper citations.'
      },
      'conflict-resolution': {
        title: 'Effective Conflict Resolution',
        category: 'Conflict Management',
        prompt: 'Provide a detailed guide on healthy conflict resolution in relationships. Include: 1) Research-backed approaches to handling disagreements, 2) Common patterns that escalate conflicts, 3) Step-by-step process for resolving conflicts productively, 4) How to repair relationships after conflicts, 5) When and how to seek outside help. Draw on research from relationship psychology, particularly Gottman\'s work, and include citations from relevant studies.'
      },
      'attachment-theory': {
        title: 'Understanding Attachment Theory',
        category: 'Psychology',
        prompt: 'Explain attachment theory and its impact on adult relationships in detail. Include: 1) The origins and development of attachment theory, 2) The four main attachment styles (secure, anxious, avoidant, and disorganized/fearful), 3) How attachment styles affect relationship dynamics, 4) Ways to develop more secure attachment patterns, 5) How to navigate relationships with different attachment styles. Cite relevant research from Bowlby, Ainsworth, and contemporary attachment researchers.'
      },
      'emotional-intelligence': {
        title: 'Emotional Intelligence in Relationships',
        category: 'Psychology',
        prompt: 'Provide a comprehensive overview of emotional intelligence in relationships. Include: 1) Definition and components of emotional intelligence, 2) How emotional awareness affects relationship quality, 3) Techniques for developing greater emotional awareness, 4) Ways to respond to a partner\'s emotions effectively, 5) Evidence-based exercises for improving emotional intelligence as a couple. Cite relevant psychological research and studies on EQ in relationships.'
      },
      'love-languages': {
        title: 'The Five Love Languages',
        category: 'Relationships',
        prompt: 'Explain the concept of love languages in detail. Include: 1) The five love languages as described by Gary Chapman, 2) How to identify your own and your partner\'s love languages, 3) Common misunderstandings when partners have different love languages, 4) Practical ways to express love in each language, 5) Research on the effectiveness of the love languages framework. Include both supportive research and critiques of the concept, with proper citations.'
      },
      'relationship-boundaries': {
        title: 'Healthy Relationship Boundaries',
        category: 'Relationships',
        prompt: 'Provide a comprehensive guide on establishing and maintaining healthy boundaries in relationships. Include: 1) What boundaries are and why they\'re essential, 2) Different types of boundaries (emotional, physical, digital, etc.), 3) Signs of boundary violations, 4) How to communicate boundaries effectively, 5) Respecting others\' boundaries while maintaining your own. Include evidence-based approaches and cite relevant psychological research.'
      }
    };
    
    // Set up click handlers for all topic cards
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach(card => {
      card.addEventListener('click', function(e) {
        const topicId = this.getAttribute('data-topic');
        if (topicId && topicPrompts[topicId]) {
          handleTopicCardClick(topicPrompts[topicId]);
        } else {
          console.error('Topic not found:', topicId);
        }
      });
      
      // Add touch events for mobile devices with passive: false to improve performance
      card.addEventListener('touchstart', function(e) {
        // Just track that the touch started (don't prevent default here)
        this.setAttribute('data-touch-started', 'true');
      }, { passive: true });
      
      card.addEventListener('touchend', function(e) {
        // Only process if touch started on this element
        if (this.getAttribute('data-touch-started') === 'true') {
          // Prevent default click behavior that might follow
          e.preventDefault();
          
          const topicId = this.getAttribute('data-topic');
          if (topicId && topicPrompts[topicId]) {
            handleTopicCardClick(topicPrompts[topicId]);
          } else {
            console.error('Topic not found:', topicId);
          }
          
          // Clean up
          this.removeAttribute('data-touch-started');
        }
      }, { passive: false });
      
      card.addEventListener('touchcancel', function() {
        // Clean up if the touch is cancelled
        this.removeAttribute('data-touch-started');
      }, { passive: true });
    });
  }
  
  // Handle a research topic card click
  async function handleTopicCardClick(topic) {
    console.log(`Research topic clicked: ${topic.title}`);
    
    // Get or create the research results container
    let resultsContainer = document.getElementById('research-results-container');
    if (!resultsContainer) {
      console.error('Research results container not found in the DOM');
      return;
    }
    
    // Update header information
    const headerCategory = resultsContainer.querySelector('.research-category');
    const headerTitle = resultsContainer.querySelector('h2');
    if (headerCategory) headerCategory.textContent = topic.category;
    if (headerTitle) headerTitle.textContent = topic.title;
    
    // Show the results container with a loading message
    resultsContainer.style.display = 'block';
    
    // Get the content container where we'll put the research results
    const contentContainer = resultsContainer.querySelector('.research-results-content');
    if (!contentContainer) {
      console.error('Content container not found within research results');
      return;
    }
    
    // Show loading state
    contentContainer.innerHTML = `
      <div class="research-loading">
        <div class="perplexity-spinner"></div>
        <p>Researching insights about ${topic.title.toLowerCase()}...</p>
      </div>
    `;
    
    // Scroll to the results container
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    try {
      // Call the Perplexity API using our handler
      if (window.perplexityHandler && typeof window.perplexityHandler.research === 'function') {
        // Use the enhanced perplexity handler
        await window.perplexityHandler.research(topic.prompt, contentContainer);
        
        // Add event listeners to any retry buttons that might be added by the handler
        addRetryButtonListeners(contentContainer, topic);
      } else {
        console.error('Perplexity handler not available');
        throw new Error('AI research functionality is not available');
      }
    } catch (error) {
      console.error(`Research error for topic "${topic.title}":`, error);
      contentContainer.innerHTML = `
        <div class="research-error">
          <h3>Research Error</h3>
          <p>${error.message || 'Failed to retrieve research on this topic'}</p>
          <button class="retry-btn primary-button">Try Again</button>
        </div>
      `;
      
      // Add retry button functionality
      addRetryButtonListeners(contentContainer, topic);
    }
  }
  
  // Helper function to add event listeners to retry buttons
  function addRetryButtonListeners(container, topic) {
    const retryBtns = container.querySelectorAll('.retry-btn');
    retryBtns.forEach(btn => {
      btn.addEventListener('click', () => handleTopicCardClick(topic));
    });
  }
  
  // Handle custom question submission
  async function handleCustomQuestion(question) {
    // Clear the input field after submission
    if (customQuestionInput) {
      customQuestionInput.value = '';
    }
    
    // Create a custom topic object for the question
    const customTopic = {
      title: question.length > 60 ? question.substring(0, 57) + '...' : question,
      category: 'Custom Question',
      prompt: `Provide a research-based answer to this relationship question: "${question}". Include relevant psychological research and relationship studies with proper citations. Structure your answer with clear sections, practical advice, and evidence-based insights.`
    };
    
    // Use the same handler as the topic cards
    handleTopicCardClick(customTopic);
  }
  
  // Make loadResearch globally available for the mobile compatibility fix
  window.loadResearch = function(topicId, title, category) {
    // Find the topic in our predefined list
    const topicPrompts = {
      'communication-styles': {
        title: 'Communication Styles in Relationships',
        category: 'Communication',
        prompt: 'Provide a comprehensive guide on communication styles in relationships. Include: 1) The main communication styles identified in research, 2) How to identify your own and your partner\'s communication style, 3) How different styles interact and potential challenges, 4) Evidence-based strategies for improving communication between different styles, 5) Practical exercises for developing better communication habits. Include research from psychology and relationship studies with proper citations.'
      },
      'conflict-resolution': {
        title: 'Effective Conflict Resolution',
        category: 'Conflict Management',
        prompt: 'Provide a detailed guide on healthy conflict resolution in relationships. Include: 1) Research-backed approaches to handling disagreements, 2) Common patterns that escalate conflicts, 3) Step-by-step process for resolving conflicts productively, 4) How to repair relationships after conflicts, 5) When and how to seek outside help. Draw on research from relationship psychology, particularly Gottman\'s work, and include citations from relevant studies.'
      },
      'attachment-theory': {
        title: 'Understanding Attachment Theory',
        category: 'Psychology',
        prompt: 'Explain attachment theory and its impact on adult relationships in detail. Include: 1) The origins and development of attachment theory, 2) The four main attachment styles (secure, anxious, avoidant, and disorganized/fearful), 3) How attachment styles affect relationship dynamics, 4) Ways to develop more secure attachment patterns, 5) How to navigate relationships with different attachment styles. Cite relevant research from Bowlby, Ainsworth, and contemporary attachment researchers.'
      },
      'emotional-intelligence': {
        title: 'Emotional Intelligence in Relationships',
        category: 'Psychology',
        prompt: 'Provide a comprehensive overview of emotional intelligence in relationships. Include: 1) Definition and components of emotional intelligence, 2) How emotional awareness affects relationship quality, 3) Techniques for developing greater emotional awareness, 4) Ways to respond to a partner\'s emotions effectively, 5) Evidence-based exercises for improving emotional intelligence as a couple. Cite relevant psychological research and studies on EQ in relationships.'
      },
      'love-languages': {
        title: 'The Five Love Languages',
        category: 'Relationships',
        prompt: 'Explain the concept of love languages in detail. Include: 1) The five love languages as described by Gary Chapman, 2) How to identify your own and your partner\'s love languages, 3) Common misunderstandings when partners have different love languages, 4) Practical ways to express love in each language, 5) Research on the effectiveness of the love languages framework. Include both supportive research and critiques of the concept, with proper citations.'
      },
      'relationship-boundaries': {
        title: 'Healthy Relationship Boundaries',
        category: 'Relationships',
        prompt: 'Provide a comprehensive guide on establishing and maintaining healthy boundaries in relationships. Include: 1) What boundaries are and why they\'re essential, 2) Different types of boundaries (emotional, physical, digital, etc.), 3) Signs of boundary violations, 4) How to communicate boundaries effectively, 5) Respecting others\' boundaries while maintaining your own. Include evidence-based approaches and cite relevant psychological research.'
      }
    };
    
    if (topicId && topicPrompts[topicId]) {
      handleTopicCardClick(topicPrompts[topicId]);
    } else if (title && category) {
      // Create a custom topic if we have title and category but no matching predefined topic
      const customTopic = {
        title: title,
        category: category,
        prompt: `Provide comprehensive information about ${title} in relationships, including research findings, practical strategies, and evidence-based approaches.`
      };
      handleTopicCardClick(customTopic);
    } else {
      console.error('Invalid topic information provided');
    }
  };
  
  // Add a custom event listener for additional flexibility
  document.addEventListener('topicSelected', function(e) {
    const {topic, title, category} = e.detail;
    window.loadResearch(topic, title, category);
  });
}); 