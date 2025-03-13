const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { OpenAI } = require('openai');
const cors = require('cors')({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// Initialize OpenAI client - you'll need to set this in Firebase Functions config
const openai = new OpenAI({
  apiKey: functions.config().openai?.key || 'YOUR_OPENAI_API_KEY', // REPLACE WITH ACTUAL KEY IN PRODUCTION
});

/**
 * Generates a relationship message using OpenAI
 * 
 * Expected data format:
 * {
 *   relationshipType: string,
 *   status: string,
 *   frequency: string,
 *   challenges: string[],
 *   message: string (additional context)
 * }
 */
exports.generateMessage = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to generate messages.'
    );
  }

  try {
    const { relationshipType, status, frequency, challenges, message } = data;
    
    // Validation
    if (!relationshipType || !status || !frequency) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Required parameters missing'
      );
    }

    // Format challenges for the prompt
    const challengesText = challenges && challenges.length > 0 
      ? `The relationship faces these challenges: ${challenges.join(', ')}. ` 
      : '';
    
    // Format additional context
    const additionalContext = message 
      ? `Additional context: ${message}. ` 
      : '';

    // Create the prompt for OpenAI
    const prompt = `
      Create a heartfelt message for my ${relationshipType}. 
      Our relationship status is ${status} and we communicate ${frequency}. 
      ${challengesText}
      ${additionalContext}
      The message should be personal, positive, and express care and understanding. 
      It should address any challenges mentioned but maintain a constructive tone.
      The message should be 2-3 paragraphs long and feel genuine, not artificial.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Use GPT-4 for best quality
      messages: [
        {
          role: "system", 
          content: "You are a relationship communication expert who helps people express their feelings in heartfelt, authentic ways."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7, // Balance creativity and coherence
      max_tokens: 500, // Limit response length
    });

    // Extract the generated message
    const generatedMessage = completion.choices[0].message.content.trim();

    // Log for analytics (without personal details)
    console.log(`Generated message for relationship type: ${relationshipType}`);

    // Return the generated message
    return {
      success: true,
      message: generatedMessage,
    };
  } catch (error) {
    console.error('Error generating message:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate message. Please try again.',
      error.message
    );
  }
});

/**
 * Saves a message to Firestore
 */
exports.saveMessage = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to save messages.'
    );
  }

  try {
    const { relationshipType, status, frequency, challenges, content } = data;
    
    // Validation
    if (!relationshipType || !status || !content) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Required message data missing'
      );
    }

    // Add message to Firestore
    const messageRef = await admin.firestore().collection('messages').add({
      userId: context.auth.uid,
      relationshipType,
      status,
      frequency,
      challenges: challenges || [],
      content,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      success: true,
      messageId: messageRef.id,
    };
  } catch (error) {
    console.error('Error saving message:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      'Failed to save message. Please try again.',
      error.message
    );
  }
}); 