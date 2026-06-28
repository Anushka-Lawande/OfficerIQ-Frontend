import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { mockTests, results } from '../data/testData';

export default function TestScreen() {
  const [tab, setTab] = useState('mock');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.heading}>Test Center</Text>
        <Text style={styles.sub}>Practice tests and track your results.</Text>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'mock' && styles.tabBtnActive]}
            onPress={() => setTab('mock')}
          >
            <Text style={[styles.tabText, tab === 'mock' && styles.tabTextActive]}>Mock Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'results' && styles.tabBtnActive]}
            onPress={() => setTab('results')}
          >
            <Text style={[styles.tabText, tab === 'results' && styles.tabTextActive]}>My Results</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'mock'
          ? mockTests.map((t, i) => (
              <View key={i} style={styles.testCard}>
                <View style={[styles.diffTag, { backgroundColor: t.diffBg }]}>
                  <Text style={[styles.diffText, { color: t.diffColor }]}>{t.difficulty}</Text>
                </View>
                <Text style={styles.testTitle}>{t.title}</Text>
                <Text style={styles.testMeta}>
                  {t.questions} Questions · {t.duration}
                </Text>
                <TouchableOpacity style={styles.startBtn}>
                  <Text style={styles.startBtnText}>Start Test</Text>
                  <Ionicons name="arrow-forward" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))
          : results.map((r, i) => (
              <View key={i} style={styles.resultCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultTitle}>{r.title}</Text>
                  <Text style={styles.resultDate}>{r.date}</Text>
                </View>
                <View style={styles.resultScore}>
                  <Text style={styles.resultScoreText}>{r.score}</Text>
                </View>
              </View>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 12 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.textDark },
  sub: { fontSize: 13, color: colors.textGray, marginTop: 4, marginBottom: 16 },
  tabRow: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 14, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10 },
  tabBtnActive: { backgroundColor: colors.primaryBlueDark },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textGray },
  tabTextActive: { color: '#fff' },
  scroll: { paddingHorizontal: 20, paddingBottom: 130 },
  testCard: {
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
  diffTag: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  diffText: { fontSize: 11, fontWeight: '700' },
  testTitle: { fontSize: 15, fontWeight: '700', color: colors.textDark, marginBottom: 4 },
  testMeta: { fontSize: 12, color: colors.textGray, marginBottom: 12 },
  startBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.primaryBlue,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 6,
  },
  startBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  resultTitle: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  resultDate: { fontSize: 12, color: colors.textGray, marginTop: 2 },
  resultScore: { backgroundColor: colors.tagGreenBg, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  resultScoreText: { fontSize: 13, fontWeight: '700', color: colors.tagGreenText },
});
