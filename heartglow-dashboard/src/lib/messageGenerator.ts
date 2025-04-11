import { getAuth } from 'firebase/auth';

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

export async function generateMessage(params: MessageGenerationParams): Promise<{
  content: string;
  insights: string[];
}> {
  try {
    // Get user token for authentication
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const idToken = await user.getIdToken();

    // Call the cloud function
    const response = await fetch('https://us-central1-heartglowai.cloudfunctions.net/generateMessageV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.content,
      insights: data.insights || []
    };
  } catch (error) {
    console.error('Error generating message:', error);
    throw error;
  }
}

// Fallback function that uses OpenAI directly if cloud function fails
export async function generateMessageDirect(params: MessageGenerationParams): Promise<{
  content: string;
  insights: string[];
}> {
  try {
    const prompt = buildPrompt(params);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that helps people craft meaningful, personalized messages. Your responses should be warm, thoughtful, and emotionally intelligent."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9
    });

    const content = completion.choices[0]?.message?.content || '';
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