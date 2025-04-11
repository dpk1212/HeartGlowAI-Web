import { generateMessage as generateMessageImpl } from './messageGenerator';

// Interface for message generation parameters that matches the MessageOutput component
export interface MessageGenerationParams {
  recipient: {
    name: string;
    relationship: string;
    id?: string;
  };
  intent: {
    type: string;
    custom?: string;
  };
  format: {
    type: string;
    length: string;
    options?: Record<string, any>;
  };
  tone: string;
  advanced?: {
    intensity: number;
    customInstructions?: string;
  };
  userUid?: string;
}

/**
 * Generate a message using the local message generator
 */
export async function generateMessage(params: MessageGenerationParams): Promise<any> {
  try {
    // Use the implementation from messageGenerator.ts
    return generateMessageImpl(params);
  } catch (error) {
    console.error("Error generating message:", error);
    throw error;
  }
}

/**
 * Generate a message directly without processing
 * This is a simpler version that can be used as a fallback
 */
export async function generateMessageDirect(params: MessageGenerationParams): Promise<any> {
  try {
    // Use the same implementation for direct generation
    return generateMessageImpl(params);
  } catch (error) {
    console.error("Error in direct message generation:", error);
    // Return a basic message structure even in case of failure
    return {
      content: "Unable to generate a message at this time. Please try again later.",
      insights: []
    };
  }
} 