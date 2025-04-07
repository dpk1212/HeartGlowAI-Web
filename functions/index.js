const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const axios = require('axios');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Create a NEW function with a different name to avoid conflicts
exports.generateMessageV2 = functions.https.onRequest(async (req, res) => {
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
        configurator = {},
        context = "",
        format = "",
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

      // Extract configurator data for more specific formatting
      const messageCategory = configurator.category || context || "";
      const messageFormat = configurator.format || format || "";
      const messageIntention = configurator.intention || intent.type || "";

      // Construct an enhanced system prompt based on user's requirements
      const systemPrompt = `You are an expert in interpersonal communication with deep understanding of human psychology, emotional intelligence, and relationship dynamics. Your expertise spans both personal and professional contexts.

Your task is to craft a highly personalized, emotionally resonant message that feels genuinely human and specific to the relationship context provided. The message will reflect both the sender's intention and the unique aspects of their relationship with the recipient.

CORE PRINCIPLES:
- Write with authenticity as if one real person is communicating to another
- Avoid all AI-like language patterns, clichés, corporate speak, and generic platitudes
- Incorporate specific details from the relationship context to make it feel genuinely personalized
- Match the emotional tone and language style to the relationship dynamic and intention
- Capture the nuance of human communication with appropriate warmth, vulnerability, or formality
- Structure messages with natural pacing and paragraph breaks appropriate to the format

FORMAT GUIDELINES:
${messageFormat === 'text' ? `For TEXT MESSAGES:
- Keep it concise (1-3 paragraphs maximum)
- Use casual language with natural punctuation, and occasional emoji if appropriate
- Structure it like a real text message with appropriate brevity
- Don't use subject lines or formal salutations` : ''}

${messageFormat === 'email' ? `For EMAILS:
- Include an appropriate subject line as the first line prefixed with "Subject: "
- Use proper email structure with greeting, body paragraphs, and sign-off
- Maintain appropriate professional tone while still being personable
- Format with clear paragraph breaks and appropriate length (3-5 paragraphs)` : ''}

${messageFormat === 'card' ? `For GREETING CARDS:
- Create a message suitable for a handwritten card or note
- Include a warm greeting and heartfelt closing
- Make it personal, intimate, and visually imagine it written by hand
- Ensure it has the appropriate emotional depth for a physical card` : ''}

${messageFormat === 'conversation' ? `For CONVERSATION STARTERS:
- Provide 3-5 specific conversation topics or questions
- Make each topic genuine, thoughtful, and likely to spark meaningful dialogue
- Format as a numbered list with brief context for why each topic would resonate
- Avoid basic small talk in favor of topics that build genuine connection` : ''}

CONTEXTUAL ADJUSTMENTS:
${messageCategory === 'professional' ? `For PROFESSIONAL CONTEXT:
- Balance warmth with appropriate professional boundaries
- Use language suitable for workplace or business relationships
- Acknowledge professional accomplishments or challenges specifically
- Maintain clarity and purpose without sacrificing interpersonal connection` : ''}

${messageCategory === 'personal' ? `For PERSONAL CONTEXT:
- Emphasize emotional connection and shared experiences
- Use warmer, more intimate language appropriate for close relationships
- Include references to personal memories, inside jokes, or shared values
- Allow for greater vulnerability and emotional expressiveness` : ''}

RESPONSE FORMAT:
1. Generate ONLY the message with no introduction, explanation, or meta-commentary
2. After the message, on a new line, include "INSIGHTS:" followed by 3 brief insights (each on a new line starting with "-") that explain why the message is effective

${messageIntention ? `SPECIFIC INTENTION GUIDANCE:
The core intention is "${messageIntention}". Ensure the message authentically expresses this intention through both explicit statements and implicit tone.` : ''}`;
      
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
${recipient.birthday ? `- Birthday: ${recipient.birthday}` : ''}
${recipient.interests ? `- Interests: ${recipient.interests}` : ''}

TONE: ${tone.type || 'Warm'} (Intensity: ${tone.intensity || 'Medium'})

FORMAT: ${messageFormat || 'General message'}
CONTEXT: ${messageCategory || 'General context'}

${variation ? `VARIATION: Please make this message ${variation} than a standard message.` : ''}`;

      // Add contextual examples based on format and category to guide the model
      if (messageFormat === 'text' && messageCategory === 'professional') {
        userPrompt += `
EXAMPLE TEXT IN PROFESSIONAL CONTEXT:
Hi Sarah, I wanted to reach out and say how impressed I was with your presentation yesterday. The way you handled those tough questions showed real expertise. Looking forward to collaborating more on this project!`;
      } else if (messageFormat === 'email' && messageCategory === 'professional') {
        userPrompt += `
EXAMPLE EMAIL IN PROFESSIONAL CONTEXT:
Subject: Your Outstanding Leadership on the Wilson Project

Hi Michael,

I just wanted to take a moment to recognize the exceptional work you've been doing leading the Wilson account. Your strategic approach to their concerns last week not only resolved the immediate issues but strengthened our relationship with their team.

What particularly stood out was how you prioritized understanding their underlying needs rather than just addressing surface-level requests. This kind of insight is exactly what makes you such a valuable part of our team.

Looking forward to our continued collaboration.

Best regards,
[Name]`;
      } else if (messageFormat === 'text' && messageCategory === 'personal') {
        userPrompt += `
EXAMPLE TEXT IN PERSONAL CONTEXT:
Hey Chris, been thinking about our conversation last week. Your advice about taking more time for myself really hit home. I finally tried that hiking trail you mentioned and you were right - the view was exactly what I needed. Thank you for always knowing just what to say. Coffee soon?`;
      }

      // Use GPT-4 for best quality
      const model = "gpt-4-turbo-preview";
      const maxTokens = 1000;
      
      console.log('Sending request with format:', messageFormat, 'and context:', messageCategory);
      
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
        usage: response.data.usage,
        format: messageFormat,
        context: messageCategory,
        intention: messageIntention
      });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        error: `Error generating message: ${error.message}` 
      });
    }
  });
}); 