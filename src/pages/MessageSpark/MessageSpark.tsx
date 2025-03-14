import React, { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaUser, FaCopy, FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa";
import { generateMessage } from '../../services/messages';
import { useFirebase } from '../../contexts/FirebaseContext';

// Define the steps of the message generation process
enum Step {
  Relationship = 0,
  Message = 1,
  Result = 2
}

// Structure for the form data
interface MessageFormData {
  recipient: string;
  relationship: string;
  occasion: string;
  tone: string;
  emotionalState: string;
  desiredOutcome: string;
  additionalInfo: string;
}

// Structure for the generated message
interface MessageResult {
  content: string;
  timestamp: Date;
}

// Heart animation properties
interface Heart {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

// Isolated hearts animation component to prevent re-rendering the main form
const FloatingHearts = memo(() => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  // Generate random heart positions initially and every 30 seconds
  useEffect(() => {
    generateHearts();
    const interval = setInterval(generateHearts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Function to generate random floating hearts with fewer hearts
  const generateHearts = () => {
    const newHearts = Array.from({ length: 6 }, (_, i) => ({
      id: `heart-${Date.now()}-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 15 + 8,
      duration: Math.random() * 15 + 15, // Longer duration
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1, // Lower max opacity
    }));
    setHearts(newHearts);
  };

  return (
    <>
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
    </>
  );
});

// Isolated form input component to optimize rendering
const FormInput = memo(({ 
  id, 
  name, 
  type = "text", 
  label, 
  value, 
  placeholder = "", 
  options = [], 
  onChange,
  rows = 1 
}: {
  id: string;
  name: string;
  type?: "text" | "select" | "textarea";
  label: string;
  value: string;
  placeholder?: string;
  options?: Array<{value: string, label: string}>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  rows?: number;
}) => {
  const inputStyles = {
    width: "100%",
    padding: "0.85rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all 0.2s ease",
  };

  const selectStyles = {
    ...inputStyles,
    appearance: "none",
    backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
  };

  const textareaStyles = {
    ...inputStyles,
    resize: "vertical" as const,
    minHeight: "100px",
  };

  return (
    <div>
      <label 
        htmlFor={id} 
        style={{ 
          display: "block", 
          marginBottom: "0.5rem", 
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "0.95rem"
        }}
      >
        {label}
      </label>

      {type === "text" && (
        <input
          id={id}
          name={name}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={inputStyles}
        />
      )}

      {type === "select" && (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          style={selectStyles}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {type === "textarea" && (
        <textarea
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={textareaStyles}
        />
      )}
    </div>
  );
});

const MessageSpark: React.FC = () => {
  // State for form data - now the single source of truth
  const [formData, setFormData] = useState<MessageFormData>({
    recipient: '',
    relationship: '',
    occasion: '',
    tone: '',
    emotionalState: 'Hopeful',
    desiredOutcome: 'Strengthen the relationship',
    additionalInfo: ''
  });

  const [currentStep, setCurrentStep] = useState<Step>(Step.Relationship);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<MessageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useFirebase();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Input change handler with performance optimization
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // When moving to the next step, we're already using the formData state
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1 as Step);
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1 as Step);
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Call the actual API service to generate message
      const result = await generateMessage({
        recipient: formData.recipient,
        relationship: formData.relationship,
        occasion: formData.occasion,
        tone: formData.tone,
        emotionalState: formData.emotionalState,
        desiredOutcome: formData.desiredOutcome,
        additionalContext: formData.additionalInfo
      });
      
      setGeneratedMessage({
        content: result,
        timestamp: new Date()
      });
      
      goToNextStep();
    } catch (err: any) {
      console.error('Error generating message:', err);
      setError(err.message || 'Failed to generate message. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  const generateAnotherMessage = () => {
    setCurrentStep(Step.Relationship);
    setGeneratedMessage(null);
  };

  const handleBack = () => {
    navigate("/welcome");
  };

  // Check form validity based on formData state directly
  const isStepValid = () => {    
    switch (currentStep) {
      case Step.Relationship:
        return !!(formData.recipient && formData.relationship && formData.occasion);
      case Step.Message:
        return !!formData.tone;
      default:
        return true;
    }
  };

  // Relationship and Recipient Form Step
  const RelationshipStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{ width: "100%" }}
    >
      <h2 
        style={{ 
          fontSize: "1.6rem", 
          fontWeight: "bold", 
          color: "#fff", 
          marginBottom: "1.5rem",
          textAlign: "center"
        }}
      >
        Who's this message for?
      </h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormInput
          id="recipient"
          name="recipient"
          label="Recipient's Name"
          value={formData.recipient}
          placeholder="E.g., Sarah, Mom, John"
          onChange={handleInputChange}
        />
        
        <FormInput
          id="relationship"
          name="relationship"
          type="select"
          label="Relationship"
          value={formData.relationship}
          onChange={handleInputChange}
          options={[
            { value: "", label: "Select relationship" },
            { value: "romantic_partner", label: "Romantic Partner" },
            { value: "spouse", label: "Spouse" },
            { value: "family_member", label: "Family Member" },
            { value: "friend", label: "Friend" },
            { value: "colleague", label: "Colleague" },
            { value: "acquaintance", label: "Acquaintance" }
          ]}
        />
        
        <FormInput
          id="occasion"
          name="occasion"
          label="Occasion or Purpose"
          value={formData.occasion}
          placeholder="E.g., Birthday, Anniversary, Apology"
          onChange={handleInputChange}
        />
        
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            style={{
              padding: "0.85rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaArrowLeft size={16} /> Back
          </motion.button>
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={goToNextStep}
            disabled={!isStepValid()}
            style={{
              padding: "0.85rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: isStepValid() 
                ? "rgba(255, 255, 255, 0.25)" 
                : "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: isStepValid() ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              opacity: isStepValid() ? 1 : 0.6,
            }}
          >
            Continue <FaArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Message Details Form Step
  const MessageDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{ width: "100%" }}
    >
      <h2 
        style={{ 
          fontSize: "1.6rem", 
          fontWeight: "bold", 
          color: "#fff", 
          marginBottom: "1.5rem",
          textAlign: "center"
        }}
      >
        Message Details
      </h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormInput
          id="tone"
          name="tone"
          type="select"
          label="Tone"
          value={formData.tone}
          onChange={handleInputChange}
          options={[
            { value: "", label: "Select tone" },
            { value: "loving", label: "Loving" },
            { value: "friendly", label: "Friendly" },
            { value: "romantic", label: "Romantic" },
            { value: "casual", label: "Casual" },
            { value: "formal", label: "Formal" },
            { value: "humorous", label: "Humorous" },
            { value: "sincere", label: "Sincere" },
            { value: "encouraging", label: "Encouraging" }
          ]}
        />

        <FormInput
          id="emotionalState"
          name="emotionalState"
          type="select"
          label="Your Emotional State"
          value={formData.emotionalState}
          onChange={handleInputChange}
          options={[
            { value: "Hopeful", label: "Hopeful" },
            { value: "Anxious", label: "Anxious" },
            { value: "Excited", label: "Excited" },
            { value: "Worried", label: "Worried" },
            { value: "Confident", label: "Confident" },
            { value: "Hesitant", label: "Hesitant" },
            { value: "Loving", label: "Loving" },
            { value: "Upset", label: "Upset" }
          ]}
        />

        <FormInput
          id="desiredOutcome"
          name="desiredOutcome"
          type="select"
          label="Desired Outcome"
          value={formData.desiredOutcome}
          onChange={handleInputChange}
          options={[
            { value: "Strengthen the relationship", label: "Strengthen the relationship" },
            { value: "Resolve a conflict", label: "Resolve a conflict" },
            { value: "Express feelings", label: "Express feelings" },
            { value: "Request something", label: "Request something" },
            { value: "Apologize", label: "Apologize" },
            { value: "Celebrate an achievement", label: "Celebrate an achievement" },
            { value: "Show support", label: "Show support" }
          ]}
        />
        
        <FormInput
          id="additionalInfo"
          name="additionalInfo"
          type="textarea"
          label="Additional Information (Optional)"
          value={formData.additionalInfo}
          placeholder="Add any specific details you'd like to include in your message..."
          onChange={handleInputChange}
          rows={4}
        />
        
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={goToPreviousStep}
            style={{
              padding: "0.85rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FaArrowLeft size={16} /> Back
          </motion.button>
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={!isStepValid() || isGenerating}
            style={{
              padding: "0.85rem 1.5rem",
              borderRadius: "8px",
              backgroundColor: isStepValid() && !isGenerating 
                ? "rgba(255, 255, 255, 0.25)" 
                : "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: isStepValid() && !isGenerating ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              opacity: isStepValid() && !isGenerating ? 1 : 0.6,
            }}
          >
            {isGenerating ? (
              <>
                <FaSpinner className="animate-spin" size={16} /> Generating...
              </>
            ) : (
              <>
                Generate Message <FaArrowRight size={16} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Result Step with fixed animation blipping
  const ResultStep = () => {
    // Use the message content directly
    const messageContent = generatedMessage?.content || "";
    
    // Parse message into sections for better readability
    const getMessageSections = () => {
      if (!messageContent) return [];
      
      // Split message by paragraph breaks
      const paragraphs = messageContent.split(/\n\n+/);
      
      // If only one paragraph, just display it as a single section
      if (paragraphs.length <= 1) {
        return [{title: "Your Message", content: messageContent}];
      }
      
      // Create meaningful sections from the paragraphs
      const sections = [];
      
      // First paragraph is usually an introduction
      if (paragraphs[0]) {
        sections.push({
          title: "Introduction",
          content: paragraphs[0]
        });
      }
      
      // Middle paragraphs form the main message
      const bodyParagraphs = paragraphs.slice(1, paragraphs.length - 1);
      if (bodyParagraphs.length > 0) {
        sections.push({
          title: "Main Message",
          content: bodyParagraphs.join('\n\n')
        });
      }
      
      // Last paragraph is typically a closing
      if (paragraphs.length > 1) {
        sections.push({
          title: "Closing",
          content: paragraphs[paragraphs.length - 1]
        });
      }
      
      return sections;
    };
    
    const messageSections = getMessageSections();
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        style={{ width: "100%" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 
            style={{ 
              fontSize: "1.6rem", 
              fontWeight: "bold", 
              color: "#fff", 
              marginBottom: "0.5rem" 
            }}
          >
            Your Message is Ready!
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.9)" }}>
            Created with HeartGlow AI for {formData.recipient}
          </p>
        </div>

        {messageContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              borderRadius: "12px",
              padding: "1.5rem",
              color: "#fff",
              marginBottom: "1.5rem",
              position: "relative",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
              overflowY: "auto",
              maxHeight: "50vh"
            }}
          >
            {messageSections.map((section, index) => (
              <div 
                key={index} 
                style={{ 
                  marginBottom: index < messageSections.length - 1 ? "1.5rem" : 0,
                  borderBottom: index < messageSections.length - 1 ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
                  paddingBottom: index < messageSections.length - 1 ? "1.5rem" : 0
                }}
              >
                <h3 style={{ 
                  fontSize: "1.2rem", 
                  fontWeight: "bold", 
                  marginBottom: "0.75rem",
                  color: "rgba(255, 255, 255, 0.95)",
                  letterSpacing: "0.5px"
                }}>
                  {section.title}
                </h3>
                <p style={{ 
                  whiteSpace: "pre-line", 
                  lineHeight: 1.7, 
                  fontSize: "1.05rem",
                  color: "rgba(255, 255, 255, 0.9)"
                }}>
                  {section.content}
                </p>
              </div>
            ))}
            
            {/* Message metadata */}
            <div style={{ 
              marginTop: "1.5rem", 
              fontSize: "0.85rem", 
              color: "rgba(255, 255, 255, 0.6)",
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "1rem"
            }}>
              <span>For: {formData.recipient}</span>
              <span>Occasion: {formData.occasion}</span>
              <span>Tone: {formData.tone}</span>
            </div>
          </motion.div>
        )}
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={copyToClipboard}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              backdropFilter: "blur(5px)",
            }}
          >
            <FaCopy size={18} />
            {copySuccess ? "Copied!" : "Copy to Clipboard"}
          </motion.button>
          
          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={generateAnotherMessage}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "none",
              color: "#fff",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Create Another Message
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              backgroundColor: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#fff",
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "0.5rem"
            }}
          >
            Return to Home
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #8a2387, #e94057, #f27121)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Isolated floating hearts background animation */}
      <FloatingHearts />

      {/* Header with logo */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "1.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ 
              scale: [1, 1.15, 1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
            style={{
              marginRight: "0.75rem",
              color: "#fff",
              filter: "drop-shadow(0 0 8px rgba(255, 100, 130, 0.6))",
            }}
          >
            <FaHeart size={28} />
          </motion.div>
          <h2
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            MessageSpark
          </h2>
        </motion.div>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "90%",
          maxWidth: "550px",
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 10,
          marginTop: "2rem",
        }}
      >
        {/* Progress indicator */}
        <div style={{ width: "100%", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.9rem" }}>
              Step {currentStep + 1} of 3
            </div>
            <div style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "0.9rem" }}>
              {currentStep === Step.Relationship ? 'Recipient' : 
               currentStep === Step.Message ? 'Details' : 'Result'}
            </div>
          </div>
          <div 
            style={{ 
              width: "100%", 
              height: "6px", 
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: "3px",
              overflow: "hidden"
            }}
          >
            <motion.div 
              initial={{ width: `${((currentStep) / 3) * 100}%` }}
              animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{ 
                height: "100%", 
                backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))",
                borderRadius: "3px"
              }}
            />
          </div>
        </div>
        
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                backgroundColor: "rgba(255, 85, 85, 0.3)",
                color: "#fff",
                padding: "0.75rem",
                borderRadius: "6px",
                marginBottom: "1rem",
                width: "100%",
                textAlign: "center",
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Step content */}
        <AnimatePresence mode="wait">
          {currentStep === Step.Relationship && <RelationshipStep key="step1" />}
          {currentStep === Step.Message && <MessageDetailsStep key="step2" />}
          {currentStep === Step.Result && <ResultStep key="step3" />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}; 

export { MessageSpark };
