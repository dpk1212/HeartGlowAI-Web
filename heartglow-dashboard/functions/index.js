/**
 * HeartGlowAI Message Generation Cloud Functions
 */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {OpenAI} = require("openai");
// const { defineString } = require("firebase-functions/params"); // Removed defineString

// Initialize Firebase Admin SDK (if not already initialized)
if (admin.apps.length === 0) {
admin.initializeApp();
}

// --- Removed OpenAI client initialization here, will be done inside functions after fetching key ---
// const OPENAI_API_KEY = defineString("OPENAI_API_KEY");
// const openai = new OpenAI({ apiKey: OPENAI_API_KEY.value() }); 

/**
 * Fetches the OpenAI API key securely from Firestore.
 * @return {Promise<string>} The OpenAI API key.
 * @throws {Error} If the key cannot be fetched.
 */
async function getOpenApiKey() {
  try {
    const docSnap = await admin.firestore().collection('secrets').doc('secrets').get();
    if (!docSnap.exists || !docSnap.data()?.openaikey) {
      functions.logger.error("OpenAI API key not found in Firestore at secrets/secrets");
      throw new Error("Server configuration error: Missing API key.");
    }
    return docSnap.data().openaikey;
  } catch (error) {
    functions.logger.error("Error fetching API key from Firestore:", error);
    // Throw a more specific error for HttpsError handling
    throw new functions.https.HttpsError("internal", "Could not retrieve API key.", error.message);
  }
}

/**
 * Extracts insights from a generated message based on parameters
 * @param {string} content - The generated message content
 * @param {object} params - The message parameters
 * @return {string[]} Array of insight strings
 */
function extractInsights(content, params) {
  const {intent, tone, recipient} = params;
  
  // Base insights that apply to most messages
  const baseInsights = [
    `This message maintains a ${tone} tone that creates an authentic connection`,
    `The personalized content acknowledges your relationship as ${recipient.relationship}`,
    `The language is emotionally intelligent and considerate`,
  ];
  
  // Custom insights based on intent
  switch (intent.type) {
    case "gratitude":
      return [
        "Expressing appreciation in a specific way makes the message feel genuine",
        "This acknowledges their impact without creating obligation",
        "The message balances warmth with respect for boundaries",
      ];
    case "support":
      return [
        "Offering support without presuming to know exactly what they need",
        "The message conveys presence without demanding a response",
        "The tone provides comfort while respecting their agency",
      ];
    case "celebration":
      return [
        "Recognizing their achievement with specific praise feels meaningful",
        "The message focuses on their qualities rather than just outcomes",
        "The tone balances excitement with sincerity",
      ];
    case "reconnection":
      return [
        "Opening with warmth helps bridge the gap in communication",
        "Acknowledging the time apart without dwelling on it creates safety",
        "The message offers a path forward without pressure",
      ];
    case "check-in":
      return [
        "The casual tone makes responding feel optional, not obligatory",
        "Showing interest without prying creates emotional safety",
        "Offering specific ways to connect makes following up easier",
      ];
    default:
      return baseInsights;
  }
}

/**
 * Sanitizes input parameters by trimming strings and handling potential undefined values.
 * @param {any} params - The parameters to sanitize.
 * @return {any} The sanitized parameters.
 */
function sanitizeParams(params) {
  if (!params || typeof params !== 'object') {
    return {};
  }
  const sanitized = {};
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else if (value !== undefined) {
        sanitized[key] = value;
      }
    }
  }
  return sanitized;
}

/**
 * Placeholder for generating the actual prompt for OpenAI based on sanitized inputs.
 * @param {object} params - Sanitized input parameters.
 * @return {string} The generated prompt.
 */
function createPrompt(params) {
  // Basic prompt structure - Adapt based on actual needs
  let prompt = `Create a brief message for ${params.recipientName} (${params.recipientRelationship}).\n\n`;
  if (params.intent) prompt += `Intent: ${params.intent}\n`;
  if (params.tone) prompt += `Tone: ${params.tone}\n`;
  if (params.format) prompt += `Format: ${params.format}\n`;
  if (params.intensity) prompt += `Intensity level: ${params.intensity}/5\n`;
  prompt += `\nPlease generate a thoughtful, personalized message that feels authentic and appropriate for this relationship.`;
  return prompt;
}

/**
 * ==========================================================================
 * generateMessageV2 Cloud Function
 * ==========================================================================
 * Handles generating messages based on user inputs via OpenAI.
 * Endpoint: https://us-central1-heartglowai.cloudfunctions.net/generateMessageV2
 */
