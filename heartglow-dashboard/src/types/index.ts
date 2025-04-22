import { Timestamp } from 'firebase/firestore';

// Represents a chat thread / connection with another person
export interface Connection {
  id: string; // Firestore document ID
  name: string; // Name of the person (e.g., "Kate", "Dad")
  relationship: string; // User-defined relationship (e.g., "Partner", "Family")
  createdAt: Timestamp; // When the connection was created
  lastMessageTimestamp?: Timestamp; // Timestamp of the last message (for sorting/display)
  // Add other relevant fields if needed (e.g., avatarUrl, notes)
}

// Represents a single message within a chat connection
export interface Message {
  id: string; // Firestore document ID
  text: string; // Content of the message
  sender: 'user' | 'ai'; // Who sent the message
  timestamp: Timestamp; // When the message was sent
  // Add other relevant fields if needed (e.g., analysis results, reactions)
} 