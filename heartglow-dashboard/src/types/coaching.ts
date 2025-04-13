import { Timestamp } from 'firebase/firestore';

// Represents metadata for a coaching chat thread focused on a specific connection
export interface CoachingThread {
  id: string; // Firestore document ID
  userId: string;
  connectionId: string; // ID of the connection being discussed
  threadTitle: string; // e.g., "Chat about Kate" or user-defined topic
  lastActivity: Timestamp; // Timestamp of the last message
  createdAt: Timestamp;
  initialPurpose?: string; // Optional: Purpose selected at creation
  // Optional: Store connection details snapshot here for quick display?
  connectionSnapshot?: { 
    name: string;
    relationship: string;
  };
  // Messages will be in a subcollection
}

// Defines who sent a message in the coaching thread
export type MessageSender = 'user' | 'coach' | 'system';

// Represents a single message within a CoachingThread's subcollection
export interface ThreadMessage {
  id: string; // Firestore document ID
  threadId: string; // Parent thread ID
  sender: MessageSender;
  content: string; // The text content
  timestamp: Timestamp;
  // Optional: Could add fields for processing status, errors, related IDs later if needed
  // e.g., error?: string;
} 