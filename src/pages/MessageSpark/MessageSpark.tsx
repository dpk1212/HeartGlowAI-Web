import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaArrowLeft, FaCopy, FaHistory, FaSave, FaTimes } from 'react-icons/fa';
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

// Conversation interface for storing reply history
interface Conversation {
  id: string;
  name: string;
  originalMessage: string;
  reply?: string;
  timestamp: Date;
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
  
  // Reply to message state
  const [conversationName, setConversationName] = useState('');
  const [originalMessage, setOriginalMessage] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  
  // Conversation history
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
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
  
  // Load saved conversations from localStorage on component mount
  useEffect(() => {
    if (user) {
      const savedConversations = localStorage.getItem(`conversations_${user.uid}`);
      if (savedConversations) {
        try {
          const parsedConversations = JSON.parse(savedConversations);
          // Convert timestamp strings back to Date objects
          const conversations = parsedConversations.map((conv: any) => ({
            ...conv,
            timestamp: new Date(conv.timestamp)
          }));
          setConversations(conversations);
        } catch (err) {
          console.error('Failed to parse saved conversations:', err);
        }
      }
    }
  }, [user]);
  
  // Save conversations to localStorage when they change
  useEffect(() => {
    if (user && conversations.length > 0) {
      localStorage.setItem(`conversations_${user.uid}`, JSON.stringify(conversations));
    }
  }, [conversations, user]);
  
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
    setSelectedConversation(null);
    setOriginalMessage('');
    setConversationName('');
    setGeneratedReply('');
  };
  
  const handleBackToHome = () => {
    navigate('/welcome');
  };
  
  const handleBackToLanding = () => {
    setView('landing');
    setError('');
  };
  
  // Handle generating a reply to a message
  const handleGenerateReply = async () => {
    if (!conversationName.trim() || !originalMessage.trim()) {
      setError('Please provide both a conversation name and the message you want to reply to.');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      // For now, we'll use the generateMessage service with a simple prompt
      // Later, this will be replaced with the specific system prompt from the user
      const prompt = `Reply to the following message in a thoughtful, personalized way:
      
      "${originalMessage}"
      
      Make the reply warm, authentic, and responsive to the content of the original message.`;
      
      const reply = await generateMessage({
        recipient: "Reply",
        relationship: "MessageReply",
        occasion: "ReplyToMessage",
        tone: "Authentic",
        emotionalState: "Thoughtful",
        desiredOutcome: "MeaningfulConversation",
        additionalContext: prompt
      });
      
      setGeneratedReply(reply);
      
      // Save the conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        name: conversationName,
        originalMessage,
        reply,
        timestamp: new Date()
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    } catch (err) {
      console.error('Error generating reply:', err);
      setError('Failed to generate reply. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle selecting a conversation from history
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setConversationName(conversation.name);
    setOriginalMessage(conversation.originalMessage);
    setGeneratedReply(conversation.reply || '');
    setShowHistory(false);
  };
  
  // Handle copying reply to clipboard
  const handleCopyReply = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
  
  // Reply to message view
  const renderReplyView = () => (
    <div className="message-spark-form-container">
      <div className="message-spark-header">
        <button className="icon-button" onClick={handleBackToLanding}>
          <FaArrowLeft /> Back
        </button>
        <h1>Reply to a Message</h1>
        {conversations.length > 0 && (
          <button 
            className="icon-button"
            onClick={() => setShowHistory(!showHistory)}
          >
            <FaHistory /> {showHistory ? 'Hide History' : 'Show History'}
          </button>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {showHistory ? (
        // Conversation History View
        <div className="conversation-history">
          <h2>Your Past Conversations</h2>
          {conversations.length === 0 ? (
            <p className="no-conversations">No saved conversations yet.</p>
          ) : (
            <ul className="conversation-list">
              {conversations.map(conversation => (
                <li 
                  key={conversation.id} 
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''}`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="conversation-name">{conversation.name}</div>
                  <div className="conversation-date">
                    {conversation.timestamp.toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button className="secondary-button" onClick={() => setShowHistory(false)}>
            Close History
          </button>
        </div>
      ) : (
        // Reply Form View
        <div className="reply-form">
          <div className="form-group">
            <label htmlFor="conversationName">Conversation Name</label>
            <input 
              type="text"
              id="conversationName"
              value={conversationName}
              onChange={(e) => setConversationName(e.target.value)}
              placeholder="E.g., Reply to Mom, Work Discussion, Friend Chat"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="originalMessage">Message to Reply To</label>
            <textarea
              id="originalMessage"
              value={originalMessage}
              onChange={(e) => setOriginalMessage(e.target.value)}
              rows={8}
              placeholder="Paste the message you want to reply to here..."
              required
            />
          </div>
          
          {!generatedReply ? (
            <div className="form-actions">
              <button
                className="primary-button generate-button"
                onClick={handleGenerateReply}
                disabled={isGenerating || !conversationName.trim() || !originalMessage.trim()}
              >
                {isGenerating ? 'Generating...' : 'Generate Reply'}
              </button>
            </div>
          ) : (
            <div className="reply-result">
              <h3>Generated Reply</h3>
              <div className="reply-content">
                <pre>{generatedReply}</pre>
              </div>
              
              <div className="reply-actions">
                <button 
                  className="primary-button"
                  onClick={handleCopyReply}
                >
                  {copied ? 'Copied!' : 'Copy Reply'}
                </button>
                
                <button
                  className="secondary-button"
                  onClick={() => {
                    setGeneratedReply('');
                    setOriginalMessage('');
                    setConversationName('');
                  }}
                >
                  New Reply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
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
      {view === 'reply' && renderReplyView()}
      
      {/* Note: The new-conversation view will be implemented later */}
    </div>
  );
};

export { MessageSpark }; 