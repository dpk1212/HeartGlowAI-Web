import { useState } from 'react';

interface ToneStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const ToneStep = ({ onNext, onBack, initialData }: ToneStepProps) => {
  const [selectedTone, setSelectedTone] = useState(initialData?.type || '');
  const [customTone, setCustomTone] = useState(initialData?.custom || '');
  const [showCustom, setShowCustom] = useState(false);

  const tones = [
    { id: 'warm', label: 'Warm', description: 'Friendly and affectionate' },
    { id: 'casual', label: 'Casual', description: 'Relaxed and informal' },
    { id: 'sincere', label: 'Sincere', description: 'Honest and heartfelt' },
    { id: 'playful', label: 'Playful', description: 'Light and fun' },
    { id: 'formal', label: 'Formal', description: 'Professional and respectful' },
    { id: 'reflective', label: 'Reflective', description: 'Thoughtful and introspective' },
    { id: 'custom', label: 'Custom', description: 'Define your own tone' }
  ];

  const handleSubmit = () => {
    onNext({
      tone: {
        type: selectedTone,
        custom: showCustom ? customTone : null
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        What tone would you like to use?
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {tones.map((tone) => (
            <button
              key={tone.id}
              onClick={() => {
                setSelectedTone(tone.id);
                setShowCustom(tone.id === 'custom');
              }}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedTone === tone.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <span className="font-medium block">{tone.label}</span>
              <span className="text-sm text-gray-500">{tone.description}</span>
            </button>
          ))}
        </div>

        {showCustom && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe your desired tone
            </label>
            <input
              type="text"
              value={customTone}
              onChange={(e) => setCustomTone(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="e.g., Encouraging, Empathetic, etc."
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
          disabled={!selectedTone || (showCustom && !customTone)}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            !selectedTone || (showCustom && !customTone)
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

export default ToneStep; 