import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressBar from './ProgressBar';
import { colors } from '../theme/colors';

export default function SubjectCard({ subject, onPress }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.topRow} onPress={onPress} activeOpacity={0.85}>
        <View style={[styles.iconWrap, { backgroundColor: subject.iconBg }]}>
          <Ionicons name={subject.icon} size={22} color={subject.iconColor} />
        </View>
        <View style={styles.titleBlock}>
          <View style={styles.titleLine}>
            <Text style={styles.title}>{subject.name}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textLightGray} />
          </View>
          <Text style={styles.subtitle}>{subject.subtitle}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.meta}>
        {subject.topics} topics  •  {subject.percent}% done
      </Text>
      <ProgressBar percent={subject.percent} height={5} />

      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.continueBtn} onPress={onPress}>
          <Text style={styles.continueText}>Continue</Text>
          <Ionicons name="chevron-forward" size={13} color={colors.primaryBlue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleBlock: {
    flex: 1,
  },
  titleLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textGray,
    marginTop: 2,
  },
  meta: {
    fontSize: 12,
    color: colors.textGray,
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 4,
  },
  continueText: {
    color: colors.primaryBlue,
    fontSize: 13,
    fontWeight: '600',
  },
});
