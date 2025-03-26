import { Platform } from 'react-native';

// Check if the app is running on web
export const isWeb = Platform.OS === 'web';

// Helper function to determine which firebase implementation to use
export const getPlatformFirebase = () => {
  if (isWeb) {
    try {
      // Try to dynamically import web Firebase
      return require('firebase/app');
    } catch (error) {
      console.error('Error importing web Firebase:', error);
      return null;
    }
  } else {
    try {
      // Try to import React Native Firebase
      return require('@react-native-firebase/app');
    } catch (error) {
      console.error('Error importing React Native Firebase:', error);
      return null;
    }
  }
};

// Helper to get the appropriate API URL based on platform
export const getApiUrl = () => {
  return isWeb 
    ? 'https://api.openai.com/v1/chat/completions'  // Web API URL
    : 'https://api.openai.com/v1/chat/completions'; // Mobile API URL (same for now)
}; 