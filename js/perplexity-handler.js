/**
 * Perplexity API Integration
 * Handles API calls and beautifully formats responses with citations
 */

// Function to retrieve Perplexity API key from Firestore or other sources
async function getPerplexityApiKey() {
  try {
    console.log('Getting Perplexity API key...');
    
    // Check local storage first for cached key (most reliable cross-device)
    const localStorageKey = localStorage.getItem('perplexity_api_key');
    if (localStorageKey) {
      console.log('Using Perplexity API key from local storage');
      return localStorageKey;
    }
    
    // Try to get from Firebase if available
    if (typeof firebase !== 'undefined' && firebase.firestore && firebase.auth && firebase.auth().currentUser) {
      console.log('Attempting to retrieve Perplexity API key from Firestore');
      try {
        // Access the secrets collection
        const secretsRef = firebase.firestore().collection('secrets').doc('api_keys');
        const secretsDoc = await secretsRef.get();
        
        if (secretsDoc.exists && secretsDoc.data() && secretsDoc.data().perplexity) {
          const apiKey = secretsDoc.data().perplexity;
          
          // Cache the key in localStorage to avoid repeated Firestore calls
          try {
            localStorage.setItem('perplexity_api_key', apiKey);
            console.log('Perplexity API key cached in localStorage');
          } catch (storageError) {
            console.warn('Could not cache API key:', storageError.message);
          }
          
          console.log('Perplexity API key retrieved from Firestore');
          return apiKey;
        } else {
          console.warn('API key not found in Firestore document');
        }
      } catch (fbError) {
        console.warn('Could not retrieve key from Firestore:', fbError.message);
      }
    } else {
      console.log('Firebase not available or user not logged in');
    }
    
    // Try alternative sources that work better on mobile
    
    // 1. Check URL parameters for a demo key
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramKey = urlParams.get('demo_key');
      if (paramKey && paramKey.startsWith('pplx-')) {
        console.log('Using demo key from URL parameter');
        return paramKey;
      }
    } catch (urlError) {
      console.warn('Error checking URL parameters:', urlError.message);
    }
    
    // 2. Check for a hardcoded fallback key in a global variable
    if (typeof PERPLEXITY_API_KEY !== 'undefined' && PERPLEXITY_API_KEY) {
      console.log('Using fallback Perplexity API key from global variable');
      return PERPLEXITY_API_KEY;
    }
    
    // 3. Use a temporary demo key as last resort
    console.warn('Using fallback demo key - this should be replaced in production');
    return 'pplx-DEMO_KEY_REPLACE_IN_PRODUCTION';
    
  } catch (error) {
    console.error('Error in getPerplexityApiKey:', error.message || error);
    // Return a fallback key even in case of errors to prevent complete failure
    return 'pplx-DEMO_KEY_REPLACE_IN_PRODUCTION';
  }
}

// Function to make a Perplexity API call with enhanced citation support
async function callPerplexityAPI(prompt, options = {}) {
  const defaultOptions = {
    model: "sonar",
    temperature: 0.7,
    max_tokens: 800,
    top_p: 0.9
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    console.log('Making Perplexity API call with prompt:', prompt);
    const apiKey = await getPerplexityApiKey();
    
    if (!apiKey) {
      throw new Error('Failed to retrieve API key for research');
    }
    
    // Create a more detailed system message to encourage citations
    const systemMessage = "You are a relationship expert providing research-backed answers about relationships. Always cite reliable sources such as psychology journals, academic research papers, or books by relationship experts. Format citations as [1], [2], etc. and include complete source details at the end of your response. Focus on providing well-structured, evidence-based information with practical advice. Always maintain a professional, empathetic tone.";
    
    // Create request options - restructured for improved mobile compatibility
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: config.temperature,
        max_tokens: config.max_tokens,
        top_p: config.top_p
      })
    };

    console.log('Sending Perplexity API request with options:', {
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.max_tokens
    });
    
    // Perform the fetch with improved error handling
    const response = await fetch('https://api.perplexity.ai/chat/completions', requestOptions);
    
    // Log response status to help with debugging
    console.log('Perplexity API response status:', response.status);
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorMessage = `API request failed with status ${response.status}`;
      
      try {
        // Try to parse error response as JSON
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = `Perplexity API error: ${errorData.error.message || errorData.error}`;
        }
      } catch (jsonError) {
        // If JSON parsing fails, use the status text
        errorMessage = `Perplexity API error: ${response.statusText || errorMessage}`;
      }
      
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    // Parse the successful response
    const data = await response.json();
    console.log('Perplexity API response received successfully');
    return data;
  } catch (error) {
    // Improved error logging with more context
    console.error('Perplexity API call failed:', error.message || error);
    
    // Rethrow with clearer message
    throw new Error(`Research service unavailable: ${error.message || 'Unknown error'}`);
  }
}

