import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// Ensure Firebase Admin is initialized (often done in index.ts, but safe to include check)
try {
  admin.initializeApp();
} catch (e) {
  // console.log("Firebase Admin already initialized.");
}
const db = admin.firestore();

// --- Helper Function to Fetch API Key (Copied from coachingAssistant source) ---
/**
 * Fetches the OpenAI API key securely from Firestore.
 * @return {Promise<string>} The OpenAI API key.
 * @throws {Error} If the key cannot be fetched.
 */
async function getOpenApiKey(): Promise<string> {
  try {
    const docSnap = await db.collection('secrets').doc('secrets').get();
    const apiKey = docSnap.data()?.openaikey;
    if (!docSnap.exists || !apiKey) {
      functions.logger.error("OpenAI API key not found in Firestore at secrets/secrets");
      // Use HttpsError for consistency if this might be called from an HTTP function later
      throw new functions.https.HttpsError("internal", "Server configuration error: Missing API key.");
    }
    return apiKey;
  } catch (error: any) {
    functions.logger.error("Error fetching API key from Firestore:", error);
    // Rethrow as HttpsError or a generic error
    if (error instanceof functions.https.HttpsError) throw error;
    throw new functions.https.HttpsError("internal", "Could not retrieve API key.", error.message);
  }
}

// --- Helper Function for Core AI Coaching Logic ---
async function generateCoachResponse(userMessageText: string, history: admin.firestore.DocumentData[]): Promise<string> {
    functions.logger.info(`Generating coach response for: "${userMessageText}"`);
    try {
        // Fetch API Key
        const apiKey = await getOpenApiKey();
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
export const handleNewMessage = functions.firestore
  .document("connections/{connectionId}/messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const { connectionId, messageId } = context.params;
    const messageData = snapshot.data();

    // Ensure messageData is defined and has expected fields
    if (!messageData || !messageData.sender || !messageData.text) {
      console.error(`Invalid message data for message ${messageId} in connection ${connectionId}:`, messageData);
      return; // Exit if data is invalid
    }

    const sender = messageData.sender;
    const text = messageData.text;

    console.log(`[${connectionId}] New message ${messageId} from ${sender}: "${text}"`);

    // --- Step 1: Ignore messages sent by the AI itself ---
    if (sender === 'ai') {
        console.log(`[${connectionId}] Ignoring message ${messageId} as it's from AI.`);
        return; // Don't process messages from the AI
    }

    // --- Step 2: Implement determineInteractionType ---
    // TODO: Add logic to analyze messageData.text and potentially recent history
    let interactionType: 'coaching' | 'generation' | 'clarification' = 'coaching'; // Default
    const lowerCaseText = text.toLowerCase();
    // Simple keyword check for message generation intent
    if (lowerCaseText.includes("help me write") || 
        lowerCaseText.includes("draft a message") || 
        lowerCaseText.includes("how do i say") ||
        lowerCaseText.includes("what should i text") ||
        lowerCaseText.includes("send a message saying")) {
        interactionType = 'generation';
    }
    // TODO: Add logic for 'clarification' if needed
    console.log(`[${connectionId}] Determined interaction type: ${interactionType}`);

    // --- Step 3: Prepare for AI model Call (Fetch Context) ---
    let history: admin.firestore.DocumentData[] = [];
    try {
        const historySnapshot = await db.collection("connections").doc(connectionId).collection("messages")
            .orderBy("timestamp", "desc") // Get recent messages first
            .limit(10) // Limit context window (adjust as needed)
            .get();
        history = historySnapshot.docs.map(doc => doc.data()).reverse(); // Reverse to maintain chronological order
        console.log(`[${connectionId}] Fetched last ${history.length} messages for context.`);
    } catch (error) {
        console.error(`[${connectionId}] Error fetching message history:`, error);
        // Decide if we should proceed without history or return
        // return; // Example: Stop if history fetch fails
    }
    
    // TODO: Implement actual calls to OpenAI or other models based on interactionType and history
    console.log(`[${connectionId}] TODO: Call AI model for ${interactionType} with text: "${text}" and history.`);
    const aiResponseText = await generateCoachResponse(text, history);

    // --- Step 4: Write AI response back to Firestore ---
    try {
        const messagesRef = db.collection("connections").doc(connectionId).collection("messages");
        await messagesRef.add({
            sender: 'ai',
            text: aiResponseText,
            timestamp: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
            interactionType: interactionType // Include the determined type
        });
        console.log(`[${connectionId}] AI response added successfully.`);
    } catch (error) {
        console.error(`[${connectionId}] Error writing AI response for message ${messageId}:`, error);
    }

    // --- Step 5: Optionally update the parent Connection document ---
    // TODO: Update Connection.lastMessagePreview and Connection.timestamp
    try {
        const connectionRef = db.collection("connections").doc(connectionId);
        // Use the *actual* AI response text if/when the placeholder is replaced
        const previewText = aiResponseText.length > 90 ? aiResponseText.substring(0, 90) + "..." : aiResponseText;

        await connectionRef.update({
            lastMessagePreview: previewText, 
            timestamp: admin.firestore.FieldValue.serverTimestamp() // Update timestamp on new AI message
        });
        console.log(`[${connectionId}] Connection document updated.`);
    } catch (error) {
        console.error(`[${connectionId}] Error updating connection document ${connectionId}:`, error);
    }
}); 