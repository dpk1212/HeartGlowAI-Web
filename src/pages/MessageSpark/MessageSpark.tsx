import React, { useState, useEffect } from 'react';
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

const MessageSpark: React.FC = () => {
  const [hearts, setHearts] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>(Step.Relationship);
  const [formData, setFormData] = useState<MessageFormData>({
    recipient: '',
    relationship: '',
    occasion: '',
    tone: '',
    emotionalState: 'Hopeful',
    desiredOutcome: 'Strengthen the relationship',
    additionalInfo: ''
  });
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

  // Generate random heart positions initially and every 30 seconds instead of 10
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
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };
  
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

  const isStepValid = () => {
    switch (currentStep) {
      case Step.Relationship:
        return !!formData.recipient && !!formData.relationship && !!formData.occasion;
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
        <div>
          <label 
            htmlFor="recipient" 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.95rem"
            }}
          >
            Recipient's Name
          </label>
          <input
            id="recipient"
            name="recipient"
            type="text"
            placeholder="E.g., Sarah, Mom, John"
            value={formData.recipient}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              transition: "all 0.2s ease",
            }}
          />
            </div>
        
        <div>
          <label 
            htmlFor="relationship" 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.95rem"
            }}
          >
            Relationship
          </label>
          <select
            id="relationship"
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              transition: "all 0.2s ease",
              appearance: "none",
              backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
            }}
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
        
        <div>
          <label 
            htmlFor="occasion" 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.95rem"
            }}
          >
            Occasion or Purpose
          </label>
          <input
            id="occasion"
            name="occasion"
            type="text"
            placeholder="E.g., Birthday, Anniversary, Apology"
            value={formData.occasion}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              transition: "all 0.2s ease",
            }}
          />
            </div>
        
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
        <div>
          <label 
            htmlFor="tone" 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.95rem"
            }}
          >
            Tone
          </label>
          <select
            id="tone"
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              transition: "all 0.2s ease",
              appearance: "none",
              backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
            }}
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

        <div>
          <label 
            htmlFor="emotionalState" 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.95rem"
            }}
          >
            Your Emotional State
          </label>
          <select
            id="emotionalState"
            name="emotionalState"
            value={formData.emotionalState}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              transition: "all 0.2s ease",
              appearance: "none",
              backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
            }}
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

        <div>
          <label 
            htmlFor="desiredOutcome" 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.95rem"
            }}
          >
            Desired Outcome
          </label>
          <select
            id="desiredOutcome"
            name="desiredOutcome"
            value={formData.desiredOutcome}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              transition: "all 0.2s ease",
              appearance: "none",
              backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
            }}
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
        
        <div>
          <label 
            htmlFor="additionalInfo" 
            style={{ 
              display: "block", 
              marginBottom: "0.5rem", 
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.95rem"
            }}
          >
            Additional Information (Optional)
          </label>
            <textarea
            id="additionalInfo"
            name="additionalInfo"
            rows={4}
            placeholder="Add any specific details you'd like to include in your message..."
            value={formData.additionalInfo}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              fontSize: "0.95rem",
              outline: "none",
              transition: "all 0.2s ease",
              resize: "vertical",
              minHeight: "100px",
            }}
            />
          </div>
        
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
    // Reference to store the message content to prevent re-rendering
    const [messageContent] = useState(generatedMessage?.content || "");
    
    // Local copy function that uses the stored message content
    const handleCopy = () => {
      navigator.clipboard.writeText(messageContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    };
    
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
            }}
          >
            <p style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>
              {messageContent}
            </p>
          </motion.div>
        )}
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCopy}
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
