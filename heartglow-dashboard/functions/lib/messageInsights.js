"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMessageInsightsHttp = exports.generateMessageInsights = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const openai_1 = __importDefault(require("openai"));
const cors_1 = __importDefault(require("cors")); // Fixed import
// Initialize CORS middleware with specific domains
const corsHandler = (0, cors_1.default)({
    origin: [
        'https://heartglowai.com',
        'https://www.heartglowai.com',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
});
// Ensure admin is initialized (idempotent)
try {
    admin.initializeApp();
}
catch (e) {
    console.log("Admin SDK already initialized.");
}
/**
 * Cloud function to generate insights and grade for a message
 */
exports.generateMessageInsights = functions.https.onCall(async (data, context) => {
    var _a, _b, _c;
    // Authentication check
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    const userId = context.auth.uid;
    console.log(`User ${userId} called generateMessageInsights`);
    const params = data;
    if (!params || !params.message) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters.');
    }
    try {
        // Get API key from environment variables
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error("OpenAI API key not configured in environment variables.");
            throw new functions.https.HttpsError('internal', 'API key not configured.');
        }
        const openai = new openai_1.default({ apiKey });
        // Build the prompt for message analysis
        const prompt = buildInsightsPrompt(params);
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
        const responseContent = (_c = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
        if (!responseContent) {
            throw new Error("Failed to get valid content from OpenAI.");
        }
        try {
            // Parse the JSON response
            const parsedResponse = JSON.parse(responseContent);
            if (!parsedResponse.grade || !parsedResponse.insights || !Array.isArray(parsedResponse.insights)) {
                throw new Error("Response missing required fields");
            }
            return {
                grade: parsedResponse.grade,
                insights: parsedResponse.insights
            };
        }
        catch (parseError) {
            console.error("Error parsing OpenAI response:", parseError);
            throw new functions.https.HttpsError('internal', 'Failed to parse insights from AI response.');
        }
    }
    catch (error) {
        console.error("Error in generateMessageInsights:", error);
        throw new functions.https.HttpsError('internal', 'Failed to generate message insights.', error.message);
    }
});
// Also create an HTTP version of the function for direct fetch calls
exports.generateMessageInsightsHttp = functions.https.onRequest((request, response) => {
    // Apply CORS middleware
    return corsHandler(request, response, async () => {
        var _a, _b, _c;
        // Check for authentication
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            response.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token' });
            return;
        }
        const idToken = authHeader.split('Bearer ')[1];
        try {
            // Verify the ID token
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const userId = decodedToken.uid;
            console.log(`User ${userId} called generateMessageInsightsHttp via HTTP endpoint`);
            // Get request body
            const params = request.body;
            if (!params || !params.message) {
                response.status(400).json({ error: 'Missing required parameters' });
                return;
            }
            // Get API key from environment variables
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                console.error("OpenAI API key not configured in environment variables.");
                response.status(500).json({ error: 'API key not configured' });
                return;
            }
            const openai = new openai_1.default({ apiKey });
            // Build the prompt for message analysis
            const prompt = buildInsightsPrompt(params);
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
            const responseContent = (_c = (_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
            if (!responseContent) {
                response.status(500).json({ error: 'Failed to get valid content from OpenAI' });
                return;
            }
            try {
                // Parse the JSON response
                const parsedResponse = JSON.parse(responseContent);
                if (!parsedResponse.grade || !parsedResponse.insights || !Array.isArray(parsedResponse.insights)) {
                    response.status(500).json({ error: 'Response missing required fields' });
                    return;
                }
                response.status(200).json({
                    grade: parsedResponse.grade,
                    insights: parsedResponse.insights
                });
            }
            catch (parseError) {
                console.error("Error parsing OpenAI response:", parseError);
                response.status(500).json({ error: 'Failed to parse insights from AI response' });
            }
        }
        catch (error) {
            console.error("Error in generateMessageInsightsHttp:", error);
            response.status(500).json({ error: 'Internal server error', message: error.message });
        }
    });
});
/**
 * Builds the prompt for generating insights
 */
function buildInsightsPrompt(params) {
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
//# sourceMappingURL=messageInsights.js.map