/**
 * Perplexity API Integration
 * Handles API calls and beautifully formats responses with citations
 * Using server-side function to maintain security and mobile compatibility
 */

// Check if Firebase is properly initialized and auth is available
function ensureFirebaseAuth() {
  return new Promise((resolve, reject) => {
    // Check if Firebase is initialized
    if (!firebase || !firebase.apps || !firebase.apps.length) {
      console.error("Firebase not initialized");
      reject(new Error("Firebase not initialized"));
      return;
    }
    
    // Check if auth is loaded
    if (!firebase.auth) {
      console.error("Firebase auth not loaded");
      reject(new Error("Firebase auth not loaded"));
      return;
    }
    
    // Set a timeout to avoid waiting forever
    const timeout = setTimeout(() => {
      reject(new Error("Authentication check timed out"));
    }, 5000);
    
    // Use onAuthStateChanged to wait for auth to initialize
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      clearTimeout(timeout);
      unsubscribe();
      
      if (user) {
        console.log("User is authenticated:", user.uid);
        resolve(user);
      } else {
        console.error("No user is signed in");
        reject(new Error("Authentication required"));
      }
    });
  });
}

// Function to create a citation-focused prompt
function createCitationPrompt(basePrompt) {
  return `${basePrompt}

Please provide a comprehensive, well-structured answer with:
1. Clear headings for main points
2. Citations to reliable academic sources, medical journals, or other authoritative references
3. Numbered citations in the format [1], [2], etc.
4. A complete list of sources at the end of your response
5. Practical advice and evidence-based insights
6. A focus on relationship psychology and research

Format your answer professionally and ensure all factual claims are properly cited.`;
}

// Function to make a Perplexity API call through our server-side function
async function callPerplexityAPI(prompt, options = {}) {
  const defaultOptions = {
    model: "sonar",
    temperature: 0.7,
    max_tokens: 800,
    top_p: 0.9
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    console.log('Making Perplexity API call with prompt:', prompt.substring(0, 100) + '...');
    
    // Ensure user is authenticated
    const user = await ensureFirebaseAuth();
    
    // Get the current user's ID token for authorization
    const idToken = await user.getIdToken();
    
    console.log('Sending research request to server function');
    
    // Make call to our server-side function (similar to OpenAI implementation)
    const response = await fetch('https://us-central1-heartglowai.cloudfunctions.net/perplexityResearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        prompt: prompt,
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        top_p: config.top_p
      })
    });
    
    console.log('Server function response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = `Server responded with status ${response.status}`;
      
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (jsonError) {
        // If JSON parsing fails, use status text
        errorMessage = `Error: ${response.statusText || errorMessage}`;
      }
      
      console.error('Server function error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    // Parse the successful response
    const data = await response.json();
    
    // The server function returns { result: perplexityResponse }
    if (!data || !data.result) {
      throw new Error('Invalid response from server function');
    }
    
    console.log('Research response received successfully');
    return data.result;
    
  } catch (error) {
    console.error('Research API call failed:', error.message || error);
    throw error;
  }
}

