import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageGenerationParams, generateMessage, saveMessage } from '../../services/messages';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { 
  ArrowLeftIcon, 
  PaperAirplaneIcon, 
  ClipboardIcon,
  HeartIcon,
  SparklesIcon,
  CheckIcon,
  UserIcon,
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleBottomCenterTextIcon,
  FaceSmileIcon,
  StarIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';

enum Step {
  RELATIONSHIP_TYPE = 0,
  OCCASION = 1,
  TONE = 2,
  CONTEXT = 3,
  MESSAGE_DISPLAY = 4,
}

export interface MessageResult {
  message: string;
  insight?: string;
  explanation?: string;
}

interface FormData {
  recipient: string;
  relationship: string;
  occasion: string;
  tone: string;
  additionalContext: string;
  emotionalState: string;
  desiredOutcome: string;
}

const relationshipOptions = [
  { value: 'partner', label: 'Partner/Spouse', icon: HeartIcon },
  { value: 'friend', label: 'Friend', icon: UserGroupIcon },
  { value: 'family', label: 'Family Member', icon: UserIcon },
  { value: 'colleague', label: 'Colleague', icon: UserGroupIcon },
];

const occasionOptions = [
  { value: 'birthday', label: 'Birthday', icon: CalendarIcon },
  { value: 'anniversary', label: 'Anniversary', icon: HeartIcon },
  { value: 'apology', label: 'Apology', icon: FaceSmileIcon },
  { value: 'congratulations', label: 'Congratulations', icon: StarIcon },
  { value: 'thank-you', label: 'Thank You', icon: SparklesIcon },
  { value: 'other', label: 'Other', icon: DocumentTextIcon },
];

const toneOptions = [
  { value: 'casual', label: 'Casual & Friendly' },
  { value: 'heartfelt', label: 'Heartfelt & Emotional' },
  { value: 'professional', label: 'Professional & Formal' },
  { value: 'humorous', label: 'Funny & Lighthearted' },
  { value: 'romantic', label: 'Romantic & Loving' },
];

export const MessageSpark = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.RELATIONSHIP_TYPE);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [parsedMessage, setParsedMessage] = useState<MessageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      recipient: '',
      relationship: '',
      occasion: '',
      tone: 'heartfelt',
      additionalContext: '',
      emotionalState: '',
      desiredOutcome: '',
    }
  });
  
  const formValues = watch();
  
  // Simulate typing effect for generated message
  useEffect(() => {
    if (currentStep === Step.MESSAGE_DISPLAY && !isTyping && generatedMessage) {
      setIsTyping(true);
      const messageEl = messageRef.current;
      if (messageEl) {
        messageEl.textContent = '';
        let i = 0;
        const typingInterval = setInterval(() => {
          if (i < generatedMessage.length) {
            messageEl.textContent += generatedMessage.charAt(i);
            i++;
          } else {
            clearInterval(typingInterval);
          }
        }, 30);
        
        return () => clearInterval(typingInterval);
      }
    }
  }, [currentStep, generatedMessage]);
  
  const nextStep = () => {
    setCurrentStep(prev => (prev + 1) as Step);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => (prev - 1) as Step);
  };
  
  const onSubmit = async (data: FormData) => {
    if (currentStep < Step.MESSAGE_DISPLAY - 1) {
      nextStep();
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const params: MessageGenerationParams = {
        recipient: data.recipient,
        relationship: data.relationship,
        occasion: data.occasion,
        tone: data.tone,
        additionalContext: data.additionalContext,
        emotionalState: data.emotionalState,
        desiredOutcome: data.desiredOutcome,
      };

      // This would normally call an API
      // Just simulating a response for the demo
      setTimeout(() => {
        const response = `Dear ${data.recipient},\n\nI wanted to take a moment to express how much your friendship means to me. You've been there for me through thick and thin, and I'm truly grateful for your presence in my life.\n\nThank you for your constant support and all the wonderful memories we've created together. I treasure our relationship and look forward to many more years of friendship.\n\nWith sincere appreciation,\n[Your Name]`;
        
        setGeneratedMessage(response);
        setParsedMessage({
          message: response,
        });
        setCurrentStep(Step.MESSAGE_DISPLAY);
        setLoading(false);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to generate message');
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = parsedMessage?.message || generatedMessage;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  const resetForm = () => {
    setCurrentStep(Step.RELATIONSHIP_TYPE);
    setGeneratedMessage('');
    setParsedMessage(null);
    setIsTyping(false);
  };
  
  const generateAnother = () => {
    setLoading(true);
    
    // Simulate generating another message
    setTimeout(() => {
      const newResponse = `Hi ${formValues.recipient},\n\nI hope this message finds you well. I've been thinking about you lately and wanted to reach out to tell you how much I value our ${formValues.relationship}. Your kindness and support have meant the world to me.\n\nWishing you all the best,\n[Your Name]`;
      
      setGeneratedMessage(newResponse);
      setParsedMessage({
        message: newResponse,
      });
      setIsTyping(false);
      setLoading(false);
    }, 1500);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        {[...Array(4)].map((_, index) => (
          <div 
            key={index} 
            className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
              index === currentStep && currentStep < 4 
                ? 'bg-white scale-125' 
                : index < currentStep && currentStep < 4
                  ? 'bg-white/80' 
                  : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case Step.RELATIONSHIP_TYPE:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white text-center">Who are you writing to?</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Recipient's Name
                </label>
                <div className="app-input-icon-wrapper">
                  <input
                    type="text"
                    placeholder="Name of recipient"
                    className={`app-input app-input-with-icon ${errors.recipient ? 'ring-2 ring-red-500' : ''}`}
                    {...register('recipient', { required: 'Recipient name is required' })}
                  />
                  <UserIcon className="app-input-icon" />
                  {errors.recipient && <div className="form-error">{errors.recipient.message}</div>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Your Relationship
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {relationshipOptions.map((option) => (
                    <Controller
                      key={option.value}
                      name="relationship"
                      control={control}
                      rules={{ required: 'Please select a relationship' }}
                      render={({ field }) => (
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className={`
                            flex flex-col items-center justify-center p-4 rounded-2xl 
                            ${field.value === option.value ? 'bg-white/30 ring-2 ring-white' : 'bg-white/10'} 
                            cursor-pointer transition-all duration-200
                          `}
                          onClick={() => field.onChange(option.value)}
                        >
                          <option.icon className="h-8 w-8 text-white mb-2" />
                          <span className="text-white text-sm font-medium text-center">{option.label}</span>
                        </motion.div>
                      )}
                    />
                  ))}
                </div>
                {errors.relationship && <div className="form-error mt-2">{errors.relationship.message}</div>}
              </div>
            </div>
          </motion.div>
        );
      
      case Step.OCCASION:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white text-center">What's the occasion?</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {occasionOptions.map((option) => (
                  <Controller
                    key={option.value}
                    name="occasion"
                    control={control}
                    rules={{ required: 'Please select an occasion' }}
                    render={({ field }) => (
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className={`
                          flex flex-col items-center justify-center p-4 rounded-2xl 
                          ${field.value === option.value ? 'bg-white/30 ring-2 ring-white' : 'bg-white/10'} 
                          cursor-pointer transition-all duration-200
                        `}
                        onClick={() => field.onChange(option.value)}
                      >
                        <option.icon className="h-8 w-8 text-white mb-2" />
                        <span className="text-white text-sm font-medium text-center">{option.label}</span>
                      </motion.div>
                    )}
                  />
                ))}
              </div>
              {errors.occasion && <div className="form-error mt-2">{errors.occasion.message}</div>}
              
              {watch('occasion') === 'other' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">
                    Specify occasion
                  </label>
                  <input
                    type="text"
                    placeholder="What's the occasion?"
                    className="app-input"
                    {...register('additionalContext')}
                  />
                </div>
              )}
            </div>
          </motion.div>
        );
      
      case Step.TONE:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white text-center">How would you like it to sound?</h2>
            
            <div className="space-y-4">
              <div className="space-y-3">
                {toneOptions.map((option) => (
                  <Controller
                    key={option.value}
                    name="tone"
                    control={control}
                    render={({ field }) => (
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className={`
                          flex items-center p-4 rounded-2xl 
                          ${field.value === option.value ? 'bg-white/30 ring-2 ring-white' : 'bg-white/10'} 
                          cursor-pointer transition-all duration-200
                        `}
                        onClick={() => field.onChange(option.value)}
                      >
                        <div className="flex-1">
                          <span className="text-white text-base font-medium">{option.label}</span>
                        </div>
                        {field.value === option.value && (
                          <CheckIcon className="h-5 w-5 text-white" />
                        )}
                      </motion.div>
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        );
      
      case Step.CONTEXT:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white text-center">Any additional details?</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Your current feelings (optional)
                </label>
                <input
                  type="text"
                  placeholder="Grateful, Apologetic, Excited, etc."
                  className="app-input"
                  {...register('emotionalState')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Desired outcome (optional)
                </label>
                <input
                  type="text"
                  placeholder="Reconciliation, Express appreciation, etc."
                  className="app-input"
                  {...register('desiredOutcome')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Additional context (optional)
                </label>
                <textarea
                  placeholder="Any specific details you'd like to include..."
                  rows={4}
                  className="app-input"
                  {...register('additionalContext')}
                />
              </div>
            </div>
          </motion.div>
        );
      
      case Step.MESSAGE_DISPLAY:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-bold text-white text-center mb-4">Your Message</h2>
            
            <motion.div 
              className="app-card bg-white/30 p-6 rounded-3xl shadow-lg"
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div 
                ref={messageRef} 
                className="text-white whitespace-pre-line min-h-[200px]"
              >
                {!isTyping && generatedMessage}
              </div>
            </motion.div>
            
            <div className="flex justify-center space-x-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center bg-white/20 text-white px-4 py-3 rounded-xl"
                onClick={copyToClipboard}
              >
                <ClipboardIcon className="h-5 w-5 mr-2" />
                {copied ? 'Copied!' : 'Copy Text'}
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center bg-white/20 text-white px-4 py-3 rounded-xl"
                onClick={generateAnother}
              >
                <SparklesIcon className="h-5 w-5 mr-2" />
                Try Again
              </motion.button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="premium-gradient min-h-screen pb-8">
      <LoadingOverlay isLoading={loading} message={loading ? "Crafting your perfect message..." : ""} />
      
      <div className="app-container">
        <header className="py-4 mb-2">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-white">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold text-white">MessageSpark</h1>
            <div className="w-6"></div> {/* Empty div for flex spacing */}
          </div>
        </header>

        {renderStepIndicator()}

        <div className="app-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
            
            {error && (
              <div className="mt-6 p-3 bg-red-500/20 border border-red-400 rounded-lg">
                <p className="text-white text-sm">{error}</p>
              </div>
            )}

            {currentStep !== Step.MESSAGE_DISPLAY && (
              <motion.div 
                className="flex justify-between mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentStep > 0 ? (
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="app-btn-secondary px-6"
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowUturnLeftIcon className="h-5 w-5 mr-2" />
                    Back
                  </motion.button>
                ) : (
                  <div></div> /* Empty div for flex spacing */
                )}
                
                <motion.button
                  type="submit"
                  className="app-btn-primary px-6"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {currentStep === Step.CONTEXT ? (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      {loading ? 'Generating...' : 'Generate Message'}
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
            
            {currentStep === Step.MESSAGE_DISPLAY && (
              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  type="button"
                  onClick={resetForm}
                  className="text-white/80 hover:text-white font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Start over with a new message
                </motion.button>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}; 