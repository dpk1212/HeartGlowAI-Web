import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { generateMessage } from '../../services/messages';
import { useFirebase } from '../../contexts/FirebaseContext';
import './MessageSpark.css';

// Interface for form data (will be used later when user clicks buttons)
interface FormData {
  recipient: string;
  relationship: string;
  occasion: string;
  tone: string;
  emotionalState: string;
  desiredOutcome: string;
  additionalContext: string;
}

// Heart animation type
interface Heart {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const MessageSpark: React.FC = () => {
  // Track whether we're on the landing page or showing a form
  const [view, setView] = useState<'landing' | 'new-conversation' | 'reply'>('landing');
  
  // For floating hearts animation
  const [hearts, setHearts] = useState<Heart[]>([]);
  
  // Form state - will be used later
  const [formData, setFormData] = useState<FormData>({
    recipient: '',
    relationship: '',
    occasion: '',
    tone: '',
    emotionalState: 'Hopeful',
    desiredOutcome: 'Strengthen the relationship',
    additionalContext: ''
  });
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useFirebase();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Generate random heart positions
  useEffect(() => {
    generateHearts();
    const interval = setInterval(generateHearts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Function to generate random floating hearts
  const generateHearts = () => {
    const newHearts = Array.from({ length: 10 }, (_, i) => ({
      id: `heart-${Date.now()}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 8,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setHearts(newHearts);
  };
  
  // Button handlers
  const handleCreateNewConversation = () => {
    setView('new-conversation');
  };
  
  const handleReplyToMessage = () => {
    setView('reply');
  };
  
  const handleBackToHome = () => {
    navigate('/welcome');
  };
  
  // The landing page view
  const renderLandingPage = () => (
    <div className="message-spark-landing">
      {/* Logo and Title */}
      <motion.div 
        className="heart-logo"
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 1.15, 1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 1
        }}
      >
        <FaHeart size={64} />
      </motion.div>
      
      <h1 className="app-title">MessageSpark</h1>
      <p className="app-tagline">Express your feelings with beautifully crafted messages</p>
      
      {/* Main buttons */}
      <div className="action-buttons">
        <motion.button
          className="primary-button"
          onClick={handleCreateNewConversation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create New Conversation
        </motion.button>
        
        <motion.button
          className="secondary-button"
          onClick={handleReplyToMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reply To A Message
        </motion.button>
      </div>
      
      {/* Back button */}
      <motion.button
        className="text-button back-button"
        onClick={handleBackToHome}
        whileHover={{ scale: 1.05 }}
      >
        Back to Home
      </motion.button>
    </div>
  );
  
  return (
    <div className="message-spark-container">
      {/* Floating hearts background animation */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          style={{
            position: "absolute",
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            opacity: heart.opacity,
            zIndex: 1,
          }}
          initial={{ y: 0 }}
          animate={{ y: -100 }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
          }}
        >
          <FaHeart
            size={heart.size}
            color="#fff"
            style={{ filter: "blur(1px)" }}
          />
        </motion.div>
      ))}
      
      {/* Render the appropriate view based on state */}
      {view === 'landing' && renderLandingPage()}
      
      {/* Note: The form views for 'new-conversation' and 'reply' will be implemented later */}
    </div>
  );
};

export { MessageSpark }; 