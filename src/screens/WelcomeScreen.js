import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgXml } from 'react-native-svg';
import heartLogoSvg from '../../assets/heart-logo.svg';
import neonHeartSvg from '../../assets/neon-heart.svg';

const WelcomeScreen = ({ onPressAuth }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <SvgXml xml={heartLogoSvg} width={32} height={32} />
          <Text style={styles.logoText}>HeartGlowAI</Text>
        </View>

        <View style={styles.heroSection}>
          <SvgXml 
            xml={neonHeartSvg} 
            width={280} 
            height={280}
            style={styles.heroImage}
          />
          
          <Text style={styles.title}>
            Enhance Your{'\n'}
            Connections with{'\n'}
            HeartGlowAI
          </Text>
        </View>

        <TouchableOpacity
          style={styles.authButton}
          onPress={onPressAuth}
        >
          <LinearGradient
            colors={['#FF3B8B', '#8C46FF', '#3B8AFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Log in or sign up</Text>
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 56,
  },
  authButton: {
    width: '100%',
    maxWidth: 400,
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 40,
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