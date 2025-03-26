import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, addDoc, Timestamp, FirestoreDataConverter } from 'firebase/firestore';
import { db } from '../firebase/config';
import { auth } from '../firebase/config';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // This should be set on the server side
  dangerouslyAllowBrowser: true // Only for development, use Firebase Functions in production
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
  // For testing purpose, return mock data to verify UI integration
  console.log('Generating messages with context:', context);
  
  try {
    // Try to use the OpenAI API directly if it's available
    if (process.env.NODE_ENV === 'production') {
      return generateMessagesViaFirebase(context);
    }

    // For development/testing, return mock data
    console.log('Using mock data for testing');
    
    // Generate a unique ID for the conversation
    const conversationId = `test-${Date.now()}`;
    
    return {
      conversation_id: conversationId,
      messages: [
        `Hey ${context.recipient_name}, I just wanted to take a moment to express how deeply grateful I am for your unwavering support during my recent career change. These past two years together have been incredible, but the way you stood by me during this challenging time has meant more than words can express. Your belief in me gave me the courage to take that leap of faith. Thank you for being my rock.`,
        `${context.recipient_name}, I've been reflecting on our journey together over these past two years, and I'm overwhelmed with gratitude for how you supported me through my career transition. During those uncertain moments when I doubted myself, your encouragement never wavered. You listened to my concerns, celebrated my small victories, and reminded me of my strengths when I forgot them. Your support has meant everything to me.`
      ],
      insights: [
        {
          communication_strategy: "Personal Appreciation",
          emotional_intelligence_score: 8.5,
          potential_impact: "Likely to strengthen the emotional bond and make the recipient feel valued for their specific supportive actions."
        },
        {
          communication_strategy: "Reflective Gratitude",
          emotional_intelligence_score: 9.2,
          potential_impact: "May help the recipient understand the significant impact of their support and deepen mutual trust."
        }
      ],
      previous_variations: [
        "I wanted to tell you how much your support has meant to me during my career change.",
        "Thank you for believing in me when I was making this difficult transition.",
        "I couldn't have made it through this career shift without your constant encouragement."
      ]
    };
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