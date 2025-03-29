/**
 * Perplexity API Integration
 * Handles API calls and beautifully formats responses with citations
 */

// Function to retrieve Perplexity API key from Firestore or other sources
async function getPerplexityApiKey() {
  try {
    // Check local storage first for cached key
    let perplexityApiKey = localStorage.getItem('perplexity_api_key');
    
    if (perplexityApiKey) {
      console.log('Using Perplexity API key from local storage');
      return perplexityApiKey;
    }
    
    // Try to get from Firebase if user is authenticated
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      console.log('Retrieving Perplexity API key from Firestore');
      try {
        // Access the secrets collection
        const secretsDoc = await firebase.firestore().collection('secrets').doc('secrets').get();
        
        if (secretsDoc.exists && secretsDoc.data().perplexitykey) {
          perplexityApiKey = secretsDoc.data().perplexitykey;
          localStorage.setItem('perplexity_api_key', perplexityApiKey);
          console.log('Perplexity API key retrieved from secrets collection');
          return perplexityApiKey;
        }
      } catch (fbError) {
        console.warn('Could not retrieve key from Firestore:', fbError);
      }
    }
    
    // Check URL parameters for a demo key (development only)
    const urlParams = new URLSearchParams(window.location.search);
    const paramKey = urlParams.get('demo_key');
    if (paramKey && paramKey.startsWith('pplx-')) {
      console.log('Using demo key from URL parameter');
      return paramKey;
    }
    
    // Prompt user for API key if we don't have one
    if (!perplexityApiKey) {
      const userKey = prompt('Please enter your Perplexity API key (starts with pplx-):');
      if (userKey && userKey.startsWith('pplx-')) {
        localStorage.setItem('perplexity_api_key', userKey);
        return userKey;
      }
    }
    
    // If we still don't have a key, return null to handle gracefully
    console.warn('No Perplexity API key available');
    return null;
  } catch (error) {
    console.error('Error fetching Perplexity API key:', error);
    return null;
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
      throw new Error('No Perplexity API key available');
    }
    
    // Create a more detailed system message to encourage citations
    const systemMessage = "You are a helpful assistant that provides informative answers with citations to sources when possible. Format citations as [1], [2], etc. and include the source details at the end of your response.";
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Perplexity API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Perplexity API response:', data);
    return data;
  } catch (error) {
    console.error('Perplexity API call failed:', error);
    throw error;
  }
}

// Function to enhance a prompt to encourage citation-rich responses
function createCitationPrompt(basePrompt) {
  return `${basePrompt}\n\nPlease include citations to reliable sources in your answer. Format citations as [1], [2], etc. and include the full source details at the end of your response.`;
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
  let citationsSection = '';
  
  // Check if the response has a citations section at the end
  const citationSectionMatch = content.match(/(?:References|Sources|Citations):\s*\n((?:.|\n)+)$/i);
  
  if (citationSectionMatch) {
    citationsSection = citationSectionMatch[1];
    content = content.replace(/(?:References|Sources|Citations):\s*\n((?:.|\n)+)$/i, '');
    
    // Extract individual citations
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
        title: citationText.replace(url, '').trim()
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
          text: `Citation ${num}`,
          url: '',
          title: `Citation ${num}`
        });
      });
    }
  }
  
  // Create HTML structure for the response
  let html = '<div class="perplexity-response">';
  
  // Format the main content with citation references
  if (citations.length > 0) {
    // Replace citation indices with superscript links
    citations.forEach(citation => {
      const refRegex = new RegExp(`\\[${citation.index}\\]`, 'g');
      content = content.replace(refRegex, `<sup class="citation-ref" data-index="${citation.index}">[${citation.index}]</sup>`);
    });
  }
  
  // Add the main content
  html += `<div class="response-content">${content}</div>`;
  
  // Add citations section if available
  if (citations.length > 0) {
    html += '<div class="citations-section">';
    html += '<h3>Sources</h3>';
    html += '<ol class="citations-list">';
    
    // Sort citations by index
    citations.sort((a, b) => a.index - b.index);
    
    citations.forEach(citation => {
      html += `<li id="citation-${citation.index}" class="citation-item">`;
      
      if (citation.title) {
        html += `<div class="citation-title">${citation.title}</div>`;
      }
      
      if (citation.url) {
        html += `<a href="${citation.url}" target="_blank" class="citation-link">${citation.url}</a>`;
      } else {
        html += `<span class="citation-text">${citation.text}</span>`;
      }
      
      html += '</li>';
    });
    
    html += '</ol></div>';
  }
  
  html += '</div>';
  
  // Set the HTML to the container
  containerElement.innerHTML = html;
  
  // Add event listeners to citation references
  setTimeout(() => {
    const refs = containerElement.querySelectorAll('.citation-ref');
    refs.forEach(ref => {
      ref.addEventListener('click', () => {
        const index = ref.getAttribute('data-index');
        const citationItem = containerElement.querySelector(`#citation-${index}`);
        if (citationItem) {
          citationItem.scrollIntoView({ behavior: 'smooth' });
          citationItem.classList.add('highlight');
          setTimeout(() => {
            citationItem.classList.remove('highlight');
          }, 2000);
        }
      });
    });
  }, 100);
}

// Function to make a research query with better citation formatting
async function performPerplexityResearch(query, containerElement, loadingElement = null) {
  try {
    // Show loading state if element provided
    if (loadingElement) {
      loadingElement.style.display = 'block';
    }
    
    // Add citation instruction to the query
    const enhancedQuery = createCitationPrompt(query);
    
    // Call the API with longer token limit for research
    const result = await callPerplexityAPI(enhancedQuery, {
      model: "sonar", // Higher quality model for research
      max_tokens: 1000,
      temperature: 0.3 // Lower temperature for more factual responses
    });
    
    // Display the formatted results
    displayPerplexityResults(result, containerElement);
    
    return result;
  } catch (error) {
    console.error('Perplexity research failed:', error);
    containerElement.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
    throw error;
  } finally {
    // Hide loading state
    if (loadingElement) {
      loadingElement.style.display = 'none';
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
      testButton.innerHTML = '<span class="button-content">Testing... <div class="perplexity-spinner"></div></span>';
      
      try {
        // Display the result container
        resultDiv.style.display = 'block';
        
        // Use a research question likely to get citations
        const researchQuery = "What are the latest research findings on the benefits of meditation for mental health? Include scientific studies.";
        
        // Perform the research query
        await performPerplexityResearch(researchQuery, responseDiv);
        
        // Scroll to the results
        resultDiv.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Perplexity test failed:', error);
        responseDiv.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
      } finally {
        // Restore button state
        testButton.disabled = false;
        testButton.innerHTML = originalText;
      }
    });
  }
}); 