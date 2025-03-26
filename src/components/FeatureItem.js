import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../config/constants';

const FeatureItem = ({ iconName, iconType = 'material', iconColor = COLORS.primary, title, chevron = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} type={iconType} color={iconColor} size={20} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {chevron && (
        <Icon name="chevron-right" type="material" color={COLORS.textSecondary} size={20} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: COLORS.primary,
  }
});

export default FeatureItem; 