import { Timestamp } from 'firebase/firestore';

// Represents a chat thread / connection with another person
export interface Connection {
  id: string; // Firestore document ID
  name: string; // Name of the person (e.g., "Kate", "Dad")
  relationship: string; // User-defined relationship (e.g., "Partner", "Family")
  // Optional detailed context fields
  specificRelationship?: string; // E.g., "Best friend", "Younger Sister", "Direct Report"
  goal?: string; // User's stated goal for this relationship/connection
  notes?: string; // User's freeform notes about the person/connection
  createdAt: Timestamp; // When the connection was created
  lastMessageTimestamp?: Timestamp; // Timestamp of the last message (for sorting/display)
  // Add other relevant fields if needed (e.g., avatarUrl, notes)
}

// Represents a single message within a chat connection
export interface Message {
  id: string; // Firestore document ID
  text: string; // Content of the message
  role: 'user' | 'assistant'; // Who sent the message
  createdAt: Timestamp; // When the message was sent
  // Keep other potential fields from cloud function
  userId?: string;
  guideContext?: string;
  isGuideResponse?: boolean;
  modelUsed?: string;
  finishReason?: string;
  // Add other relevant fields if needed (e.g., analysis results, reactions)
} 