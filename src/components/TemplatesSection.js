import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TemplateButton from './TemplateButton';
import { MESSAGE_TEMPLATES, COLORS } from '../config/constants';

const TemplatesSection = ({ onSelectTemplate }) => {
  const handleTemplatePress = (template) => {
    if (onSelectTemplate) {
      onSelectTemplate(template.scenario);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Templates</Text>
      <View style={styles.templatesGrid}>
        {MESSAGE_TEMPLATES.map((template, index) => (
          <TemplateButton
            key={index}
            name={template.name}
            onPress={() => handleTemplatePress(template)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  }
});

export default TemplatesSection; 