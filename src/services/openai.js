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
    const response = await fetch('https://us-central1-heartglowai.cloudfunctions.net/generateMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ scenario, relationshipType })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate message');
    }

    const data = await response.json();
    
    if (!data.message) {
      throw new Error('No message received from server');
    }

    return data.message;
  } catch (error) {
    console.error('Error generating message:', error);
    
    // Enhance error message based on the type of error
    if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
      throw new Error('Network error - please check your internet connection and try again');
    } else if (error.message.includes('API key')) {
      throw new Error('OpenAI API key error - please contact support');
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