// Function to enhance a prompt to encourage citation-rich responses
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
  
  // Set the HTML content
  containerElement.innerHTML = html;
  
  // Add interactive elements
  initializeInteractiveElements(containerElement);
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

// Initialize interactive elements in the response
function initializeInteractiveElements(container) {
  // Add citation tooltip functionality
  const citationRefs = container.querySelectorAll('.citation-ref');
  citationRefs.forEach(ref => {
    ref.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      const citation = container.querySelector(`#citation-${index}`);
      if (citation) {
        citation.scrollIntoView({ behavior: 'smooth', block: 'center' });
        citation.classList.add('citation-highlight');
        setTimeout(() => {
          citation.classList.remove('citation-highlight');
        }, 2000);
      }
    });
  });
  
  // Add section collapsing functionality for mobile
  const sectionHeaders = container.querySelectorAll('.section-header');
  if (window.innerWidth < 768) {
    sectionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const section = header.closest('.content-section');
        const content = section.querySelector('.section-content');
        content.classList.toggle('expanded');
      });
    });
  }
  
  // Add copy functionality
  const copyBtn = container.closest('.research-results-container')?.querySelector('#copy-results-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      // Get just the text content to copy
      const textContent = container.textContent;
      navigator.clipboard.writeText(textContent)
        .then(() => {
          // Show success message
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
          }, 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    });
  }
  
  // Add share functionality
  const shareBtn = container.closest('.research-results-container')?.querySelector('#share-results-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      // Get page title and URL
      const title = document.title;
      const url = window.location.href;
      
      // Try to use Web Share API if available
      if (navigator.share) {
        navigator.share({
          title: title,
          text: 'Check out this relationship insight from HeartGlowAI',
          url: url,
        })
        .catch(error => console.log('Error sharing', error));
      } else {
        // Fallback to copying the URL
        navigator.clipboard.writeText(url)
          .then(() => {
            // Show success message
            const originalHTML = shareBtn.innerHTML;
            shareBtn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
              shareBtn.innerHTML = originalHTML;
            }, 2000);
          })
          .catch(err => {
            console.error('Could not copy URL: ', err);
          });
      }
    });
  }
}

