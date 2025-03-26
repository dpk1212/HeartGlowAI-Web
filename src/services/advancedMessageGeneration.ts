import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, addDoc, Timestamp, FirestoreDataConverter } from 'firebase/firestore';
import { db } from '../firebase/config';
import { auth } from '../firebase/config';
import OpenAI from 'openai';

// Export the OpenAI instance so it can be updated at runtime for testing
export let openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY_HERE', // Will be replaced at runtime
  dangerouslyAllowBrowser: true // Only for development testing
});

// Pydantic Schema Types
export interface MessageInsight {
  communication_strategy: string;
  emotional_intelligence_score: number;
  potential_impact: string;
}

export interface MessageGeneration {
  messages: string[];
  insights: MessageInsight[];
  previous_variations?: string[];
  conversation_id: string;
}

export interface MessageGenerationRequest {
  relationship_type: string;
  communication_scenario: string;
  emotional_intensity: number;
  recipient_name: string;
  conversation_name: string;
  additional_context?: string;
}

export interface MessageFeedback {
  conversationId: string;
  messageText: string;
  rating: number;
  userModification?: string;
  timestamp?: Date;
  userId?: string;
  aiModel?: string;
  feedbackVersion?: string;
}

// Firestore converter for typed operations
const feedbackConverter: FirestoreDataConverter<MessageFeedback> = {
  toFirestore: (feedback) => {
    return {
      ...feedback,
      timestamp: feedback.timestamp || Timestamp.now()
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      conversationId: data.conversationId,
      messageText: data.messageText,
      rating: data.rating,
      userModification: data.userModification,
      timestamp: data.timestamp?.toDate(),
      userId: data.userId,
      aiModel: data.aiModel,
      feedbackVersion: data.feedbackVersion
    };
  }
};

/**
 * Generate advanced messages with structured output using OpenAI
 * @param context Message generation request context
 * @returns Structured response with messages and insights
 */
export const generateMessages = async (context: MessageGenerationRequest): Promise<MessageGeneration | { error: boolean, refusalReason?: string, details?: string }> => {
  console.log('Generating messages with context:', context);
  
  try {
    // In production, use Firebase Functions
    if (process.env.NODE_ENV === 'production') {
      return generateMessagesViaFirebase(context);
    }

    // For development, use direct API call
    console.log('Making direct API call to OpenAI');
    
    // Generate a unique conversation ID
    const conversationId = `direct-${Date.now()}`;
    
    // System prompt for the AI
    const systemPrompt = `You are an advanced communication coach. Generate two nuanced, contextually appropriate messages based on the given relationship and scenario information.
    
    Your response MUST be in the following JSON format:
    {
      "messages": [
        "First full message text",
        "Second full message text"
      ],
      "insights": [
        {
          "communication_strategy": "Strategy for first message",
          "emotional_intelligence_score": 8.5,
          "potential_impact": "Impact description for first message"
        },
        {
          "communication_strategy": "Strategy for second message",
          "emotional_intelligence_score": 9.2,
          "potential_impact": "Impact description for second message"
        }
      ],
      "previous_variations": [
        "Alternative phrasing 1",
        "Alternative phrasing 2",
        "Alternative phrasing 3"
      ]
    }
    
    Key Guidelines:
    - Analyze relationship dynamics and adapt message to the specified relationship type
    - Tune emotional intensity to match the given level (${context.emotional_intensity}/100)
    - Add personalization using the recipient's name (${context.recipient_name})
    - Incorporate any additional context provided
    - Provide distinct communication strategies for each message
    - Rate each message's emotional intelligence on a scale of 0-10
    - Describe the potential impact in 1-2 sentences`;
    
    // Make the direct API call
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: JSON.stringify({
            relationship_type: context.relationship_type,
            communication_scenario: context.communication_scenario,
            emotional_intensity: context.emotional_intensity,
            recipient_name: context.recipient_name,
            additional_context: context.additional_context || ''
          })
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });
    
    console.log('OpenAI API response:', response);
    
    if (!response.choices || !response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
      throw new Error('Invalid response from OpenAI API');
    }
    
    // Parse the response content
    const parsed = JSON.parse(response.choices[0].message.content);
    
    // Add conversation ID to the response
    parsed.conversation_id = conversationId;
    
    // Validate the response structure
    if (!parsed.messages || !Array.isArray(parsed.messages) || parsed.messages.length < 2) {
      return {
        error: true,
        details: 'Invalid response format: messages array missing or incomplete'
      };
    }
    
    return parsed as MessageGeneration;
  } catch (error: any) {
    // Comprehensive error handling
    console.error('Message Generation Error', error);
    return {
      error: true,
      details: error.message || 'Unknown error generating messages'
    };
  }
};

/**
 * Generate messages via Firebase Functions (for production)
 */
const generateMessagesViaFirebase = async (context: MessageGenerationRequest): Promise<MessageGeneration | { error: boolean, refusalReason?: string, details?: string }> => {
  try {
    const functions = getFunctions();
    const generateMessageFunction = httpsCallable(functions, 'generateAdvancedMessage');
    const result = await generateMessageFunction(context);
    
    return result.data as MessageGeneration;
  } catch (error: any) {
    console.error("Error in Firebase function call:", error);
    return {
      error: true,
      details: error.message
    };
  }
};

/**
 * Collect user feedback on generated messages
 */
export const collectMessageFeedback = async (feedback: MessageFeedback): Promise<void | MessageGeneration> => {
  try {
    const user = auth.currentUser;
    
    // Store feedback with advanced tracking
    await addDoc(
      collection(db, 'message_feedback').withConverter(feedbackConverter),
      {
        ...feedback,
        timestamp: new Date(),
        userId: user?.uid || 'anonymous',
        aiModel: 'gpt-4-turbo',
        feedbackVersion: '1.0'
      }
    );

    // Conditional regeneration logic
    if (feedback.rating < 3 || feedback.userModification) {
      return regenerateMessage({
        originalContext: feedback.conversationId,
        userFeedback: feedback.userModification
      });
    }
  } catch (error: any) {
    console.error('Feedback Collection Error', error);
    throw new Error(`Failed to save feedback: ${error.message}`);
  }
};

/**
 * Regenerate message based on user feedback
 */
export const regenerateMessage = async ({ originalContext, userFeedback }: { originalContext: string, userFeedback?: string }): Promise<MessageGeneration> => {
  try {
    const functions = getFunctions();
    const regenerateFunction = httpsCallable(functions, 'regenerateMessage');
    const result = await regenerateFunction({ originalContext, userFeedback });
    
    return result.data as MessageGeneration;
  } catch (error: any) {
    console.error("Regeneration Error:", error);
    throw new Error(`Failed to regenerate message: ${error.message}`);
  }
};

/**
 * Get suggested variations for a specific message
 */
export const getMessageVariations = async (messageText: string, context: Partial<MessageGenerationRequest>): Promise<string[]> => {
  try {
    const functions = getFunctions();
    const getVariationsFunction = httpsCallable(functions, 'getMessageVariations');
    const result = await getVariationsFunction({ messageText, context });
    
    return (result.data as { variations: string[] }).variations;
  } catch (error: any) {
    console.error("Variation Generation Error:", error);
    throw new Error(`Failed to generate variations: ${error.message}`);
  }
}; 