exports.generateMessageV2 = functions.https.onCall(async (data, context) => {
  // Basic authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.");
  }

  functions.logger.info("generateMessageV2 called", { structuredData: true });

  try {
    // Fetch API Key from Firestore
    const apiKey = await getOpenApiKey();
    const openai = new OpenAI({ apiKey }); // Initialize OpenAI client here

    const { params, prompt: customPrompt } = data;
    const sanitizedParams = sanitizeParams(params);

    // Use provided prompt or generate one
    const promptToUse = customPrompt || createPrompt(sanitizedParams);
    functions.logger.info("Using prompt:", promptToUse);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or your preferred model
      messages: [{ role: "user", content: promptToUse }],
    });

    const generatedMessage = completion.choices[0]?.message?.content?.trim();

    if (!generatedMessage) {
      functions.logger.error("OpenAI response missing message content.");
      throw new functions.https.HttpsError(
          "internal",
          "Failed to generate message from AI.");
    }

    functions.logger.info("Message generated successfully");
    return { generatedMessage }; // Return the generated message

  } catch (error) {
    functions.logger.error("Error in generateMessageV2: ", error);
    // Check if it's an HttpsError we threw intentionally (like from getOpenApiKey)
    if (error instanceof functions.https.HttpsError) {
      throw error;
    } 
    // Check for OpenAI specific errors
    if (error.response) {
      functions.logger.error("OpenAI Error Data: ", error.response.data);
      functions.logger.error("OpenAI Error Status: ", error.response.status);
    } else {
      functions.logger.error("General Error: ", error.message);
    }
    throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to generate message due to an internal error.");
  }
});

/**
 * ==========================================================================
 * coachingAssistant Cloud Function
 * ==========================================================================
 * Handles processing user messages or initiating a new coaching thread.
 */
