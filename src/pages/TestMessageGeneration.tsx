import React, { useState } from 'react';
import { generateMessages, MessageGeneration } from '../services/advancedMessageGeneration';
import StructuredMessageDisplay from '../components/StructuredMessageDisplay';

const TestMessageGeneration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MessageGeneration | null>(null);
  
  // Test request form state
  const [testRequest, setTestRequest] = useState({
    relationship_type: 'romantic_partner',
    communication_scenario: 'I want to express appreciation for their support',
    emotional_intensity: 70,
    recipient_name: 'Alex',
    conversation_name: 'Test Conversation',
    additional_context: 'We have been together for 2 years and recently went through a challenging time where they supported me during a career change.'
  });

  const handleTestGeneration = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Sending test request:', testRequest);
      
      // This will use Firebase Functions securely
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTestRequest(prev => ({
      ...prev,
      [name]: name === 'emotional_intensity' ? parseInt(value) : value
    }));
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
      
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-300 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Secure API Access</h2>
        <p className="mb-4 text-sm text-yellow-800">
          This test page uses Firebase Functions to securely access the OpenAI API. 
          No API keys are used in client-side code.
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Request Configuration</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Relationship Type</label>
            <input
              type="text"
              name="relationship_type"
              value={testRequest.relationship_type}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Communication Scenario</label>
            <input
              type="text"
              name="communication_scenario"
              value={testRequest.communication_scenario}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Emotional Intensity (0-100)</label>
            <input
              type="range"
              name="emotional_intensity"
              min="0"
              max="100"
              value={testRequest.emotional_intensity}
              onChange={handleInputChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs">
              <span>Subtle (0)</span>
              <span>Moderate (50)</span>
              <span>Intense (100)</span>
            </div>
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Recipient Name</label>
            <input
              type="text"
              name="recipient_name"
              value={testRequest.recipient_name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Additional Context</label>
            <textarea
              name="additional_context"
              value={testRequest.additional_context}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
      
      <button
        onClick={handleTestGeneration}
        disabled={loading}
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Messages'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-md">
          <h3 className="font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generation Results</h2>
          
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