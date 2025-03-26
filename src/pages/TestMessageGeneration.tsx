import React, { useState } from 'react';
import { generateMessages, MessageGeneration } from '../services/advancedMessageGeneration';
import StructuredMessageDisplay from '../components/StructuredMessageDisplay';

const TestMessageGeneration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MessageGeneration | null>(null);

  const handleTestGeneration = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Test message generation with sample data
      const testRequest = {
        relationship_type: 'romantic_partner',
        communication_scenario: 'I want to express appreciation for their support',
        emotional_intensity: 70,
        recipient_name: 'Alex',
        conversation_name: 'Test Conversation',
        additional_context: 'We have been together for 2 years and recently went through a challenging time where they supported me during a career change.'
      };
      
      console.log('Sending test request:', testRequest);
      
      const response = await generateMessages(testRequest);
      console.log('Received response:', response);
      
      if ('error' in response) {
        setError(response.details || 'Unknown error occurred');
      } else {
        setResult(response);
      }
    } catch (err: any) {
      console.error('Test generation error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = (message: string) => {
    console.log('Selected message:', message);
  };

  const handleRateMessage = (message: string, rating: number) => {
    console.log('Rated message:', message, 'with', rating);
  };

  const handleModifyMessage = (message: string, modification: string) => {
    console.log('Modified message from:', message, 'to:', modification);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Message Generation</h1>
      
      <button
        onClick={handleTestGeneration}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Test Generation'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
          
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Raw Response</h3>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
          
          <StructuredMessageDisplay
            messageData={result}
            onSelectMessage={handleSelectMessage}
            onRateMessage={handleRateMessage}
            onModifyMessage={handleModifyMessage}
          />
        </div>
      )}
    </div>
  );
};

export default TestMessageGeneration; 