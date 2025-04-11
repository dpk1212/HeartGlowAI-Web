import { useState } from 'react';

interface FormatStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialData?: any;
}

const FormatStep = ({ onNext, onBack, initialData }: FormatStepProps) => {
  const [selectedFormat, setSelectedFormat] = useState(initialData?.format || '');
  const [selectedLength, setSelectedLength] = useState(initialData?.length || '');
  const [formatSpecificOptions, setFormatSpecificOptions] = useState({
    emailSubject: '',
    emojiPreference: 'moderate',
    talkingPoints: 3,
    platform: 'general'
  });

  const formats = [
    { id: 'text', label: 'Text Message', icon: '📱' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'conversation', label: 'In-Person Conversation', icon: '💬' },
    { id: 'card', label: 'Greeting Card', icon: '💌' },
    { id: 'social', label: 'Social Media', icon: '🌐' },
    { id: 'letter', label: 'Letter', icon: '✉️' }
  ];

  const lengths = [
    { id: 'brief', label: 'Brief', description: '1-2 sentences' },
    { id: 'standard', label: 'Standard', description: '1 paragraph' },
    { id: 'detailed', label: 'Detailed', description: '2-3 paragraphs' },
    { id: 'extended', label: 'Extended', description: 'Full letter/email' }
  ];

  const handleSubmit = () => {
    onNext({
      format: {
        type: selectedFormat,
        length: selectedLength,
        ...formatSpecificOptions
      }
    });
  };

  const renderFormatSpecificOptions = () => {
    switch (selectedFormat) {
      case 'email':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Subject
            </label>
            <input
              type="text"
              value={formatSpecificOptions.emailSubject}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                emailSubject: e.target.value
              }))}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter email subject"
            />
          </div>
        );
      case 'text':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emoji Usage
            </label>
            <select
              value={formatSpecificOptions.emojiPreference}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                emojiPreference: e.target.value
              }))}
              className="w-full p-2 border rounded-lg"
            >
              <option value="none">No emojis</option>
              <option value="minimal">Minimal emojis</option>
              <option value="moderate">Moderate emojis</option>
              <option value="frequent">Frequent emojis</option>
            </select>
          </div>
        );
      case 'conversation':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Talking Points
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formatSpecificOptions.talkingPoints}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                talkingPoints: parseInt(e.target.value)
              }))}
              className="w-full p-2 border rounded-lg"
            />
          </div>
        );
      case 'social':
        return (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              value={formatSpecificOptions.platform}
              onChange={(e) => setFormatSpecificOptions(prev => ({
                ...prev,
                platform: e.target.value
              }))}
              className="w-full p-2 border rounded-lg"
            >
              <option value="general">General</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Choose Format & Length
      </h2>

      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Format
          </label>
          <div className="grid grid-cols-2 gap-4">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedFormat === format.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <span className="text-2xl mb-2 block">{format.icon}</span>
                <span className="font-medium">{format.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Length Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Length
          </label>
          <div className="grid grid-cols-2 gap-4">
            {lengths.map((length) => (
              <button
                key={length.id}
                onClick={() => setSelectedLength(length.id)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedLength === length.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <span className="font-medium block">{length.label}</span>
                <span className="text-sm text-gray-500">{length.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Format-Specific Options */}
        {selectedFormat && renderFormatSpecificOptions()}
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
          disabled={!selectedFormat || !selectedLength}
          className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
            !selectedFormat || !selectedLength
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

export default FormatStep; 