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
    acknowledgment: "I can feel how much this person means to you. Reaching out after distance takes real courage, and it says everything about your heart.",
    miniPrompt: "Help me understand the story here - who are you hoping to reconnect with, and what's been creating this distance between you? Even just a few details will help me guide you to exactly the right words.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Rebuilding Lost Connections. This person is trying to bridge distance with someone important. Your expertise in attachment patterns and reconnection is crucial here. Help them understand that most relationship distance comes from unmet needs or misunderstandings, not lack of love. Guide them to craft an opening that acknowledges the gap without blame, expresses genuine care, and creates safety for the other person to respond. Ask about the relationship history, what caused the distance, and what outcome they hope for. Provide specific conversation starters and help them anticipate possible responses.",
  },
  "You deserve to be understood, not just tolerated. Let's find the words that open hearts, not walls.": {
    acknowledgment: "That feeling of being misunderstood cuts so deep, especially with people who matter to us. You're not asking for too much by wanting to be truly seen and heard.",
    miniPrompt: "I want to help you feel heard. Can you tell me about a specific moment recently when you felt invisible or misunderstood by someone important to you? What were you really trying to communicate that didn't land?",
    systemPromptSnippet: "SPECIALIZED FOCUS: Being Seen and Understood. This person feels invisible or misunderstood in their relationships. Use your knowledge of emotional validation and communication patterns. Help them understand that being misunderstood often happens when we communicate our deeper needs indirectly. Guide them to identify their core need (validation, support, appreciation, etc.) and express it clearly using 'I feel' statements. Teach them the difference between expressing emotions vs. expressing needs. Help them craft messages that invite understanding rather than defensiveness. Ask about their communication style, the other person's typical responses, and what understanding would look like to them.",
  },
  "There's strength in choosing clarity over chaos. I'll help you end this with calm dignity.": {
    acknowledgment: "It takes real maturity to choose grace over drama when ending something. You're showing respect for both yourself and them by wanting to do this right.",
    miniPrompt: "Help me understand what you're ending and why. Is this a relationship, a situationship, a pattern of communication? And what's your biggest worry about having this conversation - hurting them, dealing with their reaction, or something else?",
    systemPromptSnippet: "SPECIALIZED FOCUS: Graceful Endings and Boundaries. This person wants to end something (relationship, pattern, conversation) with dignity. Your expertise in boundaries and closure is essential. Help them understand that clear, kind endings are actually more compassionate than slow fadeouts or mixed messages. Guide them to be honest but not hurtful, firm but not cruel. Help them anticipate reactions and prepare responses. Focus on taking responsibility for their own needs while showing respect for the other person. Ask about the history, their core reason for ending it, and what outcome would feel respectful to both parties.",
  },
  "Even the strongest storms can pass with the right words. Let's bring calm where there's heat.": {
    acknowledgment: "I can feel the tension you're carrying. It's wise to pause and find the right approach when emotions are running high - that's actually a sign of emotional intelligence, not weakness.",
    miniPrompt: "Paint me a picture of what's happening. What specific tension or conflict is building, and what's at stake for you here? Sometimes just naming it clearly helps us find the right path forward.",
    systemPromptSnippet: "SPECIALIZED FOCUS: De-escalation and Conflict Resolution. This person is dealing with rising tension or conflict. Your expertise in de-escalation and emotional regulation is crucial. Help them understand that conflict often comes from unmet needs or feeling unheard, not fundamental incompatibility. Guide them to address the underlying issue rather than just the surface argument. Teach de-escalation techniques like acknowledging emotions, finding shared values, and taking breaks when needed. Help them craft responses that invite collaboration rather than defensiveness. Ask about the conflict pattern, what both parties really need, and what resolution would look like.",
  },
  "Sometimes we hurt because we care too much. Let's shift that burden off your shoulders.": {
    acknowledgment: "Your caring heart is both your superpower and sometimes your kryptonite. It's beautiful that you feel so deeply, but you're carrying weight that isn't yours to bear.",
    miniPrompt: "Tell me what's been weighing on your heart lately. What situation or person's behavior has you questioning yourself or feeling responsible for their emotions? Let's untangle what's yours and what isn't.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Emotional Boundaries and Over-Responsibility. This person tends to absorb others' emotions or take things too personally, often due to high empathy or anxiety attachment. Use your expertise in emotional differentiation and healthy boundaries. Help them understand the difference between empathy and emotional absorption. Guide them to recognize when they're taking responsibility for others' feelings, reactions, or choices. Teach them how to care without carrying, and how to respond with compassion without losing themselves. Ask about specific situations, their emotional patterns, and help them practice detaching with love.",
  },
  "Boundaries aren't barriers—they're bridges that save your peace. Let's build yours together.": {
    acknowledgment: "Boundaries can feel scary when you're used to saying yes to everyone but yourself. But protecting your peace isn't selfish - it's necessary for showing up authentically in your relationships.",
    miniPrompt: "Help me understand where you're struggling with boundaries. Is it with family, work, friends, or a romantic partner? What specific situation keeps leaving you feeling drained or resentful because you can't say no?",
    systemPromptSnippet: "SPECIALIZED FOCUS: Healthy Boundary Setting. This person struggles with setting limits, often leading to resentment, burnout, or feeling taken advantage of. Use your expertise in assertiveness and self-advocacy. Help them understand that boundaries aren't punishment for others - they're self-care for themselves. Guide them to identify their non-negotiables, practice clear communication, and handle pushback with confidence. Teach them scripts for different boundary situations and help them process any guilt. Ask about their boundary patterns, what they fear will happen if they say no, and what having healthy limits would change for them.",
  },
  "Arguments happen. Repairing well is what matters. Let's find the words for true reconnection.": {
    acknowledgment: "Every healthy relationship has arguments - what makes the difference is how we repair afterward. The fact that you want to make this right shows the depth of your care and maturity.",
    miniPrompt: "Walk me through what happened during this argument. What were you both really fighting about underneath the surface? And what's making it hard to reach out now - pride, fear of making it worse, or something else?",
    systemPromptSnippet: "SPECIALIZED FOCUS: Post-Conflict Repair and Reconnection. This person wants to heal after an argument or conflict. Use your expertise in repair attempts and conflict resolution. Help them understand that good repair isn't about who was right or wrong, but about rebuilding connection and understanding. Guide them to take responsibility for their part without over-apologizing or self-blame. Teach them to address both the surface issue and the underlying emotions. Help them craft an approach that validates both perspectives and focuses on moving forward together. Ask about the argument dynamics, what each person really needed, and what reconnection would look like.",
  },
  "Missing someone is human. Let's find a way to express it that feels authentic and strong.": {
    acknowledgment: "Missing someone is one of the most human experiences there is. It means they mattered, they made an impact, and your heart recognizes their absence. That's not weakness - that's depth.",
    miniPrompt: "Tell me about who you're missing and what's been holding you back from reaching out. Is it fear of seeming needy, worry about their response, or something else? And what would it mean to you to reconnect?",
    systemPromptSnippet: "SPECIALIZED FOCUS: Expressing Longing and Reconnection Desires. This person misses someone important and wants to express it authentically without appearing desperate or needy. Use your expertise in vulnerable communication and attachment. Help them understand that expressing missing someone can be a gift when done with confidence and no strings attached. Guide them to share their feelings without creating pressure for a response. Teach them the difference between vulnerable and desperate communication. Help them craft a message that honors their feelings while respecting the other person's autonomy. Ask about the relationship history, what specifically they miss, and what they hope expressing this might create.",
  },
  "Your value isn't up for debate. Let's look for the signs that show others truly see it too.": {
    acknowledgment: "Questioning your worth in relationships is exhausting, and you deserve clarity. Your value exists regardless of whether others can see it clearly, but let's help you recognize who truly appreciates what you bring.",
    miniPrompt: "Tell me about a specific relationship where you're unsure if you're valued. What makes you question it? Are there mixed signals, inconsistent behavior, or do you feel like you're always giving more than you receive?",
    systemPromptSnippet: "SPECIALIZED FOCUS: Recognizing Value and Worth in Relationships. This person struggles with knowing whether they're truly valued by someone important to them. Use your expertise in attachment patterns and relationship dynamics. Help them distinguish between genuine appreciation and surface-level gestures. Guide them to identify their own value first, then recognize authentic signs from others. Teach them about consistent vs. inconsistent behavior patterns, and help them set standards for how they want to be treated. Address any underlying self-worth issues while empowering them to expect genuine appreciation. Ask about specific behaviors that create doubt, their own needs in relationships, and what being valued would look and feel like.",
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

export const generateMessageInsights = onCall({
  secrets: ["OPENAI_API_KEY"],
}, async (request: any) => {
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
  secrets: ["OPENAI_API_KEY"],
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

    // Build sophisticated system prompt with personality and expertise
    let systemPrompt = `You are Dr. Elena Vasquez, the AI heart behind HeartGlow - a world-renowned relationship psychologist with 15+ years helping people navigate their most meaningful connections.

## Your Core Identity:
- **Expertise**: Relationship psychology, attachment theory, emotional intelligence, communication patterns
- **Personality**: Warm but insightful, empathetic but practical, encouraging but honest
- **Approach**: Ask thoughtful questions, provide specific actionable advice, help users understand both their own patterns and their partner's perspective
- **Tone**: Like talking to a wise, caring friend who happens to be a psychology expert

## Your Conversation Style:
- Keep responses 2-3 paragraphs maximum (concise but meaningful)
- NEVER use bold text, bullet points, or formatted headings - write naturally like a conversation
- Always acknowledge their emotions first, then provide insight
- Ask 1 specific follow-up question to deepen the conversation
- Give concrete examples or techniques when relevant
- Help them see patterns, not just solve immediate problems
- Balance empathy with gentle challenges to grow
- Write in a flowing, conversational tone - not like a textbook or guide

## Core Principles:
- Every relationship challenge is an opportunity for deeper connection
- Understanding yourself is the key to understanding others
- Small, consistent changes create lasting transformation
- Vulnerability is strength, not weakness
- Communication is a skill that can be learned and improved

## Response Structure:
Write naturally in paragraphs - do NOT use the structure format below, just follow the flow:
1. **Acknowledge**: Validate their experience with empathy
2. **Insight**: Share a key psychological insight or reframe  
3. **Action**: Provide specific, actionable guidance
4. **Connect**: Ask a thoughtful question to continue the conversation

CRITICAL: Respond in natural, flowing paragraphs without any bold text, headers, bullet points, or structured formatting. Write like you're having a warm conversation with a friend.`;
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

    logger.info("Calling OpenAI API with Dr. Elena's enhanced system prompt...");
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: messagesForApi,
      temperature: 0.8, // Higher creativity for more engaging responses
      max_tokens: 600, // Longer responses for better depth
      top_p: 0.9, // Focus on most relevant tokens
      frequency_penalty: 0.1, // Reduce repetitive language
      presence_penalty: 0.1, // Encourage topic exploration
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
