import { firestore } from './firebase';
import { auth } from './firebase';

// Collection reference
const messagesCollection = firestore.collection('messages');

/**
 * Save a generated message to Firestore
 * @param {string} scenario - The input scenario
 * @param {string} relationshipType - The relationship type
 * @param {string} message - The generated message content
 * @returns {Promise<string>} - ID of the saved message
 */
export const saveMessage = async (scenario, relationshipType, message) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const messageData = {
      userId: user.uid,
      userEmail: user.email,
      scenario,
      relationshipType,
      message,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    
    const docRef = await messagesCollection.add(messageData);
    console.log('Message saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

/**
 * Get message history for the current user
 * @param {number} limit - Maximum number of messages to retrieve
 * @returns {Promise<Array>} - Array of message objects
 */
export const getMessageHistory = async (limit = 10) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const snapshot = await messagesCollection
      .where('userId', '==', user.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const messages = [];
    snapshot.forEach(doc => {
      messages.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      });
    });
    
    return messages;
  } catch (error) {
    console.error('Error getting message history:', error);
    throw error;
  }
};

/**
 * Delete a message from history
 * @param {string} messageId - ID of the message to delete
 * @returns {Promise<void>}
 */
export const deleteMessage = async (messageId) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get the message first to verify it belongs to the current user
    const messageDoc = await messagesCollection.doc(messageId).get();
    
    if (!messageDoc.exists) {
      throw new Error('Message not found');
    }
    
    const messageData = messageDoc.data();
    
    if (messageData.userId !== user.uid) {
      throw new Error('Not authorized to delete this message');
    }
    
    await messagesCollection.doc(messageId).delete();
    console.log('Message deleted:', messageId);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}; 