// Function to make a research query with better citation formatting
async function performPerplexityResearch(query, containerElement, loadingElement = null) {
  try {
    // Show loading state if element provided
    if (loadingElement) {
      loadingElement.style.display = 'block';
    } else {
      // Create and append a temporary loading indicator
      const tempLoader = document.createElement('div');
      tempLoader.className = 'perplexity-temp-loader';
      tempLoader.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; padding: 20px; color: var(--text-secondary, rgba(255,255,255,0.7));">
          <div class="perplexity-spinner"></div>
          <span style="margin-left: 12px;">Researching your query...</span>
        </div>
      `;
      containerElement.innerHTML = '';
      containerElement.appendChild(tempLoader);
    }
    
    // Add citation instruction to the query
    const enhancedQuery = createCitationPrompt(query);

    // Create safeguards to ensure the API call works on mobile
    const apiOptions = {
      model: "sonar", // Higher quality model for research
      max_tokens: 1500, // Increased token limit for more comprehensive answers
      temperature: 0.2, // Lower temperature for more factual responses
      timeout: 30000 // 30 second timeout to prevent hanging on mobile
    };
    
    console.log(`Making research query with model ${apiOptions.model}, max_tokens ${apiOptions.max_tokens}`);
    
    try {
      // Call the API with enhanced options for mobile compatibility
      const result = await Promise.race([
        callPerplexityAPI(enhancedQuery, apiOptions),
        // Create a timeout promise to prevent hanging
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Research request timed out')), apiOptions.timeout)
        )
      ]);
      
      // Display the formatted results
      displayPerplexityResults(result, containerElement);
      
      return result;
    } catch (apiError) {
      // Log and handle API-specific errors
      console.error('Perplexity API error during research:', apiError);
      
      // Create a user-friendly error message
      let errorMessage = 'Unable to complete the research query.';
      if (apiError.message.includes('timed out')) {
        errorMessage = 'The research request took too long to complete. Please try again.';
      } else if (apiError.message.includes('API key')) {
        errorMessage = 'There was an issue with the API authorization.';
      } else if (apiError.message.includes('network') || apiError.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      // Display error in container
      containerElement.innerHTML = `
        <div class="perplexity-response">
          <div class="error-message">
            <strong>Research Error:</strong> ${errorMessage}
          </div>
          <div style="margin-top: 16px; font-size: 14px; color: var(--text-secondary, rgba(255,255,255,0.7));">
            <p>Please try:</p>
            <ul>
              <li>Refreshing the page</li>
              <li>Trying a different, more specific query</li>
              <li>Checking your internet connection</li>
            </ul>
            <button class="retry-btn primary-button" style="margin-top: 15px;">Try Again</button>
          </div>
        </div>
      `;
      
      // Add event listener to the retry button
      const retryBtn = containerElement.querySelector('.retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          performPerplexityResearch(query, containerElement, loadingElement);
        });
      }
      
      throw apiError;
    }
  } catch (error) {
    // Handle general errors
    console.error('Perplexity research failed:', error);
    
    if (containerElement && !containerElement.querySelector('.error-message')) {
      containerElement.innerHTML = `
        <div class="perplexity-response">
          <div class="error-message">
            <strong>Error:</strong> We couldn't complete your research request.
            <p>Please check your internet connection and try again.</p>
            <button class="retry-btn primary-button" style="margin-top: 15px;">Try Again</button>
          </div>
        </div>
      `;
      
      // Add event listener to the retry button
      const retryBtn = containerElement.querySelector('.retry-btn');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          performPerplexityResearch(query, containerElement, loadingElement);
        });
      }
    }
    
    throw error;
  } finally {
    // Hide loading state
    if (loadingElement) {
      loadingElement.style.display = 'none';
    } else {
      // Remove temporary loader if it exists
      const tempLoader = containerElement.querySelector('.perplexity-temp-loader');
      if (tempLoader) {
        tempLoader.remove();
      }
    }
  }
}

// Export functions for use in other modules
window.perplexityHandler = {
  getApiKey: getPerplexityApiKey,
  call: callPerplexityAPI,
  display: displayPerplexityResults,
  research: performPerplexityResearch
};

// Attach event listener to the Perplexity test button when the page loads
document.addEventListener('DOMContentLoaded', function() {
  const testButton = document.getElementById('test-perplexity-btn-main');
  if (testButton) {
    testButton.addEventListener('click', async function() {
      const resultDiv = document.getElementById('perplexity-result');
      const responseDiv = document.getElementById('perplexity-response');
      
      if (!resultDiv || !responseDiv) {
        console.error('Result or response container not found');
        return;
      }
      
      // Show loading state
      testButton.disabled = true;
      const originalText = testButton.innerHTML;
      testButton.innerHTML = '<span class="button-content">Researching... <div class="perplexity-spinner"></div></span>';
      
      try {
        // Display the result container and clear previous results
        resultDiv.style.display = 'block';
        responseDiv.innerHTML = '';
        
        // Use a research-focused medical question to showcase citation abilities
        const researchQuery = "What are the latest clinical research findings on the effectiveness of meditation for treating anxiety disorders and depression? Focus on randomized controlled trials and meta-analyses from the past 5 years.";
        
        // Show heading for the result
        const resultHeader = document.createElement('h3');
        resultHeader.textContent = 'AI Research Results';
        resultHeader.style.marginBottom = '16px';
        resultHeader.style.color = 'var(--accent-blue, #64b5f6)';
        responseDiv.appendChild(resultHeader);
        
        // Perform the research query
        await performPerplexityResearch(researchQuery, responseDiv);
        
        // Scroll to the results
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (error) {
        console.error('Perplexity test failed:', error);
        if (!responseDiv.querySelector('.error-message')) {
          responseDiv.innerHTML = `
            <div class="perplexity-response">
              <div class="error-message">
                <strong>Error:</strong> ${error.message}
              </div>
            </div>
          `;
        }
      } finally {
        // Restore button state
        testButton.disabled = false;
        testButton.innerHTML = originalText;
      }
    });
  }
});

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
      // Enhance prompt with citation requirements
      const enhancedPrompt = createCitationPrompt(prompt);
      
      // Show loading state if not already shown
      if (!containerElement.querySelector('.research-loading')) {
        containerElement.innerHTML = `
          <div class="research-loading">
            <div class="perplexity-spinner"></div>
            <p>Researching insights...</p>
          </div>
        `;
      }
      
      console.log('Starting research query with prompt:', prompt.substring(0, 100) + '...');
      
      // Create API call options optimized for mobile
      const apiOptions = {
        model: "sonar",
        temperature: 0.7,
        max_tokens: 1500,  // Increased for more comprehensive responses
        top_p: 0.9,
        timeout: 30000 // 30 second timeout to prevent hanging on mobile devices
      };
      
      try {
        // Use Promise.race to implement a timeout for the API call
        const result = await Promise.race([
          // Main API call
          callPerplexityAPI(enhancedPrompt, apiOptions),
          // Timeout promise
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Research request timed out')), apiOptions.timeout)
          )
        ]);
        
        // Display formatted results
        displayPerplexityResults(result, containerElement);
        
        // Add citation click handlers after rendering
        addCitationInteractivity(containerElement);
        
        return result;
      } catch (apiError) {
        console.error('Research API call failed:', apiError);
        
        // Create user-friendly error message based on error type
        let errorMessage = 'We encountered an issue while generating insights.';
        if (apiError.message.includes('timed out')) {
          errorMessage = 'The research request took too long to complete. Please try again.';
        } else if (apiError.message.includes('network') || apiError.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        }
        
        // Display user-friendly error
        containerElement.innerHTML = `
          <div class="research-error">
            <h3>Research Error</h3>
            <p>${errorMessage}</p>
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
        
        throw apiError;
      }
    } catch (error) {
      console.error('Research wrapper failed:', error);
      
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

/**
 * Add interactivity to citation references
 */
function addCitationInteractivity(containerElement) {
  // Find all citation references
  const citationRefs = containerElement.querySelectorAll('.citation-ref');
  const citationItems = containerElement.querySelectorAll('.citation-item');
  
  citationRefs.forEach(ref => {
    ref.addEventListener('click', function() {
      const citationNumber = this.textContent.replace('[', '').replace(']', '');
      
      // Find corresponding citation
      const targetCitation = containerElement.querySelector(`.citation-item[data-citation-number="${citationNumber}"]`);
      
      if (targetCitation) {
        // Remove highlight from all citations
        citationItems.forEach(item => item.classList.remove('citation-highlight'));
        
        // Add highlight to this citation
        targetCitation.classList.add('citation-highlight');
        
        // Scroll to the citation
        targetCitation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
} 