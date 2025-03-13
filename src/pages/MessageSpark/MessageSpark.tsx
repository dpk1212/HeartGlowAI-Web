import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageGenerationParams, generateMessage, saveMessage } from '../../services/messages';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { ArrowLeftIcon, PaperAirplaneIcon, ClipboardIcon } from '@heroicons/react/24/outline';

enum Step {
  INPUT_DETAILS = 0,
  MESSAGE_DISPLAY = 1,
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

export const MessageSpark = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.INPUT_DETAILS);
  const [formData, setFormData] = useState<FormData>({
    recipient: '',
    relationship: '',
    occasion: '',
    tone: '',
    additionalContext: '',
    emotionalState: '',
    desiredOutcome: '',
  });
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [parsedMessage, setParsedMessage] = useState<MessageResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const params: MessageGenerationParams = {
        recipient: formData.recipient,
        relationship: formData.relationship,
        occasion: formData.occasion,
        tone: formData.tone,
        additionalContext: formData.additionalContext,
        emotionalState: formData.emotionalState,
        desiredOutcome: formData.desiredOutcome,
      };

      const response = await generateMessage(params);
      setGeneratedMessage(response);

      // Basic parsing - in a real app, you'd want more robust parsing
      setParsedMessage({
        message: response,
      });

      // Save the message
      await saveMessage({
        ...params,
        content: response,
      });

      setCurrentStep(Step.MESSAGE_DISPLAY);
    } catch (err: any) {
      setError(err.message || 'Failed to generate message');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const textToCopy = parsedMessage?.message || generatedMessage;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setCurrentStep(Step.INPUT_DETAILS);
    setGeneratedMessage('');
    setParsedMessage(null);
  };

  return (
    <div className="app-gradient min-h-screen">
      <LoadingOverlay isLoading={loading} message={loading ? "Crafting your perfect message..." : ""} />
      
      <div className="app-container">
        <header className="py-4">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-white mr-2">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-white">Create Message</h1>
          </div>
        </header>

        {currentStep === Step.INPUT_DETAILS ? (
          <div className="app-card">
            <h2 className="text-xl font-bold text-white mb-6">Tell us about your message</h2>
            
            {error && (
              <div className="mb-6 p-3 bg-red-500/20 border border-red-400 rounded-lg">
                <p className="text-white text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Who is this message for?
                </label>
                <input
                  type="text"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  placeholder="Name of recipient"
                  required
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Your relationship to them
                </label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  placeholder="Friend, Partner, Family member, etc."
                  required
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Occasion or purpose
                </label>
                <input
                  type="text"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  placeholder="Birthday, Thank you, Apology, etc."
                  required
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Desired tone
                </label>
                <input
                  type="text"
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  placeholder="Casual, Heartfelt, Professional, etc."
                  required
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Your current feelings (optional)
                </label>
                <input
                  type="text"
                  name="emotionalState"
                  value={formData.emotionalState}
                  onChange={handleChange}
                  placeholder="Grateful, Apologetic, Excited, etc."
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Desired outcome (optional)
                </label>
                <input
                  type="text"
                  name="desiredOutcome"
                  value={formData.desiredOutcome}
                  onChange={handleChange}
                  placeholder="Reconciliation, Express appreciation, etc."
                  className="app-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Additional context (optional)
                </label>
                <textarea
                  name="additionalContext"
                  value={formData.additionalContext}
                  onChange={handleChange}
                  placeholder="Any specific details you'd like to include..."
                  rows={3}
                  className="app-input"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="app-btn-primary"
                >
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  {loading ? 'Generating...' : 'Generate Message'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="app-card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Your Message</h2>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center text-white text-sm bg-white/20 px-3 py-1 rounded-full"
                >
                  <ClipboardIcon className="h-4 w-4 mr-1" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div className="bg-white/20 p-4 rounded-xl">
                <p className="text-white whitespace-pre-wrap">
                  {parsedMessage?.message || generatedMessage}
                </p>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button
                  onClick={resetForm}
                  className="app-btn-secondary"
                >
                  Create Another Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 