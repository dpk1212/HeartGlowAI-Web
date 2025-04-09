import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from './_app';
import { getRouteWithBasePath } from './_app';
import AuthGuard from '../components/AuthGuard';
import Layout from '../components/Layout';
import { fadeIn, itemVariantsY } from '../lib/animations';
import { useConnections } from '../lib/hooks';
import { ConnectionData } from '../lib/firestore';

// Template data structure 
interface Template {
  id: string;
  name: string;
  description: string;
  prompts: string[];
  defaultTone: string;
}

// Sample templates
const templates: Template[] = [
  {
    id: 'reconnect',
    name: 'Reconnect',
    description: 'Rebuild a connection with someone you've lost touch with',
    prompts: [
      'What do you miss about this person?',
      'How long has it been since you last spoke?',
      'What would you like to do together in the future?'
    ],
    defaultTone: 'warm'
  },
  {
    id: 'thankyou',
    name: 'Thank You',
    description: 'Express gratitude for someone who has helped you',
    prompts: [
      'What did this person do for you?',
      'How did their actions make you feel?',
      'What impact did their help have on your life?'
    ],
    defaultTone: 'appreciative'
  },
  {
    id: 'apologize',
    name: 'Apologize',
    description: 'Say sorry in a sincere and thoughtful way',
    prompts: [
      'What happened that you're sorry for?',
      'How do you think it made the other person feel?',
      'What will you do differently in the future?'
    ],
    defaultTone: 'sincere'
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Offer encouragement to someone going through a tough time',
    prompts: [
      'What is this person dealing with right now?',
      'How would you like to support them?',
      'What positive outcome do you hope for them?'
    ],
    defaultTone: 'supportive'
  },
  {
    id: 'celebrate',
    name: 'Celebrate',
    description: 'Recognize someone's achievement or special day',
    prompts: [
      'What are you celebrating?',
      'Why is this achievement meaningful?',
      'What qualities helped them succeed?'
    ],
    defaultTone: 'enthusiastic'
  },
  {
    id: 'request',
    name: 'Request',
    description: 'Ask for something in a thoughtful, considerate way',
    prompts: [
      'What are you asking for?',
      'Why is this important to you?',
      'How might this request impact the other person?'
    ],
    defaultTone: 'respectful'
  }
];

