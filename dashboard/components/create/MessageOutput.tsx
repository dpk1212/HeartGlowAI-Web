import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { firebase } from '../../lib/firebase';

interface MessageOutputProps {
  formData: any;
  onBack: () => void;
}

const MessageOutput = ({ formData, onBack }: MessageOutputProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  useEffect(() => {
    generateMessage();
  }, []);

  const generateMessage = async () => {
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(
        'https://us-central1-heartglowai.cloudfunctions.net/generateMessageV2',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            recipient: formData.recipient,
            intent: formData.intent,
            format: formData.format,
            tone: formData.tone,
            advanced: formData.advanced
          })
        }
      );

      const data = await response.json();
      setMessage(data.message);
      setInsights(data.insights);
    } catch (error) {
      console.error('Error generating message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .collection('messages')
        .add({
          content: message,
          recipientName: formData.recipient.name,
          recipientId: formData.recipient.id || null,
          relationship: formData.recipient.relationship,
          intent: formData.intent,
          tone: formData.tone,
          format: formData.format.type,
          length: formData.format.length,
          insights: insights,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  const handleShare = () => {
    setShowShareOptions(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Your Message
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="prose max-w-none mb-8">
            <p className="whitespace-pre-wrap">{message}</p>
          </div>

          <div className="border-t pt-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Why this message works:
            </h3>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Copy Message
            </button>
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSaved ? 'Saved!' : 'Save to History'}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Share
            </button>
          </div>

          {showShareOptions && (
            <div className="mt-4 p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Share Options</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(message);
                    setShowShareOptions(false);
                  }}
                  className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => {
                    window.open(`mailto:?body=${encodeURIComponent(message)}`);
                    setShowShareOptions(false);
                  }}
                  className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Email
                </button>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MessageOutput; 