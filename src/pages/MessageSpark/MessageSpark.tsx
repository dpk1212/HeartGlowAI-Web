import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  additionalInfo?: string;
}

// Structure for the generated message
interface MessageResult {
  content: string;
  timestamp: Date;
}

// Mock version of the generateMessage function
const generateMessageMock = async (data: MessageFormData): Promise<string> => {
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
  const [formData, setFormData] = useState<MessageFormData>({
    recipient: '',
    relationship: '',
    occasion: '',
    tone: '',
    additionalInfo: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<MessageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      // Call the mock function
      const result = await generateMessageMock(formData);
      
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
      alert('Message copied to clipboard!');
    }
  };
  
  const generateAnotherMessage = () => {
    setCurrentStep(Step.Relationship);
    setGeneratedMessage(null);
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
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Who's this message for?</h2>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="recipient" className="form-label">Recipient's Name</label>
          <input
            id="recipient"
            name="recipient"
            type="text"
            className="form-input"
            placeholder="E.g., Sarah, Mom, John"
            value={formData.recipient}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="relationship" className="form-label">Relationship</label>
          <select
            id="relationship"
            name="relationship"
            className="form-input"
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
        
        <div>
          <label htmlFor="occasion" className="form-label">Occasion or Purpose</label>
          <input
            id="occasion"
            name="occasion"
            type="text"
            className="form-input"
            placeholder="E.g., Birthday, Anniversary, Apology"
            value={formData.occasion}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="pt-4">
          <button
            type="button"
            className="btn-primary"
            onClick={goToNextStep}
            disabled={!isStepValid()}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  // Message Details Form Step
  const MessageDetailsStep = () => (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Message Details</h2>
      
      <div className="space-y-5">
        <div>
          <label htmlFor="tone" className="form-label">Tone</label>
          <select
            id="tone"
            name="tone"
            className="form-input"
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
        
        <div>
          <label htmlFor="additionalInfo" className="form-label">Additional Information (Optional)</label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            rows={4}
            className="form-input"
            placeholder="Add any specific details you'd like to include in your message..."
            value={formData.additionalInfo}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            className="btn-secondary"
            onClick={goToPreviousStep}
          >
            Back
          </button>
          
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={handleSubmit}
            disabled={!isStepValid() || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Message'}
          </button>
        </div>
      </div>
    </div>
  );

  // Result Step
  const ResultStep = () => (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Message is Ready!</h2>
        <p className="text-gray-600 mt-2">Created with HeartGlowAI for {formData.recipient}</p>
      </div>
      
      {generatedMessage && (
        <div className="bg-primary-gradient rounded-lg p-6 text-white shadow-lg mb-6">
          <p className="whitespace-pre-line">{generatedMessage.content}</p>
        </div>
      )}
      
      <div className="flex flex-col space-y-3">
        <button
          type="button"
          className="btn-primary"
          onClick={copyToClipboard}
        >
          Copy to Clipboard
        </button>
        
        <button
          type="button"
          className="btn-secondary"
          onClick={generateAnotherMessage}
        >
          Create Another Message
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-gradient pt-16 pb-32">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">MessageSpark</h1>
          <p className="text-white/90 text-center">Create the perfect message for any occasion</p>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-4 -mt-24">
        <div className="bg-white rounded-lg shadow-xl p-8">
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
          {currentStep === Step.Relationship && <RelationshipStep />}
          {currentStep === Step.Message && <MessageDetailsStep />}
          {currentStep === Step.Result && <ResultStep />}
        </div>
      </div>
    </div>
  );
};
