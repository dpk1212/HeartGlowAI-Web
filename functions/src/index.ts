/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Removed unused imports:
// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

"use strict";

// Using import syntax for TypeScript
import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import {OpenAI} from "openai";
import Stripe from "stripe";
import {onRequest} from "firebase-functions/v1/https";
import {config} from "firebase-functions";
import {getFirestore, FieldValue, Timestamp} from "firebase-admin/firestore";

// Ensure admin is initialized
try {
  admin.initializeApp();
} catch (e) {
  logger.info("Admin SDK already initialized.");
}

let stripe: Stripe | null = null;

// --- Interfaces ---
interface InsightsRequestData {
  message: string;
  recipient: { name: string, relationship: string };
  intent: string;
  tone: string;
}

interface ChatMessageRequestData {
  connectionId?: string | null; // Allow null for general chat
  messageText: string;
}

// Add type for Firestore message documents
interface ChatMessageData {
  text: string;
  createdAt: Timestamp; // Assuming Timestamp import
  role: "user" | "assistant" | string; // Be slightly lenient for filtering
  userId?: string;
  guideContext?: string;
  isGuideResponse?: boolean;
  modelUsed?: string;
  finishReason?: string;
}

// --- NEW: Guide Data Structure ---
interface GuideInfo {
  acknowledgment: string;
  miniPrompt: string;
  systemPromptSnippet: string;
}

const guideData: Record<string, GuideInfo> = {
  "It's never too late to reach for connection. Let's find your opening line together.": {
    acknowledgment: "Reaching out takes courage. It shows you still care.",
    miniPrompt: "Briefly tell me: who are you feeling distance from, and why does it matter to you?",
    systemPromptSnippet: "The user is trying to rebuild a connection. Focus on empathy, gentle opening lines, and acknowledging the difficulty of bridging distance.",
  },
  "You deserve to be understood, not just tolerated. Let's find the words that open hearts, not walls.": {
    acknowledgment: "Feeling unseen is incredibly painful. You deserve to be heard.",
    miniPrompt: "What's one time recently you felt invisible or misunderstood?",
    systemPromptSnippet: "The user feels unseen/misunderstood. Help them articulate their feelings clearly and calmly, focusing on 'I' statements and expressing needs without blame.",
  },
  "There's strength in choosing clarity over chaos. I'll help you end this with calm dignity.": {
    acknowledgment: "Ending things with grace is hard, but important. Let's find a way.",
    miniPrompt: "What's the hardest part you're worried about — hurting them, or feeling guilty yourself?",
    systemPromptSnippet: "The user wants to end a conversation/relationship gracefully. Focus on clear, kind, and firm language. Help them express their decision respectfully, minimizing unnecessary pain or ambiguity.",
  },
  "Even the strongest storms can pass with the right words. Let's bring calm where there's heat.": {
    acknowledgment: "It's smart to pause and find the right words when things get tense.",
    miniPrompt: "In one sentence: What tension or conflict feels like it's growing right now?",
    systemPromptSnippet: "The user wants to defuse tension. Focus on de-escalation techniques, active listening prompts, finding common ground, and suggesting ways to pause or reset the conversation.",
  },
  "Sometimes we hurt because we care too much. Let's shift that burden off your shoulders.": {
    acknowledgment: "It's easy to take things personally, especially when you care. Let's untangle this.",
    miniPrompt: "What's one thing that's been weighing on you — but deep down, you know it's not fully yours?",
    systemPromptSnippet: "The user is struggling with taking things personally or carrying others' burdens. Help them gain perspective, differentiate their feelings from others', and respond with grace without absorbing negativity.",
  },
  "Boundaries aren't barriers—they're bridges that save your peace. Let's build yours together.": {
    acknowledgment: "Setting boundaries is a sign of self-respect. It's okay to protect your peace.",
    miniPrompt: "Where in your life are you finding it hard to set healthy limits — without feeling guilty?",
    systemPromptSnippet: "The user needs help setting boundaries. Focus on clear, kind, and firm statements. Help them articulate their limits and needs without over-explaining or feeling guilty.",
  },
};
// --- End Guide Data ---

