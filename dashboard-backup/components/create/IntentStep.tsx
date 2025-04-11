import { useState } from 'react';

interface IntentStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const IntentStep = ({ onNext, onBack, initialData }: IntentStepProps) => {
  const [selectedIntent, setSelectedIntent] = useState(initialData?.type || '');
  const [customIntent, setCustomIntent] = useState(initialData?.custom || '');
  const [showCustom, setShowCustom] = useState(false);

  const intents = [
    { id: 'thank', label: 'I want to say thank you', emoji: '🙏' },
    { id: 'apology', label: 'I need to apologize', emoji: '😔' },
    { id: 'support', label: 'I want to offer support', emoji: '🤝' },
    { id: 'celebration', label: 'I want to celebrate', emoji: '🎉' },
    { id: 'checkin', label: 'I want to check in', emoji: '💭' },
    { id: 'feedback', label: 'I want to give feedback', emoji: '📝' },
    { id: 'custom', label: 'Something else', emoji: '✍️' }
  ];

  const handleSubmit = () => {
    onNext({
      intent: {
        type: selectedIntent,
        custom: showCustom ? customIntent : null
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        What's the purpose of your message?
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {intents.map((intent) => (
            <button
              key={intent.id}
              onClick={() => {
                setSelectedIntent(intent.id);
                setShowCustom(intent.id === 'custom');
              }}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedIntent === intent.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <span className="text-2xl mb-2 block">{intent.emoji}</span>
              <span className="font-medium">{intent.label}</span>
            </button>
          ))}
        </div>

        {showCustom && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe your message intent
            </label>
            <textarea
              value={customIntent}
              onChange={(e) => setCustomIntent(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="What do you want to say?"
              rows={3}
              required
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedIntent || (showCustom && !customIntent)}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            !selectedIntent || (showCustom && !customIntent)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default IntentStep; 