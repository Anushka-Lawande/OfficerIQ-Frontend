import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from './ProgressBar';
import { colors } from '../theme/colors';

export default function ContinueCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={[styles.tag, { backgroundColor: item.tagBg }]}>
        <Text style={[styles.tagText, { color: item.tagColor }]}>{item.subject}</Text>
      </View>
      <Text style={styles.chapter} numberOfLines={2}>
        {item.chapter}
      </Text>
      <ProgressBar percent={item.percent} height={5} />
      <Text style={styles.percent}>{item.percent}% complete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  chapter: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 12,
    minHeight: 34,
  },
  percent: {
    fontSize: 11,
    color: colors.textGray,
    marginTop: 6,
  },
});