// --- Helper Functions ---
function buildInsightsPrompt(params: InsightsRequestData): string {
  const message = params?.message || "[Message content missing]";
  const recipientName = params?.recipient?.name || "[Recipient name missing]";
  const recipientRelationship =
    params?.recipient?.relationship || "[Recipient relationship missing]";
  const intent = params?.intent || "[Intent missing]";
  const tone = params?.tone || "[Tone missing]";

  return `
### Message Analysis Task
Analyze the following message and provide a letter grade (A+, A, A-, B+, B,
B-, etc.) and 3 specific insights about its effectiveness.

### Message Context
- **Recipient**: ${recipientName} (${recipientRelationship})
- **Intent**: ${intent}
- **Tone**: ${tone}

### Message Content
"${message}"

### Instructions
1. Evaluate this message based on:
   - How well it achieves its stated intent
   - Appropriateness for the relationship
   - Emotional intelligence
   - Clarity and authenticity
   - Overall effectiveness

2. Provide your analysis as a JSON object with:
   - A letter grade (A+, A, A-, B+, B, B-, etc.) as a string in the "grade" 
     field.
   - An array of 3 specific, distinct, and actionable insights about what 
     makes this message effective (or could improve it) in the "insights" 
     field. Focus on constructive feedback.

### Required JSON Response Format
{
  "grade": "A letter grade as a string",
  "insights": [
    "First insight about what works well or could be improved",
    "Second insight about emotional intelligence or tone connection",
    "Third insight about relationship-specific effectiveness or authenticity"
  ]
}`;
}

// --- Exported Cloud Functions ---

export const generateMessageInsights = onCall(async (request: any) => {
  if (!request.auth) {
    logger.warn("Function called without authentication.");
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const userId = request.auth.uid;
  logger.info(`User ${userId} called generateMessageInsights (v2 Callable)`);
  const params = request.data as InsightsRequestData;
  if (!params || typeof params !== "object" || !params.message || !params.recipient || !params.intent || !params.tone) {
    logger.error("Missing required parameters in payload.", params);
    const requiredKeys: (keyof InsightsRequestData)[] = ["message", "recipient", "intent", "tone"];
    const missing = requiredKeys.filter((key) => !(key in params));
    const errorMsg = `Missing required parameters: ${missing.join(", ")}.`;
    throw new HttpsError("invalid-argument", errorMsg);
  }
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.error("OpenAI API key not configured.");
      throw new HttpsError("internal", "API key not configured.");
    }
    const openai = new OpenAI({apiKey});
    const prompt = buildInsightsPrompt(params);
    logger.info("Generated analysis prompt.");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 300,
      response_format: {type: "json_object"},
    });
    const responseContent = completion.choices[0]?.message?.content?.trim();
    if (!responseContent) {
      logger.error("OpenAI response content was empty or null.");
      throw new Error("Failed to get valid content from OpenAI.");
    }
    const logFragment = responseContent.substring(0, 100) + "...";
    logger.info("Received OpenAI response fragment:", logFragment);
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(responseContent);
      const gradeValid = parsedResponse && parsedResponse.grade && typeof parsedResponse.grade === "string";
      const insightsValid = parsedResponse && parsedResponse.insights && Array.isArray(parsedResponse.insights) && parsedResponse.insights.length === 3 && parsedResponse.insights.every((insight: any) => typeof insight === "string");
      if (!gradeValid || !insightsValid) {
        const errorMsg = "Response format error: Missing/invalid fields.";
        logger.error(errorMsg, {grade: gradeValid, insights: insightsValid}, parsedResponse);
        throw new Error(errorMsg);
      }
      logger.info(`Successfully extracted grade (${parsedResponse.grade}) and ${parsedResponse.insights.length} insights`);
      return {
        grade: parsedResponse.grade,
        insights: parsedResponse.insights,
      };
    } catch (parseError) {
      const pError = parseError as Error;
      logger.error("Error parsing OpenAI response:", pError.message);
      logger.error("Raw Content fragment for parse error:", responseContent.substring(0, 150) + "...");
      const errorMsg = "Failed to parse insights from AI response.";
      throw new HttpsError("internal", errorMsg, pError.message);
    }
  } catch (error) {
    const errorTyped = error as Error;
    logger.error("Error in generateMessageInsights:", errorTyped);
    if (error instanceof HttpsError) {
      throw error;
    }
    const errorMsg = "Failed to generate message insights.";
    throw new HttpsError("internal", errorMsg, errorTyped.message);
  }
});

