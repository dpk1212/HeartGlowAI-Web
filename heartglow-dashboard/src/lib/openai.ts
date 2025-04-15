import {
  generateMessage as generateMessageImpl,
  MessageGenerationParams as MessageGenerationParamsImpl // Import the type from messageGenerator
} from './messageGenerator';

// Re-export the correct type definition from messageGenerator
export type MessageGenerationParams = MessageGenerationParamsImpl;

// Re-export the generateMessage function from messageGenerator
// This acts as a facade if needed, but mostly ensures consistency
export const generateMessage = generateMessageImpl;

// Remove the old, outdated direct function
/*
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
*/

// Remove the old interface definition
/*
export interface MessageGenerationParams {
  // ... old fields ...
}
*/ 