import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { generateMessages, MessageGeneration, collectMessageFeedback } from '../services/advancedMessageGeneration';
import StructuredMessageDisplay from '../components/StructuredMessageDisplay';
import { useAuth } from '../contexts/AuthContext';

const MessageResults: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messageData, setMessageData] = useState<MessageGeneration | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) {
        setError('No conversation ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if we have the message request data in location state
        const messageRequest = location.state?.messageRequest;
        
        if (!messageRequest) {
          setError('Message request data not found');
          setLoading(false);
          return;
        }

        // Generate messages using the advanced service
        const response = await generateMessages(messageRequest);
        
        if ('error' in response) {
          setError(response.details || 'An error occurred while generating messages');
        } else {
          setMessageData(response);
        }
      } catch (err: any) {
        console.error('Error generating messages:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId, location.state]);

  const handleSelectMessage = (message: string) => {
    setSelectedMessage(message);
    console.log('Selected message:', message);
  };

  const handleRateMessage = async (message: string, rating: number) => {
    if (!conversationId || !user) return;
    
    try {
      await collectMessageFeedback({
        conversationId,
        messageText: message,
        rating,
        userId: user.uid,
        timestamp: new Date(),
        aiModel: 'gpt-4-turbo',
        feedbackVersion: '1.0'
      });
      
      setFeedbackSubmitted(true);
      setTimeout(() => setFeedbackSubmitted(false), 3000);
      
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback');
    }
  };

  const handleModifyMessage = async (message: string, modification: string) => {
    if (!conversationId || !user) return;
    
    try {
      await collectMessageFeedback({
        conversationId,
        messageText: message,
        rating: 2, // Lower rating to trigger regeneration
        userModification: modification,
        userId: user.uid,
        timestamp: new Date(),
        aiModel: 'gpt-4-turbo',
        feedbackVersion: '1.0'
      });
      
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
      
    } catch (err: any) {
      console.error('Error modifying message:', err);
      setError('Failed to save modifications');
    }
  };

  const handleNewConversation = () => {
    navigate('/message-spark');
  };

  return (
    <div className="message-spark-container">
      <div className="message-spark-form-container">
        <div className="message-spark-header">
          <button onClick={() => navigate(-1)} className="icon-button">
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <h1>Message Results</h1>
          <button onClick={handleNewConversation} className="icon-button">
            <i className="fas fa-plus"></i>
            New
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
            <button 
              onClick={() => navigate(-1)} 
              className="secondary-button mt-4"
            >
              Go Back
            </button>
          </div>
        ) : messageData ? (
          <div>
            {feedbackSubmitted && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
                Thank you for your feedback!
              </div>
            )}
            
            {savedMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
                Your message has been saved!
              </div>
            )}
            
            <StructuredMessageDisplay
              messageData={messageData}
              onSelectMessage={handleSelectMessage}
              onRateMessage={handleRateMessage}
              onModifyMessage={handleModifyMessage}
            />
            
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => navigate(-1)} 
                className="secondary-button"
              >
                Go Back
              </button>
              <button 
                onClick={handleNewConversation} 
                className="primary-button"
              >
                New Conversation
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-white py-8">
            <p>No message data available</p>
            <button 
              onClick={() => navigate(-1)} 
              className="secondary-button mt-4"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageResults; 