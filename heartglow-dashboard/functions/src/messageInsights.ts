import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import OpenAI from 'openai';

// Ensure admin is initialized (idempotent)
try { admin.initializeApp(); } catch (e) { console.log("Admin SDK already initialized."); }

interface InsightsRequestParams {
  message: string;
  recipient: {
    name: string;
    relationship: string;
  };
  intent: string;
  tone: string;
}

/**
 * Cloud function to generate insights and grade for a message
 */
export const generateMessageInsights = functions.https.onCall(async (data, context) => {
  // Authentication check
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }
  
  const userId = context.auth.uid;
  console.log(`User ${userId} called generateMessageInsights`);

  const params = data as InsightsRequestParams;
  
  if (!params || !params.message) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required parameters.'
    );
  }

  try {
    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key not configured in environment variables.");
      throw new functions.https.HttpsError('internal', 'API key not configured.');
    }

    const openai = new OpenAI({ apiKey });
    
    // Build the prompt for message analysis
    const prompt = buildInsightsPrompt(params);
    console.log("Generated analysis prompt for message");
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ 
        role: "user", 
        content: prompt 
      }],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content?.trim();
    
    if (!responseContent) {
      throw new Error("Failed to get valid content from OpenAI.");
    }
    
    console.log("Received response from OpenAI:", responseContent.substring(0, 100) + "...");
    
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(responseContent);
      
      if (!parsedResponse.grade || !parsedResponse.insights || !Array.isArray(parsedResponse.insights)) {
        throw new Error("Response missing required fields");
      }
      
      console.log(`Successfully extracted grade (${parsedResponse.grade}) and ${parsedResponse.insights.length} insights`);
      
      return {
        grade: parsedResponse.grade,
        insights: parsedResponse.insights
      };
      
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to parse insights from AI response.'
      );
    }
    
  } catch (error: any) {
    console.error("Error in generateMessageInsights:", error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate message insights.',
      error.message
    );
  }
});

/**
 * Builds the prompt for generating insights
 */
function buildInsightsPrompt(params: InsightsRequestParams): string {
  const { message, recipient, intent, tone } = params;
  
  return `
### Message Analysis Task

Analyze the following message and provide a letter grade (A+, A, A-, B+, B, B-, etc.) and 3 specific insights about its effectiveness.

### Message Context
- **Recipient**: ${recipient.name} (${recipient.relationship})
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
   - A letter grade (A+, A, A-, B+, B, B-, etc.)
   - 3 specific insights about what makes this message effective

### Required JSON Response Format
{
  "grade": "A letter grade as a string",
  "insights": [
    "First insight about what works well",
    "Second insight about emotional intelligence or tone",
    "Third insight about relationship-specific effectiveness"
  ]
}`;
} 