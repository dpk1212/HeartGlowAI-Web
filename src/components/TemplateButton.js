import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { MESSAGE_TEMPLATES } from '../config/constants';

const TemplateButton = ({ name, onPress }) => {
  // Find the template data from our constants
  const template = MESSAGE_TEMPLATES.find(t => t.name === name) || {
    color: '#333333',
    iconName: 'help-outline'
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: template.color }]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon name={template.iconName} type="material" color="#FFFFFF" size={28} />
      </View>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 8,
  },
  iconContainer: {
    marginBottom: 10,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  }
});

export default TemplateButton; 