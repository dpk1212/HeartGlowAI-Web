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
 *   recipient: string,
 *   relationship: string,
 *   occasion: string,
 *   tone: string,
 *   emotionalState: string,
 *   desiredOutcome: string,
 *   additionalInfo: string
 * }
 */
exports.generateMessage = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    console.error("Authentication error: User not authenticated");
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to generate messages.'
    );
  }

  console.log("generateMessage function called with data:", JSON.stringify(data));
  console.log("User ID:", context.auth.uid);

  try {
    const { 
      recipient, 
      relationship, 
      occasion, 
      tone,
      emotionalState = "Hopeful & Motivated", // Default if not provided
      desiredOutcome = "Strengthen the Bond", // Default if not provided
      additionalInfo = "" // Additional context
    } = data;
    
    // Validation
    if (!recipient || !relationship || !occasion) {
      console.error("Validation error: Missing required parameters", { recipient, relationship, occasion });
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Required parameters missing'
      );
    }

    // Format additional context
    const additionalContext = additionalInfo ? `Additional context: ${additionalInfo}` : '';

    // Create the system prompt
    const systemPrompt = `You are HeartGlowAI, an AI-powered relationship coach designed to help users improve communication and strengthen relationships with their romantic partners, friends, or family members. Your goal is to provide empathetic, non-judgmental, and actionable advice that helps users feel understood and empowered. Always validate the user's emotions, offer practical communication strategies, and suggest how they can improve their situation. Keep responses warm, uplifting, and solution-focused. Responses should be concise, approximately 100-200 words in length, ensuring they provide value without overwhelming the user.`;

    // Create the user prompt
    const userPrompt = `A user is seeking help with communicating with their ${recipient} who is their ${relationship}. 
The occasion is: ${occasion}.
They want to use a ${tone} tone.
They are feeling ${emotionalState} and want to ${desiredOutcome}. 
${additionalContext}

Provide a response in the following format:

1️⃣ Empathy & Validation – Acknowledge their feelings in 1-2 sentences.
2️⃣ Insight into the Issue (if necessary) – Explain in 1-2 sentences why this may be happening.
3️⃣ Heartfelt Message Suggestion – Provide a clear, empathetic, and effective message they could send. Ensure it aligns with their desired outcome.
4️⃣ Encouragement & Next Steps – Offer 1-2 sentences to reinforce their confidence and suggest a next step.

Keep responses warm, uplifting, and under 200 words so they are easy to read and apply. Avoid jargon or complex explanations.`;

    console.log("Calling OpenAI API with prompts");
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Use GPT-4 for best quality
      messages: [
        {
          role: "system", 
          content: systemPrompt
        },
        {
          role: "user", 
          content: userPrompt
        }
      ],
      temperature: 0.7, // Balance creativity and coherence
      max_tokens: 500, // Limit response length
    });

    // Extract the generated message
    const generatedMessage = completion.choices[0].message.content.trim();

    // Log for analytics (without personal details)
    console.log(`Generated message for recipient type: ${recipient}, message length: ${generatedMessage.length}`);

    // Return the generated message in a consistent format
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
    const { 
      recipient, 
      relationship, 
      occasion, 
      tone,
      emotionalState,
      desiredOutcome,
      additionalInfo,
      message 
    } = data;
    
    // Validation
    if (!recipient || !relationship || !message) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Required message data missing'
      );
    }

    // Add message to Firestore
    const messageRef = await admin.firestore().collection('messages').add({
      userId: context.auth.uid,
      recipient,
      relationship,
      occasion,
      tone,
      emotionalState,
      desiredOutcome,
      additionalInfo,
      content: message,
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