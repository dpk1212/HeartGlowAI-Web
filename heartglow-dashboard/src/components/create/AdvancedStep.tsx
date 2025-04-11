import { useState } from 'react';

interface AdvancedStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function AdvancedStep({ onNext, onBack }: AdvancedStepProps) {
  const [intensity, setIntensity] = useState(3);
  const [customInstructions, setCustomInstructions] = useState('');

  const handleNext = () => {
    onNext({
      advanced: {
        intensity,
        customInstructions: customInstructions.trim() || null
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Advanced Options
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Intensity (1-5)
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtle</span>
            <span>Balanced</span>
            <span>Intense</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Instructions (Optional)
          </label>
          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="w-full p-2 border rounded-lg"
            rows={4}
            placeholder="Add any specific instructions or preferences..."
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );
} 