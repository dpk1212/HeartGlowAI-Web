import React from 'react';
import { StyleSheet, View } from 'react-native';
import FeatureItem from './FeatureItem';
import { COLORS } from '../config/constants';

const FeaturesSection = () => {
  return (
    <View style={styles.container}>
      <FeatureItem 
        iconName="favorite" 
        iconColor={COLORS.primary} 
        title="AI-powered message suggestions" 
      />
      <FeatureItem 
        iconName="chevron-right" 
        iconColor={COLORS.primary} 
        title="Adjust tone to fit the conversation"
        chevron 
      />
      <FeatureItem 
        iconName="favorite" 
        iconColor={COLORS.accent2} 
        title="Strengthen your relationships" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  }
});

export default FeaturesSection; 