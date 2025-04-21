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
// import * as functions from "firebase-functions"; // <-- REMOVE THIS LINE
import * as admin from "firebase-admin";
import {OpenAI} from "openai";
import Stripe from "stripe";

// v2 Imports for Callable Functions
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger"; // Use v2 logger

// v1 Imports for HTTP Request Functions (needed for webhooks)
import {onRequest} from "firebase-functions/v1/https"; // <-- Add v1 onRequest import

// Import functions config loader explicitly
import {config} from "firebase-functions";

// Ensure admin is initialized (idempotent)
try {
  admin.initializeApp();
} catch (e) {
  logger.info("Admin SDK already initialized."); // Use v2 logger
}

// Initialize Stripe client robustly
// Access config using functions.config()
// const stripeSecretKey = config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY; // Moved inside handler
let stripe: Stripe | null = null; // Initialize as null globally

// Define expected structure for data passed to the function
interface InsightsRequestData {
  message: string;
  recipient: { name: string, relationship: string };
  intent: string; // Assuming intent is just the string type based on frontend call
  tone: string;
}

/**
 * Parameters for building the insights prompt.
 * @typedef {object} InsightsParams
 * @property {string} message - The message content.
 * @property {{name: string, relationship: string}} recipient - Recipient info.
 * @property {string} intent - The message intent.
 * @property {string} tone - The message tone.
 */

/**
 * Builds the prompt for generating insights.
 * @param {InsightsRequestData} params - The parameters for the prompt.
 * @return {string} The generated prompt string.
 */
function buildInsightsPrompt(params: InsightsRequestData): string {
  const message = params?.message || "[Message content missing]";
  const recipientName = params?.recipient?.name || "[Recipient name missing]";
  const recipientRelationship =
    params?.recipient?.relationship || "[Recipient relationship missing]";
  const intent = params?.intent || "[Intent missing]";
  const tone = params?.tone || "[Tone missing]";

  // Using template literals for multi-line string
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


/**
 * Cloud function v2 to generate insights and grade for a message (Callable).
 * @param {CallableRequest<InsightsRequestData>} request - The request object.
 *   Contains request.data and request.auth.
 * @returns {Promise<{grade: string, insights: string[]}>} Grade and insights.
 */
export const generateMessageInsights = onCall(
  async (request) => {
    // Authentication check using request.auth
    if (!request.auth) {
      logger.warn("Function called without authentication."); // v2 logger
      // Throwing an HttpsError (imported from v2)
      throw new HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
      );
    }

    const userId = request.auth.uid;
    // Break long log line
    logger.info(
      `User ${userId} called generateMessageInsights (v2 Callable)`,
    );

    const params = request.data as InsightsRequestData;

    // Validate essential parameters
    if (
      !params ||
      typeof params !== "object" ||
      !params.message ||
      !params.recipient ||
      !params.intent ||
      !params.tone
    ) {
      // Break long log line
      logger.error(
        "Missing required parameters in payload.",
        params
      );
      const requiredKeys: (keyof InsightsRequestData)[] = [
        "message", "recipient", "intent", "tone",
      ];
      const missing = requiredKeys.filter((key) => !(key in params));
      // Break long error message
      const errorMsg = `Missing required parameters: ${missing.join(", ")}.`;
      throw new HttpsError( "invalid-argument", errorMsg );
    }

    try {
      // Get API key from environment variables
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        logger.error("OpenAI API key not configured."); // v2 logger
        throw new HttpsError("internal", "API key not configured."); // v2 HttpsError
      }

      const openai = new OpenAI({apiKey});

      // Build the prompt for message analysis
      const prompt = buildInsightsPrompt(params);
      logger.info("Generated analysis prompt."); // v2 logger

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{
          role: "user",
          content: prompt,
        }],
        temperature: 0.6,
        max_tokens: 300,
        response_format: {type: "json_object"},
      });

      const responseContent = completion.choices[0]?.message?.content?.trim();

      if (!responseContent) {
        logger.error("OpenAI response content was empty or null."); // v2 logger
        throw new Error("Failed to get valid content from OpenAI.");
      }

      // Break long log line
      const logFragment = responseContent.substring(0, 100) + "..."; // Shorter fragment
      logger.info("Received OpenAI response fragment:", logFragment);

      // --- Parse and Validate OpenAI Response ---
      let parsedResponse: any; // Use any temporarily
      try {
        parsedResponse = JSON.parse(responseContent);

        const gradeValid = parsedResponse && parsedResponse.grade &&
                           typeof parsedResponse.grade === "string";
        const insightsValid = parsedResponse && parsedResponse.insights &&
                              Array.isArray(parsedResponse.insights) &&
                              parsedResponse.insights.length === 3 &&
                              parsedResponse.insights.every(
                                (insight: any) => typeof insight === "string",
                              );

        if (!gradeValid || !insightsValid) {
          // Break long log line
          const errorMsg = "Response format error: Missing/invalid fields.";
          logger.error(
            errorMsg,
            {grade: gradeValid, insights: insightsValid},
            parsedResponse,
          );
          throw new Error(errorMsg);
        }

        // Break long log line
        logger.info(
          `Successfully extracted grade (${parsedResponse.grade}) ` +
            `and ${parsedResponse.insights.length} insights`,
        );

        // Return the data directly - v2 SDK handles wrapping
        return {
          grade: parsedResponse.grade,
          insights: parsedResponse.insights,
        };
      } catch (parseError) {
        const pError = parseError as Error;
        // Break long log lines
        logger.error(
          "Error parsing OpenAI response:",
          pError.message,
        );
        logger.error(
          "Raw Content fragment for parse error:",
          responseContent.substring(0, 150) + "...",
        );
        // Break long error message
        const errorMsg = "Failed to parse insights from AI response.";
        throw new HttpsError( "internal", errorMsg, pError.message );
      }
    } catch (error) {
      const errorTyped = error as Error;
      logger.error("Error in generateMessageInsights:", errorTyped); // v2 logger

      if (error instanceof HttpsError) { // Check if it's already HttpsError
        throw error;
      }

      // Break long error message
      const errorMsg = "Failed to generate message insights.";
      throw new HttpsError( "internal", errorMsg, errorTyped.message );
    }
  }); // End of onCall

