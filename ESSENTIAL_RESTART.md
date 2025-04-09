# Essential Restart

## 1. Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBZiJPTs7dMccVgFV-YoTejnhy1bZNFEQY",
  authDomain: "heartglowai.firebaseapp.com",
  projectId: "heartglowai",
  storageBucket: "heartglowai.firebasestorage.app",
  messagingSenderId: "196565711798",
  appId: "1:196565711798:web:79e2b0320fd8e74ab0df17",
  measurementId: "G-KJMPL1DNPY"
};
```

## 2. Database Schema

### Users Collection
```javascript
// Collection: users/{userId}
{
  email: string,                    // Required
  createdAt: timestamp,            // Required
  messageCount: number,            // Required (default: 0)
  hasFeedbackSubmitted: boolean,   // Required (default: false)
  lastFeedbackSubmittedAt: timestamp|null,
  feedbackData: object|null
}
```

### Connections Collection
```javascript
// Collection: users/{userId}/connections/{connectionId}
{
  name: string,                    // Required
  relationship: string,            // Required
  otherRelationship?: string,     // Optional, if relationship === 'other'
  specificRelationship?: string,   // Optional
  yearsKnown?: number,            // Optional
  communicationStyle?: string,     // Optional
  relationshipGoal?: string,      // Optional
  notes?: string,                 // Optional
  createdAt: timestamp,           // Required
  updatedAt: timestamp,           // Required
  messageCount?: number,          // Optional
  lastMessageDate?: timestamp,    // Optional
  lastMessageType?: string,       // Optional
  lastMessageFormat?: string,     // Optional
  lastMessageCategory?: string    // Optional
}
```

### Messages Collection
```javascript
// Collection: users/{userId}/messages/{messageId}
{
  content: string,                // Required - Generated message
  recipientName: string,          // Required
  recipientId: string|null,       // Optional - Connection reference
  relationship: string|null,      // Optional
  intent: string|null,            // Optional
  tone: string|null,              // Optional
  intensity: number,              // Optional (default: 3)
  createdAt: timestamp,          // Required
  insights: array,               // Optional
  messageCategory?: string,      // Optional
  messageFormat?: string,        // Optional
  messageIntention?: string,     // Optional
  messageConfigTimestamp?: string // Optional
}
```

## 3. API Endpoints

### Message Generation
- Endpoint: `https://us-central1-heartglowai.cloudfunctions.net/generateMessageV2`
- Method: POST
- Headers:
  ```javascript
  {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`
  }
  ```

### OpenAI Configuration
- Model: "gpt-4-turbo-preview"
- Default Parameters:
  ```javascript
  {
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 0.9
  }
  ```

## 4. State Management

### Local Storage Keys
```javascript
const STATE_KEYS = {
  recipientData: 'recipientData',
  intentData: 'intentData',
  toneData: 'toneData',
  messageCategory: 'messageCategory',
  messageFormat: 'messageFormat',
  messageIntention: 'messageIntention',
  messageConfigTimestamp: 'messageConfigTimestamp'
};
```

### Message Data Structure
```javascript
const messageData = {
  recipient: null,
  intent: null,
  tone: null,
  result: null
};
```

## 5. Authentication

### User Authentication
```javascript
// Force token refresh
async function getIdToken() {
  return await firebase.auth().currentUser.getIdToken(true);
}

// Auth state observer
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    currentUser = user;
    updateUserInterface(user);
    loadUserData();
  } else {
    window.location.href = 'login.html';
  }
});
```

## 6. Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 7. Dependencies

### Required NPM Packages
```json
{
  "firebase": "^9.x.x",
  "openai": "^4.x.x"
}
```

## 8. Environment Variables

Required environment variables:
- `OPENAI_API_KEY`: OpenAI API key (stored in Firestore)
- `FIREBASE_API_KEY`: Firebase API key
- `FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `FIREBASE_PROJECT_ID`: Firebase project ID

## 9. Critical Functions

### Connection Management
```javascript
async function saveConnection(connectionData) {
  const connectionsRef = firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('connections');
    
  return connectionData.id
    ? connectionsRef.doc(connectionData.id).update(connectionData)
    : connectionsRef.add({
        ...connectionData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
}
```

### Message Management
```javascript
async function saveMessageToHistory(messageData) {
  return firebase.firestore()
    .collection('users')
    .doc(currentUser.uid)
    .collection('messages')
    .add({
      ...messageData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
}
``` 