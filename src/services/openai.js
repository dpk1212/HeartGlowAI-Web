import axios from 'axios';
import { Platform } from 'react-native';
import { isWeb } from './platform';

// For web, we use window.localStorage instead of SecureStore
let SecureStore;
if (!isWeb) {
  // Only import SecureStore in native environment
  SecureStore = require('expo-secure-store');
}

// Get API keys from different sources based on platform
const getEnvApiKey = () => {
  if (isWeb) {
    return process.env.REACT_APP_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  } else {
    try {
      // Use the react-native-dotenv import for native platforms
      const { OPENAI_API_KEY } = require('@env');
      return OPENAI_API_KEY;
    } catch (error) {
      console.error('Error loading env variable:', error);
      return null;
    }
  }
};

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// OpenAI configuration constants
const OPENAI_CONFIG = {
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  maxTokens: 300
};

// Get the API key securely from storage or fallback to env variable
async function getApiKey() {
  try {
    let apiKey;
    
    // Try to get the key from secure storage first (platform specific)
    if (isWeb) {
      // For web, use localStorage
      apiKey = localStorage.getItem('openai_api_key');
    } else {
      // For native, use SecureStore
      apiKey = await SecureStore.getItemAsync('openai_api_key');
    }
    
    // If we have a key in storage, use it
    if (apiKey) {
      return apiKey;
    }
    
    // Otherwise fallback to environment variable
    const envApiKey = getEnvApiKey();
    if (envApiKey) {
      console.log('Using API key from environment variables');
      return envApiKey;
    }
    
    // If neither is available, throw an error
    throw new Error('OpenAI API key not found');
  } catch (error) {
    console.error('Error retrieving API key:', error);
    throw error;
  }
}

// Generate a message using OpenAI
export async function generateMessage(scenario, relationshipType) {
  try {
    const apiKey = await getApiKey();
    
    const systemPrompt = `You are HeartGlowAI, a helpful AI assistant that specializes in crafting thoughtful, 
    authentic messages for personal relationships. Your goal is to help people communicate more effectively and 
    meaningfully with their loved ones. Based on the scenario and relationship type provided, 
    create a heartfelt message (about 2-4 sentences).`;
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: OPENAI_CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Create a heartfelt message for a ${relationshipType} relationship in this scenario: ${scenario}. 
            Keep it authentic, personal, and emotionally resonant. The message should be about 2-4 sentences.` 
          }
        ],
        temperature: OPENAI_CONFIG.temperature,
        max_tokens: OPENAI_CONFIG.maxTokens
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating message:', error);
    if (error.response) {
      console.error('OpenAI API error:', error.response.data);
    }
    throw error;
  }
}

// Save API key securely
export async function saveApiKey(apiKey) {
  try {
    if (isWeb) {
      // For web, use localStorage
      localStorage.setItem('openai_api_key', apiKey);
    } else {
      // For native, use SecureStore
      await SecureStore.setItemAsync('openai_api_key', apiKey);
    }
    return true;
  } catch (error) {
    console.error('Error saving API key:', error);
    return false;
  }
}

// Check if an API key is available
export async function isApiKeyAvailable() {
  try {
    let storedKey;
    
    if (isWeb) {
      // For web, use localStorage
      storedKey = localStorage.getItem('openai_api_key');
    } else {
      // For native, use SecureStore
      storedKey = await SecureStore.getItemAsync('openai_api_key');
    }
    
    return !!storedKey || !!getEnvApiKey();
  } catch (error) {
    console.error('Error checking API key:', error);
    return false;
  }
} 