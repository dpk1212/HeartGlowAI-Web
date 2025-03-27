# HeartGlowAI Developer Documentation

## 🔧 Technical Stack

### Frontend
```
├── HTML5
├── CSS3
│   └── Custom CSS Variables for theming
├── JavaScript (ES6+)
└── Firebase SDK
    ├── Authentication
    ├── Firestore
    └── Cloud Functions
```

### Backend
```
├── Firebase Cloud Functions
│   ├── Node.js v20
│   └── Express-like HTTP functions
├── OpenAI API
│   └── GPT-4 Integration
└── Firebase Admin SDK
```

## 🏗 Project Structure

```
heartglowai/
├── src/
│   ├── services/
│   │   ├── openai.js         # OpenAI service integration
│   │   ├── firebase.js       # Firebase core configuration
│   │   ├── firebase-web.js   # Web-specific Firebase setup
│   │   ├── platform.js       # Platform-specific utilities
│   │   └── messageHistory.js # Message history management
│   ├── components/
│   │   └── [UI Components]
│   └── screens/
│       └── [Screen Components]
├── functions/
│   ├── index.js             # Cloud Functions implementation
│   ├── package.json         # Function dependencies
│   └── test.js             # Function tests
├── web-build/              # Production web build
│   └── index.html          # Main application file
└── firebase.json           # Firebase configuration
```

## 💾 Database Schema

### Firestore Collections

#### users
```typescript
interface User {
  uid: string;
  email: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  messageCount: number;
}
```

#### messages
```typescript
interface Message {
  userId: string;
  scenario: string;
  relationshipType: string;
  message: string;
  insights: string[];
  createdAt: Timestamp;
  tone?: string;
  toneIntensity?: string;
  relationshipDuration?: string;
  specialCircumstances?: string;
}
```

#### requests
```typescript
interface Request {
  userId: string;
  timestamp: Timestamp;
  endpoint: string;
  success: boolean;
}
```

## 🔐 Authentication Flow

1. **User Sign-in**:
```javascript
firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    return user.getIdToken();
  })
  .then((token) => {
    // Store token for API requests
  });
```

2. **Token Refresh**:
```javascript
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    user.getIdToken(true) // Force refresh
      .then((token) => {
        // Update stored token
      });
  }
});
```

## 📡 API Integration

### Message Generation Flow

1. **Request Preparation**:
```javascript
const payload = {
  scenario: string,
  relationshipType: string,
  tone: string,
  toneIntensity: string,
  relationshipDuration: string,
  specialCircumstances: string
};

const headers = {
  'Authorization': `Bearer ${await getCurrentUser().getIdToken()}`,
  'Content-Type': 'application/json'
};
```

2. **Cloud Function Processing**:
```javascript
exports.generateMessage = onRequest({
  cors: {
    origin: ['https://heartglowai.com'],
    methods: ['POST'],
    credentials: true
  },
  secrets: ["OPENAI_KEY"]
}, async (req, res) => {
  // Implementation in functions/index.js
});
```

## 🔍 Rate Limiting Implementation

```javascript
async function checkRateLimit(userId) {
  const userRef = admin.firestore().collection('users').doc(userId);
  const requestsRef = userRef.collection('requests');
  
  const oneMinuteAgo = new Date(Date.now() - 60000);
  const snapshot = await requestsRef
    .where('timestamp', '>', oneMinuteAgo)
    .count()
    .get();
    
  if (snapshot.data().count >= 10) {
    throw new Error('Rate limit exceeded');
  }
}
```

## 🎯 OpenAI Integration

### Prompt Engineering

```javascript
const systemPrompt = `You are HeartGlowAI, an empathetic AI assistant...`;

const messages = [
  { role: 'system', content: systemPrompt },
  { 
    role: 'user',
    content: `Create a message for a ${relationshipType} relationship...`
  }
];

const config = {
  model: "gpt-4-0125-preview",
  temperature: 0.8,
  max_tokens: 500
};
```

## 🧪 Testing

### Unit Tests
```bash
# Run function tests
cd functions
npm test

# Test specific components
npm test -- --grep "Message Generation"
```

### Integration Tests
```bash
# Start emulators
firebase emulators:start

# Run integration tests
npm run test:integration
```

## 📦 Deployment

### Production Deployment
```bash
# Deploy all services
firebase deploy

# Deploy specific service
firebase deploy --only functions
firebase deploy --only hosting
```

### Environment Configuration
```bash
# Set OpenAI API key
firebase functions:secrets:set OPENAI_KEY

# Set CORS configuration
firebase functions:config:set cors.allowed_origins="['https://heartglowai.com']"
```

## 🔧 Common Development Tasks

### 1. Adding a New Feature
1. Create feature branch
2. Implement changes
3. Update tests
4. Test locally with emulators
5. Create PR

### 2. Updating Cloud Function
1. Make changes in `functions/index.js`
2. Test locally:
   ```bash
   firebase emulators:start
   ```
3. Deploy:
   ```bash
   firebase deploy --only functions
   ```

### 3. Debugging
- Use Firebase Console for logs
- Enable debug mode in browser:
  ```javascript
  firebase.functions().useEmulator('localhost', 5001);
  ```

## 🚨 Error Handling

### Common Error Types
```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
}

const ErrorCodes = {
  RATE_LIMIT: 'rate-limit-exceeded',
  AUTH: 'authentication-failed',
  OPENAI: 'openai-error',
  VALIDATION: 'validation-error'
};
```

### Error Response Format
```javascript
res.status(errorCode).json({
  error: {
    code: ErrorCodes.RATE_LIMIT,
    message: 'Too many requests',
    details: { resetTime: new Date(Date.now() + 60000) }
  }
});
```

## 📈 Performance Optimization

### Frontend
- Lazy loading for non-critical components
- Caching of Firebase Auth tokens
- Debounced API calls

### Backend
- Rate limiting per user
- Efficient Firestore queries
- Response caching where appropriate

## 🔒 Security Best Practices

1. **Authentication**
   - Always verify Firebase ID tokens
   - Implement token refresh logic
   - Use secure session management

2. **Data Access**
   - Implement proper Firestore Security Rules
   - Validate all input data
   - Sanitize user input

3. **API Security**
   - Use CORS protection
   - Implement rate limiting
   - Secure API key storage

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)

---

For questions or support, contact the development team at [contact information]. 