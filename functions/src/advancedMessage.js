const functions = require('firebase-functions');
const { OpenAI } = require('openai');
const admin = require('firebase-admin');

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate advanced messages with structured outputs
 */
exports.generateAdvancedMessage = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const {
    relationship_type,
    communication_scenario,
    emotional_intensity,
    recipient_name,
    conversation_name,
    additional_context
  } = data;

  try {
    // Generate a unique conversation ID
    const conversationId = admin.firestore().collection('conversations').doc().id;

    // Store the conversation context
    await admin.firestore().collection('conversations').doc(conversationId).set({
      relationship_type,
      communication_scenario,
      emotional_intensity,
      recipient_name,
      conversation_name,
      additional_context,
      userId: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Call OpenAI with structured response format
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: 'system',
          content: `You are an advanced communication coach. Generate two nuanced, contextually appropriate messages.
          
          Key Guidelines:
          - Analyze relationship dynamics
          - Balance emotional intelligence 
          - Provide clear, constructive communication`
        },
        {
          role: 'user',
          content: JSON.stringify({
            relationship_type,
            communication_scenario,
            emotional_intensity,
            recipient_name,
            conversation_name,
            additional_context
          })
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500
    });

    // Parse the response content
    const responseContent = JSON.parse(response.choices[0].message.content);
    
    // Add conversation ID to the response
    responseContent.conversation_id = conversationId;
    
    // Validate response structure
    if (!responseContent.messages || !Array.isArray(responseContent.messages) || responseContent.messages.length < 2) {
      throw new Error('Invalid AI response: messages array missing or incomplete');
    }

    // Store the generated messages
    await admin.firestore().collection('generatedMessages').add({
      conversation_id: conversationId,
      messages: responseContent.messages,
      insights: responseContent.insights,
      userId: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return responseContent;
  } catch (error) {
    console.error('Message Generation Error:', error);
    
    // Return a well-structured error response
    throw new functions.https.HttpsError(
      'internal',
      'Error generating message',
      { details: error.message }
    );
  }
});

/**
 * Collect feedback on generated messages
 */
exports.saveMessageFeedback = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { conversationId, messageText, rating, userModification } = data;

  try {
    // Store feedback
    await admin.firestore().collection('message_feedback').add({
      conversationId,
      messageText,
      rating,
      userModification,
      userId: context.auth.uid,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      aiModel: 'gpt-4-turbo',
      feedbackVersion: '1.0'
    });

    // If rating is low or user provided modifications, offer regeneration
    if (rating < 3 || userModification) {
      // Fetch original conversation context
      const conversationDoc = await admin.firestore()
        .collection('conversations')
        .doc(conversationId)
        .get();
      
      if (!conversationDoc.exists) {
        throw new Error('Original conversation context not found');
      }

      const conversationData = conversationDoc.data();

      // Call OpenAI with user feedback for improved response
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: 'system',
            content: `You are an advanced communication coach. Generate an improved message based on user feedback.
            
            Key Guidelines:
            - Address the specific concerns in the user feedback
            - Maintain emotional intelligence and tone appropriateness
            - Create a more effective communication`
          },
          {
            role: 'user',
            content: JSON.stringify({
              original_context: conversationData,
              original_message: messageText,
              user_feedback: userModification,
              rating
            })
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 500
      });

      // Parse and return improved message
      const improvedResponse = JSON.parse(response.choices[0].message.content);
      improvedResponse.conversation_id = conversationId;
      
      return improvedResponse;
    }

    return { success: true };
  } catch (error) {
    console.error('Feedback Error:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error processing feedback',
      { details: error.message }
    );
  }
});

/**
 * Generate message variations
 */
exports.getMessageVariations = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { messageText, context: messageContext } = data;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: 'system',
          content: `You are an advanced communication coach. Generate three alternative phrasings for the given message.
          
          Key Guidelines:
          - Maintain the same core meaning
          - Offer stylistic variations (formal, casual, warm, etc.)
          - Keep similar length and tone`
        },
        {
          role: 'user',
          content: JSON.stringify({
            message: messageText,
            context: messageContext
          })
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 500
    });

    const variations = JSON.parse(response.choices[0].message.content);
    
    return { variations: variations.variations || [] };
  } catch (error) {
    console.error('Variation Generation Error:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error generating message variations',
      { details: error.message }
    );
  }
}); 