import { useState, useEffect } from 'react';
import { ClipboardDocumentIcon, HeartIcon, LightBulbIcon, ChatBubbleLeftRightIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';
import { generateMessage, saveMessage } from '../../services/messages';
import { LoadingOverlay } from '../../components/TypingIndicator';

interface FormData {
  recipient: string;
  purpose: string;
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
  const [formData, setFormData] = useState<FormData>({
    recipient: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [parsedResult, setParsedResult] = useState<MessageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

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

    // Construct parsed result with fallbacks
    setParsedResult({
      empathy: empathyMatch ? empathyMatch[1].trim() : 'I understand how you feel.',
      insight: insightMatch ? insightMatch[1].trim() : 'This is a common communication challenge.',
      message: messageMatch ? messageMatch[2].trim() : generatedMessage,
      encouragement: encouragementMatch ? encouragementMatch[1].trim() : 'Keep working on your communication.',
    });
  }, [generatedMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateMessage = async () => {
    if (!formData.recipient || !formData.purpose) {
      setError('Please fill in both recipient and purpose fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Starting message generation with user:", user);
      
      // Check if user is authenticated
      if (!user) {
        console.error("User is not authenticated!");
        throw new Error("You must be logged in to generate messages");
      }
      
      console.log("Sending parameters to API");
      
      // Map form data to the expected parameter format in the messages service
      const generatedContent = await generateMessage({
        recipient: formData.recipient,
        relationship: 'Important person', 
        occasion: formData.purpose,
        tone: 'Warm and sincere',
        emotionalState: 'Caring',
        desiredOutcome: 'Connect meaningfully',
        additionalInfo: `Purpose: ${formData.purpose}`
      });
      
      console.log("Received generated content:", generatedContent);
      
      if (!generatedContent) {
        throw new Error("No message was generated. Please try again.");
      }
      
      setGeneratedMessage(generatedContent);
      setShowResult(true);
      
      // Save the message
      await saveMessage({
        recipient: formData.recipient,
        relationship: 'Important person',
        occasion: formData.purpose,
        tone: 'Warm and sincere',
        emotionalState: 'Caring',
        desiredOutcome: 'Connect meaningfully',
        additionalInfo: `Purpose: ${formData.purpose}`,
        message: generatedContent,
        userId: user.uid,
        createdAt: new Date()
      });
      
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
    // Add visual feedback for copy
    alert('Message copied to clipboard!');
  };

  const handleCreateNew = () => {
    setFormData({ recipient: '', purpose: '' });
    setGeneratedMessage('');
    setParsedResult(null);
    setShowResult(false);
    setError(null);
  };

  // Main form view
  const renderForm = () => (
    <>
      <div className="space-y-6">
        <div>
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
            Who is this message for?
          </label>
          <input
            type="text"
            id="recipient"
            name="recipient"
            value={formData.recipient}
            onChange={handleInputChange}
            placeholder="Enter recipient's name"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
            What's the purpose of your message?
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            placeholder="E.g., Birthday wishes, Thank you, Apology, Catching up..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary h-32"
            required
          />
        </div>

        <button
          onClick={handleGenerateMessage}
          disabled={loading || !formData.recipient || !formData.purpose}
          className={`w-full bg-gradient-to-r from-secondary-start to-secondary-end text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 ${
            loading || !formData.recipient || !formData.purpose
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:opacity-90'
          }`}
        >
          <HeartIcon className="h-5 w-5" />
          <span>{loading ? 'Generating...' : 'Generate Message'}</span>
        </button>
      </div>
    </>
  );

  // Result view
  const renderResult = () => (
    <>
      {parsedResult && (
        <div className="space-y-6">
          {/* Message Box */}
          <div className="p-6 rounded-lg bg-gradient-to-r from-secondary-start to-secondary-end text-white shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-white flex items-center">
              <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2" />
              Your Message for {formData.recipient}
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
          
          <div className="flex justify-center mt-4">
            <button
              onClick={handleCreateNew}
              className="bg-white border-2 border-primary text-primary hover:bg-primary/5 py-3 px-6 rounded-lg flex items-center space-x-2 font-medium"
            >
              <HeartIcon className="h-5 w-5" />
              <span>Create New Message</span>
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="max-w-3xl mx-auto relative">
      <LoadingOverlay 
        isLoading={loading} 
        message={"AI is crafting your heartfelt message"} 
      />
      
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <HeartIcon className="h-10 w-10 text-red-500 animate-heartbeat" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">MessageSpark</h1>
        <p className="mt-2 text-gray-600">
          Create the perfect message for any occasion
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
          <p className="flex items-center">
            <XCircleIcon className="h-5 w-5 mr-2" />
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

      <div className="card p-6 md:p-8 bg-white shadow-lg rounded-xl border border-gray-100">
        {!showResult ? renderForm() : renderResult()}
      </div>
    </div>
  );
}; 