import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import SubjectCard from '../components/SubjectCard';
import ProgressBar from '../components/ProgressBar';
import { subjects } from '../data/subjects';
import { continueLearning } from '../data/homeData';
import { colors } from '../theme/colors';

const FILTERS = ['All', 'In Progress', 'Not Started', 'Completed'];

export default function LearnScreen({ navigation }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = subjects.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'In Progress') return s.percent > 0 && s.percent < 100;
    if (filter === 'Not Started') return s.percent === 0;
    if (filter === 'Completed') return s.percent >= 100;
    return true;
  });

  const continueItem = continueLearning[0];
  const continueSubject = subjects.find((s) => s.name === continueItem.subject);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={13} color={colors.primaryBlue} />
          <Text style={styles.badgeText}>MPSC Prelims</Text>
        </View>

        <Text style={styles.heading}>
          What do you want to <Text style={styles.headingBlue}>learn{'\n'}today?</Text>
        </Text>
        <Text style={styles.sub}>Pick a subject and keep your streak alive.</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={colors.textLightGray} />
          <TextInput
            placeholder="Search subjects..."
            placeholderTextColor={colors.textLightGray}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterPill, filter === f && styles.filterPillActive]}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.continueCard}
        >
          <Text style={styles.continueLabel}>CONTINUE LEARNING</Text>
          <Text style={styles.continueTitle}>{continueItem.subject}</Text>
          <Text style={styles.continueSubtitle}>{continueSubject?.subtitle}</Text>
          <View style={styles.continueRow}>
            <View style={{ flex: 1, marginRight: 14 }}>
              <ProgressBar
                percent={continueItem.percent}
                height={6}
                colorsArr={['#fff', '#fff']}
                trackColor="rgba(255,255,255,0.3)"
              />
              <Text style={styles.continuePercent}>{continueItem.percent}% complete</Text>
            </View>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => continueSubject && navigation.navigate('SubjectDetail', { subject: continueSubject })}
            >
              <Ionicons name="play" size={18} color={colors.primaryBlue} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.subjectsHeaderRow}>
          <Text style={styles.subjectsHeading}>Subjects</Text>
          <Text style={styles.subjectsCount}>{subjects.length}</Text>
        </View>

        {filtered.map((subject) => (
          <SubjectCard
            key={subject.id}
            subject={subject}
            onPress={() => navigation.navigate('SubjectDetail', { subject })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 130 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.tagPurpleBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
    marginBottom: 14,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.tagPurpleText },
  heading: { fontSize: 26, fontWeight: '800', color: colors.textDark, lineHeight: 32 },
  headingBlue: { color: colors.primaryBlue },
  sub: { fontSize: 14, color: colors.textGray, marginTop: 10, marginBottom: 18 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textDark },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterPillActive: { backgroundColor: colors.primaryBlueDark, borderColor: colors.primaryBlueDark },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textGray },
  filterTextActive: { color: '#fff' },
  continueCard: { borderRadius: 20, padding: 18, marginBottom: 22 },
  continueLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: 'rgba(255,255,255,0.8)' },
  continueTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginTop: 6 },
  continueSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2, marginBottom: 16 },
  continueRow: { flexDirection: 'row', alignItems: 'center' },
  continuePercent: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectsHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  subjectsHeading: { fontSize: 18, fontWeight: '800', color: colors.textDark },
  subjectsCount: { fontSize: 14, color: colors.textLightGray, fontWeight: '600' },
});
