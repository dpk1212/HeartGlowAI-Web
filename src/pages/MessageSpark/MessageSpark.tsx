import { useState, useEffect } from 'react';
import { ClipboardDocumentIcon, HeartIcon, LightBulbIcon, CheckCircleIcon, ChatBubbleLeftRightIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { createMessage, generateMessage, saveMessage } from '../../services/messages';
import { LoadingOverlay } from '../../components/TypingIndicator';

type Step = 'type' | 'status' | 'challenges' | 'emotions' | 'outcomes' | 'message' | 'result';

interface FormData {
  relationshipType: string;
  status: string;
  frequency: string;
  challenges: string[];
  message: string;
  emotionalState: string;
  desiredOutcome: string;
}

interface MessageResult {
  empathy: string;
  insight: string;
  message: string;
  encouragement: string;
  badExample?: string;
}

export const MessageSpark = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('type');
  const [formData, setFormData] = useState<FormData>({
    relationshipType: '',
    status: '',
    frequency: '',
    challenges: [],
    message: '',
    emotionalState: '',
    desiredOutcome: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [parsedResult, setParsedResult] = useState<MessageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Parse the generatedMessage into sections
  useEffect(() => {
    if (!generatedMessage) {
      setParsedResult(null);
      return;
    }

    // Attempt to parse the message based on emoji numbering
    const empathyPattern = /1️⃣\s*Empathy\s*&\s*Validation[\s\n]*[-–]*[\s\n]*(.*?)(?=2️⃣|\n\n|$)/is;
    const insightPattern = /2️⃣\s*Insight[\s\n]*[-–]*[\s\n]*(.*?)(?=3️⃣|\n\n|$)/is;
    const messagePattern = /3️⃣\s*([^-\n]*?)[\s\n]*[-–]*[\s\n]*(.*?)(?=4️⃣|\n\n|$)/is;
    const encouragementPattern = /4️⃣\s*Encouragement\s*&\s*Next\s*Steps[\s\n]*[-–]*[\s\n]*(.*?)(?=\n\n|$)/is;

    // Extract content using patterns
    const empathyMatch = empathyPattern.exec(generatedMessage);
    const insightMatch = insightPattern.exec(generatedMessage);
    const messageMatch = messagePattern.exec(generatedMessage);
    const encouragementMatch = encouragementPattern.exec(generatedMessage);

    // Create a negative example (what might have been said)
    const badExample = formData.challenges.length > 0 
      ? generateNegativeExample(formData.challenges, formData.emotionalState)
      : undefined;

    // Construct parsed result with fallbacks
    setParsedResult({
      empathy: empathyMatch ? empathyMatch[1].trim() : 'I understand how you feel.',
      insight: insightMatch ? insightMatch[1].trim() : 'This is a common challenge in relationships.',
      message: messageMatch ? messageMatch[2].trim() : generatedMessage,
      encouragement: encouragementMatch ? encouragementMatch[1].trim() : 'Keep working on your communication.',
      badExample
    });
  }, [generatedMessage, formData]);

  // Generate a negative example based on challenges and emotional state
  const generateNegativeExample = (challenges: string[], emotionalState: string): string => {
    if (challenges.includes('Communication') && emotionalState === 'Frustrated & Angry') {
      return "Why don't you ever listen to me? You never pay attention to what I need!";
    } else if (challenges.includes('Trust')) {
      return "I can't believe you did this again. How am I supposed to trust you?";
    } else if (challenges.includes('Distance')) {
      return "You're always too busy for me. I guess I'm just not a priority.";
    } else if (challenges.includes('Different Expectations')) {
      return "You should know what I want by now. I shouldn't have to explain everything.";
    } else if (emotionalState === 'Sad & Disconnected') {
      return "Nothing is working in this relationship. I don't even know if it's worth trying anymore.";
    } else {
      return "You're being so difficult. This is all your fault.";
    }
  };

  const relationshipTypes = [
    'Romantic Partner',
    'Family Member',
    'Friend',
    'Professional',
  ];

  const statusOptions = [
    'Just Started',
    'Established',
    'Long Term',
    'Complicated',
  ];

  const frequencyOptions = [
    'Daily',
    'Weekly',
    'Monthly',
    'Occasional',
  ];

  const challengeOptions = [
    'Communication',
    'Trust',
    'Distance',
    'Time Management',
    'Different Expectations',
    'Cultural Differences',
  ];

  const emotionalStateOptions = [
    'Frustrated & Angry',
    'Anxious & Overwhelmed',
    'Sad & Disconnected',
    'Hopeful & Motivated',
    'Confused & Unsure',
    'Grateful & Appreciative'
  ];

  const desiredOutcomeOptions = [
    'Resolve Conflict & Restore Peace',
    'Get Emotional Support',
    'Express Appreciation or Affection',
    'Understand the Other Person Better',
    'Reconnect & Strengthen the Bond',
    'Share Important News or Updates'
  ];

  const handleNext = () => {
    const steps: Step[] = ['type', 'status', 'challenges', 'emotions', 'outcomes', 'message', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['type', 'status', 'challenges', 'emotions', 'outcomes', 'message', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleGenerateMessage = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Starting message generation with user:", user);
      
      // Check if user is authenticated
      if (!user) {
        console.error("User is not authenticated!");
        throw new Error("You must be logged in to generate messages");
      }
      
      console.log("Sending parameters to API:", {
        recipient: formData.relationshipType,
        relationship: formData.status,
        occasion: "Relationship communication",
        tone: formData.emotionalState,
        emotionalState: formData.emotionalState,
        desiredOutcome: formData.desiredOutcome,
        additionalInfo: `Frequency: ${formData.frequency}, Challenges: ${formData.challenges.join(', ')}, Additional context: ${formData.message}`
      });
      
      // Map form data to the expected parameter format in the messages service
      const generatedContent = await generateMessage({
        recipient: formData.relationshipType, // Map relationship type to recipient
        relationship: formData.status, // Map status to relationship
        occasion: "Relationship communication", // Default occasion
        tone: formData.emotionalState, // Map emotional state to tone
        emotionalState: formData.emotionalState,
        desiredOutcome: formData.desiredOutcome,
        additionalInfo: `Frequency: ${formData.frequency}, Challenges: ${formData.challenges.join(', ')}, Additional context: ${formData.message}`
      });
      
      console.log("Received generated content:", generatedContent);
      
      if (!generatedContent) {
        throw new Error("No message was generated. Please try again.");
      }
      
      setGeneratedMessage(generatedContent);
      setCurrentStep('result');
    } catch (error) {
      console.error('Error generating message:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = () => {
    if (parsedResult) {
      navigator.clipboard.writeText(parsedResult.message);
    } else {
      navigator.clipboard.writeText(generatedMessage);
    }
    // TODO: Add toast notification
  };

  const handleSaveMessage = async () => {
    if (!generatedMessage) return;
    
    setLoading(true);
    
    try {
      // Use the saveMessage function from the service
      await saveMessage({
        recipient: formData.relationshipType,
        relationship: formData.status,
        occasion: "Relationship communication",
        tone: formData.emotionalState,
        emotionalState: formData.emotionalState,
        desiredOutcome: formData.desiredOutcome,
        additionalInfo: `Frequency: ${formData.frequency}, Challenges: ${formData.challenges.join(', ')}, Additional context: ${formData.message}`,
        message: parsedResult ? parsedResult.message : generatedMessage,
        userId: user?.uid || '',
        createdAt: new Date()
      });
      
      // Show success message or notification
      console.log('Message saved successfully!');
    } catch (error) {
      console.error('Error saving message:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'type':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Choose Relationship Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {relationshipTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFormData({ ...formData, relationshipType: type });
                    handleNext();
                  }}
                  className={`p-4 rounded-lg border-2 text-left hover:border-primary transition-colors ${
                    formData.relationshipType === type
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        );

      case 'status':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Relationship Status</h2>
            <div className="grid grid-cols-2 gap-4">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFormData({ ...formData, status });
                    handleNext();
                  }}
                  className={`p-4 rounded-lg border-2 text-left hover:border-primary transition-colors ${
                    formData.status === status
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Communication Frequency</h3>
              <div className="grid grid-cols-2 gap-4">
                {frequencyOptions.map((frequency) => (
                  <button
                    key={frequency}
                    onClick={() => {
                      setFormData({ ...formData, frequency });
                    }}
                    className={`p-4 rounded-lg border-2 text-left hover:border-primary transition-colors ${
                      formData.frequency === frequency
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200'
                    }`}
                  >
                    {frequency}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'challenges':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Select Challenges</h2>
            <p className="text-gray-600">Choose the challenges you'd like to address</p>
            <div className="grid grid-cols-2 gap-4">
              {challengeOptions.map((challenge) => (
                <button
                  key={challenge}
                  onClick={() => {
                    const challenges = formData.challenges.includes(challenge)
                      ? formData.challenges.filter((c) => c !== challenge)
                      : [...formData.challenges, challenge];
                    setFormData({ ...formData, challenges });
                  }}
                  className={`p-4 rounded-lg border-2 text-left hover:border-primary transition-colors ${
                    formData.challenges.includes(challenge)
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  {challenge}
                </button>
              ))}
            </div>
          </div>
        );

      case 'emotions':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Emotional State</h2>
            <p className="text-gray-600">How are you feeling about this relationship?</p>
            <div className="grid grid-cols-2 gap-4">
              {emotionalStateOptions.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => {
                    setFormData({ ...formData, emotionalState: emotion });
                    handleNext();
                  }}
                  className={`p-4 rounded-lg border-2 text-left hover:border-primary transition-colors ${
                    formData.emotionalState === emotion
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        );

      case 'outcomes':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Desired Outcome</h2>
            <p className="text-gray-600">What would you like to achieve?</p>
            <div className="grid grid-cols-2 gap-4">
              {desiredOutcomeOptions.map((outcome) => (
                <button
                  key={outcome}
                  onClick={() => {
                    setFormData({ ...formData, desiredOutcome: outcome });
                    handleNext();
                  }}
                  className={`p-4 rounded-lg border-2 text-left hover:border-primary transition-colors ${
                    formData.desiredOutcome === outcome
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200'
                  }`}
                >
                  {outcome}
                </button>
              ))}
            </div>
          </div>
        );

      case 'message':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Additional Context</h2>
            <p className="text-gray-600">Add any specific details or context you'd like to include</p>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter any additional context or specific points you'd like to address..."
            />
          </div>
        );

      case 'result':
        if (parsedResult) {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Personalized Message</h2>
              
              {/* Message Box */}
              <div className="p-6 rounded-lg bg-gradient-to-r from-secondary-start to-secondary-end text-white shadow-lg">
                <h3 className="text-xl font-semibold mb-2 text-white flex items-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
                  Heartfelt Message
                </h3>
                <p className="leading-relaxed">{parsedResult.message}</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleCopyMessage}
                    className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg flex items-center transition-colors"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5 mr-1" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Insights Box */}
                <div className="p-5 rounded-lg bg-blue-50 border border-blue-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 text-blue-700 flex items-center">
                    <LightBulbIcon className="h-5 w-5 mr-2" />
                    Insights
                  </h3>
                  <p className="text-blue-800">{parsedResult.empathy}</p>
                  <p className="text-blue-700 mt-2">{parsedResult.insight}</p>
                </div>
                
                {/* Why It Works Box */}
                <div className="p-5 rounded-lg bg-green-50 border border-green-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 text-green-700 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Why This Works
                  </h3>
                  <p className="text-green-800">{parsedResult.encouragement}</p>
                </div>
              </div>
              
              {/* What You Might Have Said Box */}
              {parsedResult.badExample && (
                <div className="p-5 rounded-lg bg-red-50 border border-red-200 shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 text-red-700 flex items-center">
                    <XCircleIcon className="h-5 w-5 mr-2" />
                    What You Might Have Said
                  </h3>
                  <div className="flex items-start">
                    <div className="bg-red-100 p-3 rounded-lg text-red-800 italic">
                      "{parsedResult.badExample}"
                    </div>
                  </div>
                  <p className="text-red-700 mt-3 text-sm">
                    This approach might create defensiveness rather than openness to connection.
                  </p>
                </div>
              )}
              
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleSaveMessage}
                  className="btn-primary flex items-center space-x-2"
                >
                  <HeartIcon className="h-5 w-5" />
                  <span>Save This Message</span>
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Generated Message</h2>
              <div className="p-6 rounded-lg bg-gradient-to-r from-secondary-start to-secondary-end text-white">
                {generatedMessage}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleCopyMessage}
                  className="btn-primary flex items-center space-x-2"
                >
                  <ClipboardDocumentIcon className="h-5 w-5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={handleSaveMessage}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <HeartIcon className="h-5 w-5" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          );
        }
    }
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <LoadingOverlay 
        isLoading={loading} 
        message={currentStep === 'message' ? "AI is crafting your heartfelt message" : "Processing"} 
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">MessageSpark</h1>
        <p className="mt-2 text-gray-600">
          Create heartfelt messages for your important relationships
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
          <button 
            onClick={() => setError(null)} 
            className="text-sm underline mt-2 text-red-700 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="card">
        {renderStep()}

        <div className="mt-8 flex justify-between">
          {currentStep !== 'type' && (
            <button onClick={handleBack} className="btn-primary">
              Back
            </button>
          )}
          {currentStep !== 'result' && (
            <button
              onClick={
                currentStep === 'message' ? handleGenerateMessage : handleNext
              }
              className={`btn-secondary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {currentStep === 'message' ? (
                loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  'Generate Message'
                )
              ) : (
                'Next'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 