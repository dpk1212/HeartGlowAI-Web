// Application color scheme
export const COLORS = {
  background: '#050A14',
  cardBackground: '#1C1C1E',
  primary: '#0A84FF',
  accent1: '#FF3B7F',
  accent2: '#8862FC', 
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
};

// Relationship types for message generation
export const RELATIONSHIP_TYPES = [
  'Romantic Partner',
  'Friend',
  'Family Member',
  'Professional',
  'Acquaintance'
];

// Message templates
export const MESSAGE_TEMPLATES = [
  { 
    name: 'Apology', 
    iconName: 'close',
    color: '#6A75E8',
    scenario: 'I need to apologize for something I did wrong'
  },
  { 
    name: 'Romantic', 
    iconName: 'favorite',
    color: '#FF3B7F',
    scenario: 'I want to express my love and appreciation'
  },
  { 
    name: 'Tough Talk', 
    iconName: 'menu',
    color: '#E93B43',
    scenario: 'I need to have a difficult conversation about an important issue'
  },
  { 
    name: 'Check-In', 
    iconName: 'star',
    color: '#9C3FE4',
    scenario: 'I want to check in on how someone is doing'
  }
];

// OpenAI configuration
export const OPENAI_CONFIG = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 150,
};

// App information
export const APP_INFO = {
  name: 'HeartGlowAI',
  version: '1.0.0',
  description: 'AI-powered message generation for meaningful communication',
}; 