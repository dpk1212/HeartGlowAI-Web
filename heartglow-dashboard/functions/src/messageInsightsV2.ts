import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from 'openai';

// Ensure admin is initialized (idempotent)
// If admin is initialized elsewhere (e.g., index.ts), this might not be strictly necessary here,
// but it's safe to leave for standalone testing or clarity.
try { admin.initializeApp(); } catch (e) { /* Already initialized */ }

// Define the expected input structure from the frontend
interface InsightsRequestParamsV2 {
  message: string;
  recipient: {
    name: string;
    relationship: string;
  };
  intent: string; // Assuming intent type is passed, e.g., "Gratitude", "Apology"
  tone: string;   // E.g., "Warm", "Formal"
}

// Define the structure of the expected JSON response from OpenAI
interface OpenAIInsightsResponseV2 {
  grade: string;
  insights: string[];
}

/**
 * Builds the prompt for generating insights and a grade, specifically requesting JSON output.
 */
function buildInsightsPromptV2(params: InsightsRequestParamsV2): string {
  const { message, recipient, intent, tone } = params;

  // Basic validation within the builder
  const safeMessage = message || "[Message content missing]";
  const safeRecipientName = recipient?.name || "[Name missing]";
  const safeRecipientRelationship = recipient?.relationship || "[Relationship missing]";
  const safeIntent = intent || "[Intent missing]";
  const safeTone = tone || "[Tone missing]";

  // Construct the prompt, explicitly asking for JSON and nothing else.
  return `
Analyze the following message based on the provided context.

**Context:**
*   **Recipient:** ${safeRecipientName} (${safeRecipientRelationship})
*   **User's Stated Intent:** ${safeIntent}
*   **User's Desired Tone:** ${safeTone}

**Message Content:**
\`\`\`
${safeMessage}
\`\`\`

**Task:**
Evaluate the message's effectiveness based on the context. Consider:
*   Alignment with the stated intent and tone.
*   Appropriateness for the recipient and relationship.
*   Clarity, authenticity, and emotional intelligence.
*   Overall potential impact.

**Output Requirements:**
Respond ONLY with a valid JSON object adhering to the following structure. Do NOT include any introductory text, concluding remarks, markdown formatting (like \`\`\`json), or any other text outside the JSON object itself.

\`\`\`json
{
  "grade": "A letter grade (e.g., A, B+, C-) reflecting the overall effectiveness",
  "insights": [
    "A specific insight explaining *why* the grade was given (focus on strengths or weaknesses related to intent/tone).",
    "A specific insight about the message's suitability for the relationship and recipient.",
    "A specific insight regarding clarity, authenticity, or emotional connection."
  ]
}
\`\`\`
`;
}

/**
 * Firebase Cloud Function (HTTPS Callable V2) to generate insights and a grade for a message.
 * Calls OpenAI API requesting a JSON response. Uses older SDK syntax.
 */
export const generateMessageInsightsV2 = functions
  // Add region/runtime options if needed, but start without them to avoid the previous error
  // .region('us-central1')
  // .runWith({ timeoutSeconds: 300, memory: '256MB' })
  .https.onCall(async (data, context) => {
    const functionName = "generateMessageInsightsV2"; // For logging

    // 1. Authentication Check
    if (!context.auth) {
      console.error(`${functionName}: Authentication check failed.`);
      throw new functions.https.HttpsError(
        'unauthenticated',
        'The function must be called while authenticated.'
      );
    }
    const userId = context.auth.uid;
    console.log(`${functionName}: Function called by authenticated user ${userId}.`);

    // 2. Input Validation
    const params = data as InsightsRequestParamsV2;
    if (!params || !params.message || !params.recipient || !params.intent || !params.tone) {
       console.error(`${functionName}: Invalid arguments received.`, { params });
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required parameters (message, recipient, intent, tone).'
      );
    }
    console.log(`${functionName}: Valid parameters received.`);

    // 3. Prepare for OpenAI Call
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error(`${functionName}: OpenAI API key not configured.`);
      throw new functions.https.HttpsError('internal', 'API key not configured.');
    }

    const openai = new OpenAI({ apiKey });
    const prompt = buildInsightsPromptV2(params);
    const model = "gpt-4-turbo-preview"; // Or your preferred model

    console.log(`${functionName}: Calling OpenAI model ${model}.`);

    try {
      // 4. Call OpenAI API - Requesting JSON Output
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.5, // Slightly lower temp for more focused analysis
        max_tokens: 300,  // Should be sufficient for the JSON structure
        response_format: { type: "json_object" }, // ** Crucial for reliability **
      });

      const responseContent = completion.choices[0]?.message?.content?.trim();

      if (!responseContent) {
        console.error(`${functionName}: OpenAI response content is empty.`);
        throw new Error("OpenAI returned empty content.");
      }

      console.log(`${functionName}: Received raw response from OpenAI (first 100 chars):`, responseContent.substring(0, 100));

      // 5. Parse and Validate JSON Response
      let parsedResponse: OpenAIInsightsResponseV2;
      try {
        parsedResponse = JSON.parse(responseContent);

        // Validate the structure
        if (!parsedResponse.grade || typeof parsedResponse.grade !== 'string' ||
            !parsedResponse.insights || !Array.isArray(parsedResponse.insights) ||
            parsedResponse.insights.length === 0 || // Ensure insights array is not empty
            !parsedResponse.insights.every(item => typeof item === 'string')) {

          console.error(`${functionName}: Parsed JSON structure is invalid.`, { parsedResponse });
          throw new Error("Parsed JSON response has invalid structure or missing fields.");
        }

      } catch (parseError: any) {
        console.error(`${functionName}: Failed to parse OpenAI JSON response.`, { error: parseError.message, responseContent });
        throw new functions.https.HttpsError(
          'internal',
          'Failed to parse the analysis from the AI response. The response was not valid JSON.',
          parseError.message // Include parsing error message
        );
      }

      console.log(`${functionName}: Successfully parsed grade (${parsedResponse.grade}) and ${parsedResponse.insights.length} insights.`);

      // 6. Return Success Response
      return {
        grade: parsedResponse.grade,
        insights: parsedResponse.insights
      };

    } catch (error: any) {
      console.error(`${functionName}: Error during OpenAI call or processing.`, { errorMessage: error.message, errorDetails: error });

      throw new functions.https.HttpsError(
        'internal', // Default to 'internal' unless a more specific error is identified
        'Failed to generate message analysis due to an internal error.',
        error.message // Pass the underlying error message
      );
    }
}); 