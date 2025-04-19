// heartglow-dashboard/functions/src/messageGeneration.ts
import * as functions from "firebase-functions"; // Add import
import * as admin from "firebase-admin"; // Add import
import OpenAI from 'openai'; // Using the official OpenAI library

// Ensure admin is initialized (idempotent)
try { admin.initializeApp(); } catch (e) { console.log("Admin SDK already initialized."); }

// Define the expected input structure (matching frontend)
// Basic structure, refine based on actual data passed
interface ConnectionData {
    specificRelationship?: string;
    yearsKnown?: number;
    communicationStyle?: string;
    relationshipGoal?: string;
    lastMessageDate?: any;
}

interface StyleData {
    formality: number; // 1-5
    depth: number; // 1-5
    length: string; // Descriptive
}

interface CustomInstructions {
    text: string;
    options: Record<string, boolean>;
}

interface GenerationParams {
    recipient: { name: string; relationship: string; id?: string };
    connectionData: ConnectionData;
    intent: { type: string; custom?: string };
    format: { type: string; length: string; options?: Record<string, any> };
    tone: string;
    promptedBy: string;
    messageGoal: string;
    style: StyleData;
    customInstructions: CustomInstructions;
}

// --- Helper: Build the structured prompt ---
function buildEnhancedPrompt(params: GenerationParams): string {
    const {
        recipient, connectionData, intent, format, tone,
        promptedBy, messageGoal, style, customInstructions
    } = params;

    // Translate numerical levels to descriptions
    const formalityMap = ['Very Casual', 'Casual', 'Neutral', 'Formal', 'Very Formal'];
    const depthMap = ['Lighthearted', 'Warm', 'Personal', 'Deeply Personal', 'Vulnerable'];
    const formalityDesc = formalityMap[style.formality - 1] || 'Neutral';
    const depthDesc = depthMap[style.depth - 1] || 'Personal';

    // Build context string carefully
    let context = `*   **Recipient:** ${recipient.name}\n`;
    context += `*   **Relationship:** ${recipient.relationship}`;
    if (connectionData.specificRelationship) context += ` (${connectionData.specificRelationship})`;
    context += `\n`;
    if (connectionData.yearsKnown) context += `*   **Known for:** ${connectionData.yearsKnown} years\n`;
    if (connectionData.communicationStyle) context += `*   **Their Communication Style (User Note):** ${connectionData.communicationStyle}\n`;
    if (connectionData.relationshipGoal) context += `*   **User's Goal for Relationship:** ${connectionData.relationshipGoal}\n`;
    if (promptedBy) context += `*   **Reason for this Message:** ${promptedBy}\n`;
    if (messageGoal) context += `*   **User's Goal for this Message:** ${messageGoal}\n`;

    // Build requirements string
    let requirements = `*   **Core Intent:** ${intent.custom || intent.type}\n`;
    requirements += `*   **Format:** ${format.type}\n`;
    requirements += `*   **Desired Length:** ${style.length}\n`; // Use descriptive length
    requirements += `*   **Tone:** ${tone}\n`;
    requirements += `*   **Formality Level:** ${formalityDesc}\n`;
    requirements += `*   **Emotional Depth:** ${depthDesc}\n`;
    if (customInstructions.text) requirements += `*   **Specific User Instructions:** ${customInstructions.text}\n`;
    // Optional: Add checkbox instructions if needed:
    // if (customInstructions.options?.mentionMemory) requirements += "*   **Guidance:** Mention a specific memory/event if relevant.\n";
    // if (customInstructions.options?.askQuestion) requirements += "*   **Guidance:** Include a question for the recipient.\n";


    // Construct the final prompt
    // Simplified separator and clearer instructions
    // Correctly escaped backslashes for newline characters
    const separator = "\\n%%%INSIGHTS%%%\\n"; // Use escaped \\n within the string
    const prompt = `### Persona\nAct as an expert in empathetic communication named HeartGlow AI. Your goal is to help the user craft authentic, thoughtful messages that build stronger relationships, tailored to the specific context provided.\n\n### Context\n${context}\n### Message Requirements\n${requirements}\n### Task\nYour response MUST follow this exact structure:\n1.  First, provide ONLY the generated message content based on the Context and Requirements. Do NOT add any introductory text, commentary, or sign-off before the message.\n2.  Immediately after the message content, add the exact separator line: \`${separator}\` \n3.  Immediately following the separator, provide 2-3 concise bullet points (each starting with '*') explaining *why* the generated message is effective for the given Context and Requirements. Focus on tone, intent alignment, and relationship suitability. Do NOT add any text after the final bullet point.\n\n### Output Structure Example:\n[Generated Message Content Only]\n%%%INSIGHTS%%%\n* Insight explaining effectiveness 1.\n* Insight explaining effectiveness 2.`;

    return prompt;
}


