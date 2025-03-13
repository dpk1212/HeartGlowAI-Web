import { useState } from 'react';
import { ClipboardDocumentIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

type Step = 'type' | 'status' | 'challenges' | 'message' | 'result';

interface FormData {
  relationshipType: string;
  status: string;
  frequency: string;
  challenges: string[];
  message: string;
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
  });
  const [loading, setLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

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

  const handleNext = () => {
    const steps: Step[] = ['type', 'status', 'challenges', 'message', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['type', 'status', 'challenges', 'message', 'result'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleGenerateMessage = async () => {
    setLoading(true);
    // TODO: Implement actual message generation with AI
    setTimeout(() => {
      setGeneratedMessage(
        "I've been thinking about our relationship and wanted to express how much I value our connection. Despite the challenges we face, I'm committed to making this work and growing together."
      );
      setLoading(false);
      setCurrentStep('result');
    }, 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    // TODO: Add toast notification
  };

  const handleSaveMessage = () => {
    // TODO: Implement message saving to database
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
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">MessageSpark</h1>
        <p className="mt-2 text-gray-600">
          Create heartfelt messages for your important relationships
        </p>
      </div>

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