// Function to display formatted Perplexity results with citations
function displayPerplexityResults(result, containerElement) {
  if (!result || !result.choices || !result.choices[0] || !result.choices[0].message) {
    containerElement.innerHTML = '<p>Invalid response received.</p>';
    return;
  }
  
  const message = result.choices[0].message;
  let content = message.content;
  
  // Extract citation references and sources from the content
  const citations = [];
  
  // Check if the response has a citations section at the end
  const citationSectionMatches = content.match(/(?:References|Sources|Citations):\s*\n((?:.|\n)+)$/i);
  
  if (citationSectionMatches) {
    const citationsSection = citationSectionMatches[1];
    // Remove the citations section from the main content
    content = content.replace(/(?:References|Sources|Citations):\s*\n((?:.|\n)+)$/i, '');
    
    // Extract individual citations with improved regex
    const citationRegex = /\[(\d+)\]\s*(.+?)(?=\n\[\d+\]|\n*$)/gs;
    let match;
    
    while ((match = citationRegex.exec(citationsSection)) !== null) {
      const index = parseInt(match[1]);
      const citationText = match[2].trim();
      
      // Try to extract URL if present
      let url = '';
      const urlMatch = citationText.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        url = urlMatch[1];
      }
      
      citations.push({
        index,
        text: citationText,
        url,
        title: citationText.replace(url, '').trim() || `Source ${index}`
      });
    }
  } else {
    // Alternative: Look for inline citation pattern [number]
    const citationRefs = content.match(/\[(\d+)\]/g);
    
    if (citationRefs) {
      // Extract unique citation numbers
      const citationNumbers = [...new Set(citationRefs.map(ref => parseInt(ref.match(/\[(\d+)\]/)[1])))];
      
      // Create placeholder citations for each reference number
      citationNumbers.forEach(num => {
        citations.push({
          index: num,
          text: `Source ${num}`,
          url: '',
          title: `Source ${num}`
        });
      });
    }
  }
  
  // Sort citations by index
  citations.sort((a, b) => a.index - b.index);
  
  // Parse and format the content for enhanced display
  const formattedResponse = formatResearchResponse(content, citations);
  
  // Create HTML for the enhanced research response
  let html = '<div class="research-response">';
  
  // Key Takeaways Section
  html += '<div class="key-takeaways">';
  html += '<h3>Key Insights</h3>';
  html += '<div class="takeaway-grid">';
  
  formattedResponse.keyTakeaways.forEach(point => {
    html += `
      <div class="takeaway-card">
        <i class="fas ${point.icon}"></i>
        <h4>${point.title}</h4>
        <p>${point.description}</p>
      </div>
    `;
  });
  
  html += '</div></div>';
  
  // Main Content Sections
  html += '<div class="content-sections">';
  
  formattedResponse.sections.forEach(section => {
    html += `
      <div class="content-section">
        <div class="section-header">
          <h3>${section.title}</h3>
        </div>
        <div class="section-content">
          ${section.content}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  // Practical Tips Section (if available)
  if (formattedResponse.practicalTips.length > 0) {
    html += '<div class="practical-tips">';
    html += '<h3>Practical Applications</h3>';
    html += '<div class="tips-list">';
    
    formattedResponse.practicalTips.forEach(tip => {
      html += `
        <div class="tip-item">
          <div class="tip-icon"><i class="fas fa-lightbulb"></i></div>
          <div class="tip-content">${tip}</div>
        </div>
      `;
    });
    
    html += '</div></div>';
  }
  
  // Citations Panel
  if (citations.length > 0) {
    html += '<div class="citations-panel">';
    html += '<h3>Sources</h3>';
    html += '<div class="citation-cards">';
    
    citations.forEach(citation => {
      html += `
        <div class="citation-card" id="citation-${citation.index}">
          <div class="citation-number">[${citation.index}]</div>
          <div class="citation-details">
            <div class="citation-title">${citation.title}</div>
            ${citation.url ? `<a href="${citation.url}" target="_blank" class="citation-link">${citation.url}</a>` : ''}
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';
  }
  
  html += '</div>'; // End of research-response div
  
  // Display the HTML in the container
  containerElement.innerHTML = html;
  
  // Add event listeners to any citation references
  addCitationInteractivity(containerElement);
}