// --- Cloud Function Definition ---
export const generateEnhancedMessage = functions.https.onCall(async (data, context) => {
    // Optional: Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }
    const userId = context.auth.uid;
    console.log(`User ${userId} called generateEnhancedMessage`);

    const params = data.params as GenerationParams; // Get params passed from frontend

    if (!params) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters.');
    }

    // Build the prompt
    const prompt = buildEnhancedPrompt(params);
    console.log("Generated Prompt:\n", prompt); // Log prompt for debugging

    try {
        // --- OpenAI API Call ---
        // Get API key from environment variables
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error("OpenAI API key not configured in environment variables.");
            throw new functions.https.HttpsError('internal', 'API key not configured.');
        }

        const openai = new OpenAI({ apiKey });

        // Choose model (e.g., gpt-4 or gpt-3.5-turbo)
        const model = "gpt-4-turbo-preview"; // Or "gpt-3.5-turbo"

        const completion = await openai.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7, // Adjust as needed
            max_tokens: 500, // Adjust based on expected length
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const rawCompletion = completion.choices[0]?.message?.content?.trim();

        if (!rawCompletion) {
            throw new Error("Failed to get valid content from OpenAI.");
        }

        // --- Parse Message and Insights ---
        // Look for the new, simple separator
        const separator = "\n%%%INSIGHTS%%%\n"; 
        const parts = rawCompletion.split(separator);
        
        let messageContent = '';
        let parsedInsights: string[] = [];

        if (parts.length >= 2) {
            messageContent = parts[0].trim();
            const insightsText = parts[1].trim();
            // Split insights by common list markers (newline followed by *, -, or •)
            // Also trim each insight and filter empty ones
            parsedInsights = insightsText
                .split(/\n\s*[-*•]\s*/)
                .map(insight => insight.trim())
                .filter(insight => insight.length > 0);

            // If splitting by list marker yields only one item (or zero), 
            // maybe the AI just listed them separated by newlines only.
            if (parsedInsights.length <= 1 && insightsText.includes('\n')) {
                parsedInsights = insightsText
                    .split(/\n+/)
                    .map(insight => insight.trim())
                    .filter(insight => insight.length > 0);
            }

        } else {
            // Fallback if separator is not found (treat entire response as message)
            console.warn('[generateEnhancedMessage] Separator not found in OpenAI response. Treating entire response as message.');
            messageContent = rawCompletion;
            // Provide basic fallback insights if parsing failed
            parsedInsights = [
                `Generated using ${model}.`,
                `Tone aimed for: ${params.tone}.`,
                `Tailored for relationship: ${params.recipient.relationship}.`,
                `(Using fallback insights as structure was not recognized)` // Add note about fallback
            ];
        }

        // --- Deprecated Basic Insights Generation ---
        // const insights = [\n        //     `Generated using ${model} based on detailed context.`,\n        //     `Tone aimed for: ${params.tone}.`,\n        //     `Tailored for relationship: ${params.recipient.relationship}.`\n        // ];\n
        console.log("Successfully generated message content and parsed insights.");
        return { content: messageContent, insights: parsedInsights }; // Return parsed content and insights

    } catch (error: any) {
        console.error("Error calling OpenAI or processing response:", error);
        if (error.response) {
            console.error("OpenAI API Error Details:", error.response.data);
        }
        // Throw a specific error for the frontend
        throw new functions.https.HttpsError('internal', 'Failed to generate message via OpenAI.', error.message);
    }
}); 