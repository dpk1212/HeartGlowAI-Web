const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

// Rate limiting configuration
const rateLimit = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10 // maximum 10 requests per minute per user
};

// Helper function to verify Firebase ID token
async function verifyAuth(req) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    throw new Error('No Firebase ID token was passed');
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  return admin.auth().verifyIdToken(idToken);
}

// Helper function to check rate limit
async function checkRateLimit(userId) {
  const userRef = admin.firestore().collection('users').doc(userId);
  const requestsRef = userRef.collection('requests');
  
  // Get timestamp for one minute ago
  const oneMinuteAgo = new Date(Date.now() - rateLimit.windowMs);
  
  // Count requests in the last minute
  const snapshot = await requestsRef
    .where('timestamp', '>', oneMinuteAgo)
    .count()
    .get();
    
  if (snapshot.data().count >= rateLimit.maxRequests) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  // Log this request
  await requestsRef.add({
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
}

// API endpoint to generate messages
exports.generateMessage = onRequest({
  cors: true,
  secrets: ["OPENAI_KEY"],
  maxInstances: 10,
  invoker: "public"
}, async (req, res) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Verify Firebase authentication
    const decodedToken = await verifyAuth(req);
    const userId = decodedToken.uid;
    
    // Check rate limit
    await checkRateLimit(userId);
    
    // Get request data with new fields
    const { 
      scenario, 
      relationshipType,
      tone = 'casual',
      toneIntensity = '3',
      relationshipDuration = 'unspecified',
      specialCircumstances = '',
      previousMessage = '',
      userFeedback = ''
    } = req.body;
    
    if (!scenario || !relationshipType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get the API key from secrets
    const apiKey = process.env.OPENAI_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    
    // Enhanced system prompt with more context
    const systemPrompt = `You are HeartGlowAI, an empathetic AI assistant specializing in crafting thoughtful, 
    authentic messages for personal relationships. Your expertise includes understanding relationship dynamics 
    and emotional contexts. Your goal is to help people communicate more effectively and meaningfully with 
    their loved ones.

    You will provide two parts in your response:
    1. A message that fits the requested parameters
    2. A brief analysis of why the message is effective (2-3 key insights)

    When crafting messages:
    - Consider the relationship type and duration to reflect appropriate depth and familiarity
    - Adapt the tone and style to match the requested communication style and intensity level
    - Keep messages authentic, personal, and emotionally resonant
    - Focus on strengthening the relationship and fostering positive communication
    - Adjust the emotional intensity based on the provided scale (1=subtle, 3=balanced, 5=strong)
    - If user feedback is provided, carefully incorporate their suggestions while maintaining authenticity

    When providing insights:
    - Explain how the message aligns with the relationship dynamics
    - Point out specific elements that make it effective
    - Highlight how the tone and intensity choices enhance the message
    - If this is a revised message, explain how the changes address the user's feedback`;
    
    // Build a detailed context for the user prompt
    let contextDetails = [];
    if (relationshipDuration !== 'unspecified') {
      contextDetails.push(`This is a ${relationshipDuration} relationship`);
    }
    if (specialCircumstances) {
      contextDetails.push(`Special context: ${specialCircumstances}`);
    }
    if (previousMessage && userFeedback) {
      contextDetails.push(`Previous message: "${previousMessage}"`);
      contextDetails.push(`User feedback: "${userFeedback}"`);
    }
    
    const contextString = contextDetails.length > 0 
      ? `\n\nAdditional context:\n${contextDetails.join('\n')}`
      : '';

    const intensityLevel = {
      '1': 'very subtle and gentle',
      '2': 'mild and soft',
      '3': 'balanced and natural',
      '4': 'strong and pronounced',
      '5': 'very strong and intense'
    }[toneIntensity] || 'balanced and natural';
    
    // Make API call to OpenAI using axios
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4-0125-preview",
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `${previousMessage && userFeedback ? 'Revise the previous message based on user feedback.' : 'Create a message'} for a ${relationshipType} relationship in this scenario: ${scenario}.${contextString}

The message should be:
- About 2-4 sentences long
- Written in a ${tone} tone with ${intensityLevel} emotional expression
- Authentic and personal
- Appropriate for the relationship type and duration
- Mindful of any special circumstances${previousMessage && userFeedback ? '\n- Incorporate the user\'s feedback while maintaining the message\'s authenticity' : ''}

After the message, provide 2-3 brief insights about why this message is effective. Format your response exactly like this:

MESSAGE:
[Your message here]

INSIGHTS:
• [First insight about why the message works]
• [Second insight about why the message works]
• [Optional third insight]` 
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    const fullResponse = response.data.choices[0].message.content.trim();
    
    // Split the response into message and insights
    const [messagePart, insightsPart] = fullResponse.split('INSIGHTS:').map(part => part.trim());
    const message = messagePart.replace('MESSAGE:', '').trim();
    const insights = insightsPart ? insightsPart.split('•').filter(insight => insight.trim()).map(insight => insight.trim()) : [];
    
    // Return both message and insights
    return res.status(200).json({ 
      message,
      insights
    });
    
  } catch (error) {
    console.error('Error generating message:', error);
    
    // Handle specific error cases
    if (error.response) {
      // OpenAI API error
      return res.status(error.response.status).json({ 
        error: error.response.data.error?.message || 'Failed to generate message' 
      });
    } else if (error.request) {
      // Network error
      return res.status(503).json({ error: 'Network error - please try again' });
    } else {
      // Other errors
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}); 