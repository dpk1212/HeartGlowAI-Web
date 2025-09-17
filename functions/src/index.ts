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
    systemPromptSnippet: "SPECIALIZED FOCUS: Read Receipt Anxiety and Follow-up Strategy. Use the new structured format: IMMEDIATE SOLUTION (provide 3 exact follow-up templates), WHY THIS WORKS (explain psychology of read receipts, why people don't respond, and what makes certain follow-ups attractive vs needy), NEXT STEPS (timing guidance and how to choose the right template). Give them exact phrases like 'Hey, just realized my last message might not have been clear' or 'Lol, that came out wrong - what I meant was...' Make the psychological insights compelling so they understand the strategy behind the tactics.",
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
  // --- MESSAGE GUIDES (Exact Scripts) ---
  "Give me 5 texts that make them smile when they're having a bad day.": {
    acknowledgment: "When someone you care about is struggling, the right words can be like a warm hug through the phone. You want to lift their spirits without being overwhelming.",
    miniPrompt: "What's their situation - work stress, family drama, general rough patch? And what's your relationship like - are you dating, friends, or something in between? I'll give you perfect messages for their specific situation.",
    systemPromptSnippet: "SPECIALIZED FOCUS: ONLY provide 5 exact, copy-paste text messages. Number them 1-5 using clean formatting. NO explanations, NO timing advice, NO psychology, NO bold text or asterisks - just the exact texts they can send. Keep each message to 1-2 sentences max. Use simple numbered format like: 1. Hey love, just wanted to remind you... The interactive bubbles will handle why they work and when to send them.",
  },
  "What's the perfect good morning text that doesn't sound clingy?": {
    acknowledgment: "Good morning texts are such a sweet gesture, but there's definitely an art to hitting the right tone - warm and caring without being too intense.",
    miniPrompt: "How long have you been talking/dating? And what's their communication style like - do they text a lot or are they more reserved? I'll give you the perfect morning message formula.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Copy-Paste Good Morning Text Templates. This person wants EXACT good morning texts they can send. Provide 3-4 specific message options formatted for copying, organized by relationship stage. Start with 'Here are perfect good morning texts you can copy and send:' then clearly format like: **For Early Dating:** 'Good morning! Hope your day is as lovely as your smile ☀️' **For Established Relationships:** 'Morning beautiful/handsome ☀️ Coffee and you would make this day perfect' **For Long-term:** 'Good morning my favorite person ❤️ Ready to take on the day together?' Include timing advice (not before 7am, not every single day initially) and explain why these work. Focus on giving them ready-to-use content first.",
  },
  "How do I slide into their DMs without being creepy? Give me the exact opener.": {
    acknowledgment: "DM sliding is an art form - you want to be confident and interesting without coming across as pushy or desperate. The right opener can start something amazing.",
    miniPrompt: "Where do you know them from - social media, mutual friends, work, or somewhere else? And what caught your attention about them? I'll craft the perfect conversation starter.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Copy-Paste DM Opener Templates. This person wants EXACT DM messages they can send. Provide 3-4 specific opener templates based on context. Start with 'Here are DM openers you can copy and customize:' then format clearly: **For Social Media:** 'Hey! I saw your post about [specific thing] - that's actually something I'm really into too. What got you started with it?' **For Mutual Friends:** 'Hey! I think we have some mutual friends - you seem really cool and I'd love to get to know you better' **For Professional/Hobby:** 'Hi! I noticed we both [shared interest/work in same field] - would love to connect!' Emphasize personalizing with specific details from their profile. Give the formula: specific observation + genuine interest + question. Provide exactly what to type.",
  },
  // --- ACTIVITY GUIDES (Things To Do) ---
  "Show me 7 activities that create deep connection in under 2 hours.": {
    acknowledgment: "Building real intimacy doesn't have to take months - the right activities can create profound connection in just one afternoon. You're smart to focus on experiences that matter.",
    miniPrompt: "Are you looking for activities for a romantic partner, close friend, or someone you're just getting to know? And do you prefer conversation-based bonding or shared experiences? I'll tailor the perfect list.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Specific Connection Activities List. This person wants a clear, actionable list of 7 activities they can do today. Format as 'Here are 7 activities that create deep connection in under 2 hours:' then list clearly: **1. The 36 Questions** - Ask the scientifically-proven questions that make strangers fall in love **2. Cook Something Together** - Make a meal or dessert from scratch **3. Share Childhood Stories** - Take turns telling formative memories **4. Teach Each Other Something** - Exchange skills or knowledge **5. Explore Somewhere New** - Visit a place neither of you has been **6. Create Art Together** - Draw, write, or make something side by side **7. Plan a Future Adventure** - Dream and plan a trip you'd take together. For each, give 1-2 sentence instructions on how to do it. Focus on giving them ready-to-implement activities.",
  },
  "How do I turn a boring hangout into emotional intimacy? Give me the playbook.": {
    acknowledgment: "The best connections often happen when you transform ordinary moments into something meaningful. You have the power to shift any interaction from surface-level to soul-level.",
    miniPrompt: "What kind of hangout are you in - watching TV, driving somewhere, just sitting around? And what's your relationship dynamic like currently? I'll give you specific moves to deepen things.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Intimacy Escalation Techniques. This person wants to transform casual time into meaningful connection. Provide specific transition strategies: 1) The Story Bridge ('That reminds me of something that happened to me...') 2) The Vulnerability Drop ('Can I tell you something I don't usually share?') 3) The Future Focus ('I've been thinking about...') 4) The Gratitude Moment ('I really appreciate that you...') Give conversation redirects, physical intimacy escalation (if appropriate), and emotional deepening techniques. Teach them to read receptiveness and back off gracefully if someone isn't ready. Emphasize that intimacy is built through gradual vulnerability and mutual interest.",
  },
  "What are 3 conversation games that reveal everything about someone?": {
    acknowledgment: "The right questions can unlock someone's entire inner world. Games make deep conversations feel natural and fun rather than like an interview.",
    miniPrompt: "Who are you wanting to understand better - someone you're dating, a friend you want to get closer to, or someone new? I'll give you games that perfectly match your situation.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Revealing Conversation Games. This person wants structured ways to learn about someone deeply. Provide 3 specific games: 1) 'Would You Rather' (reveals values and priorities) 2) 'The Story Behind the Scar' (physical/emotional - reveals formative experiences) 3) 'If You Could Time Travel' (reveals regrets, dreams, core identity). For each game, provide detailed instructions, example questions, and what to listen for in responses. Teach them how to create psychological safety, reciprocate vulnerability, and build on answers. Explain the psychology behind why games work better than direct questions (they feel safe, playful, and less threatening).",
  },
  // --- DATE GUIDES (Date Planning) ---
  "Give me first date ideas that guarantee a second date.": {
    acknowledgment: "First dates can make or break potential relationships, so you're smart to put thought into creating an experience that showcases your personality while allowing real connection.",
    miniPrompt: "What's your budget range, and what kind of vibe are you going for - adventurous, intimate, fun, or sophisticated? Also, what do you know about their interests? I'll design the perfect first date.",
    systemPromptSnippet: "SPECIALIZED FOCUS: First Date Planning for Maximum Connection. This person wants date ideas that create chemistry and guarantee follow-up. Provide specific, actionable date concepts with step-by-step guidance. Include: 1) Interactive dates that encourage conversation (cooking class, art gallery with discussion prompts, mini golf with playful competition) 2) Experience-based dates that create shared memories (hiking to a view, food tour, escape room) 3) Budget-friendly but thoughtful options (picnic with homemade treats, bookstore browsing + coffee, local farmers market exploration). For each suggestion, explain the psychology of why it works: shared activities create bonding, novel experiences increase attraction, and collaborative elements build teamwork. Include conversation starters, timing tips, and how to read their interest level during the date.",
  },
  "How do I plan the perfect romantic surprise on any budget?": {
    acknowledgment: "The most romantic gestures aren't about money - they're about thoughtfulness, effort, and showing that you truly know and care about someone. Your heart is in the right place.",
    miniPrompt: "What's your budget range, and what does your partner love most - experiences, personal touches, quality time, or thoughtful gifts? Also, what's the occasion? I'll create something they'll never forget.",
    systemPromptSnippet: "SPECIALIZED FOCUS: Quick, Actionable Romantic Surprise Ideas. Format as a SHORT bulleted list by budget tier. Keep each suggestion to 1 line with brief explanation. Use this EXACT format: **Budget Tier ($X-$Y):** • Idea 1 - why it works • Idea 2 - why it works. Maximum 4 sentences total for the entire response. Focus on immediate actionable ideas they can execute this week. NO long explanations, NO psychology lectures - just practical surprise ideas they can copy-paste into action.",
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

interface RevealBubbleRequestData {
  bubbleType: 'insights' | 'actions';
  guideContext: string;
  messageId: string;
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

// --- NEW: Handle Interactive Bubble Clicks ---
export const revealBubbleContent = onCall({
  timeoutSeconds: 60,
  secrets: ["OPENAI_API_KEY"],
}, async (request: CallableRequest<RevealBubbleRequestData>) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "The function must be called while authenticated.");
  }
  
  const userId = request.auth.uid;
  const { bubbleType, guideContext, messageId } = request.data;
  
  logger.info(`revealBubbleContent called - userId: ${userId}, bubbleType: ${bubbleType}, guideContext: ${guideContext}`);
  
  if (!bubbleType || !guideContext || !messageId) {
    throw new HttpsError("invalid-argument", "Missing required parameters.");
  }
  
  const firestore = getFirestore();
  const userMessageRef = firestore.collection("users").doc(userId).collection("messages");
  
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new HttpsError("internal", "API key not configured.");
    }
    const openai = new OpenAI({ apiKey });
    
    // Get the guide info for context
    const guideInfo = guideData[guideContext];
    if (!guideInfo) {
      throw new HttpsError("not-found", "Guide context not found.");
    }
    
    let contentPrompt = "";
    if (bubbleType === "insights") {
      contentPrompt = `Based on the guide "${guideContext}", provide 3 SHORT psychological insights about why this works. Use clean, modern formatting without excessive bold or asterisks. Keep each insight to 1-2 sentences. Maximum 100 words total. Format like this:

🧠 Positive messages trigger dopamine and serotonin release, naturally boosting mood and well-being.

💭 Personalized support signals that they're valued and not alone in their struggles, reducing stress and anxiety.

✨ Thoughtful texts provide momentary distraction from negative thoughts, helping reset mental state.`;
    } else if (bubbleType === "actions") {
      contentPrompt = `Based on the guide "${guideContext}", provide 3 SPECIFIC next steps they can take immediately. Use clean numbered format without excessive bold or asterisks. Each step should be 1 sentence with clear action. Maximum 75 words total. Format like this:

1. Choose the message that fits their personality and current situation best

2. Add a personal touch or inside reference to make it feel more genuine and tailored

3. Send with a smile emoji or GIF to enhance the cheerful intent`;
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system", 
          content: "You are Dr. Elena Vasquez. Provide clear, insightful content that adds value beyond the initial solution. Be conversational and helpful."
        },
        {
          role: "user",
          content: contentPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400,
    });
    
    const revealedContent = completion.choices[0]?.message?.content?.trim();
    if (!revealedContent) {
      throw new HttpsError("internal", "Failed to generate content.");
    }
    
    // Update the original bubble message with the revealed content
    await userMessageRef.doc(messageId).update({
      text: revealedContent,
      isRevealed: true,
      revealedAt: FieldValue.serverTimestamp(),
    });
    
    logger.info(`Bubble content revealed for message ID: ${messageId}`);
    return { success: true, content: revealedContent };
    
  } catch (error) {
    logger.error("Error in revealBubbleContent:", error);
    throw new HttpsError("internal", "Failed to reveal content.");
  }
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
  const isAnonymous = request.auth.token.firebase?.sign_in_provider === 'anonymous';
  const {connectionId, messageText} = request.data;
  
  // Debug logging for anonymous detection
  logger.info(`handleChatMessage - userId: ${userId}, isAnonymous: ${isAnonymous}, sign_in_provider: ${request.auth.token.firebase?.sign_in_provider}, auth_time: ${request.auth.token.auth_time}`);

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

  // --- USAGE LIMITS FOR ANONYMOUS USERS ---
  // Check multiple ways to detect anonymous users
  const isAnonymousAlt = request.auth.token.firebase?.identities === undefined || 
                        Object.keys(request.auth.token.firebase?.identities || {}).length === 0;
  const shouldApplyLimits = isAnonymous || isAnonymousAlt;
  
  logger.info(`Usage limit check - isAnonymous: ${isAnonymous}, isAnonymousAlt: ${isAnonymousAlt}, shouldApplyLimits: ${shouldApplyLimits}`);
  
  if (shouldApplyLimits) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const usageRef = firestore.collection("users").doc(userId).collection("usage").doc(today);
    const usageSnap = await usageRef.get();
    const usageData = usageSnap.exists ? usageSnap.data() || {} : { messageCount: 0, guideCount: 0 };
    
    // Check if message matches a guide
    const isGuideMessage = !!guideData[trimmedMessage];
    
    if (isGuideMessage && (usageData.guideCount || 0) >= 1) {
      logger.warn(`Anonymous user ${userId} exceeded guide limit for ${today}`);
      throw new HttpsError("resource-exhausted", "You've used your free guide for today. Create an account to get unlimited access!");
    }
    
    logger.info(`Message limit check - isGuideMessage: ${isGuideMessage}, messageCount: ${usageData.messageCount || 0}, limit check: ${(usageData.messageCount || 0) >= 5}`);
    
    if (!isGuideMessage && (usageData.messageCount || 0) >= 5) {
      logger.warn(`Anonymous user ${userId} exceeded message limit for ${today}`);
      throw new HttpsError("resource-exhausted", "You've used your 5 free messages for today. Create an account to get unlimited access!");
    }
    
    // Update usage count
    if (isGuideMessage) {
      await usageRef.set({ 
        ...usageData, 
        guideCount: (usageData.guideCount || 0) + 1,
        lastUsed: FieldValue.serverTimestamp()
      }, { merge: true });
      logger.info(`Updated guide usage for anonymous user ${userId}: ${(usageData.guideCount || 0) + 1}/1`);
    } else {
      await usageRef.set({ 
        ...usageData, 
        messageCount: (usageData.messageCount || 0) + 1,
        lastUsed: FieldValue.serverTimestamp()
      }, { merge: true });
      logger.info(`Updated message usage for anonymous user ${userId}: ${(usageData.messageCount || 0) + 1}/5`);
    }
  } else {
    logger.info(`Skipping usage limits for authenticated user ${userId}`);
  }

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

    // Check recent messages to see if we need to add guide context
    let activeGuideSystemPrompt = "";
    
    // Look through recent message docs for any guide context (more robust than just last message)
    for (const doc of messagesSnap.docs.slice(-3)) {
        const msgData = doc.data() as ChatMessageData;
        if (msgData.role === 'assistant' && msgData.isGuideResponse && msgData.guideContext) {
            const triggeredGuide = guideData[msgData.guideContext];
             if (triggeredGuide) {
                 activeGuideSystemPrompt = triggeredGuide.systemPromptSnippet;
                logger.info(`Adding system prompt snippet for guide: ${msgData.guideContext}`);
                break; // Use the most recent guide context
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

## Your Mission: DELIVER IMMEDIATE ACTIONABLE VALUE
Your primary goal is to give people specific, copy-paste solutions they can use in the next 5 minutes. When someone asks for texts, give them exact texts. When they ask for activities, give them step-by-step instructions. When they ask for scripts, provide word-for-word examples. Every response should contain:
1. Clear validation of their experience
2. IMMEDIATE actionable content (exact messages, specific steps, ready-to-use scripts)
3. Brief explanation of why it works
4. Context for when/how to use it

## Your Conversation Style:
- Lead with the actionable content they requested, then explain why it works
- Structure responses for maximum impact and readability
- For message guides: Provide exact, copy-paste texts with clear formatting
- For activity guides: Give specific step-by-step instructions they can follow today
- For date guides: Provide concrete plans with timing, location, and conversation ideas
- Include psychological insights that validate your advice
- Use natural formatting with sections for easy scanning
- Only ask a follow-up question if you absolutely need more context to help better

## Core Principles:
- Give people tools they can use in the next 5 minutes
- Every relationship challenge has practical solutions
- Small, specific actions create big changes
- Understanding patterns helps, but action creates results
- Provide exact words and phrases people can actually say

## CRITICAL: Response Structure for Interactive Experience

**YOUR MAIN RESPONSE SHOULD ONLY CONTAIN:**
- The core solution (exact texts, specific ideas, copy-paste content)
- Maximum 4-5 bullet points or short sentences
- NO explanations of why it works (that goes in bubbles)
- NO timing tips or implementation advice (that goes in bubbles) 
- NO follow-up suggestions (system handles that)

**WHAT TO EXCLUDE FROM MAIN RESPONSE:**
- ❌ NO "Why this works" explanations
- ❌ NO "When to send" or timing advice  
- ❌ NO psychological insights
- ❌ NO detailed next steps or action plans
- ❌ NO background theory or context

**FORMATTING RULES:**
- Use clean, numbered lists (1. 2. 3.) not bullet points
- NO excessive bold text with asterisks
- NO markdown formatting in your responses
- Keep it simple and scannable
- Professional, sophisticated appearance

The interactive bubbles will provide the insights and action plans - your job is to give the solution and create anticipation for the deeper content.

## MANDATORY: ALWAYS END WITH FOLLOW-UP PROMPTS
After delivering your core response, ALWAYS end with 2-3 specific follow-up prompts to keep the user engaged. Format as:

---

**What's next? I can help you:**
• [Specific action 1 based on their situation]
• [Specific action 2 based on their situation] 
• [Specific action 3 based on their situation]

Make follow-ups SPECIFIC to their exact situation, not generic. Examples:
- "Want me to help you practice this conversation?"
- "Need me to draft a follow-up message for tomorrow?"
- "Should we brainstorm what to do if they respond differently?"
- "Want to work on your confidence before sending this?"
- "Need help timing when to send this message?"
- "Should we plan what to say if they ask follow-up questions?"

NEVER use generic prompts like "anything else?" Always make them contextual and actionable.`;
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

    // Check if this is a follow-up to a recent guide
    let recentGuideContext: string | null = null;
    let isGuideFollowUp = false;
    
    // Look through recent message docs to see if there was a recent guide interaction
    for (const doc of messagesSnap.docs.slice(-5)) {
      const msgData = doc.data() as ChatMessageData;
      if (msgData.role === 'assistant' && msgData.isGuideResponse && msgData.guideContext) {
        recentGuideContext = msgData.guideContext;
        isGuideFollowUp = true;
        logger.info(`Detected guide follow-up for: ${recentGuideContext}`);
        break;
      }
    }

    const aiResponseData: any = {
      text: aiResponseText,
      createdAt: FieldValue.serverTimestamp(),
      role: "assistant",
      modelUsed: completion.model,
      finishReason: completion.choices[0]?.finish_reason,
      isGuideResponse: !!matchedGuide || isGuideFollowUp,
    };
    
    // Add guideContext for both initial guides and follow-ups
    if (matchedGuide) {
      aiResponseData.guideContext = trimmedMessage;
    } else if (isGuideFollowUp && recentGuideContext) {
      aiResponseData.guideContext = recentGuideContext;
    }
    
    const savedAiMessage = await userMessageRef.add(aiResponseData);
    logger.info(`AI response saved with ID: ${savedAiMessage.id}`);

    // Create interactive follow-up bubbles for guide follow-up responses (NOT initial guide clicks)
    if (isGuideFollowUp && recentGuideContext) {
      logger.info(`Creating interactive bubbles for guide follow-up: ${recentGuideContext}`);
      
      // Add slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Interactive insights bubble
      const insightsBubbleData = {
        text: "🧠 ✨ Why this actually works (the psychology behind it)",
        createdAt: FieldValue.serverTimestamp(),
        role: "assistant",
        isInteractiveBubble: true,
        bubbleType: "insights",
        guideContext: recentGuideContext,
      };
      const savedInsightsBubble = await userMessageRef.add(insightsBubbleData);
      logger.info(`Insights bubble created with ID: ${savedInsightsBubble.id}`);

      // Add another slight delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Interactive action bubble  
      const actionBubbleData = {
        text: "🎯 ⚡ Your step-by-step game plan (exactly what to do next)",
        createdAt: FieldValue.serverTimestamp(),
        role: "assistant",
        isInteractiveBubble: true,
        bubbleType: "actions",
        guideContext: recentGuideContext,
      };
      const savedActionBubble = await userMessageRef.add(actionBubbleData);
      logger.info(`Action bubble created with ID: ${savedActionBubble.id}`);
    }

    return {success: true, messageId: savedAiMessage.id};
  } catch (error) {
    logger.error("Error in handleChatMessage main block:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError("internal", "Failed to process chat message.", (error as Error).message);
  }
});
