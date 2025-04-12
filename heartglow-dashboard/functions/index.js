/**
 * HeartGlowAI Message Generation Cloud Functions
 */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {OpenAI} = require("openai");

// Initialize Firebase Admin
admin.initializeApp();

// Helper function to get OpenAI API key from Firestore
async function getOpenAIKey() {
  try {
    const snapshot = await admin.firestore().collection('secrets').doc('secrets').get();
    if (!snapshot.exists) {
      throw new Error('Secrets document not found');
    }
    const data = snapshot.data();
    if (!data.openaikey) {
      throw new Error('OpenAI key not found in secrets');
    }
    return data.openaikey;
  } catch (error) {
    console.error('Error fetching OpenAI key from Firestore:', error);
    throw error;
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
 * Cloud function to generate a message using OpenAI
 * This matches the existing endpoint:
 * https://us-central1-heartglowai.cloudfunctions.net/generateMessageV2
 */
exports.generateMessageV2 = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
    );
  }

  try {
    // Get OpenAI API key from Firestore
    const apiKey = await getOpenAIKey();
    
    // Initialize OpenAI client with API key from Firestore
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    const {params, prompt} = data;
    
    // Create system message with formatting instructions
    const systemPrompt = `You are HeartGlowAI, an emotionally intelligent AI that crafts heartfelt, personalized messages. 
    
Format your response as a JSON object with two properties:
1. "content": The message text
2. "insights": An array of 3 strings explaining why the message works emotionally`;

    // Call OpenAI API with parameters from ESSENTIAL_RESTART.md
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // Match existing configuration
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: prompt},
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
      response_format: {type: "json_object"},
    });

    // Parse the response
    const responseContent = response.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No content received from OpenAI");
    }

    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(responseContent);
      
      // Validate the response format
      if (!parsedResponse.content) {
        throw new Error("Invalid response format");
      }
      
      // Return the generated message and insights
      return {
        content: parsedResponse.content,
        insights: parsedResponse.insights || 
          extractInsights(parsedResponse.content, params),
      };
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      
      // If JSON parsing fails, treat the entire response as the message content
      return {
        content: responseContent,
        insights: extractInsights(responseContent, params),
      };
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Failed to generate message with OpenAI.",
        error
    );
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
    // Get OpenAI API key from Firestore
    const apiKey = await getOpenAIKey();
    
    // Initialize OpenAI client with API key from Firestore
    const openai = new OpenAI({
      apiKey: apiKey,
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