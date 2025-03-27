const { onRequest } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

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
    // Get request data
    const { scenario, relationshipType } = req.body;
    
    if (!scenario || !relationshipType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get the API key from secrets
    const apiKey = process.env.OPENAI_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    
    // OpenAI API configuration
    const systemPrompt = `You are HeartGlowAI, a helpful AI assistant that specializes in crafting thoughtful, 
    authentic messages for personal relationships. Your goal is to help people communicate more effectively and 
    meaningfully with their loved ones. Based on the scenario and relationship type provided, 
    create a heartfelt message (about 2-4 sentences).`;
    
    // Make API call to OpenAI using axios
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Create a heartfelt message for a ${relationshipType} relationship in this scenario: ${scenario}. 
            Keep it authentic, personal, and emotionally resonant. The message should be about 2-4 sentences.` 
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    const message = response.data.choices[0].message.content.trim();
    
    // Return the generated message
    return res.status(200).json({ message });
    
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