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

function extractInsights(content: string, params: MessageGenerationParams): string[] {
  // Generate tailored insights based on the message content and parameters
  const { intent, tone, recipient } = params;
  
  // Base insights that apply to most messages
  const baseInsights = [
    `This message maintains a ${tone} tone that creates an authentic connection`,
    `The personalized content acknowledges your relationship as ${recipient.relationship}`,
    `The language is emotionally intelligent and considerate`
  ];
  
  // Add specific insights based on intent
  let intentInsights: string[] = [];
  
  switch (intent.type) {
    case 'gratitude':
      intentInsights = [
        `Expressing appreciation in a specific way makes the message feel genuine`,
        `This acknowledges their impact without creating obligation`,
        `The message balances warmth with respect for boundaries`
      ];
      break;
    case 'support':
      intentInsights = [
        `Offering support without presuming to know exactly what they need`,
        `The message conveys presence without demanding a response`,
        `The tone provides comfort while respecting their agency`
      ];
      break;
    case 'celebration':
      intentInsights = [
        `Recognizing their achievement with specific praise feels meaningful`,
        `The message focuses on their qualities rather than just outcomes`,
        `The tone balances excitement with sincerity`
      ];
      break;
    case 'reconnection':
      intentInsights = [
        `Opening with warmth helps bridge the gap in communication`,
        `Acknowledging the time apart without dwelling on it creates safety`,
        `The message offers a path forward without pressure`
      ];
      break;
    case 'check-in':
      intentInsights = [
        `The casual tone makes responding feel optional, not obligatory`,
        `Showing interest without prying creates emotional safety`,
        `Offering specific ways to connect makes following up easier`
      ];
      break;
    default:
      intentInsights = [
        `The message clearly communicates your intention in a thoughtful way`,
        `The tone matches the purpose while maintaining emotional intelligence`,
        `The content is focused and specific rather than generic`
      ];
  }
  
  // Select 3 insights, prioritizing intent-specific ones
  // Combine intent insights with base insights and take the first 3
  return [...intentInsights, ...baseInsights].slice(0, 3);
}

/**
 * Generate a mock message without calling OpenAI API
 */
function generateMockMessage(params: MessageGenerationParams): string {
  const { recipient, intent, tone, format } = params;
  
  // Customize greeting based on relationship and tone
  const greetings: Record<string, string[]> = {
    'warm': [`Dear ${recipient.name}`, `My dear ${recipient.name}`, `Dearest ${recipient.name},`],
    'casual': [`Hey ${recipient.name}`, `Hi ${recipient.name}`, `Hello there ${recipient.name},`],
    'sincere': [`${recipient.name},`, `Dear ${recipient.name},`, `My ${recipient.relationship} ${recipient.name},`],
    'playful': [`Hey you!`, `${recipient.name}! 😊`, `Heya ${recipient.name}!`],
    'formal': [`Dear ${recipient.name},`, `${recipient.name},`, `Respected ${recipient.name},`],
    'reflective': [`${recipient.name},`, `Dear ${recipient.name},`, `My ${recipient.relationship} ${recipient.name},`]
  };
  
  // Content templates based on intent
  const contentTemplates: Record<string, string[]> = {
    'check-in': [
      `I've been thinking about you lately and wanted to see how you're doing. It's been a while since we caught up, and I'd love to hear what's been happening in your life.`,
      `Just wanted to reach out and check how things are going with you. I've been reflecting on our relationship as ${recipient.relationship}, and thought I'd send a quick message.`,
      `Life gets busy sometimes, but I wanted to take a moment to connect and see how you're doing. I value having you as my ${recipient.relationship}, and I'd love to hear your updates.`
    ],
    'gratitude': [
      `I wanted to take a moment to express my gratitude for having you in my life. As my ${recipient.relationship}, you bring so much joy and meaning to my days. I appreciate all that you do and who you are.`,
      `I've been reflecting lately on the people who make a difference in my life, and you immediately came to mind. I'm truly grateful for your presence and the way you ${getRelationshipAttribute(recipient.relationship)}.`,
      `Sometimes we don't say it enough, but I wanted you to know how thankful I am for you. Your ${getRelationshipAttribute(recipient.relationship)} means more to me than you might realize.`
    ],
    'support': [
      `I wanted to reach out and let you know that I'm here for you. Whatever you're going through right now, please remember that you don't have to face it alone. As your ${recipient.relationship}, I'm ready to listen, help, or simply be present in whatever way you need.`,
      `I've been thinking about you and wanted to remind you that you have my unwavering support. Life has its challenges, but you have the strength to overcome them, and I'll be right beside you along the way.`,
      `Just a note to say I'm in your corner. We all need support sometimes, and I want you to know that as your ${recipient.relationship}, I'm here for you - whether you need practical help, a listening ear, or just someone to remind you of how capable you are.`
    ],
    'celebration': [
      `I wanted to celebrate your recent achievement with you! What you've accomplished is truly impressive, and I'm so proud to be your ${recipient.relationship}. Your hard work, talent, and perseverance have paid off beautifully.`,
      `Congratulations on your success! It's been wonderful to witness your journey, and this achievement is so well-deserved. As your ${recipient.relationship}, I couldn't be happier for you.`,
      `I'm absolutely thrilled about your recent news! This achievement is a testament to your dedication and abilities. I'm honored to be your ${recipient.relationship} and to celebrate this special moment with you.`
    ],
    'reconnection': [
      `It's been too long since we connected, and I've been thinking about you. I value our relationship as ${recipient.relationship}s, and I'd love to bridge this gap and reconnect. How have you been?`,
      `I've been reflecting on important relationships in my life, and you came to mind immediately. It's been a while since we've been in touch, and I miss having you as part of my life. I'd love to hear how you've been.`,
      `Time has a way of slipping by, but some connections are worth rekindling. I've been thinking about our relationship as ${recipient.relationship}s, and I'd like to reach out and reconnect. Would you be open to catching up?`
    ],
  };
  
  // Closings based on tone
  const closings: Record<string, string[]> = {
    'warm': [`With love,`, `Warmly,`, `With affection,`],
    'casual': [`Talk soon,`, `Cheers,`, `See you around,`],
    'sincere': [`Sincerely,`, `With gratitude,`, `Truly yours,`],
    'playful': [`Until next time!`, `Catch you later!`, `With a smile,`],
    'formal': [`Respectfully,`, `Kind regards,`, `Best regards,`],
    'reflective': [`In appreciation,`, `With thought,`, `Contemplatively,`]
  };
  
  // Default to 'sincere' if the tone isn't in our maps
  const defaultTone = 'sincere';
  const greetingOptions = greetings[tone] || greetings[defaultTone];
  const closingOptions = closings[tone] || closings[defaultTone];
  
  // Get appropriate content templates
  const intentKey = intent.type in contentTemplates ? intent.type : 'gratitude';
  const contentOptions = contentTemplates[intentKey];
  
  // Select random options from each array
  const greeting = greetingOptions[Math.floor(Math.random() * greetingOptions.length)];
  const content = contentOptions[Math.floor(Math.random() * contentOptions.length)];
  const closing = closingOptions[Math.floor(Math.random() * closingOptions.length)];
  
  // Add a personalized opening and closing line
  const openingLine = getOpeningLine(tone, recipient.relationship);
  const closingLine = getClosingLine(tone, intent.type);
  
  // Format message appropriately
  if (format.type === 'email') {
    return `
Subject: ${getEmailSubject(intent.type, recipient.name)}

${greeting}

${openingLine}

${content}

${closingLine}

${closing}
`.trim();
  } else {
    // Default text message format
    return `
${greeting}

${content}

${closingLine}

${closing}
`.trim();
  }
}