// Helper function to extract key points from content
function formatResearchResponse(content, citations) {
  // Process the content to identify key sections, takeaways, and practical tips
  
  // Extract headings and split content into sections
  const sections = [];
  let currentSection = { title: 'Overview', content: '' };
  let keyTakeaways = [];
  let practicalTips = [];
  
  // Split content into paragraphs
  const paragraphs = content.split(/\n\n+/);
  
  // Process each paragraph
  paragraphs.forEach(paragraph => {
    paragraph = paragraph.trim();
    if (!paragraph) return;
    
    // Check if paragraph is a heading
    if (/^#+\s+.+/.test(paragraph) || /^.+\n[=\-]{2,}$/.test(paragraph)) {
      // If we have content in the current section, save it
      if (currentSection.content) {
        sections.push({ ...currentSection });
      }
      
      // Extract heading text
      let title = paragraph.replace(/^#+\s+/, '').replace(/\n[=\-]{2,}$/, '');
      currentSection = { title, content: '' };
    } 
    // Check if paragraph might be a key takeaway
    else if (paragraph.includes(':') && paragraph.length < 200 && !paragraph.includes('[') && /^[A-Z]/.test(paragraph)) {
      const parts = paragraph.split(':');
      if (parts.length >= 2) {
        keyTakeaways.push({
          title: parts[0].trim(),
          description: parts.slice(1).join(':').trim(),
          icon: selectIconForContent(parts[0].trim())
        });
      } else {
        currentSection.content += formatParagraph(paragraph);
      }
    }
    // Check if paragraph might be a practical tip
    else if ((paragraph.toLowerCase().includes('tip') || 
              paragraph.toLowerCase().includes('advice') || 
              paragraph.toLowerCase().includes('recommend') ||
              paragraph.toLowerCase().includes('practice') ||
              paragraph.toLowerCase().includes('suggest')) && 
              paragraph.length < 300) {
      practicalTips.push(formatParagraph(paragraph));
    }
    // Regular content paragraph
    else {
      currentSection.content += formatParagraph(paragraph);
    }
  });
  
  // Add the last section if it has content
  if (currentSection.content) {
    sections.push({ ...currentSection });
  }
  
  // If we couldn't identify sections, create a default one with all content
  if (sections.length === 0) {
    sections.push({ title: 'Information', content: formatParagraph(content) });
  }
  
  // If we couldn't identify key takeaways, extract some from the first section
  if (keyTakeaways.length === 0) {
    // Try to extract key sentences from the first section
    const sentences = sections[0].content.split(/(?<=[.!?])\s+/);
    
    for (let i = 0; i < sentences.length && keyTakeaways.length < 3; i++) {
      const sentence = sentences[i];
      if (sentence.length > 40 && sentence.length < 200 && !sentence.includes('citation')) {
        keyTakeaways.push({
          title: `Key Point ${keyTakeaways.length + 1}`,
          description: sentence,
          icon: selectIconForContent(sentence)
        });
      }
    }
  }
  
  // Limit to 3-4 key takeaways
  keyTakeaways = keyTakeaways.slice(0, 4);
  
  // Enhance each section with citations
  sections.forEach(section => {
    // Replace citation indices with enhanced superscript
    citations.forEach(citation => {
      const refRegex = new RegExp(`\\[${citation.index}\\]`, 'g');
      section.content = section.content.replace(refRegex, 
        `<sup class="citation-ref" data-index="${citation.index}">[${citation.index}]</sup>`);
    });
    
    // Highlight key terms
    section.content = highlightKeyTerms(section.content);
  });
  
  return {
    keyTakeaways,
    sections,
    practicalTips
  };
}

// Format a paragraph with proper HTML and enhanced styling
function formatParagraph(paragraph) {
  // Replace newlines with breaks
  let formatted = paragraph.replace(/\n/g, '<br>');
  
  // Add spacing between paragraphs
  return `<p>${formatted}</p>`;
}

// Highlight important terms in the content
function highlightKeyTerms(content) {
  // List of relationship and psychology key terms to highlight
  const keyTerms = [
    'attachment style', 'secure attachment', 'anxious attachment', 'avoidant attachment',
    'love language', 'emotional intelligence', 'stonewalling', 'contempt', 'criticism',
    'defensiveness', 'gaslighting', 'boundaries', 'validation', 'active listening',
    'communication pattern', 'conflict resolution', 'intimacy', 'vulnerability'
  ];
  
  // Highlight each term
  keyTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    content = content.replace(regex, '<span class="key-term">$1</span>');
  });
  
  return content;
}

// Select appropriate icon based on content
function selectIconForContent(text) {
  text = text.toLowerCase();
  
  if (text.includes('communication') || text.includes('talk') || text.includes('conversation'))
    return 'fa-comments';
  
  if (text.includes('emotion') || text.includes('feel') || text.includes('empathy'))
    return 'fa-heart';
  
  if (text.includes('understand') || text.includes('knowledge') || text.includes('learn'))
    return 'fa-lightbulb';
    
  if (text.includes('conflict') || text.includes('disagree') || text.includes('argument'))
    return 'fa-handshake';
    
  if (text.includes('boundary') || text.includes('limit') || text.includes('protect'))
    return 'fa-shield-alt';
    
  if (text.includes('attachment') || text.includes('connect') || text.includes('bond'))
    return 'fa-link';
    
  // Default icon
  return 'fa-check-circle';
}

