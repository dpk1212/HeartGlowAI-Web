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
  "They left me on read and my brain is spiraling. Give me the exact response that wins.": {
    acknowledgment: "Being left on read is the modern torture of relationships. Your brain is doing what brains do - creating worst-case scenarios when there's silence. But you don't have to stay stuck in that spiral.",
    miniPrompt: "Tell me exactly what happened - what did you send, how long has it been, and what's this relationship like normally? I'll give you the perfect follow-up that shows confidence, not desperation.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Read Receipt Anxiety and Follow-up Strategy. This person is in the classic 'left on read' spiral. Give them immediate anxiety relief first, then practical response options. Provide 3 specific follow-up templates: 1) The Confident Clarification 2) The Lighthearted Redirect 3) The Strategic Pause. Include exact phrases like 'Hey, just realized my last message might not have been clear' or 'Lol, that came out wrong - what I meant was...' Explain why people actually leave messages on read (usually not personal) and teach them the psychology of attractive follow-ups vs. needy double-texting. Give timing guidance and help them recognize when to pause vs. when to pivot.",
  },
  "I can't tell if they're actually into me or just being nice. Show me the signs.": {
    acknowledgment: "Mixed signals are relationship quicksand - the more you analyze, the more confused you get. You deserve clarity, not constant guessing games about where you stand.",
    miniPrompt: "Describe their behavior that's got you confused - are they flirty but distant, available but uncommitted, or interested but inconsistent? I'll decode exactly what's happening.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Decoding Interest vs. Politeness. This person needs concrete behavioral analysis to distinguish genuine interest from friendly politeness. Teach them the 'Interest Triangle': Effort + Consistency + Escalation. Give them specific green flags (initiates contact, asks personal questions, makes plans) vs. yellow flags (responds but doesn't initiate, keeps conversations surface-level). Provide the '48-Hour Test' and other practical ways to gauge interest. Help them understand that mixed signals often mean 'not enough interest' rather than confusion. Give them exact phrases to create clarity like 'I'm getting mixed signals - are you interested in exploring this further?' Teach them when to lean in vs. when to step back.",
  },
  "They're pulling away and I don't know if I should chase or give space. What's the move?": {
    acknowledgment: "The pull-away panic is real. When someone you care about starts creating distance, every instinct screams to chase harder. But there's a smarter way to handle this.",
    miniPrompt: "Tell me what 'pulling away' looks like for them - less texting, shorter responses, canceled plans, or emotional distance? And how long has this been happening? I'll tell you exactly what to do.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Responding to Distance and Withdrawal. This person is facing the classic pursue-withdraw dynamic. Teach them the 'Mirror and Match' principle - give the same energy they're receiving. Provide specific strategies: 1) The Confident Pause (stop pursuing for 3-5 days) 2) The Gentle Check-in ('Hey, I've noticed you seem busy lately - everything okay?') 3) The Direct Conversation starter. Explain why chasing pushes people further away and how space creates curiosity. Give them exact scripts for addressing the distance without being clingy. Help them understand when pulling away means 'I need space' vs. 'I'm losing interest' and how to respond to each.",
  },
  "I said something that made things weird. How do I fix this before it's too late?": {
    acknowledgment: "That sinking feeling when you realize your words landed wrong is awful. But most 'mistakes' aren't relationship-enders - they're opportunities to show your emotional intelligence.",
    miniPrompt: "What exactly did you say and what was their reaction? Was it a joke that didn't land, something too intense too soon, or an accidental overshare? I'll give you the perfect recovery script.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Communication Recovery and Damage Control. This person needs immediate damage control for a communication misstep. Provide the '24-Hour Rule' for addressing mistakes quickly but not frantically. Give them 3 recovery templates: 1) The Acknowledgment ('I realize what I said might have come across wrong...') 2) The Clarification ('What I meant to say was...') 3) The Reset ('Can we restart that conversation?'). Teach them the difference between over-apologizing and taking accountability. Help them understand that addressing mistakes actually builds trust and attraction when done right. Provide specific language that shows maturity without desperation.",
  },
  "I want them to miss me. Give me the psychology behind making someone realize your worth.": {
    acknowledgment: "Wanting someone to recognize what they had with you is completely human. The good news? There are psychological principles that naturally create that 'oh no, what did I lose?' feeling.",
    miniPrompt: "Are you wanting an ex to miss you, someone who's taking you for granted, or someone who's pulling away? Each situation needs a different strategy - tell me the context.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Creating Positive Absence and Value Recognition. This person wants to trigger appreciation through strategic absence. Teach them the 'Scarcity Principle' - how reducing availability increases perceived value. Provide the 'Glow Up Strategy': focus on yourself visibly (social media, new activities, self-improvement). Give them specific tactics: 1) The Social Proof Method 2) The Mysterious Upgrade 3) The Selective Availability. Explain why desperation repels while confidence attracts. Help them understand the difference between healthy self-focus and manipulation. Provide examples of how to naturally create space while improving themselves.",
  },
  "I think I ruined everything. Can this relationship be saved or should I walk away?": {
    acknowledgment: "When you're in the thick of relationship turmoil, it's hard to see clearly. Most situations feel more hopeless than they actually are, but some do require the courage to walk away.",
    miniPrompt: "What happened that makes you feel like everything is ruined? Was it a fight, a betrayal, accumulated issues, or something else? I'll help you see if this is repairable or if it's time to move on.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Relationship Damage Assessment and Decision Making. This person needs help determining if their relationship is salvageable. Provide the 'Relationship Triage Framework': 1) Assess the damage (communication breakdown vs. trust issues vs. fundamental incompatibility) 2) Evaluate repair willingness from both sides 3) Determine if core needs can be met. Give them specific questions to ask themselves and key indicators for staying vs. leaving. Teach them the difference between workable problems and dealbreakers. If salvageable, provide repair strategies. If not, give them graceful exit scripts. Help them understand that some endings are actually new beginnings.",
  },
  "They're being weird lately and I'm overthinking everything. Help me figure out what's actually happening.": {
    acknowledgment: "When someone's behavior shifts, your brain goes into detective mode, analyzing every text and interaction. Sometimes 'weird' means something, sometimes it doesn't - let's figure out which this is.",
    miniPrompt: "Describe exactly what's different about their behavior. Are they being distant, moody, less responsive, or acting differently in person? And how long has this been going on?",
    systemPromptSnippet: "SPECIALIZED FOCUS: Behavioral Change Analysis and Response Strategy. This person is experiencing anxiety from someone's changed behavior. Teach them to distinguish between 1) Personal stress affecting behavior 2) Relationship doubts 3) External life changes 4) Loss of interest. Provide the 'Direct Approach Framework': how to address changes without being accusatory. Give them specific conversation starters like 'I've noticed you seem different lately - is everything okay with us?' Help them understand when to be concerned vs. when to give space. Teach them to ask directly rather than assume, and provide scripts for different scenarios based on what they discover.",
  },
  "I'm tired of being the backup option. How do I know my worth and demand better?": {
    acknowledgment: "Being someone's second choice is exhausting and soul-crushing. You deserve to be someone's first choice, not their safety net when other options fall through.",
    miniPrompt: "Tell me about the situation that's making you feel like a backup option. Are they inconsistent with plans, only reaching out when convenient, or keeping you at arm's length while pursuing others?",
    systemPromptSnippet: "SPECIALIZED FOCUS: Recognizing and Rejecting Backup Status. This person needs to identify backup option patterns and establish their worth. Teach them the signs: inconsistent communication, last-minute plans, lack of progression, and 'breadcrumbing.' Provide the 'Priority Test' - specific ways to gauge if they're a priority. Give them boundary-setting scripts: 'I'm looking for someone who's excited about me, not just available when convenient.' Help them understand the difference between patience and settling. Provide strategies for communicating their standards and walking away when not met. Teach them that demanding better isn't mean - it's necessary for healthy relationships.",
  },
  "I can't get over them and it's been way too long. Give me the real strategy for moving on.": {
    acknowledgment: "Healing doesn't follow a timeline, and there's no shame in struggling to move on. Some people leave deeper marks than others. But staying stuck isn't honoring what you had - it's preventing what you could have.",
    miniPrompt: "How long has it been, and what's keeping you stuck - hope they'll come back, comparing everyone to them, or just the pain of accepting it's over? I'll give you a real roadmap for moving forward.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Comprehensive Moving On Strategy. This person is stuck in the grief/hope cycle after a relationship ended. Provide the 'Grief to Growth Framework': 1) The Acceptance Phase (stop fighting reality) 2) The Redirection Phase (energy toward new goals) 3) The Reconstruction Phase (building new identity). Give them specific daily practices, social media strategies, and mental exercises. Teach them the difference between healing and moving on. Address the 'what if' thoughts and provide cognitive techniques for letting go. Help them understand that moving on doesn't mean forgetting - it means choosing their future over their past.",
  },
  "I want to tell them how I feel but I'm terrified of ruining everything. Give me the script.": {
    acknowledgment: "Vulnerable moments require incredible courage. The fear of losing what you have by asking for more is real, but so is the regret of never knowing what could have been.",
    miniPrompt: "Tell me about your relationship with them now - are you friends, dating casually, or in some other situation? And what exactly do you want to tell them? I'll craft the perfect approach.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Vulnerable Confession and Emotional Risk-Taking. This person wants to express feelings without creating pressure or awkwardness. Provide situation-specific scripts: 1) Friends to More ('I value our friendship and don't want to make things weird, but I'd be lying if I said I didn't want to explore if there could be something more between us') 2) Casual to Serious 3) Unrequited Love Confession. Teach them the 'No Pressure Principle' - how to express feelings while giving the other person complete freedom to respond. Help them prepare for different responses and maintain dignity regardless of outcome. Emphasize that authentic expression is always worth it, even if the answer isn't what they hope for.",
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
- **Approach**: Provide immediate actionable advice and concrete techniques people can use right away
- **Tone**: Like talking to a wise, caring friend who happens to be a psychology expert

## Your Mission: DELIVER VALUE FIRST
Your primary goal is to give people tangible advice they can use immediately. Users come to you for solutions, not endless questions. Every response should contain:
1. Clear validation of their experience
2. Practical insight that reframes their situation
3. Specific actions they can take TODAY
4. Concrete examples or exact phrases they can use

## Your Conversation Style:
- Keep responses 2-3 paragraphs maximum (concise but meaningful)
- NEVER use bold text, bullet points, or formatted headings - write naturally like a conversation
- Always start with empathy, then immediately pivot to actionable guidance
- Give specific examples, exact phrases, or step-by-step techniques
- Help them understand the psychology behind WHY your advice works
- Offer 2-3 concrete options they can choose from
- Only ask a follow-up question if you absolutely need more context to help better

## Core Principles:
- Give people tools they can use in the next 5 minutes
- Every relationship challenge has practical solutions
- Small, specific actions create big changes
- Understanding patterns helps, but action creates results
- Provide exact words and phrases people can actually say

## Response Structure:
Write naturally in paragraphs following this flow:
1. **Validate**: Acknowledge their feelings with genuine empathy
2. **Reframe**: Offer a psychological insight that shifts their perspective
3. **Action**: Give 2-3 specific, actionable steps they can take immediately
4. **Empower**: Explain why this approach works and encourage them to try it

CRITICAL: Focus on giving concrete, actionable advice over asking questions. Users want solutions they can implement today, not more questions to think about.`;
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
