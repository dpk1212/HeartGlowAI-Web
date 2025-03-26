import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, View, Text, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthScreen from './src/screens/AuthScreen';
import MessageGeneratorScreen from './src/screens/MessageGeneratorScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import firebase from './src/services/firebase';
import { auth, isFirebaseConfigured } from './src/services/firebase';
import { COLORS } from './src/config/constants';

export default function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // Check if Firebase is properly configured
    if (!isFirebaseConfigured()) {
      setFirebaseError('Firebase configuration missing. Please check your environment variables.');
      setInitializing(false);
      return;
    }

    try {
      const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    } catch (error) {
      console.error('Firebase auth error:', error);
      setFirebaseError('Failed to initialize Firebase authentication. Please check your configuration.');
      setInitializing(false);
    }
  }, []);

  const handleStartConversation = () => {
    if (user) {
      // User is already logged in, no need to show auth screen
      return;
    } else {
      // Show auth screen to log in
      setShowAuth(true);
    }
  };

  const handlePressAuth = () => {
    setShowAuth(true);
  };

  if (initializing) return null;

  // If there's a Firebase error, display it
  if (firebaseError) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <View style={[styles.container, styles.errorContainer]}>
          <Text style={styles.errorText}>Firebase Error</Text>
          <Text style={styles.errorMessage}>{firebaseError}</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Determine which screen to show
  let screenToShow;
  if (user) {
    // User is logged in, show message generator
    screenToShow = <MessageGeneratorScreen user={user} />;
  } else if (showAuth) {
    // Show authentication screen
    screenToShow = <AuthScreen />;
  } else {
    // Show welcome screen
    screenToShow = (
      <WelcomeScreen 
        onStartConversation={handleStartConversation}
        onPressAuth={handlePressAuth}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {screenToShow}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent1,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
}); 