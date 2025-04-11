// Mock message generator for HeartGlow AI

export interface MessageGenerationParams {
  recipient: {
    name: string;
    relationship: string;
    otherRelationship?: string;
  };
  intent: {
    type: string;
    custom?: string;
  };
  format: {
    type: string;
    length: string;
    options?: Record<string, any>;
  };
  tone: string;
  advanced?: {
    intensity: number;
    customInstructions?: string;
  };
}

// Helper functions first, so they're defined before being used
function buildPrompt(params: MessageGenerationParams): string {
  const {
    recipient,
    intent,
    format,
    tone,
    advanced
  } = params;

  let prompt = `Create a ${format.length} message for ${recipient.name} (${recipient.relationship}).\n\n`;
  prompt += `Intent: ${intent.custom || intent.type}\n`;
  prompt += `Tone: ${tone}\n`;
  prompt += `Format: ${format.type}\n`;

  if (advanced?.intensity) {
    prompt += `Intensity level: ${advanced.intensity}/5\n`;
  }

  if (advanced?.customInstructions) {
    prompt += `Additional instructions: ${advanced.customInstructions}\n`;
  }

  prompt += "\nPlease generate a thoughtful, personalized message that feels authentic and appropriate for this relationship.";

  return prompt;
}

function extractInsights(content: string): string[] {
  // This is a simple implementation - in production, you might want to use
  // a more sophisticated approach to extract insights
  const insights = [
    "Message maintains appropriate tone throughout",
    "Content is personalized to the recipient",
    "Emotional intelligence is demonstrated"
  ];
  return insights;
}

/**
 * Generate a mock message without calling OpenAI API
 */
function generateMockMessage(params: MessageGenerationParams): string {
  const { recipient, intent, tone } = params;
  
  const greetings = [
    `Dear ${recipient.name}`,
    `Hi ${recipient.name}`,
    `Hello ${recipient.name}`,
  ];
  
  const midSections = [
    `I wanted to reach out to you as my ${recipient.relationship} to express how much you mean to me.`,
    `I'm thinking of you today and wanted to share my thoughts.`,
    `I value our relationship so much and wanted to take a moment to tell you why.`,
  ];
  
  const closings = [
    `With love and appreciation,`,
    `Warmly,`,
    `Thinking of you,`,
    `With gratitude,`,
  ];
  
  const toneAdjectives: Record<string, string> = {
    'warm': 'heartfelt',
    'professional': 'respectful',
    'casual': 'relaxed',
    'humorous': 'lighthearted',
    'sincere': 'genuine',
    'formal': 'dignified'
  };
  
  // Default to 'thoughtful' if the tone isn't in our map
  const adjective = toneAdjectives[tone] || 'thoughtful';
  
  // Ensure there's a value for intentText
  const intentText = intent.custom || intent.type || 'this occasion';
  
  // Generate the message with selection from arrays
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  const midSection = midSections[Math.floor(Math.random() * midSections.length)];
  const closing = closings[Math.floor(Math.random() * closings.length)];
  
  // Build specific content based on intent type
  let intentContent = '';
  if (intent.type === 'appreciation') {
    intentContent = 'Thank you for being you and for all that you bring to my life.';
  } else if (intent.type === 'celebration') {
    intentContent = 'Congratulations on your achievements and success!';
  } else if (intent.type === 'support') {
    intentContent = 'I want you to know that I\'m here for you, no matter what.';
  } else {
    intentContent = 'I appreciate having you in my life.';
  }

  // Build the final message
  return `
${greeting},

${midSection}

I wanted to share this ${adjective} message with you for ${intentText}. Your presence in my life brings joy and meaning, and I appreciate all that you do.

${intentContent}

${closing}
`.trim();
}

// Main exported functions
export async function generateMessage(params: MessageGenerationParams): Promise<{
  content: string;
  insights: string[];
}> {
  try {
    const prompt = buildPrompt(params);
    console.log("Generating message with prompt:", prompt);
    
    // Use the mock generator
    const content = generateMockMessage(params);
    const insights = extractInsights(content);

    return {
      content,
      insights
    };
  } catch (error) {
    console.error('Error generating message:', error);
    throw error;
  }
}

// Fallback function that uses the same mock generator
export async function generateMessageDirect(params: MessageGenerationParams): Promise<{
  content: string;
  insights: string[];
}> {
  try {
    const prompt = buildPrompt(params);
    
    // Use the mock message generator
    console.log("Generating direct message with prompt:", prompt);
    const content = generateMockMessage(params);
    const insights = extractInsights(content);

    return {
      content,
      insights
    };
  } catch (error) {
    console.error('Error generating message directly:', error);
    throw error;
  }
} 