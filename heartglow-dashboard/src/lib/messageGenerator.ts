// Mock message generator for HeartGlow AI
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../lib/firebase';

// Define the parameter structure matching the Cloud Function
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

// This is the main interface used by the frontend to call generateMessage
export interface MessageGenerationParams {
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

// Main exported function - updated to call the new Cloud Function
export async function generateMessage(params: MessageGenerationParams): Promise<{
  content: string;
  insights: string[];
}> {
  try {
    console.log("[messageGenerator] Calling generateEnhancedMessage with params:", params);
    
    const functions = getFunctions(app);
    // Call the NEW cloud function
    const generateEnhancedMessageCallable = httpsCallable(functions, 'generateEnhancedMessage'); 
    
    // Pass the params object directly (Cloud function expects { params: ... } structure)
    // Note: The `httpsCallable` might automatically wrap it, or you might need to send `{ params }`.
    // Testing is needed. Let's assume direct passing first.
    // CORRECTION: httpsCallable expects the data object directly, not nested under 'params'
    const result = await generateEnhancedMessageCallable({ params }); 
    
    const data = result.data as { content: string, insights: string[] };
    
    if (data && data.content) {
      console.log("[messageGenerator] Received response:", data);
      return {
        content: data.content,
        insights: data.insights || [] // Use provided insights or empty array
      };
    } else {
      console.error("[messageGenerator] Cloud function returned invalid data structure:", data);
      throw new Error('Invalid response structure from generation function');
    }

  } catch (error: any) {
    console.error('[messageGenerator] Error calling generateEnhancedMessage function:', error);
    // Provide a user-friendly error message and empty insights
    return {
      content: `Sorry, we couldn't generate a message right now. ${error.message || 'Please try again later.'} `,
      insights: []
    };
  }
}

// Remove or comment out the old generateMockMessage and related helpers
/*
function buildPrompt(params: MessageGenerationParams): string { ... }
function extractInsights(content: string, params: MessageGenerationParams): string[] { ... }
function generateMockMessage(params: MessageGenerationParams): string { ... }
function getRelationshipAttribute(relationship: string): string { ... }
function getOpeningLine(tone: string, relationship: string): string { ... }
function getClosingLine(tone: string, intent: string): string { ... }
function getEmailSubject(intent: string, name: string): string { ... }
*/

// Keep generateMessageDirect only if a fundamentally different fallback (e.g., cheaper model call) is implemented
// Otherwise, remove it to avoid confusion.
// For now, let's comment it out. The primary function now handles errors.
/*
export async function generateMessageDirect(params: MessageGenerationParams): Promise<{ ... }> { ... }
*/ 