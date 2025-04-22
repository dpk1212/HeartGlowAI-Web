export interface Connection {
  id: string; // Firestore document ID
  userId: string; // ID of the user this connection belongs to
  contactName: string; // Name of the person this connection is with
  relationshipLabel: string; // User-defined label (e.g., "Mom", "Partner", "Friend")
  lastMessagePreview?: string; // Optional preview of the last message
  timestamp: FirebaseFirestore.Timestamp; // Timestamp of the last interaction/update
  // Add other relevant fields as needed, e.g., notes, profile picture URL
}

export interface ChatMessage {
  id: string; // Firestore document ID
  sender: 'user' | 'ai'; // Who sent the message
  text: string; // Content of the message
  timestamp: FirebaseFirestore.Timestamp; // When the message was sent
  interactionType?: 'coaching' | 'generation' | 'clarification'; // AI's understanding of the message intent
  // Add other fields if necessary, e.g., related insights, message drafts
}

// We need to import Timestamp type if not globally available
// Consider adding this at the top if needed:
// import * as admin from 'firebase-admin'; // For backend usage
// import { Timestamp } from 'firebase/firestore'; // For frontend usage
// Depending on where these types are used, the specific import might differ.
// For now, assuming FirebaseFirestore.Timestamp is resolved contextually. 

// Consider adding imports for Timestamp if needed:
// import { Timestamp } from 'firebase/firestore'; // Frontend
// import * as admin from 'firebase-admin'; // Backend (FirebaseFirestore.Timestamp) 