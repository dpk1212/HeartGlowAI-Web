import { Timestamp } from 'firebase/firestore';

// Describes the overall template/blueprint for a HeartSteps plan
export interface HeartStepPlanTemplate {
  id: string; // Firestore document ID
  title: string;
  tagline?: string;
  goalDescription: string;
  durationDays: number;
  intendedRelationshipTypes?: string[]; // e.g., ['Romantic', 'Friend']
  // Guidelines for the AI to generate plan steps
  aiPromptGuideline: {
    initial: string; // For Day 1 / overall plan setup
    daily?: string;   // For subsequent days (can reference day number, context)
  };
  toneSuggestions?: string[]; // e.g., ['Warm', 'Sincere', 'Playful']
  category?: string; // e.g., 'Repair', 'Reconnect', 'Deepen'
  difficulty?: 'gentle' | 'moderate' | 'deep';
  isPremium?: boolean; // For potential monetization
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Represents a user's specific instance of following a plan
export interface HeartStepPlanInstance {
  id: string; // Firestore document ID
  userId: string;
  planTemplateId: string;
  threadId: string; // Link to the GlowCoachThread
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: Timestamp;
  currentDay: number; // Which day of the plan the user is currently on
  totalDays: number; // Copied from template for convenience
  // Tracking progress more robustly
  progress: {
    // Key is day number (as string, e.g., '1', '2')
    [day: string]: 'completed' | 'skipped' | 'pending'; 
  };
  lastActivityDate: Timestamp;
  selectedTone?: string; // User's tone choice for this instance
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Represents the settings/profile specific to HeartSteps for a user
// Could be a subcollection under users/ or fields on the main user doc
export interface UserHeartStepsProfile {
  userId: string;
  activePlanInstanceId?: string | null; // Link to the currently active plan
  // User preferences for HeartSteps module
  defaultPacing?: 'normal' | 'relaxed'; 
  notificationPreferences?: {
    reminders?: boolean;
    checkins?: boolean;
  };
  // Aggregate stats (optional)
  completedPlansCount?: number;
  currentStreak?: number;
}

// Represents the entire chat history for a single plan instance
export interface GlowCoachThread {
  id: string; // Firestore document ID (should match planInstanceId)
  planInstanceId: string;
  userId: string;
  createdAt: Timestamp;
  lastMessageTimestamp?: Timestamp;
  // Messages would typically be in a subcollection
}

// Type definition for the different roles in a message
export type MessageSender = 'system' | 'coach' | 'user';

// Type definition for the different kinds of messages in the thread
export type MessageType = 
  | 'system-start'          // Initial system message starting the plan
  | 'coach-welcome'         // Coach's welcome for the day
  | 'coach-prompt'          // The suggested message/action prompt from AI
  | 'coach-insight'         // The explanation/insight from the coach AI
  | 'coach-reflection-prompt' // Coach asks user to reflect
  | 'coach-feedback-request'// Coach asks for feedback on a prompt
  | 'coach-variation'       // An alternative prompt offered by AI
  | 'coach-error'           // Error message from coach/AI system
  | 'user-sent-prompt'      // User sent the AI prompt as-is
  | 'user-edited-message'   // User sent their own edited version
  | 'user-request-variation'// User asked for a different version
  | 'user-skip-day'         // User chose to skip the day
  | 'user-feedback'         // User provided structured feedback (links to MessageFeedback)
  | 'user-reflection'       // User provided reflection text (links to UserReflection)
  | 'user-raw-text'         // User typed a freeform message to the coach (less common)
  ;

// Represents a single message within a GlowCoachThread (likely in a subcollection)
export interface ThreadMessage {
  id: string; // Firestore document ID
  threadId: string;
  planInstanceId: string;
  sender: MessageSender; // Who sent the message
  type: MessageType;     // What kind of message it is
  timestamp: Timestamp;
  dayOfPlan: number;
  content: string; // The text content of the message
  // Optional fields based on context
  userId?: string; // Should match planInstance.userId if sender is 'user'
  relatedMessageId?: string; // Link to another message (e.g., the prompt this feedback/edit relates to)
  feedbackId?: string;       // Link to associated MessageFeedback doc (if type is 'user-feedback')
  reflectionId?: string;     // Link to associated UserReflection doc (if type is 'user-reflection')
}

// Represents user feedback on a specific coach prompt message
export interface MessageFeedback {
  id: string; // Firestore document ID
  promptMessageId: string; // Link to the 'coach-prompt' ThreadMessage
  planInstanceId: string;
  userId: string;
  timestamp: Timestamp;
  sentiment: 'positive' | 'neutral' | 'negative' | 'not-sent'; // Corresponds to 😊, 😐, 😔, 📤
}

// Represents a user's reflection entry, potentially linked to a day or message
export interface UserReflection {
  id: string; // Firestore document ID
  planInstanceId: string;
  userId: string;
  dayOfPlan: number;
  promptMessageId?: string; // Optional link to the message that prompted reflection
  timestamp: Timestamp;
  reflectionText: string;
}

// Represents a message favorited by the user
export interface FavoriteMessage {
  id: string; // Firestore document ID
  userId: string;
  originalMessageId: string; // Link to the ThreadMessage being favorited
  threadId: string;
  planInstanceId: string;
  timestamp: Timestamp;
  // Could add user notes about why it was favorited
  userNote?: string;
} 