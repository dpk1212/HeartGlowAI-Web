import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import RecipientStep from '../components/create/RecipientStep';
import IntentStep from '../components/create/IntentStep';
import FormatStep from '../components/create/FormatStep';
import ToneStep from '../components/create/ToneStep';
import AdvancedStep from '../components/create/AdvancedStep';
import MessageOutput from '../components/create/MessageOutput';
import { motion } from 'framer-motion';

export default function CreatePage() {
  console.log('>>> CreatePage component rendering started');
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient: null,
    intent: null,
    format: null,
    tone: null,
    advanced: null
  });

  useEffect(() => {
    if (router.isReady) {
      const { intent: queryIntent, tone: queryTone } = router.query;
      
      if (queryIntent || queryTone) {
        console.log('>>> Query params found:', { queryIntent, queryTone });
        setFormData(prev => ({
          ...prev,
          intent: queryIntent ? { type: queryIntent as string, custom: '' } : prev.intent, 
          tone: queryTone ? queryTone as string : prev.tone
        }));
      }
    }
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-heartglow-pink"></div>
      </div>
    );
  }

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  const handleNext = (data: any) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const renderStep = () => {
    console.log(`>>> CreatePage rendering step: ${step}`);
    switch (step) {
      case 1:
        return <RecipientStep onNext={handleNext} />;
      case 2:
        return <IntentStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <FormatStep onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <ToneStep onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <AdvancedStep onNext={handleNext} onBack={handleBack} />;
      case 6:
        return (
          <MessageOutput
            recipient={formData.recipient}
            intent={formData.intent}
            format={formData.format}
            tone={formData.tone}
            advanced={formData.advanced}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-heartglow-deepgray py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-heartglow-deepgray rounded-lg shadow-sm p-6"
        >
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      stepNumber < step
                        ? 'bg-heartglow-pink text-white'
                        : stepNumber === step
                        ? 'bg-heartglow-violet text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 5 && (
                    <div
                      className={`h-1 w-12 ${
                        stepNumber < step
                          ? 'bg-heartglow-pink'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {renderStep()}
        </motion.div>
      </div>
    </div>
  );
} 