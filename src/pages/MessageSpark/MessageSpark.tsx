import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaArrowLeft, FaCopy, FaHistory, FaSave, FaTimes, FaPlus, FaChevronDown, FaChevronUp, FaReply } from 'react-icons/fa';
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

// Exchange interface for a single message-reply pair
interface Exchange {
  id: string;
  originalMessage: string;
  reply?: string;
  timestamp: Date;
}

// Enhanced conversation interface for storing multiple exchanges
interface Conversation {
  id: string;
  name: string;
  exchanges: Exchange[];
  lastUpdated: Date;
  created: Date;
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
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null);
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCreatingNewExchange, setIsCreatingNewExchange] = useState(false);
  
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
          // Convert timestamp strings back to Date objects for all dates
          const conversations = parsedConversations.map((conv: any) => ({
            ...conv,
            created: new Date(conv.created),
            lastUpdated: new Date(conv.lastUpdated),
            exchanges: conv.exchanges.map((ex: any) => ({
              ...ex,
              timestamp: new Date(ex.timestamp)
            }))
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
    setSelectedExchange(null);
    setOriginalMessage('');
    setConversationName('');
    setGeneratedReply('');
    setIsCreatingNewExchange(true);
  };
  
  const handleBackToHome = () => {
    navigate('/welcome');
  };
  
  const handleBackToLanding = () => {
    setView('landing');
    setError('');
  };
  
  // Toggle conversation expansion in history view
  const toggleConversationExpansion = (conversationId: string) => {
    if (expandedConversation === conversationId) {
      setExpandedConversation(null);
    } else {
      setExpandedConversation(conversationId);
    }
  };
  
  // Handle generating a reply to a message
  const handleGenerateReply = async () => {
    if (isCreatingNewExchange && !conversationName.trim()) {
      setError('Please provide a conversation name.');
      return;
    }
    
    if (!originalMessage.trim()) {
      setError('Please provide the message you want to reply to.');
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
      
      // Create a new exchange
      const newExchange: Exchange = {
        id: Date.now().toString(),
        originalMessage,
        reply,
        timestamp: new Date()
      };
      
      // Handle different scenarios: new conversation vs. adding to existing one
      if (isCreatingNewExchange) {
        // Creating a brand new conversation
        const newConversation: Conversation = {
          id: Date.now().toString(),
          name: conversationName,
          exchanges: [newExchange],
          created: new Date(),
          lastUpdated: new Date()
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation);
        setSelectedExchange(newExchange);
      } else if (selectedConversation) {
        // Adding a new exchange to an existing conversation
        const updatedConversation: Conversation = {
          ...selectedConversation,
          exchanges: [...selectedConversation.exchanges, newExchange],
          lastUpdated: new Date()
        };
        
        setConversations(prev => 
          prev.map(c => c.id === updatedConversation.id ? updatedConversation : c)
        );
        setSelectedConversation(updatedConversation);
        setSelectedExchange(newExchange);
      }
      
      setIsCreatingNewExchange(false);
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
    
    // Select the most recent exchange by default
    const latestExchange = conversation.exchanges[conversation.exchanges.length - 1];
    setSelectedExchange(latestExchange);
    
    // Load the exchange data into the form
    setConversationName(conversation.name);
    setOriginalMessage(latestExchange.originalMessage);
    setGeneratedReply(latestExchange.reply || '');
    
    setIsCreatingNewExchange(false);
    setShowHistory(false);
  };
  
  // Handle selecting a specific exchange within a conversation
  const handleSelectExchange = (exchange: Exchange) => {
    setSelectedExchange(exchange);
    setOriginalMessage(exchange.originalMessage);
    setGeneratedReply(exchange.reply || '');
    setIsCreatingNewExchange(false);
  };
  
  // Start a new exchange in the current conversation
  const handleStartNewExchange = () => {
    if (!selectedConversation) return;
    
    setOriginalMessage('');
    setGeneratedReply('');
    setIsCreatingNewExchange(true);
    setSelectedExchange(null);
  };
  
  // Handle copying reply to clipboard
  const handleCopyReply = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Format timestamp for display
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
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
        <h1>
          {isCreatingNewExchange && !selectedConversation 
            ? 'New Conversation' 
            : selectedConversation?.name || 'Reply to a Message'}
        </h1>
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
        // Conversation History View with expandable exchanges
        <div className="conversation-history">
          <h2>Your Conversations</h2>
          {conversations.length === 0 ? (
            <p className="no-conversations">No saved conversations yet.</p>
          ) : (
            <ul className="conversation-list">
              {conversations.map(conversation => (
                <li key={conversation.id} className="conversation-group">
                  <div 
                    className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''}`}
                    onClick={() => toggleConversationExpansion(conversation.id)}
                  >
                    <div className="conversation-header">
                      <div className="conversation-name">{conversation.name}</div>
                      <div className="conversation-count">
                        {conversation.exchanges.length} {conversation.exchanges.length === 1 ? 'exchange' : 'exchanges'}
                      </div>
                    </div>
                    <div className="conversation-date">
                      Last updated: {formatDate(conversation.lastUpdated)}
                    </div>
                    <button className="expand-button">
                      {expandedConversation === conversation.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>
                  
                  {/* Expanded view showing all exchanges in this conversation */}
                  {expandedConversation === conversation.id && (
                    <ul className="exchanges-list">
                      {conversation.exchanges.map((exchange, index) => (
                        <li 
                          key={exchange.id}
                          className={`exchange-item ${selectedExchange?.id === exchange.id ? 'selected' : ''}`}
                          onClick={() => {
                            handleSelectConversation(conversation);
                            handleSelectExchange(exchange);
                          }}
                        >
                          <div className="exchange-number">Exchange {index + 1}</div>
                          <div className="exchange-preview">
                            {exchange.originalMessage.substring(0, 50)}
                            {exchange.originalMessage.length > 50 ? '...' : ''}
                          </div>
                          <div className="exchange-date">{formatDate(exchange.timestamp)}</div>
                        </li>
                      ))}
                      <li 
                        className="new-exchange-button"
                        onClick={() => {
                          handleSelectConversation(conversation);
                          handleStartNewExchange();
                        }}
                      >
                        <FaPlus /> New Exchange
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
          <button className="secondary-button" onClick={() => setShowHistory(false)}>
            Close History
          </button>
        </div>
      ) : (
        // Reply Form View with conversation context
        <div className="reply-form">
          {/* Only show conversation name input for brand new conversations */}
          {isCreatingNewExchange && !selectedConversation && (
            <div className="form-group">
              <label htmlFor="conversationName">Conversation Name</label>
              <input 
                type="text"
                id="conversationName"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                placeholder="E.g., Partner, Mom, Work Friend"
                required
              />
            </div>
          )}
          
          {/* Context information when in an existing conversation */}
          {selectedConversation && (
            <div className="conversation-context">
              <h3>{selectedConversation.name}</h3>
              <div className="context-details">
                <span>Started {formatDate(selectedConversation.created)}</span>
                <span>•</span>
                <span>{selectedConversation.exchanges.length} {selectedConversation.exchanges.length === 1 ? 'exchange' : 'exchanges'}</span>
              </div>
              
              {/* Show exchange navigation if not creating a new exchange */}
              {!isCreatingNewExchange && selectedConversation.exchanges.length > 1 && (
                <div className="exchange-navigation">
                  <label>View Exchange:</label>
                  <select 
                    value={selectedExchange?.id || ''} 
                    onChange={(e) => {
                      const exchange = selectedConversation.exchanges.find(ex => ex.id === e.target.value);
                      if (exchange) handleSelectExchange(exchange);
                    }}
                  >
                    {selectedConversation.exchanges.map((exchange, index) => (
                      <option key={exchange.id} value={exchange.id}>
                        Exchange {index + 1} - {formatDate(exchange.timestamp)}
                      </option>
                    ))}
                  </select>
                  <button 
                    className="icon-button new-exchange-button"
                    onClick={handleStartNewExchange}
                    title="Start a new exchange in this conversation"
                  >
                    <FaPlus /> New
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="originalMessage">
              {isCreatingNewExchange ? 'Message to Reply To' : 'Original Message'}
            </label>
            <textarea
              id="originalMessage"
              value={originalMessage}
              onChange={(e) => setOriginalMessage(e.target.value)}
              rows={8}
              placeholder="Paste the message you want to reply to here..."
              required
              readOnly={!isCreatingNewExchange}
              className={!isCreatingNewExchange ? 'read-only' : ''}
            />
          </div>
          
          {!isCreatingNewExchange && generatedReply ? (
            // View mode for existing exchange
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
                
                {selectedConversation && (
                  <button
                    className="secondary-button"
                    onClick={handleStartNewExchange}
                  >
                    <FaReply /> New Exchange
                  </button>
                )}
              </div>
            </div>
          ) : isCreatingNewExchange ? (
            // Create mode for new exchange
            generatedReply ? (
              // Show generated reply for new exchange
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
                      if (!selectedConversation) {
                        setConversationName('');
                      }
                    }}
                  >
                    New Reply
                  </button>
                </div>
              </div>
            ) : (
              // Generate button for new exchange
              <div className="form-actions">
                <button
                  className="primary-button generate-button"
                  onClick={handleGenerateReply}
                  disabled={
                    isGenerating || 
                    !originalMessage.trim() || 
                    (isCreatingNewExchange && !selectedConversation && !conversationName.trim())
                  }
                >
                  {isGenerating ? 'Generating...' : 'Generate Reply'}
                </button>
              </div>
            )
          ) : null}
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