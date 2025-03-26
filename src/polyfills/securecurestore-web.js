/**
 * Web polyfill for expo-secure-store
 * This uses localStorage instead of secure storage for web platforms
 */

// Keys are prefixed to avoid collisions with other localStorage items
const STORAGE_PREFIX = 'secure_store_';

export default {
  setItemAsync: async (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
      return true;
    } catch (error) {
      console.error('Error setting secure storage item:', error);
      return false;
    }
  },

  getItemAsync: async (key) => {
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error('Error getting secure storage item:', error);
      return null;
    }
  },

  deleteItemAsync: async (key) => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
      return true;
    } catch (error) {
      console.error('Error deleting secure storage item:', error);
      return false;
    }
  }
}; 