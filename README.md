# HeartGlow AI

> Say what matters. Gently.

HeartGlow AI is a platform that helps users craft emotionally intelligent messages for difficult conversations using AI. It provides personalized message templates, emotional sentiment analysis, and a user-friendly interface to manage connections and messages.

## Features

- 🔄 **Connection Management**: Easily add and manage your personal and professional connections
- 💬 **Message Crafting**: Create heartfelt, emotionally intelligent messages
- 📊 **Sentiment Analysis**: Understand the emotional tone of your messages
- 🎨 **Beautiful UI**: Intuitive, responsive interface with elegant animations

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ConnectlyAI.git
   cd ConnectlyAI
   ```

2. Install dependencies:
   ```bash
   cd heartglow-dashboard
   npm install
   ```

3. Create a Firebase project and enable:
   - Authentication with Email/Password and Google providers
   - Firestore Database
   
4. Set up environment variables:
   Create a `.env.local` file in the `heartglow-dashboard` directory:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Firestore Database Structure

The application uses the following Firestore collections:

- `users`: User accounts and profile information
  - `{userId}/connections`: User's personal connections
    - `{connectionId}/messages`: Messages associated with each connection

## Deployment to GitHub Pages

You can easily deploy the HeartGlow Dashboard to GitHub Pages using the provided script:

1. Make sure all changes are committed to your repository
2. Run the deployment script:
   ```bash
   chmod +x deploy-to-github.sh
   ./deploy-to-github.sh
   ```
3. The script will build and deploy the application to the `gh-pages` branch
4. Your site will be available at `https://yourusername.github.io/ConnectlyAI`

## Project Structure

```
heartglow-dashboard/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   ├── lib/          # Utility functions and hooks
│   ├── pages/        # Next.js pages
│   └── styles/       # CSS and styling
└── ...               # Configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/) 