export const stripeWebhook = onRequest(async (request, response) => {
  if (!stripe) {
    const stripeSecretKey = config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      logger.error("CRITICAL: Stripe secret key not configured. ...");
      response.status(500).send("Server Configuration Error: Missing Stripe secret key.");
      return;
    } else {
      stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2025-03-31.basil", // Match expected type
        typescript: true,
      });
      logger.info("Stripe client initialized for webhook handler instance.");
    }
  }
  const signature = request.headers["stripe-signature"];
  const webhookSecret = config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !signature) {
    logger.error("CRITICAL: Stripe webhook secret or signature is missing.");
    response.status(400).send("Webhook Error: Missing secret or signature configuration.");
    return;
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.rawBody, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    logger.error("Webhook signature verification failed.", error.message);
    response.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }
  logger.info("Received Stripe event:", event.type);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clientReferenceId = session.client_reference_id;
    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
    if (!clientReferenceId) {
      logger.error("Missing client_reference_id in checkout.session.completed", { sessionId: session.id });
      response.status(200).send("Success (no client_reference_id)");
      return;
    }
    logger.info(`Checkout session completed for user UID: ${clientReferenceId}`, { sessionId: session.id, customer: stripeCustomerId, subscription: subscriptionId });
    try {
      const userRef = admin.firestore().collection('users').doc(clientReferenceId);
      await userRef.set({
        stripeCustomerId: stripeCustomerId,
        stripeSubscriptionId: subscriptionId,
        isPremium: true,
      }, { merge: true });
      logger.info(`Successfully updated Firestore for user ${clientReferenceId} to premium.`);
    } catch (firestoreError) {
      logger.error(`Error updating Firestore for user ${clientReferenceId}:`, firestoreError);
    }
  }
  response.status(200).send("Received");
});

