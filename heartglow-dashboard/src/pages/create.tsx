import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import RecipientStep from '../components/create/RecipientStep';
import PurposeToneStep from '../components/create/PurposeToneStep';
import RefineGenerateStep from '../components/create/RefineGenerateStep';
import MessageOutput from '../components/create/MessageOutput';
import { AnimatePresence, motion } from 'framer-motion';

const stepsInfo = [
  { number: 1, label: 'Recipient' },
  { number: 2, label: 'Message Essence' },
  { number: 3, label: 'Delivery & Details' },
];

export default function CreatePage() {
  console.log('>>> CreatePage component rendering started');
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    recipient: null,
    connectionData: null,
    intent: null,
    format: null,
    tone: null,
    promptedBy: '',
    messageGoal: '',
    formalityLevel: 3,
    emotionalDepth: 3,
    customInstructionsText: '',
    customInstructionsOptions: {},
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
    console.log(`>>> Data received from step ${step}:`, data);
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const renderStep = () => {
    console.log(`>>> CreatePage rendering step: ${step}`);
    
    const stepVariants = {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    };

    const currentStepComponent = () => {
      switch (step) {
        case 1: return <RecipientStep onNext={handleNext} initialData={formData.recipient} />;
        case 2: return <PurposeToneStep
                        onNext={handleNext}
                        onBack={handleBack}
                        initialData={{
                          intent: formData.intent,
                          tone: formData.tone,
                          formalityLevel: formData.formalityLevel,
                          emotionalDepth: formData.emotionalDepth,
                          messageGoal: formData.messageGoal
                        }}
                     />;
        case 3: return <RefineGenerateStep
                        onNext={handleNext}
                        onBack={handleBack}
                        initialData={{
                          format: formData.format,
                          promptedBy: formData.promptedBy,
                          customInstructionsText: formData.customInstructionsText,
                          customInstructionsOptions: formData.customInstructionsOptions,
                        }}
                     />;
        case 4: 
          return <MessageOutput 
            recipient={formData.recipient}
            connectionData={formData.connectionData}
            intent={formData.intent}
            format={formData.format}
            tone={formData.tone}
            promptedBy={formData.promptedBy}
            messageGoal={formData.messageGoal}
            formalityLevel={formData.formalityLevel}
            emotionalDepth={formData.emotionalDepth}
            customInstructionsText={formData.customInstructionsText}
            customInstructionsOptions={formData.customInstructionsOptions}
          />;
        default: return null;
      }
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {currentStepComponent()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-heartglow-deepgray dark:to-gray-900 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-heartglow-deepgray text-gray-900 dark:text-gray-100 rounded-xl shadow-xl overflow-hidden p-8 sm:p-10">
          
          {step <= 3 && (
            <div className="mb-10 sm:mb-12">
              <div className="flex items-start justify-between">
                {stepsInfo.map((stepInfo, index) => (
                  <div key={stepInfo.number} className="flex items-center flex-grow justify-center flex-col sm:flex-row">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-1 transition-all duration-300 ${
                          stepInfo.number < step
                            ? 'bg-heartglow-pink text-white shadow-md'
                            : stepInfo.number === step
                            ? 'bg-heartglow-violet text-white scale-110 shadow-lg'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {stepInfo.number}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium transition-colors duration-300 ${
                         stepInfo.number <= step ? 'text-heartglow-charcoal dark:text-heartglow-offwhite' : 'text-gray-400 dark:text-gray-500'
                      }`}>{stepInfo.label}</span>
                    </div>
                    {index < stepsInfo.length - 1 && (
                      <div
                        className={`h-1 flex-grow mx-2 mt-5 hidden sm:block transition-colors duration-300 ${
                          stepInfo.number < step
                            ? 'bg-heartglow-pink'
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderStep()}
        </motion.div>
      </div>
    </div>
  );
} 