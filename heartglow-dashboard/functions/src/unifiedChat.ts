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
  // Allow 'heartglow-ai' as a valid ID
  if (!connectionId || typeof connectionId !== 'string' || !messageText || typeof messageText !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with "connectionId" (string) and "messageText" (string) arguments.');
  }

  functions.logger.info(`[${userId}] handleChatMessage called for ${connectionId === 'heartglow-ai' ? 'General AI Chat' : 'connection ' + connectionId}`);

  let messagesRef: admin.firestore.CollectionReference;
  let isGeneralChat = false;

  // --- Determine Firestore Path based on connectionId ---
  if (connectionId === 'heartglow-ai') {
    isGeneralChat = true;
    messagesRef = db.collection('users').doc(userId).collection('generalChat').collection('messages');
    functions.logger.info(`[${userId}] Using dedicated path for General AI Chat.`);
  } else {
    // Path for regular user connections
    messagesRef = db.collection('users').doc(userId).collection('connections').doc(connectionId).collection('messages');
  }

  // --- Step 1: Save User's Message to Firestore ---
  const userMessage = {
    sender: 'user',
    text: messageText,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  };
  let userMessageRef;
  try {
      userMessageRef = await messagesRef.add(userMessage);
      functions.logger.info(`[${userId}/${connectionId}] User message ${userMessageRef.id} saved to path: ${messagesRef.path}`);
  } catch (error) {
      functions.logger.error(`[${userId}/${connectionId}] Error saving user message to path ${messagesRef.path}:`, error);
      throw new functions.https.HttpsError('internal', 'Failed to save user message.', error);
  }

  // --- Step 2: Implement determineInteractionType (Remains the same) ---
  let interactionType: 'coaching' | 'generation' | 'clarification' = 'coaching';
  const lowerCaseText = messageText.toLowerCase();
    if (lowerCaseText.includes("help me write") ||
        lowerCaseText.includes("draft a message") ||
        lowerCaseText.includes("how do i say") ||
        lowerCaseText.includes("what should i text") ||
        lowerCaseText.includes("send a message saying")) {
        interactionType = 'generation';
    }
  functions.logger.info(`[${userId}/${connectionId}] Determined interaction type: ${interactionType}`);

  // --- Step 3: Fetch History and Prepare for AI Call ---
  let history: admin.firestore.DocumentData[] = [];
  try {
    const historySnapshot = await messagesRef // Use the determined ref
      .orderBy("timestamp", "desc") 
      .limit(11) // Limit context window + the message just added
      .get();
    history = historySnapshot.docs
        .filter(doc => doc.id !== userMessageRef?.id) 
        .map(doc => doc.data())
        .reverse(); 
    functions.logger.info(`[${userId}/${connectionId}] Fetched last ${history.length} messages from ${messagesRef.path} for context.`);
  } catch (error) {
    functions.logger.error(`[${userId}/${connectionId}] Error fetching message history from ${messagesRef.path}:`, error);
  }

  // --- Step 4: Call AI Model (Remains the same) ---
  let aiResponseText = "Sorry, I encountered an issue generating a response."; 
  try {
      aiResponseText = await generateCoachResponse(messageText, history);
  } catch (error) {
      functions.logger.error(`[${userId}/${connectionId}] Error calling generateCoachResponse:`, error);
  }

  // --- Step 5: Write AI response back to Firestore ---
  try {
    await messagesRef.add({ // Use the determined ref
      sender: 'ai',
      text: aiResponseText,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      interactionType: interactionType
    });
    functions.logger.info(`[${userId}/${connectionId}] AI response added successfully to path ${messagesRef.path}.`);
  } catch (error) {
    functions.logger.error(`[${userId}/${connectionId}] Error writing AI response to path ${messagesRef.path}:`, error);
  }

  // --- Step 6: Optionally update the parent Connection document (SKIP for general chat) ---
  if (!isGeneralChat) {
    try {
        const connectionRef = db.collection('users').doc(userId).collection('connections').doc(connectionId);
        const previewText = aiResponseText.length > 90 ? aiResponseText.substring(0, 90) + "..." : aiResponseText;
        await connectionRef.update({
            lastMessagePreview: previewText,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });
        functions.logger.info(`[${userId}/${connectionId}] Connection document updated.`);
    } catch (error) {
        // Log error if the connection doc doesn't exist or update fails, but don't fail the function
        functions.logger.warn(`[${userId}/${connectionId}] Non-critical error updating connection document (might not exist):`, error);
    }
  } else {
      functions.logger.info(`[${userId}/heartglow-ai] Skipping connection document update for general chat.`);
  }

  // --- Step 7: Return Success ---
   return { success: true, message: aiResponseText }; 

}); 