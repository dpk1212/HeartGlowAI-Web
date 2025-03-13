import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HeartIcon, 
  PaperAirplaneIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  ClipboardDocumentIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';

// Define the steps of the message generation process
enum Step {
  Relationship = 0,
  Message = 1,
  Result = 2
}

// Schema for the form
const messageFormSchema = z.object({
  recipient: z.string().min(1, 'Please enter a recipient'),
  relationship: z.string().min(1, 'Please select a relationship type'),
  occasion: z.string().min(1, 'Please enter an occasion'),
  tone: z.string().min(1, 'Please select a tone'),
  additionalInfo: z.string().optional()
});

type MessageFormData = z.infer<typeof messageFormSchema>;

// Structure for the generated message
interface MessageResult {
  content: string;
  timestamp: Date;
}

// Mock version of the generateMessage function to avoid type errors for now
const generateMessageMock = async (data: MessageFormData): Promise<string> => {
  // In a real implementation, this would call the OpenAI service
  // For now, simulate a delay and return a canned response
  return new Promise((resolve) => {
    setTimeout(() => {
      const messages = [
        `Dear ${data.recipient},\n\nI wanted to take a moment to express how much you mean to me. Your presence in my life brings so much joy and warmth. I cherish every moment we spend together.\n\nWith love and affection,\nMe`,
        `Hey ${data.recipient}!\n\nJust thinking about you and wanted to say you're amazing! Hope your ${data.occasion} is as wonderful as you are.\n\nCheers,\nMe`,
        `My dearest ${data.recipient},\n\nAs I sit here thinking about our journey together, I'm filled with gratitude for having you in my life. Your kindness, strength, and love inspire me every day.\n\nForever yours,\nMe`
      ];
      const randomIndex = Math.floor(Math.random() * messages.length);
      resolve(messages[randomIndex]);
    }, 2000); // Simulate a 2-second delay
  });
};