exports.coachingAssistant = functions.https.onCall(async (data, context) => {
  // Basic authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.");
  }
  const userId = context.auth.uid;
  functions.logger.info("coachingAssistant called by user:", userId, { structuredData: true });

  // Data now includes optional initialPurpose
  const { threadId, userMessage, initialPurpose } = data; 

  // Input validation for threadId
  if (!threadId || typeof threadId !== 'string' || threadId.trim() === '') {
     // ... (error handling for invalid threadId) ...
     throw new functions.https.HttpsError("invalid-argument", "Invalid thread ID provided.");
  }

  // Determine if this is an initial trigger based on lack of userMessage
  const isInitialTrigger = !userMessage || userMessage.trim() === '';

  try {
    // Fetch API Key from Firestore
    const apiKey = await getOpenApiKey();
    const openai = new OpenAI({ apiKey });

    const messagesRef = admin.firestore()
                           .collection('coachingThreads').doc(threadId)
                           .collection('messages');

    // Check existing messages count
    const existingMessagesSnapshot = await messagesRef.limit(1).get();
    const hasExistingMessages = !existingMessagesSnapshot.empty;

    let aiResponseContent = '';

    if (isInitialTrigger && !hasExistingMessages) {
      // --- Generate Initial Welcome Message (using purpose if available) --- 
      functions.logger.info(`Generating initial message for new thread: ${threadId}`, { initialPurpose });
      
      const threadDoc = await admin.firestore().collection('coachingThreads').doc(threadId).get();
      const connectionName = threadDoc.data()?.connectionSnapshot?.name || 'this connection';
      const purposeLabel = chatPurposes.find(p => p.id === initialPurpose)?.label || 'your relationship'; // Get label for the purpose ID

      if (initialPurpose && initialPurpose !== 'open_chat') {
        // Tailored welcome message based on purpose
        aiResponseContent = 
`Hi there! I'm your AI coach. I see you'd like to focus on **${purposeLabel.toLowerCase()}** regarding your relationship with ${connectionName}.

That's a great area to explore. To get started, could you tell me a bit more about a specific situation where this comes up, or what prompted you to focus on this today?`;
      } else {
        // Generic welcome message if no purpose or "Open Chat"
        aiResponseContent = 
`Hi there! I'm your AI coach, ready to help with your relationship with ${connectionName}.

What area would you like to focus on today? Here are a few starting points:

1.  Improving communication clarity.
2.  Strengthening emotional connection.
3.  Navigating a recent disagreement.
4.  Expressing appreciation more effectively.

Or, feel free to tell me what's on your mind!`
      }
      
      functions.logger.info("Initial coach message generated.");

    } else if (!isInitialTrigger) {
      // --- Process User Message and Generate Response --- 
      functions.logger.info(`Processing user message for thread: ${threadId}`, { userMessage });

      // Fetch message history
      const messagesSnapshot = await messagesRef.orderBy("timestamp", "desc").limit(20).get();
      const messageHistory = messagesSnapshot.docs.map(doc => doc.data()).reverse();

      // Construct prompt with REVISED PHASED system message
      const systemPrompt = 
`You are HeartGlow AI, an empathetic and insightful communication coach. Your goal is to help the user improve their relationships by exploring their thoughts and feelings and offering guidance towards actionable outcomes.

**Phase 1: Exploration (Initial Interaction)**
Adopt a conversational, Socratic coaching style. Avoid giving long blocks of advice immediately. Instead:
1. **Actively listen:** Acknowledge the user's last message.
2. **Ask clarifying questions:** Probe deeper into their situation, feelings, or goals. Help them uncover their own insights. Use open-ended questions.
3. **Offer small reflections or perspectives** based *only* on what the user has shared.
4. **Guide the conversation:** Gently steer towards understanding the core issue and the user's desired outcome.
5. **Maintain context:** Remember previous parts of this specific chat thread.
6. **Be supportive and encouraging.**
Keep your responses concise and focused on the immediate conversational turn during this phase.

**Phase 2: Synthesis & Action (After sufficient discussion, ~3-5 exchanges, or when prompted)**
Once you feel the core issue and the user's needs have been explored through back-and-forth discussion, gently transition towards providing concrete value. You can signal this shift, for example: "Based on what we've discussed, would you like to explore some specific strategies?" or "It sounds like the main challenge is X. Here are a couple of ways you might approach that:". Offer one or more of the following tailored to the conversation:
*   **Summarize Key Insights:** Briefly recap the main points or feelings uncovered.
*   **Suggest Actionable Steps:** Propose 2-3 specific, manageable steps the user could try (e.g., "Consider starting the conversation with...", "Perhaps try reflecting on [specific trigger]...", "One technique is to use 'I feel...' statements like...").
*   **Offer to Draft a Message:** Ask if the user would like help drafting a short, sample message based on the conversation, which they can then adapt.
*   **Recommend Communication Techniques:** Briefly explain a relevant technique (e.g., active listening, perspective-taking).

**Overall:** Balance empathetic exploration with goal-oriented guidance. Lead the user through self-discovery first, then provide a valuable, actionable payoff based on that shared understanding. Avoid overwhelming the user; focus on 1-2 clear takeaways per synthesis turn.`

      const promptMessages = [
          { role: "system", content: systemPrompt }, // Use new system prompt
          ...messageHistory.map(msg => ({
               role: msg.sender === 'user' ? 'user' : 'assistant',
               content: msg.content
          })),
          { role: "user", content: userMessage }
      ];

      functions.logger.info("Calling OpenAI with revised prompt messages for thread:", threadId);

      // Call OpenAI API 
      const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini", 
          messages: promptMessages,
          temperature: 0.7, // Temperature can be adjusted based on testing
      });
      const openAiResponse = completion.choices[0]?.message?.content?.trim();

      if (!openAiResponse) {
        functions.logger.error("OpenAI response missing message content for coachingAssistant.");
        throw new functions.https.HttpsError("internal", "Failed to get response from AI coach.");
      }
      aiResponseContent = openAiResponse;
      functions.logger.info("AI coach response generated for user message.");

    } else {
       // Scenario: Triggered initially but messages already exist. Do nothing.
       functions.logger.info(`Initial trigger for thread ${threadId}, but messages already exist. No action needed.`);
       return { success: true, message: "Already initiated" }; 
    }

    // Save the generated AI response (either welcome or reply)
    if (aiResponseContent) {
      await messagesRef.add({
        threadId: threadId,
        sender: 'coach',
        content: aiResponseContent,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      functions.logger.info("AI coach message saved to Firestore for thread:", threadId);
    } else {
       functions.logger.warn("No AI content generated to save for thread:", threadId);
    }

    return { success: true }; 

  } catch (error) {
    functions.logger.error("Error in coachingAssistant: ", error);
    if (error instanceof functions.https.HttpsError) { throw error; } 
    if (error.response) { /* OpenAI error details */ } else { /* General error details */ }
    throw new functions.https.HttpsError("internal", error.message || "Failed to process coaching message.");
  }
});

/**
 * Alternative implementation for direct message generation
 * This serves as a fallback if the primary method fails
 */