// Helper functions to generate varied content
function getRelationshipAttribute(relationship: string): string {
  const attributes: Record<string, string[]> = {
    'friend': ['friendship', 'loyalty', 'understanding', 'shared laughter'],
    'partner': ['love', 'companionship', 'support', 'partnership'],
    'family': ['love', 'support', 'understanding', 'presence'],
    'colleague': ['collaboration', 'professionalism', 'support', 'insights'],
    'mentor': ['guidance', 'wisdom', 'support', 'belief in me'],
    'mentee': ['eagerness to learn', 'fresh perspective', 'growth', 'questions that make me think'],
    'acquaintance': ['occasional conversations', 'perspectives', 'connection', 'presence'],
  };
  
  // Get attributes for this relationship, or use default
  const relationshipLower = relationship.toLowerCase();
  const options = attributes[relationshipLower] || ['presence in my life', 'unique perspective', 'role in my life'];
  
  return options[Math.floor(Math.random() * options.length)];
}

function getOpeningLine(tone: string, relationship: string): string {
  const options: string[] = [
    `I hope this message finds you well.`,
    `I've been thinking about our relationship as ${relationship}s lately.`,
    `Something prompted me to reach out to you today.`,
    `I wanted to take a moment to connect with you.`
  ];
  
  return options[Math.floor(Math.random() * options.length)];
}

function getClosingLine(tone: string, intent: string): string {
  const options: Record<string, string[]> = {
    'gratitude': [
      `Thank you again for being you.`,
      `I'm so grateful for your presence in my life.`,
      `Your impact on my life deserves recognition.`
    ],
    'support': [
      `Remember, I'm here whenever you need me.`,
      `Please don't hesitate to reach out if you need anything.`,
      `I believe in your strength, but I'm here to support you too.`
    ],
    'celebration': [
      `Here's to your continued success!`,
      `I look forward to celebrating more of your achievements.`,
      `You should be incredibly proud of yourself.`
    ],
    'reconnection': [
      `I'd love to hear from you when you have time.`,
      `Perhaps we could catch up properly sometime soon?`,
      `I hope we can reconnect and rebuild our relationship.`
    ],
    'check-in': [
      `Looking forward to hearing how you've been.`,
      `I'd love to catch up properly when you have time.`,
      `No pressure to respond immediately, but I'd love to hear from you.`
    ]
  };
  
  // Get closings for this intent, or use default
  const closings = options[intent] || [
    `Looking forward to connecting with you again soon.`,
    `Wishing you well in all things.`,
    `Until next time, take care of yourself.`
  ];
  
  return closings[Math.floor(Math.random() * closings.length)];
}

function getEmailSubject(intent: string, name: string): string {
  const subjects: Record<string, string[]> = {
    'gratitude': [`A note of thanks`, `Gratitude for you, ${name}`, `Appreciating our connection`],
    'support': [`Thinking of you`, `Here for you`, `Support and encouragement`],
    'celebration': [`Celebrating your success!`, `Congratulations!`, `In recognition of your achievement`],
    'reconnection': [`Reconnecting`, `Reaching out`, `Let's catch up`],
    'check-in': [`Checking in`, `How have you been?`, `Just saying hello`]
  };
  
  const options = subjects[intent] || [`A message for ${name}`, `Reaching out`, `Connecting with you`];
  return options[Math.floor(Math.random() * options.length)];
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
    const insights = extractInsights(content, params);

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
    const insights = extractInsights(content, params);

    return {
      content,
      insights
    };
  } catch (error) {
    console.error('Error generating message directly:', error);
    throw error;
  }
} 