export const MessageSpark = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.Relationship);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<MessageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isValid } 
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageFormSchema),
    mode: 'onChange'
  });

  const formData = watch();
  
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1 as Step);
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1 as Step);
  };

  const onSubmit = async (data: MessageFormData) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Call our mock function instead of the real service for now
      const result = await generateMessageMock(data);
      
      setGeneratedMessage({
        content: result,
        timestamp: new Date()
      });
      
      goToNextStep();
    } catch (err: any) {
      setError('Failed to generate message. Please try again.');
      console.error('Error generating message:', err);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage.content);
      // Could add a toast notification here
    }
  };
  
  const generateAnotherMessage = () => {
    setCurrentStep(Step.Relationship);
    setGeneratedMessage(null);
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  };

  // Loading overlay when generating message
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-heartglow-gradient bg-opacity-90 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <div className="bg-white/10 rounded-xl p-8 max-w-md text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto mb-6"
        >
          <HeartIcon className="h-16 w-16 text-white" />
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-3">Crafting your message...</h3>
        <p className="text-white/90 mb-6">Our AI is creating the perfect words for your special someone</p>
        <div className="flex justify-center space-x-2">
          <motion.div 
            className="h-3 w-3 bg-white rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }}
          />
          <motion.div 
            className="h-3 w-3 bg-white rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.div 
            className="h-3 w-3 bg-white rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
        </div>
      </div>
    </div>
  );

  // Relationship and Recipient Form Step
  const RelationshipStep = () => (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Who's this message for?</h2>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="recipient" className="app-input-label">Recipient's Name</label>
          <input
            id="recipient"
            type="text"
            className={`app-input ${errors.recipient ? 'error' : ''}`}
            placeholder="E.g., Sarah, Mom, John"
            {...register('recipient')}
          />
          {errors.recipient && (
            <p className="app-error-message">{errors.recipient.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="relationship" className="app-input-label">Relationship</label>
          <select
            id="relationship"
            className={`app-input ${errors.relationship ? 'error' : ''}`}
            {...register('relationship')}
          >
            <option value="">Select relationship</option>
            <option value="romantic_partner">Romantic Partner</option>
            <option value="spouse">Spouse</option>
            <option value="family_member">Family Member</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
            <option value="acquaintance">Acquaintance</option>
          </select>
          {errors.relationship && (
            <p className="app-error-message">{errors.relationship.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="occasion" className="app-input-label">Occasion or Purpose</label>
          <input
            id="occasion"
            type="text"
            className={`app-input ${errors.occasion ? 'error' : ''}`}
            placeholder="E.g., Birthday, Anniversary, Apology"
            {...register('occasion')}
          />
          {errors.occasion && (
            <p className="app-error-message">{errors.occasion.message}</p>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="button"
            className="app-btn-primary"
            onClick={goToNextStep}
            disabled={!formData.recipient || !formData.relationship || !formData.occasion}
          >
            Continue
            <ArrowRightIcon className="h-5 w-5 ml-2 inline" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Message Details Form Step
  const MessageDetailsStep = () => (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Message Details</h2>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="tone" className="app-input-label">Tone</label>
          <select
            id="tone"
            className={`app-input ${errors.tone ? 'error' : ''}`}
            {...register('tone')}
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
          {errors.tone && (
            <p className="app-error-message">{errors.tone.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="additionalInfo" className="app-input-label">Additional Information (Optional)</label>
          <textarea
            id="additionalInfo"
            rows={4}
            className="app-input"
            placeholder="Add any specific details you'd like to include in your message..."
            {...register('additionalInfo')}
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            className="app-btn-secondary"
            onClick={goToPreviousStep}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 inline" />
            Back
          </button>
          
          <button
            type="button"
            className="app-btn-primary flex-1"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isGenerating}
          >
            {isGenerating ? (
              <div className="app-loading-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <>
                Generate Message
                <PaperAirplaneIcon className="h-5 w-5 ml-2 inline" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Result Step
  const ResultStep = () => (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="text-center mb-6">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="inline-block bg-green-100 p-3 rounded-full mb-4"
        >
          <HeartIcon className="h-8 w-8 text-pink-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800">Your Message is Ready!</h2>
        <p className="text-gray-600 mt-2">Created with HeartGlowAI for {formData.recipient}</p>
      </div>
      
      {generatedMessage && (
        <motion.div 
          className="bg-heartglow-gradient rounded-xl p-6 text-white shadow-lg mb-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute bottom-10 -left-10 w-16 h-16 bg-white/10 rounded-full" />
          
          <p className="whitespace-pre-line relative z-10">{generatedMessage.content}</p>
        </motion.div>
      )}
      
      <div className="flex flex-col space-y-3">
        <button
          type="button"
          className="app-btn-primary flex items-center justify-center"
          onClick={copyToClipboard}
        >
          <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
          Copy to Clipboard
        </button>
        
        <button
          type="button"
          className="app-btn-secondary flex items-center justify-center"
          onClick={generateAnotherMessage}
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Create Another Message
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {isGenerating && <LoadingOverlay />}
      
      <div className="bg-heartglow-gradient pt-16 pb-32">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">MessageSpark</h1>
          <p className="text-white/90 text-center">Create the perfect message for any occasion</p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-4 -mt-24">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-500">
                Step {currentStep + 1} of 3
              </div>
              <div className="text-sm font-medium text-gray-500">
                {currentStep === Step.Relationship ? 'Recipient' : 
                 currentStep === Step.Message ? 'Details' : 'Result'}
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-teal-400 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}
          
          {/* Step content */}
          <AnimatePresence mode="wait">
            {currentStep === Step.Relationship && <RelationshipStep key="step1" />}
            {currentStep === Step.Message && <MessageDetailsStep key="step2" />}
            {currentStep === Step.Result && <ResultStep key="step3" />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