// --- UPDATED handleChatMessage Function ---
export const handleChatMessage = onCall({
  timeoutSeconds: 120,
}, async (request: CallableRequest<ChatMessageRequestData>) => {
  logger.info("handleChatMessage received raw request data:", request.data);

  if (!request.auth) {
    logger.warn("handleChatMessage called without authentication.");
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const userId = request.auth.uid;
  const {connectionId, messageText} = request.data;

  if (!messageText || typeof messageText !== "string" || messageText.trim().length === 0) {
    logger.error("Invalid messageText received.", {userId, connectionId});
    throw new HttpsError("invalid-argument", "Message text cannot be empty.");
  }

  const trimmedMessage = messageText.trim();
  const firestore = getFirestore();
  const isGeneralChat = !connectionId || connectionId === "heartglow-ai";
  const userMessageRef = isGeneralChat ?
    firestore.collection("users").doc(userId).collection("messages") :
    firestore.collection("users").doc(userId).collection("connections").doc(connectionId!).collection("messages");

  // --- Step 1: Check if message matches a Guide's firstLine ---
  const matchedGuide = guideData[trimmedMessage];

  // BULLETPROOF: Always treat any guide firstLine as a guide trigger, every time, even if repeated
  if (matchedGuide) {
    logger.info(`Guide click detected for user ${userId}, connection ${connectionId || 'general'}. Guide Ack: ${matchedGuide.acknowledgment}`);
    try {
      // Never save a user message for a guide trigger, no matter what
      const aiResponseData = {
        text: `${matchedGuide.acknowledgment} ${matchedGuide.miniPrompt}`,
        createdAt: FieldValue.serverTimestamp(),
        role: "assistant",
        guideContext: trimmedMessage, 
        isGuideResponse: true, 
      };
      // Save the AI response
      const savedAiMessage = await userMessageRef.add(aiResponseData);
      logger.info(`Successfully saved AI guide prompt with ID: ${savedAiMessage.id}`);
      // Return the ID of the AI message saved
      return {success: true, messageId: savedAiMessage.id}; 
    } catch (error) {
      logger.error("Error saving guide prompt to Firestore:", error);
      throw new HttpsError("internal", "Failed to save initial guide interaction.", (error as Error).message);
    }
  }

  // --- Step 2: Proceed with normal message handling (if not a guide click) ---
  logger.info(`Handling regular message for user ${userId}, connection ${connectionId || 'general'}.`);

  try {
    // Save the user's message first
    const userMessageData = {
      text: trimmedMessage,
      createdAt: FieldValue.serverTimestamp(),
      role: "user",
      userId: userId,
    };
    const savedUserMessage = await userMessageRef.add(userMessageData);
    logger.info(`User message saved with ID: ${savedUserMessage.id}`);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      logger.error("OpenAI API key not configured.");
      throw new HttpsError("internal", "API key not configured.");
    }
    const openai = new OpenAI({apiKey});

    // Fetch connection details if applicable
    let connectionData: admin.firestore.DocumentData | null = null;
    if (!isGeneralChat) {
      const connectionRef = firestore.collection("users").doc(userId).collection("connections").doc(connectionId!);
      const connectionSnap = await connectionRef.get();
      if (connectionSnap.exists) {
        connectionData = connectionSnap.data() || {};
        logger.info("Fetched connection details.", {connectionId});
      } else {
        logger.warn("Connection ID provided but document not found.", {connectionId});
      }
    }

    // Fetch recent messages for context
    const messagesQuery = userMessageRef.orderBy("createdAt", "desc").limit(15);
    const messagesSnap = await messagesQuery.get();
    const recentMessages = messagesSnap.docs
      .map((doc) => {
          const data = doc.data() as ChatMessageData;
          return { id: doc.id, ...data };
      })
      .reverse()
      .filter((msg): msg is {id: string} & ChatMessageData & { role: 'user' | 'assistant' } =>
          msg.role === "user" || msg.role === "assistant"
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.text || "",
      }));

    // Check the last AI message to see if we need to add guide context
    let activeGuideSystemPrompt = "";
    if (messagesSnap.docs.length >= 1) {
        const lastDocSnap = messagesSnap.docs[0];
        const lastMessageData = lastDocSnap.data() as ChatMessageData;

        // Check if the *actual last message* in DB was an AI guide response
        if (lastMessageData.role === 'assistant' && lastMessageData.isGuideResponse && lastMessageData.guideContext) {
             const triggeredGuide = guideData[lastMessageData.guideContext];
             if (triggeredGuide) {
                 activeGuideSystemPrompt = triggeredGuide.systemPromptSnippet;
                 logger.info(`Adding system prompt snippet for guide: ${lastMessageData.guideContext}`);
             }
        }
    }

    // Append CONVERSATION context (if applicable)
    let systemPrompt = "You are HeartGlow AI, an empathetic relationship coach. Your responses should be warm, supportive, and focused on emotional intelligence.";
    if (!isGeneralChat && connectionData) {
      systemPrompt += `\n\n## Conversation Context:`;
      if (connectionData.name) systemPrompt += `\n- Talking about: ${connectionData.name}`;
      if (connectionData.relationship) systemPrompt += `\n- Relationship: ${connectionData.relationship}`;
      if (connectionData.specificRelationship) systemPrompt += ` (${connectionData.specificRelationship})`;
      if (connectionData.goal) systemPrompt += `\n- Goal: ${connectionData.goal}`;
      if (connectionData.notes) systemPrompt += `\n- Notes: ${connectionData.notes}`;
    }

    // Append GUIDE context (if applicable)
    if (activeGuideSystemPrompt) {
        systemPrompt += `\n\n## Current Focus:\n${activeGuideSystemPrompt}`;
    }

    // Prepare messages for OpenAI API
    const messagesForApi: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {role: "system", content: systemPrompt},
      ...recentMessages.map((msg): OpenAI.Chat.ChatCompletionUserMessageParam | OpenAI.Chat.ChatCompletionAssistantMessageParam => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    logger.info("Calling OpenAI API with updated 2-step interaction system prompt...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: messagesForApi,
      temperature: 0.7,
      max_tokens: 450,
      user: userId,
    });

    const aiResponseText = completion.choices[0]?.message?.content?.trim();

    if (!aiResponseText) {
      logger.error("OpenAI response content was empty or null.");
      throw new HttpsError("internal", "AI failed to generate a response.");
    }

    const aiResponseData = {
      text: aiResponseText,
      createdAt: FieldValue.serverTimestamp(),
      role: "assistant",
      modelUsed: completion.model,
      finishReason: completion.choices[0]?.finish_reason,
    };
    const savedAiMessage = await userMessageRef.add(aiResponseData);
    logger.info(`AI response saved with ID: ${savedAiMessage.id}`);

    return {success: true, messageId: savedAiMessage.id};
  } catch (error) {
    logger.error("Error in handleChatMessage main block:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to process chat message.", (error as Error).message);
  }
});
