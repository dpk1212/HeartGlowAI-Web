import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.heroContainer}>
        <LinearGradient
          colors={['#ff6b9d', '#64d2ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroIcon} />
        </LinearGradient>
      </View>
      
      <Text style={styles.title}>Say what you feel, the way they'll hear it.</Text>
      <Text style={styles.subtitle}>AI-powered heartfelt message generator for all your relationships</Text>
      
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Auth')}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#050A14',
  },
  heroContainer: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  heroGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#050A14',
    borderRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#B7BAC1',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  loginButton: {
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