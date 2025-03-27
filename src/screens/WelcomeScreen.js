import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const WelcomeScreen = ({ onPressAuth }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.titlePink}>Say what you feel,</Text>
          <Text style={styles.titleGray}>the way they'll</Text>
          <Text style={styles.titleGreen}>hear it.</Text>
        </View>

        <Text style={styles.subtitle}>
          AI-powered heartfelt message generator{'\n'}
          for all your relationships
        </Text>

        <TouchableOpacity
          style={styles.authButton}
          onPress={onPressAuth}
        >
          <LinearGradient
            colors={['#ff6b9d', '#64d2ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Log in or Register to Begin</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050A14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 800,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titlePink: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ff6b9d',
    textAlign: 'center',
    lineHeight: 76,
  },
  titleGray: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 76,
  },
  titleGreen: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#64d2ff',
    textAlign: 'center',
    lineHeight: 76,
  },
  subtitle: {
    fontSize: 24,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 32,
  },
  authButton: {
    width: '100%',
    maxWidth: 300,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen; 