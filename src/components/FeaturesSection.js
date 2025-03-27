import React from 'react';
import { View, StyleSheet } from 'react-native';
import FeatureItem from './FeatureItem';

const features = [
  {
    title: 'Personalized Messages',
    description: 'AI-generated messages tailored to your relationship and situation',
    icon: '💝'
  },
  {
    title: 'Multiple Relationships',
    description: 'Generate messages for friends, family, partners, and more',
    icon: '👥'
  },
  {
    title: 'Emotional Intelligence',
    description: 'Messages that understand and express emotions effectively',
    icon: '❤️'
  }
];

const FeaturesSection = () => {
  return (
    <View style={styles.container}>
      {features.map((feature, index) => (
        <FeatureItem
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  }
});

export default FeaturesSection; 