// --- NEW: Stripe Webhook Handler ---

/**
 * Firebase HTTP function to handle Stripe webhooks.
 * v1 HTTPS function is recommended for webhooks by Stripe docs.
 */
export const stripeWebhook = onRequest(async (request, response) => {
  // --- Initialize Stripe inside the handler ---
  if (!stripe) { // Initialize only once per instance
    const stripeSecretKey = config().stripe?.secret_key || process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      logger.error(
        "CRITICAL: Stripe secret key not configured. "+
        "Ensure 'stripe.secret_key' is set in Firebase Functions config "+
        "using `firebase functions:config:set stripe.secret_key=...` and deploy."
      );
      // Cannot proceed without a key at runtime
      response.status(500).send("Server Configuration Error: Missing Stripe secret key.");
      return;
    } else {
      stripe = new Stripe(stripeSecretKey, {
        apiVersion: "2025-03-31.basil",
        typescript: true,
      });
      logger.info("Stripe client initialized for webhook handler instance.");
    }
  }
  // -------------------------------------------

  const signature = request.headers["stripe-signature"] as string;

  // Ensure you have set stripe.webhook_secret in Firebase config
  const webhookSecret = config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error(
      "CRITICAL: Stripe webhook secret is not configured. "+
      "Ensure 'stripe.webhook_secret' is set in Firebase Functions config "+
      "using `firebase functions:config:set stripe.webhook_secret=...` and deploy."
    );
    response.status(400).send("Webhook Error: Missing webhook secret configuration.");
    return;
  }

  let event: Stripe.Event;

  try {
    // Use rawBody for verification
    event = stripe.webhooks.constructEvent( // Use the now-initialized stripe client
      request.rawBody,
      signature,
      webhookSecret
    );
  } catch (err) {
    const error = err as Error;
    logger.error("Webhook signature verification failed.", error.message);
    response.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  logger.info("Received Stripe event:", event.type);

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Retrieve the client_reference_id (Firebase UID)
    const clientReferenceId = session.client_reference_id;
    // Ensure customer and subscription IDs are treated as strings (can be null/object)
    const stripeCustomerId = typeof session.customer === 'string' ? session.customer : null;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;

    if (!clientReferenceId) {
      logger.error(
        "Missing client_reference_id in checkout.session.completed",
        {sessionId: session.id}
      );
      // Respond early, nothing to do without the user ID
      response.status(200).send("Success (no client_reference_id)");
      return;
    }

    logger.info(
      `Checkout session completed for user UID: ${clientReferenceId}`,
      {sessionId: session.id, customer: stripeCustomerId, subscription: subscriptionId}
    );

    // --- Provision access ---
    try {
      const userRef = admin.firestore().collection('users').doc(clientReferenceId);
      await userRef.set({
        stripeCustomerId: stripeCustomerId,
        stripeSubscriptionId: subscriptionId,
        isPremium: true, // Set premium status to true
        // Consider adding subscription end date later by fetching subscription details if needed
      }, { merge: true }); // Use merge: true to avoid overwriting other user data

      logger.info(`Successfully updated Firestore for user ${clientReferenceId} to premium.`);

    } catch (firestoreError) {
      logger.error(
        `Error updating Firestore for user ${clientReferenceId}:`,
        firestoreError
      );
      // Decide if this should be a 500 error to Stripe.
      // Generally, if provisioning fails, you might want Stripe to retry.
      // However, ensure your function is idempotent if it retries.
      // For now, we still send 200 to acknowledge receipt, but log the critical failure.
      // response.status(500).send("Internal Server Error: Failed to update user data.");
      // return;
    }
    // ------------------------------

    // Example: Log success and respond to Stripe
    // logger.info(`Successfully processed checkout for user ${clientReferenceId}`); // Moved logging inside try block
  }

  // Add handlers for other events if needed (e.g., subscription updates/cancellations)
  // else if (event.type === 'customer.subscription.updated') { ... }
  // else if (event.type === 'customer.subscription.deleted') { ... }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send("Received");
});

// --- Optional: Customer Portal Function ---
// You might want a function to create a portal session later.
// export const createCustomerPortal = onCall(async (request) => { ... });

// Add exports for any other functions defined in this file below
// e.g., export { someOtherFunction } from "./otherFile";
