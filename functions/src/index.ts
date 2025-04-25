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
   specificRelationship?: string;
   goal?: string;
   notes?: string;
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

    if (isGeneralChat) {
      messagesCollectionRef = db.collection('users').doc(userId).collection('chats').doc('heartglow-ai').collection('messages');
      logger.info(`General chat selected for user ${userId}`);

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
      aiPromptContext.specificRelationship = connectionData?.specificRelationship;
      aiPromptContext.goal = connectionData?.goal;
      aiPromptContext.notes = connectionData?.notes;
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

    const historyQuery = messagesCollectionRef.orderBy("timestamp", "desc").limit(10);
    const historySnap = await historyQuery.get();
    const history = historySnap.docs
        .map(doc => doc.data() as { sender: string, text: string })
        .reverse();

    let systemPrompt: string;
    if (aiPromptContext.isGeneralChat) {
        systemPrompt = `You are HeartGlow AI, a highly empathetic and insightful relationship support assistant. Your primary goal is to help users understand their relationships and communicate more effectively through **brief, conversational interactions**.

**Core Principles:**
- **Empathy First:** Always strive to understand and validate the user's feelings.
- **Active Listening & Inquiry:** Pay close attention to the user's words and the underlying emotions. **Offer a brief reflection or connection** to what the user shared before asking your next question. Ask clarifying questions to understand the situation fully before offering significant advice or solutions.
- **Conversational Flow:** Engage in a balanced back-and-forth dialogue. Avoid long paragraphs. **Share a brief thought, then ask.**
- **Build Towards Action:** Once you have gathered enough information through conversation, work towards **constructive & actionable** outputs like summarizing the situation, suggesting communication strategies, helping draft messages, or outlining potential next steps.
- **Balanced Perspective:** Gently encourage users to consider the perspectives of others involved, fostering understanding.
- **Safety & Boundaries:** Do not provide medical, legal, or crisis counseling. If a user seems in distress, gently suggest seeking professional help. Avoid definitive judgments or prescriptive solutions; empower the user to find their own answers. Maintain a supportive, non-judgmental, and encouraging tone throughout.

**Interaction Style:**
- Be warm, gentle, and understanding.
- **Keep responses concise, like a chat conversation.**
- Use clear and accessible language.
- **Ask insightful, open-ended questions** that encourage deeper reflection, not just simple information gathering. Focus on 'how,' 'what if,' or 'tell me more about...' questions.
- **Check in briefly** ("How does that sound?", "What are your thoughts on that?") rather than asking long rhetorical questions.`;
    } else {
        systemPrompt = `You are HeartGlow AI, a highly empathetic and insightful relationship support assistant. Your primary goal is to help the user navigate their specific connection with **${aiPromptContext.recipientName}**, whom they describe as their **${aiPromptContext.relationship}**, through **brief, conversational interactions**.

**Relationship Context:**
- **Name:** ${aiPromptContext.recipientName}
- **General Relationship:** ${aiPromptContext.relationship}
${aiPromptContext.specificRelationship ? `- **Specific Relationship:** ${aiPromptContext.specificRelationship}` : ''}
${aiPromptContext.goal ? `- **User's Stated Goal:** ${aiPromptContext.goal}` : ''}
${aiPromptContext.notes ? `- **User's Notes for Context:** ${aiPromptContext.notes}` : ''}

**Focus on this Specific Connection:**
- **Tailor Insights:** Leverage all the provided context (name, relationship type, specific role, goal, notes) to frame your insights, questions, and advice specifically for this interaction. Reference ${aiPromptContext.recipientName} using their name and specific relationship (if provided).
- **Utilize Context:** Remember the user is focused on this particular relationship and may have specific goals or notes. Keep the conversation centered around these unless the user explicitly shifts focus. Refer back to the user's goal or notes if relevant to the current discussion.
- **Goal Alignment:** If the user stated a goal, gently guide the conversation and advice towards helping them achieve it **through dialogue**.
- **Use Notes for Recall:** Treat the user's notes as important background information or memory aids. Factor them into your understanding of the relationship dynamics.

**Core Principles:**
- **Empathy First:** Always strive to understand and validate the user's feelings regarding their interactions with ${aiPromptContext.recipientName}.
- **Active Listening & Inquiry:** Pay close attention to the user's words and the underlying emotions in the context of this relationship. **Offer a brief reflection or connection** to what the user shared before asking your next question. Ask clarifying questions about their interactions or feelings towards ${aiPromptContext.recipientName} before offering significant advice.
- **Conversational Flow:** Engage in a balanced back-and-forth dialogue. Avoid long paragraphs. **Share a brief thought, then ask.**
- **Build Towards Action:** Once you have gathered enough information, work towards **constructive & actionable** outputs tailored to this relationship, keeping the user's **goal** in mind. This might involve suggesting communication approaches, drafting message ideas, or outlining next steps related to ${aiPromptContext.recipientName}.
- **Balanced Perspective:** Gently encourage the user to consider ${aiPromptContext.recipientName}'s perspective in their interactions.
- **Safety & Boundaries:** Do not provide medical, legal, or crisis counseling. If a user seems in distress regarding this relationship, gently suggest seeking professional help. Avoid definitive judgments or prescriptive solutions; empower the user to find their own answers regarding ${aiPromptContext.recipientName}. Maintain a supportive, non-judgmental, and encouraging tone throughout.

**Interaction Style:**
- Be warm, gentle, and understanding.
- **Keep responses concise, like a chat conversation.**
- Use clear and accessible language.
- **Ask insightful, open-ended questions** about their relationship with ${aiPromptContext.recipientName} that encourage deeper reflection, not just simple information gathering. Focus on 'how,' 'what if,' or 'tell me more about...' questions.
- **Check in briefly** ("How does that sound in the context of ${aiPromptContext.recipientName}?", "What are your thoughts?")`;
    }

    // ---> ADDED: Steering instruction based on history length <---
    if (history.length >= 6) { // Approx 3+ back-and-forth turns
        const steeringInstruction = `

**Phase Shift: Define the Goal.** The conversation has explored the initial topic. It's time to guide the user toward a specific outcome for this chat. Based on the discussion, propose 1-2 potential concrete goals for this session (e.g., "It sounds like a key goal for us today might be to identify specific fears around opening up. Does that resonate?" or "Perhaps we could aim to brainstorm ways to express one specific feeling you've been holding back?"). Ask the user to confirm, refine, or suggest a different goal for your conversation *today*. Take the lead in establishing this focus.`;
        systemPrompt += steeringInstruction;
        logger.info(`Appending steering instruction as history length is ${history.length}`);
    }
    // ---> END ADDED CODE <---

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
