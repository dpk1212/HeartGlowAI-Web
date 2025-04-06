// Updated generateMessage function with improved insights formatting
exports.generateMessage = functions.https.onRequest((req, res) => {
  // Use the cors middleware to handle CORS properly
  cors(req, res, async () => {
    try {
      // Get the authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Extract the ID token
      const idToken = authHeader.split('Bearer ')[1];
      
      // Verify the ID token
      try {
        await admin.auth().verifyIdToken(idToken);
      } catch (error) {
        console.error('Error verifying ID token:', error);
        res.status(401).json({ error: 'Invalid token' });
        return;
      }

      // Get request data with new fields
      const { 
        intent = {},
        recipient = {},
        tone = {},
        variation = null,
        apiKey = null // Check if API key is provided in request
      } = req.body;
      
      // Check for required data
      if (!intent.type || !recipient.name) {
        res.status(400).json({ error: 'Intent and recipient information are required' });
        return;
      }

      // Get OpenAI API key - first try from request, then from Firestore
      let openaiApiKey;
      
      // Option 1: Use API key from request if provided
      if (apiKey) {
        console.log('Using API key provided in the request');
        openaiApiKey = apiKey;
      } else {
        // Option 2: Get API key from Firestore
        try {
          console.log('Fetching API key from Firestore...');
          const secretsDoc = await admin.firestore().collection('secrets').doc('openai').get();
          
          if (!secretsDoc.exists) {
            throw new Error('API key document not found');
          }
          
          openaiApiKey = secretsDoc.data().apiKey;
          
          if (!openaiApiKey) {
            throw new Error('API key not found in document');
          }
        } catch (error) {
          console.error('Error fetching API key from Firestore:', error);
          res.status(500).json({ error: 'Failed to access API key' });
          return;
        }
      }
      
      if (!openaiApiKey) {
        console.error('No valid API key found via any method');
        res.status(500).json({ error: 'No valid API key available' });
        return;
      }

      // Construct an enhanced system prompt based on user's requirements
      const systemPrompt = `You are an expert in heartfelt communication and relationship dynamics. 
Your task is to create an emotionally resonant, sincere message that reflects the specific relationship context provided. 

Follow these key principles:
1. Be authentic and use natural language - write as one human to another
2. Avoid sounding like AI, cliches, or corporate language
3. Match the appropriate emotional tone for the relationship and intent
4. Include specific, personalized details from the context provided
5. Keep the message concise but emotionally impactful

You MUST structure your response exactly as follows:
1. First, provide ONLY the message text with no introduction, labels or additional text
2. Then, on a new line after your message, write "INSIGHTS:" (all caps)
3. Provide 2-3 brief insights about why the message works, each on a new line prefixed with "-"

Do not add any additional commentary, explanations, or suggestions - strictly follow the format above.`;
      
      // Build detailed user prompt
      let userPrompt = `Create a heartfelt message with the following parameters:

INTENT: ${intent.type || 'Support'} 
${intent.details ? `Intent Details: ${intent.details}` : ''}

RECIPIENT: 
- Name: ${recipient.name}
- Relationship: ${recipient.relationship || 'Friend'}
${recipient.relationshipCategory ? `- Relationship Category: ${recipient.relationshipCategory}` : ''}
${recipient.relationshipFocus ? `- Focus of Relationship: ${recipient.relationshipFocus}` : ''}
${recipient.yearsKnown ? `- Known for: ${recipient.yearsKnown} years` : ''}
${recipient.communicationStyle ? `- Communication Style: ${recipient.communicationStyle}` : ''}
${recipient.personalNotes ? `- Personal Context: ${recipient.personalNotes}` : ''}

TONE: ${tone.type || 'Warm'} (Intensity: ${tone.intensity || 'Medium'})

${variation ? `VARIATION: Please make this message ${variation} than a standard message.` : ''}`;

      // Use GPT-4 for best quality
      const model = "gpt-4-turbo-preview";
      const maxTokens = 1000;
      
      // Call OpenAI API
      const response = await axios({
        method: 'post',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        data: {
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: maxTokens
        }
      });

      // Process the response to extract message and insights
      const responseContent = response.data.choices[0].message.content;
      const parts = responseContent.split(/INSIGHTS:/i);
      
      let message = '';
      let insights = [];
      
      if (parts.length >= 2) {
        message = parts[0].trim();
        
        // Extract insights as an array
        const insightsText = parts[1].trim();
        insights = insightsText
          .split(/\n+/)
          .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
          .filter(line => line.length > 0);
      } else {
        // Fallback if format wasn't followed
        message = responseContent.trim();
      }

      // Return the result
      res.status(200).json({ 
        message: message,
        insights: insights,
        usage: response.data.usage
      });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        error: `Error generating message: ${error.message}` 
      });
    }
  });
}); 