// Function to make a research query
async function performPerplexityResearch(query, containerElement, loadingElement = null) {
  try {
    // Show loading state
    if (loadingElement) {
      loadingElement.style.display = 'block';
    } else {
      // Create loading indicator
      containerElement.innerHTML = `
        <div class="research-loading">
          <div class="perplexity-spinner"></div>
          <p>Researching your query...</p>
        </div>
      `;
    }
    
    // Add citation instruction to the query
    const enhancedQuery = createCitationPrompt(query);
    
    try {
      // Call the API with longer token limit for research
      const result = await callPerplexityAPI(enhancedQuery, {
        model: "sonar", // Higher quality model for research
        max_tokens: 1500, // Increased token limit for more comprehensive answers
        temperature: 0.2 // Lower temperature for more factual responses
      });
      
      // Display the formatted results
      displayPerplexityResults(result, containerElement);
      
      return result;
    } catch (apiError) {
      console.error('Research API call failed:', apiError);
      
      // Create user-friendly error message
      let errorMessage = 'Unable to complete the research at this time.';
      
      if (apiError.message.includes('sign')) {
        errorMessage = 'You must be signed in to use research features.';
      } else if (apiError.message.includes('network') || apiError.message.includes('connection')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      // Display error
      containerElement.innerHTML = `
        <div class="research-error">
          <h3>Research Error</h3>
          <p>${errorMessage}</p>
          <button class="retry-btn primary-button">Try Again</button>
        </div>
      `;
      
      // Add retry button functionality
      const retryBtn = containerElement.querySelector('.retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => performPerplexityResearch(query, containerElement));
      }
      
      throw apiError;
    }
  } catch (error) {
    console.error('Research wrapper failed:', error);
    
    if (!containerElement.querySelector('.research-error')) {
      containerElement.innerHTML = `
        <div class="research-error">
          <h3>Research Error</h3>
          <p>We encountered an issue. Please try again later.</p>
          <button class="retry-btn primary-button">Try Again</button>
        </div>
      `;
      
      // Add retry button functionality
      const retryBtn = containerElement.querySelector('.retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => performPerplexityResearch(query, containerElement));
      }
    }
    
    throw error;
  } finally {
    // Hide loading state
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
  }
}

/**
 * Add interactivity to citation references
 */
function addCitationInteractivity(containerElement) {
  // Find all citation references
  const citationRefs = containerElement.querySelectorAll('.citation-ref');
  const citationPanel = containerElement.querySelector('.citation-panel');
  
  if (citationRefs.length > 0 && citationPanel) {
    citationRefs.forEach(ref => {
      ref.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the citation number
        const citationNum = this.textContent.match(/\d+/)[0];
        
        // Find the corresponding citation in the panel
        const citationItem = citationPanel.querySelector(`.citation-item[data-index="${citationNum}"]`);
        
        if (citationItem) {
          // Remove active class from all citations
          citationPanel.querySelectorAll('.citation-item').forEach(item => {
            item.classList.remove('active');
          });
          
          // Add active class to this citation
          citationItem.classList.add('active');
          
          // Scroll the citation into view
          citationItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }
}

// Export the perplexityHandler for other modules to use
window.perplexityHandler = {
  /**
   * Research a topic using Perplexity AI and display results in the container
   * @param {string} prompt - The research prompt to send to Perplexity
   * @param {HTMLElement} containerElement - The container to display results in
   * @returns {Promise<void>}
   */
  research: async function(prompt, containerElement) {
    try {
      // Show initial loading state
      containerElement.innerHTML = `
        <div class="research-loading">
          <div class="perplexity-spinner"></div>
          <p>Preparing research...</p>
        </div>
      `;
      
      // Check authentication state properly
      try {
        await ensureFirebaseAuth();
      } catch (authError) {
        console.error('Authentication failed:', authError);
        
        containerElement.innerHTML = `
          <div class="research-error">
            <h3>Authentication Required</h3>
            <p>You must be signed in to use the research feature.</p>
            <button class="primary-button" onclick="window.location.href='index.html'">Go to Login Page</button>
          </div>
        `;
        throw new Error('Authentication required for research');
      }
      
      // Enhance prompt with citation requirements
      const enhancedPrompt = createCitationPrompt(prompt);
      
      // Update loading state
      containerElement.innerHTML = `
        <div class="research-loading">
          <div class="perplexity-spinner"></div>
          <p>Researching insights...</p>
        </div>
      `;
      
      console.log('Starting research query with prompt:', prompt.substring(0, 100) + '...');
      
      // Call the server-side function with appropriate options
      const result = await callPerplexityAPI(enhancedPrompt, {
        model: "sonar",
        temperature: 0.7,
        max_tokens: 1500
      });
      
      // Display formatted results
      displayPerplexityResults(result, containerElement);
      
      // Add citation click handlers
      addCitationInteractivity(containerElement);
      
      return result;
    } catch (error) {
      console.error('Research failed:', error);
      
      // Only show error if not already displayed
      if (!containerElement.querySelector('.research-error')) {
        containerElement.innerHTML = `
          <div class="research-error">
            <h3>Research Error</h3>
            <p>We encountered an issue while generating insights. Please try again.</p>
            <button class="retry-btn primary-button">Try Again</button>
          </div>
        `;
        
        // Add retry button handler
        const retryButton = containerElement.querySelector('.retry-btn');
        if (retryButton) {
          retryButton.addEventListener('click', () => {
            this.research(prompt, containerElement);
          });
        }
      }
      
      throw error;
    }
  }
}; 