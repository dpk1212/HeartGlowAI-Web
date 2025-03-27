const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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
    
    // Get the API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
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