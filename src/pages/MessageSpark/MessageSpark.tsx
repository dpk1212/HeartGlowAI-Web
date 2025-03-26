import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaArrowLeft, FaCopy, FaHistory, FaSave, FaTimes, FaPlus, FaChevronDown, FaChevronUp, FaReply, FaTrash } from 'react-icons/fa';
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

// Card-based conversation creation interfaces
interface RelationshipTypeCard {
  type: 'romantic_partner' | 'family_member' | 'friend' | 'professional_contact' | 'other';
  customType?: string;
}

interface ScenarioCard {
  scenario: string;
  scenarioType: 'conflict_resolution' | 'emotional_expression' | 'seeking_support' | 'giving_feedback' | 'other';
}

interface EmotionalContextCard {
  primaryEmotion: string;
  emotionalIntensity: number; // 1-10
}

// Combined conversation context from all cards
interface ConversationContext {
  relationship: RelationshipTypeCard;
  scenario: ScenarioCard;
  emotionalContext: EmotionalContextCard;
  currentStep: number;
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
  
  // New card-based conversation creation state
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    relationship: {
      type: 'romantic_partner',
    },
    scenario: {
      scenario: '',
      scenarioType: 'emotional_expression'
    },
    emotionalContext: {
      primaryEmotion: 'Hopeful',
      emotionalIntensity: 5
    },
    currentStep: 1
  });
  
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
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
    // Set view to new-conversation for our card-based interface
    setView('new-conversation');
    
    // Reset the conversation context
    setConversationContext({
      relationship: {
        type: 'romantic_partner',
      },
      scenario: {
        scenario: '',
        scenarioType: 'emotional_expression'
      },
      emotionalContext: {
        primaryEmotion: 'Hopeful',
        emotionalIntensity: 5
      },
      currentStep: 1
    });
    
    // Clear any previous errors
    setError('');
  };
  
  // Navigation functions for card-based flow
  const handleNextStep = () => {
    setConversationContext(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 3) // We have 3 cards total
    }));
  };
  
  const handlePrevStep = () => {
    setConversationContext(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1)
    }));
  };
  
  // Handle finishing the card flow
  const handleFinishCardFlow = () => {
    // Use the collected information to create a conversation
    const relationshipType = conversationContext.relationship.type === 'other' 
      ? conversationContext.relationship.customType || 'Custom' 
      : conversationContext.relationship.type.replace('_', ' ');
      
    const scenarioDesc = conversationContext.scenario.scenarioType === 'other'
      ? conversationContext.scenario.scenario
      : conversationContext.scenario.scenarioType.replace('_', ' ');
      
    // Set conversation name based on relationship
    setConversationName(relationshipType);
    
    // Use the scenario as the original message prompt
    setOriginalMessage(`I need help with a ${relationshipType} relationship. 
Context: ${scenarioDesc}
Emotional state: ${conversationContext.emotionalContext.primaryEmotion} (intensity: ${conversationContext.emotionalContext.emotionalIntensity}/10)`);
    
    // Switch to reply view to complete the flow
    setView('reply');
    setSelectedConversation(null);
    setSelectedExchange(null);
    setGeneratedReply('');
    setIsCreatingNewExchange(true);
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
  
  // Handle deleting a conversation
  const handleDeleteConversation = (conversationId: string) => {
    // If this is just a confirmation request
    if (showDeleteConfirm !== conversationId) {
      setShowDeleteConfirm(conversationId);
      return;
    }
    
    // Actually delete the conversation
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    
    // If the deleted conversation was selected, clear the selection
    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null);
      setSelectedExchange(null);
      setConversationName('');
      setOriginalMessage('');
      setGeneratedReply('');
      setIsCreatingNewExchange(true);
    }
    
    // Reset delete confirmation
    setShowDeleteConfirm(null);
  };
  
  // Cancel delete confirmation
  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the conversation item click
    setShowDeleteConfirm(null);
  };
  
  // Two-step process for generating a properly formatted reply
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
      // Step 1: Generate the initial text response
      const initialPrompt = `You are HeartGlowAI, an AI-powered relationship coach that helps users improve communication in romantic, friendship, and family relationships. Your goal is to provide warm, thoughtful, and emotionally intelligent responses to messages, ensuring that users can express themselves clearly and effectively.

When generating a response, follow this format with THREE sections:

1. Try This Response: Craft a concise, empathetic, and clear response to the given message. Ensure the tone matches the context.

2. Why This Could Work Insights: Explain why the suggested response is effective in strengthening communication.

3. Common Mistakes: Identify common errors people make when replying to similar messages.

The message you need to reply to is:
"${originalMessage}"

Please respond with ONLY these three sections clearly labeled.`;

      const initialReply = await generateMessage({
        recipient: "Reply",
        relationship: "MessageReply",
        occasion: "ReplyToMessage",
        tone: "Authentic",
        emotionalState: "Thoughtful",
        desiredOutcome: "MeaningfulConversation",
        additionalContext: initialPrompt
      });
      
      // Step 2: Convert the text response to JSON format
      const jsonFormatPrompt = `Convert the following text response into a valid JSON object with the following structure exactly:

{
  "try_this_response": "the text from the 'Try This Response' section",
  "why_this_could_work": "the text from the 'Why This Could Work Insights' section",
  "common_mistakes": "the text from the 'Common Mistakes' section"
}

The text to convert is:

${initialReply}

Return ONLY the JSON object with no additional text before or after. Make sure it is valid JSON.`;

      const jsonReply = await generateMessage({
        recipient: "FormatJSON",
        relationship: "TextToJSON",
        occasion: "FormatConversion",
        tone: "Technical",
        emotionalState: "Precise",
        desiredOutcome: "ValidJSON",
        additionalContext: jsonFormatPrompt
      });
      
      setGeneratedReply(jsonReply);
      
      // Create a new exchange
      const newExchange: Exchange = {
        id: Date.now().toString(),
        originalMessage,
        reply: jsonReply,
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
  
  // Format the structured reply for display
  const formatStructuredReply = (reply: string) => {
    // Default structure with empty sections
    const sections = {
      response: '',
      insights: '',
      mistakes: ''
    };

    try {
      // Try to parse the reply as JSON first
      let parsedReply;
      
      // Extract just the JSON part if there's text around it
      const jsonMatch = reply.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : reply;
      
      try {
        parsedReply = JSON.parse(jsonString);
        
        // If parsed successfully, extract the sections
        if (parsedReply.try_this_response) {
          sections.response = parsedReply.try_this_response;
        }
        if (parsedReply.why_this_could_work) {
          sections.insights = parsedReply.why_this_could_work;
        }
        if (parsedReply.common_mistakes) {
          sections.mistakes = parsedReply.common_mistakes;
        }
        
        // If all sections are empty, fall back to regex parsing
        if (!sections.response && !sections.insights && !sections.mistakes) {
          throw new Error('JSON parsing successful but no expected fields found');
        }
        
        return sections;
      } catch (jsonError) {
        console.warn('Failed to parse as JSON, falling back to regex:', jsonError);
        // Fall back to regex parsing for backward compatibility with older responses
        const responseMatch = reply.match(/Try This Response\s*([\s\S]*?)(?=Why This Could Work Insights|$)/i);
        const insightsMatch = reply.match(/Why This Could Work Insights\s*([\s\S]*?)(?=Common Mistakes|$)/i);
        const mistakesMatch = reply.match(/Common Mistakes\s*([\s\S]*?)(?=$)/i);
        
        // Extract content from each section, excluding the heading
        if (responseMatch && responseMatch[1]) sections.response = responseMatch[1].trim();
        if (insightsMatch && insightsMatch[1]) sections.insights = insightsMatch[1].trim();
        if (mistakesMatch && mistakesMatch[1]) sections.mistakes = mistakesMatch[1].trim();
      }
      
      // If we still couldn't parse the format, just return the whole reply as the response
      if (!sections.response && !sections.insights && !sections.mistakes) {
        sections.response = reply;
      }
    } catch (err) {
      // Fallback if all parsing fails
      console.error('Error parsing reply:', err);
      sections.response = reply;
    }
    
    return sections;
  };

  // Render the structured reply with formatting
  const renderStructuredReply = (reply: string) => {
    const sections = formatStructuredReply(reply);
    
    return (
      <div className="structured-reply">
        {sections.response && (
          <div className="reply-section response-section">
            <h4>Try This Response</h4>
            <div className="section-content">
              {sections.response}
            </div>
          </div>
        )}
        
        {sections.insights && (
          <div className="reply-section insights-section">
            <h4>Why This Could Work</h4>
            <div className="section-content">
              {sections.insights}
            </div>
          </div>
        )}
        
        {sections.mistakes && (
          <div className="reply-section mistakes-section">
            <h4>Common Mistakes</h4>
            <div className="section-content">
              {sections.mistakes}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Handle copying reply to clipboard - only copy the response section
  const handleCopyReply = () => {
    // Format the reply and get just the response section to copy
    const sections = formatStructuredReply(generatedReply);
    const textToCopy = sections.response || generatedReply;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy response:', err);
        setError('Failed to copy to clipboard. Please try again.');
      });
  };
  
  // Copy the full reply with all sections (insights and mistakes)
  const handleCopyFullReply = () => {
    try {
      // Try to extract nicely formatted text instead of raw JSON
      const sections = formatStructuredReply(generatedReply);
      const formattedText = `${sections.response}

Why This Could Work:
${sections.insights}

Common Mistakes:
${sections.mistakes}`;

      navigator.clipboard.writeText(formattedText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // Fall back to copying the original reply if formatting fails
          navigator.clipboard.writeText(generatedReply);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    } catch (err) {
      // Last resort - just copy the raw reply
      navigator.clipboard.writeText(generatedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
      <p className="app-tagline">Express your feelings with beautifully crafted heartfelt messages</p>
      
      {/* Main buttons */}
      <div className="action-buttons">
        <motion.button
          className="primary-button"
          onClick={handleCreateNewConversation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create New Message
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
            ? 'Create a New Message' 
            : selectedConversation?.name || 'Create a New Message'}
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
                    <div className="conversation-actions">
                      {showDeleteConfirm === conversation.id ? (
                        <div className="delete-confirm">
                          <span>Delete?</span>
                          <button 
                            className="confirm-yes" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConversation(conversation.id);
                            }}
                          >
                            Yes
                          </button>
                          <button 
                            className="confirm-no"
                            onClick={handleCancelDelete}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="delete-button" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConversation(conversation.id);
                          }}
                          title="Delete conversation"
                        >
                          <FaTrash />
                        </button>
                      )}
                      <button className="expand-button">
                        {expandedConversation === conversation.id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
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
              {renderStructuredReply(generatedReply)}
              
              <div className="reply-actions">
                <button 
                  className="primary-button"
                  onClick={handleCopyReply}
                >
                  {copied ? 'Copied!' : 'Copy Response Message'}
                </button>
                
                <button 
                  className="secondary-button"
                  onClick={handleCopyFullReply}
                >
                  Copy Full Response with Insights
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
                {renderStructuredReply(generatedReply)}
                
                <div className="reply-actions">
                  <button 
                    className="primary-button"
                    onClick={handleCopyReply}
                  >
                    {copied ? 'Copied!' : 'Copy Response Message'}
                  </button>
                  
                  <button 
                    className="secondary-button"
                    onClick={handleCopyFullReply}
                  >
                    Copy Full Response with Insights
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
  
  // Relationship Type Card Component
  const RelationshipTypeCard = () => {
    const relationshipTypes = [
      { id: 'romantic_partner', label: 'Romantic Partner' },
      { id: 'family_member', label: 'Family Member' },
      { id: 'friend', label: 'Friend' },
      { id: 'professional_contact', label: 'Professional Contact' },
      { id: 'other', label: 'Other' }
    ];
    
    return (
      <motion.div 
        className="message-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="card-title">Who are you communicating with?</h2>
        <div className="card-content">
          <div className="button-group">
            {relationshipTypes.map(type => (
              <button
                key={type.id}
                className={`card-button ${conversationContext.relationship.type === type.id ? 'selected' : ''}`}
                onClick={() => setConversationContext(prev => ({
                  ...prev,
                  relationship: {
                    ...prev.relationship,
                    type: type.id as RelationshipTypeCard['type']
                  }
                }))}
              >
                {type.label}
              </button>
            ))}
          </div>
          
          {conversationContext.relationship.type === 'other' && (
            <div className="form-group mt-4">
              <input
                type="text"
                className="text-input"
                placeholder="Describe your relationship"
                value={conversationContext.relationship.customType || ''}
                onChange={(e) => setConversationContext(prev => ({
                  ...prev,
                  relationship: {
                    ...prev.relationship,
                    customType: e.target.value
                  }
                }))}
              />
            </div>
          )}
          
          <div className="card-actions">
            <button 
              className="secondary-button"
              onClick={handleBackToLanding}
            >
              Back
            </button>
            <button 
              className="primary-button"
              onClick={handleNextStep}
              disabled={conversationContext.relationship.type === 'other' && 
                        (!conversationContext.relationship.customType || 
                         conversationContext.relationship.customType.trim() === '')}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Communication Scenario Card Component
  const CommunicationScenarioCard = () => {
    const scenarioTypes = [
      { id: 'conflict_resolution', label: 'Resolving a Conflict' },
      { id: 'emotional_expression', label: 'Expressing Feelings' },
      { id: 'seeking_support', label: 'Seeking Support' },
      { id: 'giving_feedback', label: 'Giving Feedback' },
      { id: 'other', label: 'Something Else' }
    ];
    
    return (
      <motion.div 
        className="message-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="card-title">What's the context of your communication?</h2>
        <div className="card-content">
          <div className="button-group">
            {scenarioTypes.map(type => (
              <button
                key={type.id}
                className={`card-button ${conversationContext.scenario.scenarioType === type.id ? 'selected' : ''}`}
                onClick={() => setConversationContext(prev => ({
                  ...prev,
                  scenario: {
                    ...prev.scenario,
                    scenarioType: type.id as ScenarioCard['scenarioType']
                  }
                }))}
              >
                {type.label}
              </button>
            ))}
          </div>
          
          {conversationContext.scenario.scenarioType === 'other' && (
            <div className="form-group mt-4">
              <textarea
                className="text-input"
                placeholder="Describe your specific scenario"
                value={conversationContext.scenario.scenario}
                onChange={(e) => setConversationContext(prev => ({
                  ...prev,
                  scenario: {
                    ...prev.scenario,
                    scenario: e.target.value
                  }
                }))}
                rows={3}
              />
            </div>
          )}
          
          <div className="card-actions">
            <button 
              className="secondary-button"
              onClick={handlePrevStep}
            >
              Back
            </button>
            <button 
              className="primary-button"
              onClick={handleNextStep}
              disabled={conversationContext.scenario.scenarioType === 'other' && 
                       (!conversationContext.scenario.scenario || 
                        conversationContext.scenario.scenario.trim() === '')}
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Emotional Context Card Component
  const EmotionalContextCard = () => {
    const emotions = ['Hopeful', 'Frustrated', 'Anxious', 'Excited', 'Uncertain', 'Calm', 'Worried', 'Happy', 'Sad', 'Angry'];
    
    return (
      <motion.div 
        className="message-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="card-title">How are you feeling?</h2>
        <div className="card-content">
          <div className="form-group">
            <label>Primary Emotion</label>
            <select
              className="select-input"
              value={conversationContext.emotionalContext.primaryEmotion}
              onChange={(e) => setConversationContext(prev => ({
                ...prev,
                emotionalContext: {
                  ...prev.emotionalContext,
                  primaryEmotion: e.target.value
                }
              }))}
            >
              {emotions.map(emotion => (
                <option key={emotion} value={emotion}>
                  {emotion}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group mt-4">
            <label>
              Intensity: {conversationContext.emotionalContext.emotionalIntensity}
            </label>
            <div className="slider-container">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={conversationContext.emotionalContext.emotionalIntensity}
                onChange={(e) => setConversationContext(prev => ({
                  ...prev,
                  emotionalContext: {
                    ...prev.emotionalContext,
                    emotionalIntensity: parseInt(e.target.value)
                  }
                }))}
                className="slider"
              />
              <div className="slider-labels">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
              </div>
            </div>
          </div>
          
          <div className="card-actions">
            <button 
              className="secondary-button"
              onClick={handlePrevStep}
            >
              Back
            </button>
            <button 
              className="primary-button"
              onClick={handleFinishCardFlow}
            >
              Create Conversation
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // New Conversation View with Card-Based Flow
  const renderNewConversationView = () => {
    return (
      <div className="new-conversation-container">
        <div className="new-conversation-header">
          <button className="icon-button" onClick={handleBackToLanding}>
            <FaArrowLeft /> Back
          </button>
          <h1>Create a New Conversation</h1>
        </div>
        
        {/* Progress indicator */}
        <div className="progress-indicator">
          <div className={`progress-step ${conversationContext.currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${conversationContext.currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${conversationContext.currentStep >= 3 ? 'active' : ''}`}>3</div>
        </div>
        
        {/* Card content with AnimatePresence for smooth transitions */}
        <div className="card-container">
          <AnimatePresence mode="wait">
            {conversationContext.currentStep === 1 && <RelationshipTypeCard />}
            {conversationContext.currentStep === 2 && <CommunicationScenarioCard />}
            {conversationContext.currentStep === 3 && <EmotionalContextCard />}
          </AnimatePresence>
        </div>
      </div>
    );
  };
  
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
      {view === 'new-conversation' && renderNewConversationView()} {/* Reuse reply view for now */}
    </div>
  );
};

export { MessageSpark }; 