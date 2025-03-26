# HeartGlowAI

A React Native mobile application that helps users create heartfelt messages for their relationships using AI.

## Features

- Firebase Authentication
- OpenAI API integration for message generation
- Intuitive UI for:
  - Text input for current communication scenario
  - Relationship type selection
  - Generated message display
  - Copy to clipboard functionality

## Screenshots

![HeartGlowAI Screenshots](./assets/screenshots.png)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- OpenAI API key
- Firebase project

### Installation

1. Clone the repository:
```
git clone https://github.com/dpk1212/HeartGlowAI.git
cd HeartGlowAI
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```
OPENAI_API_KEY=your_openai_api_key
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

4. Generate assets (if needed):
   - Open `assets/convert-assets.html` in a web browser
   - Download the generated PNG files
   - Ensure all required assets are in the `assets` directory

5. Start the development server:
```
npm start
```

6. Use the Expo Go app on your mobile device to scan the QR code, or press 'i' to open in iOS simulator or 'a' to open in Android emulator.

## Deployment

### Deploy to GitHub Pages

1. Set up GitHub repository secrets:
   - Go to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - OPENAI_API_KEY
     - FIREBASE_API_KEY
     - FIREBASE_AUTH_DOMAIN
     - FIREBASE_PROJECT_ID
     - FIREBASE_STORAGE_BUCKET
     - FIREBASE_MESSAGING_SENDER_ID
     - FIREBASE_APP_ID
     - FIREBASE_MEASUREMENT_ID

2. To manually deploy:
```
npm run deploy
```

3. The app will be automatically deployed via GitHub Actions when pushing to the main branch.

### Deploy to Expo

1. Login to Expo:
```
expo login
```

2. Build for web:
```
expo build:web
```

3. Deploy to Expo:
```
expo publish
```

## Usage

1. Register or log in to your account
2. Enter a communication scenario (e.g., "I need to apologize to my partner for forgetting our anniversary")
3. Select the relationship type from the dropdown
4. Tap "Generate Message" to create an AI-generated message
5. Copy the message to your clipboard to use it in your preferred messaging app

## App Design

HeartGlowAI features a modern, sleek dark UI with a distinctive heart-shaped logo that has circuit board patterns inside it. The color scheme uses gradients from pink to cyan blue, creating a futuristic yet emotional visual identity that perfectly represents the app's purpose of combining AI technology with heartfelt communication.

## Technical Details

- Built with React Native and Expo
- Firebase Authentication for user management
- OpenAI GPT-3.5 Turbo for message generation
- Secure API key storage using Expo SecureStore

## License

This project is licensed under the MIT License - see the LICENSE file for details. 