import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

export default function ProgressBar({
  percent = 0,
  height = 6,
  trackColor,
  colorsArr,
}) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  return (
    <View
      style={[
        styles.track,
        { height, backgroundColor: trackColor || colors.border },
      ]}
    >
      <LinearGradient
        colors={colorsArr || [colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fill, { width: `${clamped}%`, height }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 10,
  },
});
