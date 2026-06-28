import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatPill({ emoji, value, bg }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={styles.text}>
        {emoji} {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    marginLeft: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#13182B',
  },
});