export default function CreateMessage() {
  const router = useRouter();
  const { templateId, connectionId } = router.query;
  const { user, loading: userLoading } = useAuth();
  const { connections, loading: connectionsLoading } = useConnections();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionData | null>(null);
  
  // Handle initial template selection from URL
  useEffect(() => {
    if (templateId && typeof templateId === 'string') {
      const template = templates.find(t => t.id === templateId.toLowerCase());
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [templateId]);
  
  // Handle initial connection selection from URL
  useEffect(() => {
    if (connectionId && typeof connectionId === 'string' && connections) {
      const connection = connections.find(c => c.id === connectionId);
      if (connection) {
        setSelectedConnection(connection);
      }
    }
  }, [connectionId, connections]);
  
  // If user is not authenticated, redirect to login
  useEffect(() => {
    if (!userLoading && !user) {
      router.push(getRouteWithBasePath('/login'));
    }
  }, [user, userLoading, router]);

  // Handle template selection
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };
  
  // Handle connection selection
  const handleSelectConnection = (connection: ConnectionData) => {
    setSelectedConnection(connection);
  };
  
  // Loading state
  if (userLoading || connectionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-heartglow-pink to-heartglow-violet">
            HeartGlow AI
          </h1>
          <p className="mt-2 text-center">Loading message creator...</p>
        </div>
      </div>
    );
  }
  
  // Render template selection if no template selected
  if (!selectedTemplate) {
    return (
      <AuthGuard>
        <Layout title="Create a Message | HeartGlow AI">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Choose a Template</h1>
                <p className="text-heartglow-deepgray dark:text-heartglow-softgray">
                  Select a starting point for your message
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    variants={itemVariantsY}
                    custom={index}
                    className="card cursor-pointer hover:shadow-glow transition-all duration-300"
                    onClick={() => handleSelectTemplate(template)}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <h2 className="text-lg font-medium mb-2">{template.name}</h2>
                    <p className="text-sm text-heartglow-deepgray dark:text-heartglow-softgray">
                      {template.description}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <button
                  className="heartglow-button-outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        </Layout>
      </AuthGuard>
    );
  }
  
  // If we have a template but no connection, show connection selection
  if (!selectedConnection) {
    return (
      <AuthGuard>
        <Layout title={`${selectedTemplate.name} Message | HeartGlow AI`}>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <button
                  className="text-heartglow-indigo hover:underline mb-4 flex items-center"
                  onClick={() => setSelectedTemplate(null)}
                >
                  ← Choose different template
                </button>
                
                <h1 className="text-3xl font-bold mb-4">{selectedTemplate.name} Message</h1>
                <p className="text-heartglow-deepgray dark:text-heartglow-softgray mb-6">
                  {selectedTemplate.description}
                </p>
                
                <div className="mb-8">
                  <h2 className="text-xl font-medium mb-4">Who is this message for?</h2>
                  
                  {connections && connections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {connections.map((connection, index) => (
                        <motion.div
                          key={connection.id}
                          variants={itemVariantsY}
                          custom={index}
                          className="card cursor-pointer hover:shadow-md transition-all duration-300"
                          onClick={() => handleSelectConnection(connection)}
                          whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        >
                          <h3 className="font-medium">{connection.name}</h3>
                          <p className="text-sm text-heartglow-deepgray dark:text-heartglow-softgray">
                            {connection.relationship}
                          </p>
                        </motion.div>
                      ))}
                      
                      <motion.div
                        variants={itemVariantsY}
                        custom={connections.length}
                        className="card border border-dashed border-heartglow-softgray dark:border-heartglow-deepgray flex items-center justify-center cursor-pointer hover:border-heartglow-indigo transition-colors duration-300"
                        onClick={() => router.push('/connections/new')}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      >
                        <div className="text-center">
                          <p className="text-sm font-medium text-heartglow-indigo">+ Add New Connection</p>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="card border border-dashed border-heartglow-softgray dark:border-heartglow-deepgray p-6 text-center">
                      <p className="text-heartglow-deepgray dark:text-heartglow-softgray mb-4">
                        You haven't added any connections yet.
                      </p>
                      <button
                        className="heartglow-button-outline"
                        onClick={() => router.push('/connections/new')}
                      >
                        + Add Your First Connection
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <button 
                    className="text-sm text-heartglow-indigo hover:underline"
                    onClick={() => {
                      // Allow user to continue without a connection (skip this step)
                      setSelectedConnection({
                        id: 'custom',
                        name: '',
                        relationship: 'other'
                      });
                    }}
                  >
                    Or continue without selecting a connection
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </Layout>
      </AuthGuard>
    );
  }
  
  // Once we have both template and connection, show the message creation form
  // For now, this is just a placeholder - we'll implement the full form in the next phase
  return (
    <AuthGuard>
      <Layout title={`Create ${selectedTemplate.name} Message | HeartGlow AI`}>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <button
                className="text-heartglow-indigo hover:underline mb-4 flex items-center"
                onClick={() => setSelectedConnection(null)}
              >
                ← Choose different recipient
              </button>
              
              <h1 className="text-3xl font-bold mb-2">
                {selectedTemplate.name} Message
              </h1>
              
              <p className="text-lg mb-6">
                {selectedConnection.id !== 'custom' 
                  ? `To: ${selectedConnection.name}`
                  : 'To: Custom recipient'}
              </p>
              
              <div className="card mb-8">
                <h2 className="text-xl font-medium mb-4">Coming Soon!</h2>
                <p className="text-heartglow-deepgray dark:text-heartglow-softgray mb-4">
                  The message creation form will be implemented in the next phase.
                </p>
                <p className="text-heartglow-deepgray dark:text-heartglow-softgray mb-4">
                  You selected the "{selectedTemplate.name}" template 
                  {selectedConnection.id !== 'custom' 
                    ? ` for ${selectedConnection.name}`
                    : ''}
                </p>
                <button
                  className="heartglow-button"
                  onClick={() => router.push('/dashboard')}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </Layout>
    </AuthGuard>
  );
} 