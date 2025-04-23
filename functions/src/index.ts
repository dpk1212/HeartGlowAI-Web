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

interface AIPromptContext {
   recipientName?: string;
   relationship?: string;
   isGeneralChat: boolean;
}

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
   - A letter grade (A+, A, A-, B+, B, B-, etc.) as a string in the \"grade\" 
     field.
   - An array of 3 specific, distinct, and actionable insights about what 
     makes this message effective (or could improve it) in the \"insights\" 
     field. Focus on constructive feedback.

### Required JSON Response Format
{
  "grade": \"A letter grade as a string\",
  "insights": [
    \"First insight about what works well or could be improved\",
    \"Second insight about emotional intelligence or tone connection\",
    \"Third insight about relationship-specific effectiveness or authenticity\"
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
}, async (request: CallableRequest<ChatMessageRequestData>) => {
  logger.info("handleChatMessage received raw request data:", request.data);

  if (!request.auth) {
    logger.warn("handleChatMessage called without authentication.");
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  const userId = request.auth.uid;
  const { connectionId, messageText } = request.data;

  if (!messageText || typeof messageText !== 'string' || messageText.trim().length === 0) {
     logger.error("Missing or invalid messageText.", { userId, connectionId });
     throw new HttpsError("invalid-argument", "Missing or invalid 'messageText'.");
  }
  if (connectionId !== null && connectionId !== undefined && typeof connectionId !== 'string') {
      logger.error("Invalid connectionId type.", { userId, connectionId });
      throw new HttpsError("invalid-argument", "The 'connectionId' argument must be a string, null, or undefined.");
  }

  const userMessageText = messageText.trim();
  logger.info(`User ${userId} sending message to ${connectionId || 'General AI Chat'}: \"${userMessageText.substring(0, 50)}...\"`);

  const db = admin.firestore();

  try {
    let messagesCollectionRef: admin.firestore.CollectionReference;
    let connectionRef: admin.firestore.DocumentReference | null = null;
    const isGeneralChat = !connectionId || connectionId === 'heartglow-ai';
    const aiPromptContext: AIPromptContext = { isGeneralChat: isGeneralChat };
    let isFirstGeneralMessage = false;

    if (isGeneralChat) {
      messagesCollectionRef = db.collection('users').doc(userId).collection('chats').doc('heartglow-ai').collection('messages');
      logger.info(`General chat selected for user ${userId}`);

      const snapshot = await messagesCollectionRef.limit(1).get();
      if (snapshot.empty) {
        isFirstGeneralMessage = true;
        logger.info(`First message detected for user ${userId} in general chat. Adding onboarding message.`);
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        await messagesCollectionRef.add({
          sender: 'ai',
          text: "Welcome to HeartGlow AI! ✨ I'm here to be your guide in navigating communication challenges and deepening your relationships.\n\nThink of me as your personal communication co-pilot. You can ask me anything about relationships, get help drafting tricky messages, or explore ways to express yourself more authentically.\n\nYou can chat with me here for general guidance, or you can create specific **Connections** using the '+' button on the left sidebar. Setting up a Connection for a specific person (like a partner, family member, or colleague) helps me offer more tailored insights and advice based on that unique relationship context.\n\nSo, what's on your mind today? Are you facing a specific communication situation you'd like help with, or would you perhaps like to start by setting up your first Connection?",
          timestamp: timestamp,
        });
        logger.info(`Onboarding message added for user ${userId}.`);
      }

    } else {
      const connId = connectionId as string;
      connectionRef = db.collection('users').doc(userId).collection('connections').doc(connId);
      messagesCollectionRef = connectionRef.collection('messages');
      logger.info(`Connection chat selected for user ${userId}, connection ${connId}`);

      const connectionSnap = await connectionRef.get();
      if (!connectionSnap.exists) {
        logger.error("Connection document not found.", { userId, connectionId: connId });
        throw new HttpsError("not-found", `Connection ${connId} not found.`);
      }
      const connectionData = connectionSnap.data();
      aiPromptContext.recipientName = connectionData?.name || "the recipient";
      aiPromptContext.relationship = connectionData?.relationship || "this relationship";
    }

    const userMessageData = {
      sender: 'user',
      text: userMessageText,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    const userMessageRef = await messagesCollectionRef.add(userMessageData);
    logger.info(`User message saved with ID: ${userMessageRef.id} to ${isGeneralChat ? 'General Chat' : `Connection ${connectionId}`}`);

    if (connectionRef) {
        await connectionRef.set({ lastMessageTimestamp: userMessageData.timestamp }, { merge: true });
    }

    if (isFirstGeneralMessage) {
      logger.info(`Skipping AI call for the first general message interaction for user ${userId}.`);
      return { success: true, messageId: userMessageRef.id };
    }

    const historyQuery = messagesCollectionRef.orderBy("timestamp", "desc").limit(10);
    const historySnap = await historyQuery.get();
    const history = historySnap.docs
        .map(doc => doc.data() as { sender: string, text: string })
        .reverse();

    let systemPrompt: string;
    if (aiPromptContext.isGeneralChat) {
        systemPrompt = `You are HeartGlow AI, a compassionate assistant helping users navigate their relationships. Be supportive, insightful, and helpful. Listen actively and offer constructive advice or help drafting messages when appropriate. Maintain a gentle and understanding tone.`;
    } else {
        systemPrompt = `You are HeartGlow AI, a compassionate assistant helping users navigate their relationships. You are currently chatting with the user about their connection with ${aiPromptContext.recipientName} (${aiPromptContext.relationship}). Be supportive, insightful, and helpful, tailoring your advice to this specific relationship context. Listen actively and offer constructive advice or help drafting messages when appropriate. Maintain a gentle and understanding tone.`;
    }

    const promptMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.map((msg): OpenAI.Chat.ChatCompletionUserMessageParam | OpenAI.Chat.ChatCompletionAssistantMessageParam => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
      })),
    ];

    if (promptMessages[promptMessages.length - 1]?.role !== 'user' || promptMessages[promptMessages.length - 1]?.content !== userMessageText) {
         const recentMessagesContent = history.slice(-3).map(m => m.text);
         if (!recentMessagesContent.includes(userMessageText)) {
            promptMessages.push({ role: "user", content: userMessageText });
            logger.info("Explicitly added current user message to prompt history as it wasn't the last item.");
         }
    }

    logger.info(`Constructing prompt for OpenAI with ${promptMessages.length -1} history messages (excluding system). Context: ${isGeneralChat ? 'General' : 'Connection ' + connectionId}`, { userId });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        logger.error("OpenAI API key not configured.");
        throw new HttpsError("internal", "AI service not configured.");
    }
    const openai = new OpenAI({ apiKey });

    let aiResponseText: string | null = null;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: promptMessages,
            temperature: 0.7,
            max_tokens: 500,
        });
        aiResponseText = completion.choices[0]?.message?.content?.trim() || null;
    } catch (aiError) {
         logger.error("Error calling OpenAI API:", aiError, { userId, connectionId });
    }

    if (!aiResponseText) {
        logger.warn("OpenAI response content was empty or null. No AI reply will be saved.", { userId, connectionId });
        return { success: true, messageId: userMessageRef.id, warning: "AI response was empty." };
    } else {
         logger.info(`Received OpenAI response: \"${aiResponseText.substring(0, 50)}...\"`, { userId, connectionId: connectionId || 'General' });
        const aiMessageData = {
            text: aiResponseText,
            sender: "ai",
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };
        const aiMessageRef = await messagesCollectionRef.add(aiMessageData);
        logger.info(`AI message saved with ID: ${aiMessageRef.id} to ${isGeneralChat ? 'General Chat' : `Connection ${connectionId}`}`);

         if (connectionRef) {
             await connectionRef.set({ lastMessageTimestamp: aiMessageData.timestamp }, { merge: true });
         }
         return { success: true, messageId: userMessageRef.id };
    }

  } catch (error: any) {
    logger.error("Error processing chat message:", error, { userId, connectionId: connectionId || 'General' });
    if (error instanceof HttpsError) {
      throw error;
    } else {
      throw new HttpsError("internal", "Failed to handle chat message.", error.message);
    }
  }
});
