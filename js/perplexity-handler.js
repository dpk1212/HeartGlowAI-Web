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
  return `${basePrompt}

Please provide a comprehensive, well-structured answer with:
1. Clear headings for main points
2. Citations to reliable academic sources, medical journals, or other authoritative references
3. Numbered citations in the format [1], [2], etc.
4. A complete list of sources at the end of your response

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
  
  // Format the main content with enhanced citation references
  if (citations.length > 0) {
    // Replace citation indices with superscript links
    citations.forEach(citation => {
      const refRegex = new RegExp(`\\[${citation.index}\\]`, 'g');
      content = content.replace(refRegex, `<sup class="citation-ref" data-index="${citation.index}">[${citation.index}]</sup>`);
    });
  }
  
  // Create HTML structure for the response with improved formatting
  let html = '<div class="perplexity-response">';
  
  // Add the main content with paragraphs preserved
  const paragraphs = content.trim().split(/\n\n+/);
  html += '<div class="response-content">';
  paragraphs.forEach(paragraph => {
    if (paragraph.trim()) {
      html += `<p>${paragraph.trim().replace(/\n/g, '<br>')}</p>`;
    }
  });
  html += '</div>';
  
  // Add citations section if available
  if (citations.length > 0) {
    html += '<div class="citations-section">';
    
    // Add tabbed navigation for citations
    html += '<div class="citations-tabs">';
    html += '<div class="citation-tab active" data-tab="list">Sources</div>';
    html += '<div class="citation-tab" data-tab="grid">References</div>';
    html += '</div>';
    
    // Sources list view (default)
    html += '<div class="citation-tab-content" id="tab-list">';
    html += '<ol class="citations-list">';
    
    citations.forEach(citation => {
      html += `<li id="citation-${citation.index}" class="citation-item">`;
      
      if (citation.url) {
        html += `<a href="${citation.url}" target="_blank" rel="noopener noreferrer" class="citation-link">`;
        html += `<div class="citation-title">${citation.title || 'Source'}</div>`;
        html += `<div class="citation-url">${citation.url}</div>`;
        html += '</a>';
      } else {
        html += `<div class="citation-title">${citation.title || 'Source'}</div>`;
        html += `<div class="citation-text">${citation.text}</div>`;
      }
      
      html += '</li>';
    });
    
    html += '</ol></div>';
    
    // References grid view (alternative view)
    html += '<div class="citation-tab-content" id="tab-grid" style="display: none;">';
    html += '<div class="citations-grid">';
    
    citations.forEach(citation => {
      html += `<div class="citation-card" id="citation-grid-${citation.index}">`;
      html += `<span class="citation-number">${citation.index}</span>`;
      
      html += `<div class="citation-card-content">`;
      if (citation.url) {
        html += `<a href="${citation.url}" target="_blank" rel="noopener noreferrer" class="citation-card-title">${citation.title}</a>`;
      } else {
        html += `<div class="citation-card-title">${citation.title}</div>`;
      }
      
      html += `<div class="citation-meta">Reference ${citation.index}</div>`;
      
      if (citation.url) {
        html += `<a href="${citation.url}" target="_blank" rel="noopener noreferrer" class="citation-goto">View Source →</a>`;
      }
      
      html += '</div></div>';
    });
    
    html += '</div></div>';
    
    html += '</div>'; // Close citations-section
  }
  
  html += '</div>';
  
  // Set the HTML to the container
  containerElement.innerHTML = html;
  
  // Add event listeners to citation references with improved highlighting
  setTimeout(() => {
    const refs = containerElement.querySelectorAll('.citation-ref');
    refs.forEach(ref => {
      ref.addEventListener('click', () => {
        const index = ref.getAttribute('data-index');
        const citationItem = containerElement.querySelector(`#citation-${index}`);
        
        // Remove highlight from all citations first
        document.querySelectorAll('.citation-item, .citation-card').forEach(item => {
          item.classList.remove('highlight');
        });
        
        if (citationItem) {
          // Make sure we're on the list tab view
          const listTab = containerElement.querySelector('.citation-tab[data-tab="list"]');
          if (listTab) {
            listTab.click();
          }
          
          // Smooth scroll to the citation
          citationItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add highlight class
          citationItem.classList.add('highlight');
          
          // Remove highlight after delay
          setTimeout(() => {
            citationItem.classList.remove('highlight');
          }, 3000);
        }
      });
    });
    
    // Add tab switching functionality
    const tabs = containerElement.querySelectorAll('.citation-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to current tab
        tab.classList.add('active');
        
        // Hide all tab content
        containerElement.querySelectorAll('.citation-tab-content').forEach(content => {
          content.style.display = 'none';
        });
        
        // Show current tab content
        const tabId = tab.getAttribute('data-tab');
        containerElement.querySelector(`#tab-${tabId}`).style.display = 'block';
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
      // Handle API-specific errors
      console.error('Perplexity API error:', apiError);
      
      // Create a more user-friendly error message
      const errorMessage = apiError.message.includes('Perplexity API error') 
        ? apiError.message 
        : 'Unable to complete the research query. Please try again later.';
      
      containerElement.innerHTML = `
        <div class="perplexity-response">
          <div class="error-message">
            <strong>Research Error:</strong> ${errorMessage}
          </div>
          <div style="margin-top: 16px; font-size: 14px; color: var(--text-secondary, rgba(255,255,255,0.7));">
            <p>Possible solutions:</p>
            <ul>
              <li>Check your API key configuration</li>
              <li>Try a different, more specific query</li>
              <li>Reduce the complexity of your question</li>
            </ul>
          </div>
        </div>
      `;
      
      throw apiError;
    }
  } catch (error) {
    // Handle general errors
    console.error('Perplexity research failed:', error);
    
    if (containerElement && !containerElement.querySelector('.error-message')) {
      containerElement.innerHTML = `
        <div class="perplexity-response">
          <div class="error-message">
            <strong>Error:</strong> ${error.message}
          </div>
        </div>
      `;
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

/**
 * PerplexityHandler - Handles interactions with Perplexity AI for research queries
 * This is a mock implementation for demonstration purposes
 */
class PerplexityHandler {
  constructor() {
    this.isReady = true;
    console.log('PerplexityHandler initialized');
  }

  /**
   * Submit a query to the Perplexity API
   * @param {string} query - The research query to submit
   * @returns {Promise} - Promise that resolves with the response
   */
  submitQuery(query) {
    return new Promise((resolve) => {
      console.log('Submitting research query:', query);
      
      // Simulate API delay
      setTimeout(() => {
        resolve(this.generateMockResponse(query));
      }, 2000);
    });
  }

  /**
   * Generate mock response for demonstration
   * @param {string} query - The original query
   * @returns {Object} - Mock response object
   */
  generateMockResponse(query) {
    const topics = {
      'communication': {
        title: 'Communication Styles in Relationships',
        category: 'Communication',
        content: `
# Understanding Communication Styles in Relationships

Effective communication is the cornerstone of healthy relationships. Different people have distinct communication styles that can significantly impact how they interact with others.

## Common Communication Styles

**Assertive Communication**: This style involves expressing thoughts, feelings, and needs in a direct, honest, and appropriate way while respecting others' boundaries. Assertive communicators use "I" statements, maintain appropriate eye contact, and speak with a calm, clear voice.

**Passive Communication**: People with this style tend to avoid expressing their thoughts, feelings, or needs directly. They often prioritize others' needs over their own, avoid conflict, and may struggle with setting boundaries.

**Aggressive Communication**: This style involves expressing thoughts, feelings, and needs in a way that violates others' boundaries. Aggressive communicators may use "you" statements that blame or accuse, speak loudly, and display intimidating body language.

**Passive-Aggressive Communication**: This style combines elements of passive and aggressive communication. People may appear passive on the surface but express negative feelings indirectly through subtle actions, sarcasm, or by withholding positive behaviors.

## Identifying Your Communication Style

To identify your communication style, reflect on:
- How you typically respond in conflicts
- Your comfort level with expressing needs and emotions
- Your body language during difficult conversations
- How others typically respond to your communication

## Practical Strategies for Effective Communication

1. **Practice active listening**: Give your full attention, avoid interrupting, and validate the other person's perspective.

2. **Use "I" statements**: Frame your thoughts around your experience rather than blaming others (e.g., "I feel frustrated when plans change last minute" instead of "You always change plans").

3. **Be mindful of non-verbal cues**: Body language, facial expressions, and tone of voice all contribute to how your message is received.

4. **Adapt to different styles**: Recognize when you're communicating with someone who has a different style and adjust accordingly.

5. **Check for understanding**: Periodically summarize or ask clarifying questions to ensure mutual understanding.

Improving your communication style is a journey that requires practice, patience, and self-awareness. By understanding your own tendencies and learning to adapt when necessary, you can build stronger, more connected relationships.
`,
        citations: [
          {
            title: 'The Four Communication Styles',
            url: 'https://www.betterup.com/blog/communication-styles',
            snippet: 'This article outlines the four primary communication styles and how they impact personal and professional relationships.'
          },
          {
            title: 'Effective Communication in Relationships',
            url: 'https://www.gottman.com/blog/communication-mistakes/',
            snippet: 'The Gottman Institute explores common communication mistakes couples make and how to overcome them.'
          }
        ]
      },
      'conflict': {
        title: 'Conflict Resolution Techniques',
        category: 'Conflict Management',
        content: `
# Effective Conflict Resolution in Relationships

Conflict is inevitable in any relationship, but how we handle these disagreements determines whether they strengthen or damage our connections. Healthy conflict resolution skills are essential for maintaining strong, resilient relationships.

## Step-by-Step Approach to Resolving Conflicts

### 1. Create the Right Environment
- Choose an appropriate time when both parties are calm
- Find a private, neutral space without distractions
- Set a positive tone by acknowledging the shared goal of resolution

### 2. Define the Issue Clearly
- Focus on one specific issue at a time
- Describe the behavior or situation objectively without accusations
- Explain the impact using "I" statements

### 3. Listen Actively and Empathetically
- Give your full attention when the other person speaks
- Avoid interrupting or planning your response while they're talking
- Validate their feelings even if you disagree with their perspective
- Reflect back what you've heard to confirm understanding

### 4. Find Common Ground
- Identify shared goals, values, or interests
- Acknowledge areas where you agree before addressing disagreements
- Focus on the present issue rather than past conflicts

### 5. Explore Solutions Together
- Brainstorm potential solutions without immediately evaluating them
- Consider multiple options before deciding
- Be willing to compromise where appropriate
- Create solutions that address both parties' core needs

### 6. Agree on a Specific Plan
- Clearly define what each person will do differently
- Be specific about behaviors, not general promises
- Set a time to check in and evaluate progress

## Common Pitfalls to Avoid

1. **Criticism**: Attacking character rather than addressing specific behaviors
2. **Defensiveness**: Refusing to acknowledge any responsibility
3. **Stonewalling**: Withdrawing from the conversation completely
4. **Contempt**: Expressing disgust or superiority toward your partner
5. **Escalation**: Allowing emotions to intensify rather than staying focused on resolution
6. **Bringing up past conflicts**: Using past issues as ammunition

## Signs of Healthy Conflict Resolution

- Both parties feel heard and respected
- The relationship feels stronger after resolving the conflict
- New understanding and growth emerge from the disagreement
- Solutions address underlying needs, not just surface issues
- Both people follow through on commitments made

Remember that effective conflict resolution is a skill that improves with practice. With patience and commitment, conflicts can become opportunities for deeper understanding and connection rather than sources of relationship damage.
`,
        citations: [
          {
            title: 'The Four Horsemen: Criticism, Contempt, Defensiveness, and Stonewalling',
            url: 'https://www.gottman.com/blog/the-four-horsemen-recognizing-criticism-contempt-defensiveness-and-stonewalling/',
            snippet: 'Dr. John Gottman explains the four communication styles that predict relationship failure.'
          },
          {
            title: 'Healthy Approaches to Conflict Resolution',
            url: 'https://www.apa.org/topics/families/resolve-conflicts',
            snippet: 'The American Psychological Association provides research-backed techniques for resolving conflicts in relationships.'
          }
        ]
      }
    };

    // Generate a response based on the query keywords
    let mockResponse = {
      answer: `# Research Results for: "${query}"\n\nThis is a simulated research response. In a fully integrated system, this would contain real AI-generated insights based on your query.\n\n## Key Points\n\n- This feature provides relationship insights through AI research\n- You can explore topics like communication, conflict resolution, and attachment theory\n- The goal is to help you understand relationship dynamics better\n\n## Next Steps\n\nIf this were connected to the Perplexity API, you would receive detailed, research-backed information about your specific question.`,
      citations: [
        {
          title: "HeartGlowAI Research Documentation",
          url: "https://heartglowai.com/research",
          snippet: "HeartGlowAI provides relationship insights through AI research."
        },
        {
          title: "Understanding Relationships",
          url: "https://example.com/relationship-research",
          snippet: "This resource covers fundamental concepts in relationship psychology."
        }
      ]
    };

    // Check for specific topics
    if (query.toLowerCase().includes('communication')) {
      mockResponse = {
        answer: topics.communication.content,
        citations: topics.communication.citations
      };
    } else if (query.toLowerCase().includes('conflict')) {
      mockResponse = {
        answer: topics.conflict.content,
        citations: topics.conflict.citations
      };
    }

    return mockResponse;
  }
} 