exports.directOpenAIMessage = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
    );
  }

  try {
    // Initialize OpenAI client with API key from config
    const openai = new OpenAI({
      apiKey: functions.config().openai.api_key,
    });
    
    const {params} = data;
    
    // Simplified prompt for direct generation
    const simplifiedPrompt = 
      `Generate a heartfelt message for ${params.recipient.name} who is my ${params.recipient.relationship}.
The message should express ${params.intent.type || params.intent.custom}.
The tone should be ${params.tone}.
Format as ${params.format.type}.

Your response should be a JSON object with:
1. "content": The message text
2. "insights": An array of 3 strings about why this message works emotionally`;

    // Call OpenAI API with simpler setup but same parameters
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use a faster model for the fallback
      messages: [
        {role: "user", content: simplifiedPrompt},
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
      response_format: {type: "json_object"},
    });

    const responseContent = response.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No content received from OpenAI");
    }

    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(responseContent);
      
      // Return the generated message and insights
      return {
        content: parsedResponse.content || responseContent,
        insights: parsedResponse.insights || 
          extractInsights(parsedResponse.content || responseContent, params),
      };
    } catch (parseError) {
      console.error("Error parsing OpenAI direct response:", parseError);
      
      // Fallback to returning raw content
      return {
        content: responseContent,
        insights: extractInsights(responseContent, params),
      };
    }
  } catch (error) {
    console.error("Error in direct OpenAI call:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to generate message directly with OpenAI.",
        error
    );
  }
}); 

/**
 * ==========================================================================
 * deleteCoachingThread Cloud Function (NEW)
 * ==========================================================================
 * Deletes a coaching thread and all its messages after verifying ownership.
 */
exports.deleteCoachingThread = functions.https.onCall(async (data, context) => {
  // 1. Authentication Check
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.");
  }
  const userId = context.auth.uid;
  const { threadId } = data;

  // 2. Input Validation
  if (!threadId || typeof threadId !== 'string' || threadId.trim() === '') {
    functions.logger.error("Invalid threadId received for deletion:", threadId);
    throw new functions.https.HttpsError("invalid-argument", "Invalid thread ID provided.");
  }
  
  functions.logger.info(`Attempting to delete thread: ${threadId} by user: ${userId}`);
  
  const db = admin.firestore();
  const threadRef = db.collection('coachingThreads').doc(threadId);
  const messagesRef = threadRef.collection('messages');

  try {
    // 3. Verify Ownership
    const threadSnap = await threadRef.get();
    if (!threadSnap.exists) {
      functions.logger.warn(`Thread ${threadId} not found for deletion.`);
      // Return success even if not found, as the desired state (non-existence) is achieved
      return { success: true, message: "Thread not found." }; 
    }

    const threadData = threadSnap.data();
    if (threadData.userId !== userId) {
      functions.logger.error(`User ${userId} attempted to delete thread ${threadId} owned by ${threadData.userId}.`);
      throw new functions.https.HttpsError("permission-denied", "You do not have permission to delete this thread.");
    }

    // 4. Delete Messages Subcollection (using batch or recursive delete helper)
    // Simple batch delete (limited to 500 messages per batch, might need iteration for large threads)
    // For robustness, consider a recursive delete helper function if threads can have many messages.
    functions.logger.info(`Deleting messages for thread: ${threadId}`);
    const messagesQuery = messagesRef.limit(500); // Process in batches
    let messagesDeleted = 0;
    
    return db.runTransaction(async (transaction) => {
      let snapshot = await transaction.get(messagesQuery);
      while (snapshot.size > 0) {
          snapshot.docs.forEach(doc => transaction.delete(doc.ref));
          messagesDeleted += snapshot.size;
          if (snapshot.size < 500) break; // Exit if less than batch size means all done
          snapshot = await transaction.get(messagesQuery); // Fetch next batch in transaction
      }
      functions.logger.info(`Deleted ${messagesDeleted} messages.`);
      
      // 5. Delete Main Thread Document
      functions.logger.info(`Deleting thread document: ${threadId}`);
      transaction.delete(threadRef);
    }).then(() => {
       functions.logger.info(`Successfully deleted thread: ${threadId}`);
       return { success: true };
    });

  } catch (error) {
    functions.logger.error(`Error deleting thread ${threadId}: `, error);
    if (error instanceof functions.https.HttpsError) {
      throw error; // Re-throw HttpsErrors
    }
    throw new functions.https.HttpsError(
        "internal",
        error.message || "Failed to delete coaching thread due to an internal error.");
  }
});

// Add the chatPurposes array here or import from a shared types file if preferred
const chatPurposes = [
  { id: 'improve_communication', label: 'Improve Communication' },
  { id: 'navigate_disagreement', label: 'Navigate Disagreement' },
  { id: 'express_appreciation', label: 'Express Appreciation' },
  { id: 'strengthen_connection', label: 'Strengthen Connection' },
  { id: 'open_chat', label: 'Open Chat / Other' },
]; 