# HeartGlowAI App

A web application that helps users create heartfelt messages for their relationships using AI.

## Features

- User authentication (signup, login, password reset)
- AI-powered message generation
- Message history and management
- Responsive design
- Real-time updates

## Getting Started with Firebase

Follow these steps to set up Firebase for the HeartGlowAI app:

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup steps
3. Name your project (e.g., "HeartGlowAI")
4. Enable Google Analytics if desired
5. Click "Create project"

### 2. Register Your Web App

1. In the Firebase console, click the "</>" icon to add a web app
2. Name your app (e.g., "HeartGlowAI Web")
3. Register the app
4. Copy the Firebase configuration from the setup screen

### 3. Add Firebase Configuration to .env File

1. Create a `.env` file in the root directory of your project
2. Add your Firebase configuration details:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4. Enable Authentication Methods

1. In the Firebase console, go to "Authentication" > "Sign-in method"
2. Enable "Email/Password" authentication
3. Optionally enable other authentication methods as needed (Google, Facebook, etc.)

### 5. Set Up Firestore Database

1. Go to "Firestore Database" in the Firebase console
2. Click "Create database"
3. Start in test mode (or set up security rules as needed)
4. Choose a database location close to your users
5. Click "Enable"

### 6. Deploy Firebase Security Rules

1. Create firestore.rules file in your project:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

2. Deploy the rules using Firebase CLI:

```
firebase deploy --only firestore:rules
```

## Running the Application

After setting up Firebase, you can run the application:

```
npm install
npm run dev
```

## Building for Production

```
npm run build
```

## Learn More

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://react.dev/)

## Testing

1. Create a test account using the signup form
2. Try generating messages with different relationship types and contexts
3. Test the message saving and retrieval functionality
4. Verify the responsive design on different devices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firebase for authentication and database services
- React and Vite for the frontend framework
- Tailwind CSS for styling
