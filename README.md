# HeartGlowAI - AI-Powered Message Generation Platform

HeartGlowAI is a web application that helps users craft thoughtful, personalized messages for their relationships using advanced AI technology. Whether you're reaching out to family, friends, or loved ones, HeartGlowAI helps you express yourself authentically and meaningfully.

## 🌟 Features

- **AI-Powered Message Generation**: Uses GPT-4 to create personalized messages
- **Relationship Context**: Tailors messages based on relationship type and duration
- **Customizable Tone**: Adjust the emotional intensity and tone of messages
- **Message Insights**: Provides analysis of why each message is effective
- **User Authentication**: Secure Firebase-based authentication
- **Rate Limiting**: Prevents abuse with smart request limiting
- **Mobile-Friendly**: Responsive design works on all devices

## 🏗 Technical Architecture

### Frontend
- **Web Application**: Built with HTML, CSS, and JavaScript
- **Authentication**: Firebase Authentication for user management
- **Real-time Updates**: Firebase Realtime Database for message history
- **Responsive Design**: Modern, mobile-first UI approach

### Backend
- **Cloud Functions**: Firebase Cloud Functions (Node.js)
- **AI Integration**: OpenAI GPT-4 API
- **Database**: Firebase Firestore
- **Security**: Firebase Security Rules

## 🔧 Core Components

### 1. Message Generation Service
Located in `functions/index.js`, this is the heart of HeartGlowAI. It:
- Validates user authentication
- Enforces rate limiting
- Processes message requests
- Communicates with OpenAI's API
- Returns formatted messages with insights

### 2. User Interface
The main interface allows users to specify:
- Communication scenario
- Relationship type (family, friend, etc.)
- Message tone (casual, formal, etc.)
- Tone intensity (1-5 scale)
- Relationship duration
- Special circumstances

### 3. Security Features
- Firebase Authentication
- Request rate limiting (10 requests per minute)
- Secure API key storage
- CORS protection
- Input validation

## 🚀 How It Works

1. **User Input**:
   - User enters their communication scenario
   - Selects relationship type and tone preferences
   - Can add special circumstances or context

2. **Processing**:
   - Frontend sends request to Cloud Function
   - Cloud Function authenticates user
   - Checks rate limiting
   - Formats prompt for OpenAI
   - Makes API call to GPT-4

3. **Response**:
   - AI generates personalized message
   - Provides 2-3 insights about the message
   - Returns to user interface
   - Saves to message history (if enabled)

## 🔐 Security Considerations

- OpenAI API keys stored in Firebase Secrets
- User authentication required for all requests
- Rate limiting prevents abuse
- CORS configured for specific domains:
  - heartglowai.com
  - localhost:3000 (development)
  - localhost:5000 (Firebase emulator)

## 💻 Development Setup

1. **Prerequisites**:
   - Node.js v20 or later
   - Firebase CLI
   - Firebase project with Blaze plan (for OpenAI API calls)

2. **Installation**:
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Install dependencies
   cd functions
   npm install
   
   # Install frontend dependencies
   cd ..
   npm install
   ```

3. **Environment Setup**:
   ```bash
   # Set up Firebase configuration
   firebase login
   firebase init
   
   # Configure OpenAI API key
   firebase functions:secrets:set OPENAI_KEY
   ```

## 🛠 Configuration

### Firebase Configuration
Required services:
- Authentication
- Cloud Functions
- Firestore
- Hosting

### OpenAI Configuration
- Model: gpt-4-0125-preview
- Temperature: 0.8
- Max tokens: 500

## 📝 API Documentation

### Generate Message Endpoint
`POST https://us-central1-heartglowai.cloudfunctions.net/generateMessage`

**Headers**:
- Authorization: Bearer [Firebase ID Token]
- Content-Type: application/json

**Request Body**:
```json
{
  "scenario": "string",
  "relationshipType": "string",
  "tone": "string",
  "toneIntensity": "string",
  "relationshipDuration": "string",
  "specialCircumstances": "string"
}
```

**Response**:
```json
{
  "message": "string",
  "insights": ["string"]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📈 Future Enhancements

- Message history and favorites
- Multiple language support
- Custom relationship categories
- Message templates
- Feedback-based improvements
- Advanced tone analysis
- Message scheduling

## 🆘 Troubleshooting

Common issues and solutions:
1. **CORS Errors**: Check domain configuration in Cloud Function
2. **Authentication Errors**: Verify Firebase setup
3. **Rate Limit Errors**: Wait one minute between requests
4. **API Errors**: Check OpenAI API key configuration

## 📞 Support

For issues or questions:
1. Check the troubleshooting guide
2. Review Firebase logs
3. Contact support team

## 📄 License

[Your License Information]

## 🔄 Version Control & Restoration

### Stable Versions
- `v1.0.0-stable`: Initial stable release with working message generation
  - Full documentation
  - Working message generation
  - Proper CORS configuration
  - Rate limiting implemented
  - Firebase integration complete

### Restoring Previous Versions

If you need to restore the stable version, you have several options:

1. **Using the Tag** (Recommended):
```bash
# View all tags
git tag -l

# Restore to stable version
git checkout v1.0.0-stable
```

2. **Using Commit Hash**:
```bash
# View commit history
git log --oneline

# Restore to specific commit
git checkout 6109b79
```

3. **Complete Reset**:
```bash
# Hard reset to stable version
git reset --hard v1.0.0-stable

# Force push if needed (use with caution)
git push -f origin main
```

### Branch Management
```bash
# Create new feature branch
git checkout -b feature/your-feature-name

# Switch back to main branch
git checkout main

# Update main branch
git pull origin main
```

### Emergency Restoration
If something goes wrong and you need to quickly restore the stable version:

1. Save any uncommitted changes:
```bash
git stash
```

2. Reset to stable version:
```bash
git checkout v1.0.0-stable
```

3. Create new branch from stable (optional):
```bash
git checkout -b recovery/$(date +%Y%m%d)
```

⚠️ **Important Notes**:
- Always create a backup branch before major changes
- Use `git stash` to save uncommitted changes
- Test after restoration to ensure everything works
- Check Firebase deployment status after restoration

---

Made with ❤️ by HeartGlowAI Team 