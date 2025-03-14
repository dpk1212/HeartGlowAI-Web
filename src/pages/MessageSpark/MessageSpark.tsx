import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
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

// CSS properties for select element
interface SelectStyles extends React.CSSProperties {
  appearance: 'none';
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
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          style={{
            position: "absolute",
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            opacity: heart.opacity,
            zIndex: 1,
            pointerEvents: "none",
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
    </div>
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
  const inputStyles: React.CSSProperties = {
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

  const selectStyles: SelectStyles = {
    ...inputStyles,
    appearance: 'none',
    backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
  };

  const textareaStyles: React.CSSProperties = {
    ...inputStyles,
    resize: "vertical",
    minHeight: "100px",
  };

  // Create a stable reference to the input element to ensure it doesn't re-create on re-renders
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null>(null);

  // Handle changes without causing re-renders by debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // Ensure onChange is only called once per keystroke
    onChange(e);
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
          onChange={handleInputChange}
          style={inputStyles}
          ref={inputRef as React.RefObject<HTMLInputElement>}
        />
      )}

      {type === "select" && (
        <select
          id={id}
          name={name}
          value={value}
          onChange={handleInputChange}
          style={selectStyles}
          ref={inputRef as React.RefObject<HTMLSelectElement>}
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
          onChange={handleInputChange}
          style={textareaStyles}
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        />
      )}
    </div>
  );
}, 
// Use custom comparison to avoid re-renders when handlers change but values don't
(prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.id === nextProps.id &&
    prevProps.type === nextProps.type
  );
});

const MessageSpark: React.FC = () => {
  // ⭐ ULTRA-SIMPLIFIED STATE MANAGEMENT ⭐
  // We're using refs for direct DOM access to prevent re-renders during typing
  const [formData, setFormData] = useState<MessageFormData>({
    recipient: '',
    relationship: '',
    occasion: '',
    tone: '',
    emotionalState: 'Hopeful',
    desiredOutcome: 'Strengthen the relationship',
    additionalInfo: ''
  });
  
  // Create refs for all form elements
  const recipientRef = useRef<HTMLInputElement>(null);
  const relationshipRef = useRef<HTMLSelectElement>(null);
  const occasionRef = useRef<HTMLInputElement>(null);
  const toneRef = useRef<HTMLSelectElement>(null);
  const emotionalStateRef = useRef<HTMLSelectElement>(null);
  const desiredOutcomeRef = useRef<HTMLSelectElement>(null);
  const additionalInfoRef = useRef<HTMLTextAreaElement>(null);

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
  
  // ⭐ DIRECT DOM UPDATE STRATEGY ⭐
  // This syncs our form data with the UI without triggering unnecessary re-renders
  const syncFormData = () => {
    setFormData({
      recipient: recipientRef.current?.value || '',
      relationship: relationshipRef.current?.value || '',
      occasion: occasionRef.current?.value || '',
      tone: toneRef.current?.value || '',
      emotionalState: emotionalStateRef.current?.value || 'Hopeful',
      desiredOutcome: desiredOutcomeRef.current?.value || 'Strengthen the relationship',
      additionalInfo: additionalInfoRef.current?.value || ''
    });
  };
  
  // ⭐ NAVIGATION WITHOUT STATE UPDATES DURING TYPING ⭐
  const goToNextStep = () => {
    // Sync form data before navigation
    syncFormData();
    setCurrentStep(prev => prev + 1 as Step);
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1 as Step);
  };

  const handleBack = () => {
    navigate("/welcome");
  };
  
  // ⭐ SIMPLIFIED SUBMIT WITHOUT COMPLEX STATE ⭐
  const handleSubmit = async () => {
    // Make sure we have the latest form data
    syncFormData();
    
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
      
      setCurrentStep(Step.Result);
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

  // ⭐ SIMPLE VALIDATION LOGIC ⭐
  const isStepValid = () => {
    // Manually check the DOM elements for values
    switch (currentStep) {
      case Step.Relationship:
        return !!(
          recipientRef.current?.value && 
          relationshipRef.current?.value && 
          occasionRef.current?.value
        );
      case Step.Message:
        return !!toneRef.current?.value;
      default:
        return true;
    }
  };

  // ⭐ ULTRA-OPTIMIZED RENDERING ⭐
  // All inputs are uncontrolled to eliminate re-rendering during typing
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
      {/* Completely isolated animation that won't affect inputs */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
              marginRight: "0.75rem",
              color: "#fff",
              filter: "drop-shadow(0 0 8px rgba(255, 100, 130, 0.6))",
            }}
          >
            <FaHeart size={28} />
          </div>
          <h2
            style={{
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            MessageSpark
          </h2>
        </div>
      </div>

      {/* Main content */}
      <div
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
            <div 
              style={{ 
                height: "100%", 
                width: `${((currentStep + 1) / 3) * 100}%`,
                backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2))",
                borderRadius: "3px",
                transition: "width 0.3s ease-in-out"
              }}
            />
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div
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
          </div>
        )}
        
        {/* Step content with super-simplified rendering */}
        <div style={{ width: "100%" }}>
          {currentStep === Step.Relationship && (
            <div>
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
                {/* ⭐ UNCONTROLLED INPUTS FOR MAXIMUM PERFORMANCE ⭐ */}
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
                    defaultValue={formData.recipient}
                    ref={recipientRef}
                    onChange={() => {}} // Empty handler to make React happy
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
                    defaultValue={formData.relationship}
                    ref={relationshipRef}
                    onChange={() => {}} // Empty handler to make React happy
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
                      appearance: 'none',
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
                    defaultValue={formData.occasion}
                    ref={occasionRef}
                    onChange={() => {}} // Empty handler to make React happy
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
                  <button
                    type="button"
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
                  </button>
                  
                  <button
                    type="button"
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
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === Step.Message && (
            <div>
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
                {/* ⭐ UNCONTROLLED INPUTS FOR MAXIMUM PERFORMANCE ⭐ */}
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
                    defaultValue={formData.tone}
                    ref={toneRef}
                    onChange={() => {}} // Empty handler to make React happy
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
                      appearance: 'none',
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
                    defaultValue={formData.emotionalState}
                    ref={emotionalStateRef}
                    onChange={() => {}} // Empty handler to make React happy
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
                      appearance: 'none',
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
                    defaultValue={formData.desiredOutcome}
                    ref={desiredOutcomeRef}
                    onChange={() => {}} // Empty handler to make React happy
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
                      appearance: 'none',
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
                    defaultValue={formData.additionalInfo}
                    ref={additionalInfoRef}
                    onChange={() => {}} // Empty handler to make React happy
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
                  <button
                    type="button"
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
                  </button>
                  
                  <button
                    type="button"
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
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === Step.Result && generatedMessage && (
            <div>
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

              <div
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
                {/* Simple message display without complex parsing */}
                <div style={{ whiteSpace: "pre-line", lineHeight: 1.7 }}>
                  {generatedMessage.content}
                </div>
                
                <div style={{ 
                  marginTop: "1.5rem", 
                  fontSize: "0.85rem", 
                  color: "rgba(255, 255, 255, 0.6)",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingTop: "1rem"
                }}>
                  <span>For: {formData.recipient}</span>
                  <span>Occasion: {formData.occasion}</span>
                  <span>Tone: {formData.tone}</span>
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <button
                  type="button"
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
                </button>
                
                <button
                  type="button"
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
                </button>

                <button
                  type="button"
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
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { MessageSpark };
