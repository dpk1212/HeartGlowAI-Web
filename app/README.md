# HeartGlowAI

A web application that helps users create heartfelt messages for their relationships using AI.

## Features

- User authentication (signup, login, password reset)
- AI-powered message generation
- Message history and management
- Responsive design
- Real-time updates

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v7 or higher)
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/heartglowai.git
cd heartglowai
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
