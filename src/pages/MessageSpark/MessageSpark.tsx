import { useState } from 'react';
import { MessageGenerationParams, generateMessage, saveMessage } from '../../services/messages';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  PaperAirplaneIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

enum Step {
  INPUT_DETAILS = 0,
  MESSAGE_DISPLAY = 1,
}

export interface MessageResult {
  insight: string;
  explanation: string;
  message: string;
  examples: string;
}

interface FormData {
  recipient: string;
  relationship: string;
  occasion: string;
  tone: string;
  additionalContext: string;
  messageLength: string;
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
    messageLength: 'medium',
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
        messageLength: formData.messageLength,
        emotionalState: formData.emotionalState,
        desiredOutcome: formData.desiredOutcome,
      };

      const response = await generateMessage(params);
      setGeneratedMessage(response);

      // Parse the message into sections
      try {
        const sections = parseMessageSections(response);
        setParsedMessage(sections);
      } catch (err) {
        console.error('Error parsing message sections:', err);
        setParsedMessage(null);
      }

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

  const parseMessageSections = (fullMessage: string): MessageResult => {
    const sections: MessageResult = {
      insight: '',
      explanation: '',
      message: '',
      examples: '',
    };

    // Look for section headers (## Insight, ## Explanation, etc)
    const insightMatch = fullMessage.match(/#+\s*Insight[s]?:?([\s\S]*?)(?=#+\s*|\Z)/i);
    const explanationMatch = fullMessage.match(/#+\s*Explanation:?([\s\S]*?)(?=#+\s*|\Z)/i);
    const messageMatch = fullMessage.match(/#+\s*Message:?([\s\S]*?)(?=#+\s*|\Z)/i);
    const examplesMatch = fullMessage.match(/#+\s*Examples?:?([\s\S]*?)(?=#+\s*|\Z)/i) || 
                          fullMessage.match(/#+\s*Similar Messages?:?([\s\S]*?)(?=#+\s*|\Z)/i);

    sections.insight = insightMatch ? insightMatch[1].trim() : '';
    sections.explanation = explanationMatch ? explanationMatch[1].trim() : '';
    sections.message = messageMatch ? messageMatch[1].trim() : fullMessage;
    sections.examples = examplesMatch ? examplesMatch[1].trim() : '';

    // If we couldn't parse the message into sections, just use the whole message
    if (!sections.message && !messageMatch) {
      sections.message = fullMessage;
    }

    return sections;
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

  // Loading message based on current step
  const getLoadingMessage = () => {
    return currentStep === Step.INPUT_DETAILS
      ? 'Crafting your heartfelt message...'
      : 'Processing your request...';
  };

        return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-teal-400 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-600/30 p-3 rounded-full mr-4">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Message Spark
            </h1>
          </div>
          <p className="text-white/90">
            Create heartfelt messages for your loved ones with the help of AI. Fill in the details below to get started.
          </p>
        </div>

        <LoadingOverlay isLoading={loading} message={getLoadingMessage()} />

        {currentStep === Step.INPUT_DETAILS ? (
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6">Message Details</h2>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-400 rounded-xl">
                <p className="text-white text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-white mb-1">
                    Recipient's Name
                  </label>
                  <input
                    id="recipient"
                    name="recipient"
                    type="text"
                    required
                    value={formData.recipient}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Who is this message for?"
                  />
                </div>

                <div>
                  <label htmlFor="relationship" className="block text-sm font-medium text-white mb-1">
                    Relationship
                  </label>
                  <input
                    id="relationship"
                    name="relationship"
                    type="text"
                    required
                    value={formData.relationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Friend, Partner, Family, etc."
                  />
                </div>

                <div>
                  <label htmlFor="occasion" className="block text-sm font-medium text-white mb-1">
                    Occasion
                  </label>
                  <input
                    id="occasion"
                    name="occasion"
                    type="text"
                    required
                    value={formData.occasion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Birthday, Anniversary, Thank You, etc."
                  />
                </div>

                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-white mb-1">
                    Tone
                  </label>
                  <input
                    id="tone"
                    name="tone"
                    type="text"
                    required
                    value={formData.tone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Warm, Funny, Serious, etc."
                  />
                </div>

                <div>
                  <label htmlFor="emotionalState" className="block text-sm font-medium text-white mb-1">
                    Your Emotional State
                  </label>
                  <input
                    id="emotionalState"
                    name="emotionalState"
                    type="text"
                    value={formData.emotionalState}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Grateful, Apologetic, Excited, etc."
                  />
                </div>

                <div>
                  <label htmlFor="desiredOutcome" className="block text-sm font-medium text-white mb-1">
                    Desired Outcome
                  </label>
                  <input
                    id="desiredOutcome"
                    name="desiredOutcome"
                    type="text"
                    value={formData.desiredOutcome}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Reconnect, Express Love, Resolve Conflict, etc."
                  />
            </div>

                <div className="md:col-span-2">
                  <label htmlFor="messageLength" className="block text-sm font-medium text-white mb-1">
                    Message Length
                  </label>
                  <select
                    id="messageLength"
                    name="messageLength"
                    value={formData.messageLength}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="additionalContext" className="block text-sm font-medium text-white mb-1">
                    Additional Context (Optional)
                  </label>
                  <textarea
                    id="additionalContext"
                    name="additionalContext"
                    rows={4}
                    value={formData.additionalContext}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/30 text-white placeholder-white/70 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Include any specific details or memories you'd like to incorporate"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-blue-600 bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PaperAirplaneIcon className="h-6 w-6 mr-2" />
                  {loading ? 'Generating...' : 'Generate Message'}
                </button>
            </div>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {parsedMessage ? (
              <>
                {parsedMessage.message && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-xl relative">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                      Your Message
                    </h2>
                    <div className="bg-white/20 p-5 rounded-xl mb-4 whitespace-pre-wrap text-white leading-relaxed">
                      {parsedMessage.message}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center px-4 py-2 bg-white/30 hover:bg-white/40 rounded-xl text-white font-medium"
                      >
                        <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                      </button>
                    </div>
                  </div>
                )}

                {parsedMessage.insight && (
                  <div className="bg-blue-500/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Insights</h2>
                    <div className="bg-white/20 p-5 rounded-xl whitespace-pre-wrap text-white leading-relaxed">
                      {parsedMessage.insight}
                    </div>
                  </div>
                )}

                {parsedMessage.explanation && (
                  <div className="bg-teal-500/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Explanation</h2>
                    <div className="bg-white/20 p-5 rounded-xl whitespace-pre-wrap text-white leading-relaxed">
                      {parsedMessage.explanation}
                    </div>
          </div>
                )}

                {parsedMessage.examples && (
                  <div className="bg-purple-500/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-4">Similar Messages</h2>
                    <div className="bg-white/20 p-5 rounded-xl whitespace-pre-wrap text-white leading-relaxed">
                      {parsedMessage.examples}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-4">Generated Message</h2>
                <div className="bg-white/20 p-5 rounded-xl mb-4 whitespace-pre-wrap text-white">
              {generatedMessage}
            </div>
                <div className="flex justify-end">
              <button
                    onClick={copyToClipboard}
                    className="flex items-center px-4 py-2 bg-white/30 hover:bg-white/40 rounded-xl text-white font-medium"
              >
                    <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-white text-blue-600 hover:bg-white/90 font-medium rounded-xl shadow"
              >
                Create Another Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 