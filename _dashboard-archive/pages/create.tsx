import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import RecipientStep from '../components/create/RecipientStep';
import IntentStep from '../components/create/IntentStep';
import FormatStep from '../components/create/FormatStep';
import ToneStep from '../components/create/ToneStep';
import AdvancedStep from '../components/create/AdvancedStep';
import MessageOutput from '../components/create/MessageOutput';

const CreatePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient: null,
    intent: null,
    format: null,
    length: null,
    tone: null,
    advanced: null
  });

  const steps = [
    { id: 1, title: 'Recipient & Relationship' },
    { id: 2, title: 'Message Intent' },
    { id: 3, title: 'Format & Length' },
    { id: 4, title: 'Tone' },
    { id: 5, title: 'Advanced Options' }
  ];

  const handleNext = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RecipientStep onNext={handleNext} initialData={formData.recipient} />;
      case 2:
        return <IntentStep onNext={handleNext} onBack={handleBack} initialData={formData.intent} />;
      case 3:
        return <FormatStep onNext={handleNext} onBack={handleBack} initialData={formData.format} />;
      case 4:
        return <ToneStep onNext={handleNext} onBack={handleBack} initialData={formData.tone} />;
      case 5:
        return <AdvancedStep onNext={handleNext} onBack={handleBack} initialData={formData.advanced} />;
      default:
        return <MessageOutput formData={formData} onBack={handleBack} />;
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-2 text-sm font-medium text-gray-700">
                  {step.title}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-1 bg-gray-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreatePage; 