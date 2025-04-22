import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// Ensure Firebase Admin is initialized (often done in index.ts, but safe to include check)
try {
  admin.initializeApp();
} catch (e) {
  // console.log("Firebase Admin already initialized.");
}
const db = admin.firestore();

// --- Helper Function for Core AI Coaching Logic ---
async function generateCoachResponse(userMessageText: string, history: admin.firestore.DocumentData[]): Promise<string> {
    functions.logger.info(`Generating coach response for: "${userMessageText}"`);
    try {
        // Fetch API Key from Environment Variable
        const apiKey = process.env.OPENAI_API_KEY; // Use environment variable

        if (!apiKey) {
             functions.logger.error("OpenAI API key environment variable (OPENAI_API_KEY) is not set.");
             throw new functions.https.HttpsError("internal", "Server configuration error: Missing API key configuration.");
        }

        const {OpenAI} = await import("openai"); // Dynamic import inside async function
        const openai = new OpenAI({ apiKey });

        // Construct prompt messages (Adapted from coachingAssistant)
        const systemPrompt = 
`You are HeartGlow AI, an empathetic and insightful communication coach... [REST OF SYSTEM PROMPT AS DEFINED IN coachingAssistant] ...avoid overwhelming the user; focus on 1-2 clear takeaways per synthesis turn.`; // TODO: Paste full system prompt here

        const promptMessages = [
            { role: "system", content: systemPrompt }, 
            // Map history (assuming history has sender: 'user'|'ai', text: string)
            ...history.map(msg => ({
                 role: msg.sender === 'user' ? 'user' : 'assistant', // Map 'ai' to 'assistant'
                 content: msg.text || '' // Ensure content exists
            })),
            { role: "user", content: userMessageText } // Add current user message
        ];

        functions.logger.info("Calling OpenAI with prompt messages.");

        // Call OpenAI API 
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Match model used in coachingAssistant
            messages: promptMessages,
            temperature: 0.7, 
        });
        const openAiResponse = completion.choices[0]?.message?.content?.trim();

        if (!openAiResponse) {
            functions.logger.error("OpenAI response missing message content for coaching response.");
            throw new Error("Failed to get response from AI coach.");
        }
        functions.logger.info("AI coach response generated successfully.");
        return openAiResponse;

    } catch (error) {
        functions.logger.error("Error inside generateCoachResponse: ", error);
        // Re-throw the error to be handled by the caller (handleNewMessage)
        throw error; 
    }
}

/**
 * Triggered when a new message is created in any connection's message subcollection.
 * This function will handle routing to the appropriate AI model (coaching/generation)
 * and writing the AI response back to the same subcollection.
 */
export const handleChatMessage = functions.https.onCall(async (data, context) => {
  // --- Authentication Check ---
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }
  const userId = context.auth.uid; // Get UID from context

  // --- Input Validation ---
  const { connectionId, messageText } = data;
  if (!connectionId || typeof connectionId !== 'string' || !messageText || typeof messageText !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with "connectionId" (string) and "messageText" (string) arguments.');
  }

  functions.logger.info(`[${userId}] handleChatMessage called for connection ${connectionId}`);

  // --- Step 1: Save User's Message to Firestore ---
  const userMessage = {
    sender: 'user',
    text: messageText,
    timestamp: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
    // Optionally add userId if needed for rules/querying, though path has it
    // userId: userId 
  };
  const messagesRef = db.collection('users').doc(userId).collection('connections').doc(connectionId).collection('messages');
  let userMessageRef; // To get the ID if needed
  try {
      userMessageRef = await messagesRef.add(userMessage);
      functions.logger.info(`[${userId}/${connectionId}] User message ${userMessageRef.id} saved.`);
  } catch (error) {
      functions.logger.error(`[${userId}/${connectionId}] Error saving user message:`, error);
      throw new functions.https.HttpsError('internal', 'Failed to save user message.', error);
  }

  // --- Step 2: Implement determineInteractionType (Placeholder) ---
  // TODO: Add logic to analyze messageText and potentially recent history
  let interactionType: 'coaching' | 'generation' | 'clarification' = 'coaching'; // Default
  const lowerCaseText = messageText.toLowerCase();
    // Simple keyword check for message generation intent
    if (lowerCaseText.includes("help me write") ||
        lowerCaseText.includes("draft a message") ||
        lowerCaseText.includes("how do i say") ||
        lowerCaseText.includes("what should i text") ||
        lowerCaseText.includes("send a message saying")) {
        interactionType = 'generation';
    }
  // TODO: Add logic for 'clarification' if needed
  functions.logger.info(`[${userId}/${connectionId}] Determined interaction type: ${interactionType}`);


  // --- Step 3: Fetch History and Prepare for AI Call ---
  let history: admin.firestore.DocumentData[] = [];
  try {
    // Fetch history from the correct path
    const historySnapshot = await messagesRef // Use the ref we already have
      .orderBy("timestamp", "desc") // Get recent messages first
      .limit(11) // Limit context window + the message just added (adjust as needed)
      .get();

    // Filter out the message we *just* added (it's in messageText) and map, then reverse
    history = historySnapshot.docs
        .filter(doc => doc.id !== userMessageRef?.id) // Exclude the current user message doc
        .map(doc => doc.data())
        .reverse(); // Reverse to maintain chronological order for the AI

    functions.logger.info(`[${userId}/${connectionId}] Fetched last ${history.length} messages for context.`);
  } catch (error) {
    functions.logger.error(`[${userId}/${connectionId}] Error fetching message history:`, error);
    // Continue without history, but log it. Could also throw here.
  }

  // --- Step 4: Call AI Model ---
  let aiResponseText = "Sorry, I encountered an issue generating a response."; // Default error message
  try {
      // Pass the current message text and the fetched history
      aiResponseText = await generateCoachResponse(messageText, history); 
  } catch (error) {
      functions.logger.error(`[${userId}/${connectionId}] Error calling generateCoachResponse:`, error);
      // Keep default error message, the error is already logged
      // Optionally re-throw if client needs specific failure info
      // throw new functions.https.HttpsError('internal', 'AI processing failed.', error);
  }

  // --- Step 5: Write AI response back to Firestore ---
  try {
    await messagesRef.add({
      sender: 'ai',
      text: aiResponseText,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      interactionType: interactionType
    });
    functions.logger.info(`[${userId}/${connectionId}] AI response added successfully.`);
  } catch (error) {
    functions.logger.error(`[${userId}/${connectionId}] Error writing AI response:`, error);
    // Don't throw here, user message is saved, AI just failed to save response
  }

   // --- Step 6: Optionally update the parent Connection document ---
  // TODO: Consider if updating lastMessagePreview is still needed on the USER's connection doc
  try {
      const connectionRef = db.collection('users').doc(userId).collection('connections').doc(connectionId);
      const previewText = aiResponseText.length > 90 ? aiResponseText.substring(0, 90) + "..." : aiResponseText;
      await connectionRef.update({
          lastMessagePreview: previewText,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
      functions.logger.info(`[${userId}/${connectionId}] Connection document updated.`);
  } catch (error) {
      functions.logger.error(`[${userId}/${connectionId}] Error updating connection document:`, error);
  }

  // --- Step 7: Return Success (or result if needed) ---
   // Return success status and maybe the AI response or message ID if client needs it
  return { success: true, message: aiResponseText }; 

}); 