import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, addDoc, Timestamp, FirestoreDataConverter } from 'firebase/firestore';
import { db } from '../firebase/config';
import { auth } from '../firebase/config';
import OpenAI from 'openai';

// For server-side usage only - API keys should be managed in secure environment variables
// and NEVER directly included in the code
// This setup relies on Firebase Functions for secure API access
export let openai: OpenAI | null = null;

// Initialize OpenAI only on server environments if needed
// Client-side code should use Firebase Functions instead
if (typeof window === 'undefined') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: false
  });
}

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
    // Always use Firebase Functions for security
    return generateMessagesViaFirebase(context);
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
 * Generate messages via Firebase Functions
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

// All sensitive API keys should be stored in environment variables
// and accessed securely through Firebase Functions 