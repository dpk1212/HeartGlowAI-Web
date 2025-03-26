import { AppRegistry } from 'react-native';
import App from '../App';

// Register the app
AppRegistry.registerComponent('HeartGlowAI', () => App);

// Initialize web app
if (window.document) {
  AppRegistry.runApplication('HeartGlowAI', {
    rootTag: document.getElementById('root'),
  });
} 