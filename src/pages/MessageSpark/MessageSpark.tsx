import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateMessage } from '../../services/messages';
import { useFirebase } from '../../contexts/FirebaseContext';
import './MessageSpark.css';

// Simple form data interface
interface FormData {
  recipient: string;
  relationship: string;
  occasion: string;
  tone: string;
  emotionalState: string;
  desiredOutcome: string;
  additionalContext: string;
}

const MessageSpark: React.FC = () => {
  // Form state
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
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if form is valid  
  const isFormValid = () => {
    return (
      formData.recipient.trim() !== '' &&
      formData.relationship.trim() !== '' &&
      formData.occasion.trim() !== '' &&
      formData.tone.trim() !== ''
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill out all required fields');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const message = await generateMessage({
        recipient: formData.recipient,
        relationship: formData.relationship,
        occasion: formData.occasion,
        tone: formData.tone,
        emotionalState: formData.emotionalState,
        desiredOutcome: formData.desiredOutcome,
        additionalContext: formData.additionalContext
      });
      
      setGeneratedMessage(message);
    } catch (err) {
      setError('Failed to generate message. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Copy message to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Reset the form
  const handleReset = () => {
    setFormData({
      recipient: '',
      relationship: '',
      occasion: '',
      tone: '',
      emotionalState: 'Hopeful',
      desiredOutcome: 'Strengthen the relationship',
      additionalContext: ''
    });
    setGeneratedMessage('');
  };
  
  return (
    <div className="message-spark-container">
      <div className="message-spark-header">
        <h1>Message Spark</h1>
        <p>Create heartfelt messages for your loved ones</p>
      </div>
      
      {/* Form or result based on whether we have a generated message */}
      {!generatedMessage ? (
        <form className="message-spark-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="recipient">Recipient's Name*</label>
            <input
              type="text"
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleChange}
              placeholder="E.g., Sarah, Mom, John"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="relationship">Relationship*</label>
            <select
              id="relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              required
            >
              <option value="">Select relationship</option>
              <option value="romantic_partner">Romantic Partner</option>
              <option value="spouse">Spouse</option>
              <option value="family_member">Family Member</option>
              <option value="friend">Friend</option>
              <option value="colleague">Colleague</option>
              <option value="acquaintance">Acquaintance</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="occasion">Occasion or Purpose*</label>
            <input
              type="text"
              id="occasion"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              placeholder="E.g., Birthday, Anniversary, Apology"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tone">Tone*</label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              required
            >
              <option value="">Select tone</option>
              <option value="loving">Loving</option>
              <option value="friendly">Friendly</option>
              <option value="romantic">Romantic</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="humorous">Humorous</option>
              <option value="sincere">Sincere</option>
              <option value="encouraging">Encouraging</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="emotionalState">Your Emotional State</label>
            <select
              id="emotionalState"
              name="emotionalState"
              value={formData.emotionalState}
              onChange={handleChange}
            >
              <option value="Hopeful">Hopeful</option>
              <option value="Anxious">Anxious</option>
              <option value="Excited">Excited</option>
              <option value="Worried">Worried</option>
              <option value="Confident">Confident</option>
              <option value="Hesitant">Hesitant</option>
              <option value="Loving">Loving</option>
              <option value="Upset">Upset</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="desiredOutcome">Desired Outcome</label>
            <select
              id="desiredOutcome"
              name="desiredOutcome"
              value={formData.desiredOutcome}
              onChange={handleChange}
            >
              <option value="Strengthen the relationship">Strengthen the relationship</option>
              <option value="Resolve a conflict">Resolve a conflict</option>
              <option value="Express feelings">Express feelings</option>
              <option value="Request something">Request something</option>
              <option value="Apologize">Apologize</option>
              <option value="Celebrate an achievement">Celebrate an achievement</option>
              <option value="Show support">Show support</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="additionalContext">Additional Information (Optional)</label>
            <textarea
              id="additionalContext"
              name="additionalContext"
              value={formData.additionalContext}
              onChange={handleChange}
              rows={4}
              placeholder="Add any specific details you'd like to include in your message..."
            />
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/welcome')}
              className="secondary-button"
            >
              Back to Home
            </button>
            
            <button
              type="submit"
              disabled={isGenerating || !isFormValid()}
              className="primary-button"
            >
              {isGenerating ? 'Generating...' : 'Generate Message'}
            </button>
          </div>
        </form>
      ) : (
        <div className="message-result">
          <h2>Your Message is Ready!</h2>
          <p className="recipient-info">For: {formData.recipient}</p>
          
          <div className="message-content">
            <pre>{generatedMessage}</pre>
          </div>
          
          <div className="message-meta">
            <span>Occasion: {formData.occasion}</span>
            <span>Tone: {formData.tone}</span>
          </div>
          
          <div className="result-actions">
            <button 
              onClick={copyToClipboard}
              className="primary-button"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            
            <button
              onClick={handleReset}
              className="secondary-button"
            >
              Create Another Message
            </button>
            
            <button
              onClick={() => navigate('/welcome')}
              className="text-button"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { MessageSpark }; 