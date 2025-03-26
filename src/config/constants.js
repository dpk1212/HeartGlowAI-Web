// Color scheme
export const COLORS = {
  background: '#121212',
  text: '#F5F5F5',
  accent1: '#FF4081',  // Pink
  accent2: '#2196F3',  // Blue
  accent3: '#7C4DFF',  // Purple
  error: '#F44336',
  success: '#4CAF50',
  card: '#1E1E1E',
  border: '#333333',
  gradient: ['#FF4081', '#7C4DFF', '#2196F3'] // Pink to Purple to Blue gradient
};

// Relationship types
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
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 300
};

// Form validation
export const FORM_VALIDATION = {
  MIN_SCENARIO_LENGTH: 10,
  MAX_SCENARIO_LENGTH: 500
};

// Storage keys
export const STORAGE_KEYS = {
  API_KEY: 'openai_api_key',
  USER_SETTINGS: 'user_settings',
  MESSAGE_HISTORY: 'message_history'
};

// App information
export const APP_INFO = {
  name: 'HeartGlowAI',
  version: '1.0.0',
  description: 'AI-powered message generation for meaningful communication',
}; 