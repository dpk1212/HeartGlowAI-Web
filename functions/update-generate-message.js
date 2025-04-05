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
        scenario, 
        relationshipType,
        tone = 'casual',
        toneIntensity = '3',
        relationshipDuration = 'unspecified',
        specialCircumstances = '',
        previousMessage = '',
        userFeedback = '',
        messageToAnalyze = '',
        recipientContext = '',
        blueprintData = {},
        apiKey = null // Check if API key is provided in request
      } = req.body;
      
      // Check required fields based on mode
      if (messageToAnalyze && recipientContext) {
        // This is a preview/analysis request
        console.log("Message analysis request received");
      } else if (!scenario || !relationshipType) {
        res.status(400).json({ error: 'Scenario and relationshipType are required' });
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

      // Blueprint data handling
      let blueprintContextString = '';
      if (blueprintData && Object.keys(blueprintData).length > 0) {
        blueprintContextString = `
RELATIONSHIP BLUEPRINT CONTEXT:
Person: ${blueprintData.personName || 'Unspecified'} (${blueprintData.relationshipType || relationshipType})
Goal: ${blueprintData.goal || 'Unspecified'}
Key Dynamics: ${blueprintData.relationshipDescription || 'Unspecified'}
${blueprintData.qanda ? `Specific Details: ${JSON.stringify(blueprintData.qanda)}` : ''}`;
      }

      let model = "gpt-4-turbo-preview";
      let maxTokens = 1000;
      let systemPrompt = '';
      let prompt = '';

      // Prepare prompts based on request type
      if (messageToAnalyze && recipientContext) {
        // Analysis request
        systemPrompt = `You are an expert in communication psychology, emotional intelligence, and relationship dynamics. Your task is to analyze a message and provide feedback on its effectiveness.`;
        prompt = `Analyze this message in the context provided. Evaluate its effectiveness, appropriateness, and suggest improvements.
        
MESSAGE TO ANALYZE:
${messageToAnalyze}

RECIPIENT CONTEXT:
${recipientContext}

Provide a detailed analysis including strengths, potential weaknesses, and suggestions for improvement.`;
      } else if (previousMessage && userFeedback) {
        // Tweak request
        systemPrompt = `You are an expert in interpersonal communication and relationship dynamics. Your task is to improve a message based on specific feedback.`;
        prompt = `Revise the following message based on the user's feedback. Create a completely new version that addresses their concerns.

ORIGINAL MESSAGE:
${previousMessage}

USER FEEDBACK:
${userFeedback}

SCENARIO:
${scenario}

RELATIONSHIP:
Type: ${relationshipType}
Duration: ${relationshipDuration}
Tone: ${tone} (intensity: ${toneIntensity}/5)
${specialCircumstances ? `Special circumstances: ${specialCircumstances}` : ''}
${blueprintContextString}

RESPONSE FORMAT:
First provide ONLY the revised message text with no introduction.
Then, on a new line add "INSIGHTS:" followed by 3-4 structured insights about the improvements made. Format each insight as "Title: Description" where the title is a short 2-3 word summary and the description explains the specific improvement made and why it's effective.`;
      } else {
        // Standard message generation
        systemPrompt = `You are an expert in interpersonal communication and relationship dynamics. Your role is to create authentic, effective messages tailored to specific relationship contexts. Focus on emotional intelligence, clear communication, and relationship-building techniques.`;

        prompt = `Create a message for a ${relationshipType} relationship in this scenario: ${scenario}. Tone: ${tone} (intensity: ${toneIntensity}/5). Relationship duration: ${relationshipDuration}.${specialCircumstances ? ` Special circumstances: ${specialCircumstances}.` : ''}${blueprintContextString}
        
RESPONSE FORMAT:
First provide ONLY the message text with no introduction or context.
Then, on a new line add "INSIGHTS:" followed by 3-4 structured insights. Format each insight as "Title: Description" where Title is 2-3 words capturing the key communication technique or emotional element, and Description explains how this specific element works in the message and why it's effective for this relationship context.

Examples of good insight formats:
- "Emotional Validation: The message acknowledges their feelings about [specific aspect] which creates psychological safety."
- "Future Focus: Mentioning specific plans for [activity] provides something positive to look forward to."
- "Shared History: Referencing the [specific memory] strengthens your connection by activating positive associations."

Keep insights concise (1-2 sentences each) but specific to this exact message and relationship.`;
      }

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
            { 
              role: 'system', 
              content: systemPrompt
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: maxTokens
        }
      });

      // Process response based on the type of request
      if (messageToAnalyze && recipientContext) {
        // Return analysis
        res.status(200).json({ 
          analysis: response.data.choices[0].message.content
        });
      } else {
        // Process the response to separate message and insights
        const responseContent = response.data.choices[0].message.content;
        const parts = responseContent.split(/INSIGHTS:/i);
        
        let message = '';
        let insights = [];
        
        if (parts.length >= 2) {
          message = parts[0].trim();
          
          // Process insights from the second part
          const insightsText = parts[1].trim();
          insights = insightsText
            .split(/\n+/)
            .map(line => line.replace(/^[•\-\*]\s*/, '').trim())
            .filter(line => line.length > 0);
        } else {
          // Fallback if format wasn't followed
          message = responseContent.trim();
        }

        // Return the result for standard message generation
        res.status(200).json({ 
          message: message,
          insights: insights,
          usage: response.data.usage
        });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        error: `Error generating message: ${error.message}` 
      });
    }
  });
}); 