const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
admin.initializeApp();

// Securely retrieve the OpenAI API key from Firestore
async function getOpenAIKey() {
  try {
    const db = admin.firestore();
    const secretDoc = await db.collection('secrets').doc('openaiKey').get();
    
    if (!secretDoc.exists) {
      console.error('OpenAI API key document not found in Firestore');
      throw new Error('API key configuration not found');
    }
    
    const apiKey = secretDoc.data().openaiKey;
    if (!apiKey) {
      console.error('OpenAI API key field not found in document');
      throw new Error('API key field not found');
    }
    
    return apiKey;
  } catch (error) {
    console.error('Error retrieving OpenAI API key from Firestore:', error);
    throw error;
  }
}

// Securely provide the OpenAI API key
exports.getOpenAIKey = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    // For added security, check authentication if needed
    let authenticated = false;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const idToken = req.headers.authorization.split('Bearer ')[1];
      try {
        await admin.auth().verifyIdToken(idToken);
        authenticated = true;
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    }
    
    // Only allow authenticated users in production
    const isProduction = process.env.NODE_ENV === 'production';
    if (isProduction && !authenticated) {
      console.warn('Unauthenticated access attempt to API key in production');
      return res.status(403).json({ error: 'Authentication required' });
    }
    
    // Get the API key from Firestore
    const openaiApiKey = await getOpenAIKey();
    
    // Only return first few and last few characters for logging
    const maskedKey = `${openaiApiKey.substring(0, 3)}...${openaiApiKey.substring(openaiApiKey.length - 3)}`;
    console.log(`Providing API key ${maskedKey} to ${authenticated ? 'authenticated' : 'unauthenticated'} user`);
    
    // Return the API key
    return res.status(200).json({ key: openaiApiKey });
    
  } catch (error) {
    console.error('Error in getOpenAIKey function:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Direct message generation endpoint (even more secure approach)
exports.generateMessage = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { scenario, relationshipType } = req.body;
    
    if (!scenario || !relationshipType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Get the API key from Firestore
    const apiKey = await getOpenAIKey();
    
    // OpenAI configuration
    const systemPrompt = `You are HeartGlowAI, a helpful AI assistant that specializes in crafting thoughtful, 
    authentic messages for personal relationships. Your goal is to help people communicate more effectively and 
    meaningfully with their loved ones. Based on the scenario and relationship type provided, 
    create a heartfelt message (about 2-4 sentences).`;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
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
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error response:', errorData);
      return res.status(500).json({ error: errorData.error?.message || 'Failed to generate message' });
    }
    
    const data = await response.json();
    const message = data.choices[0].message.content.trim();
    
    return res.status(200).json({ message });
    
  } catch (error) {
    console.error('Error in generateMessage function:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}); 