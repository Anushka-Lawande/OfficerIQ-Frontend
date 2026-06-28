import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProgressBar from '../components/ProgressBar';
import { colors } from '../theme/colors';
import { getSubjectDetail } from '../data/subjectDetails';

export default function SubjectDetailScreen({ route, navigation }) {
  const { subject } = route.params;
  const detail = getSubjectDetail(subject.id);
  const [expanded, setExpanded] = useState({ 0: true });
  const [checked, setChecked] = useState({});

  const toggleChapter = (idx) => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  const toggleTopic = (key) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[subject.iconColor, colors.gradientEnd]}
          style={styles.hero}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Ionicons name={subject.icon} size={38} color="#fff" />
          <Text style={styles.heroTagline}>{detail.tagline}</Text>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.subjectName}>{subject.name}</Text>

          <View style={styles.progressCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.progressLabel}>Overall Progress</Text>
              <Text style={styles.progressPercent}>{detail.overallPercent}%</Text>
            </View>
            <View style={{ marginVertical: 10 }}>
              <ProgressBar percent={detail.overallPercent} height={7} />
            </View>
            <Text style={styles.progressSub}>
              {detail.completedCount} of {detail.totalCount} Topics Completed
            </Text>
          </View>

          <Text style={styles.chaptersHeading}>Chapters</Text>

          {detail.chapters.map((chapter, idx) => (
            <View key={idx} style={styles.chapterCard}>
              <TouchableOpacity style={styles.chapterHeader} onPress={() => toggleChapter(idx)}>
                <View style={styles.chapterNum}>
                  <Text style={styles.chapterNumText}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  <Text style={styles.chapterMeta}>
                    {chapter.topicsCount} Topics{chapter.hasTest ? ' · 1 Test' : ''}
                  </Text>
                </View>
                <Ionicons
                  name={expanded[idx] ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textGray}
                />
              </TouchableOpacity>

              {expanded[idx] && (
                <View style={styles.topicsList}>
                  {chapter.topics.map((topic, tIdx) => {
                    const key = `${idx}-${tIdx}`;
                    const isChecked = !!checked[key];
                    return (
                      <TouchableOpacity
                        key={key}
                        style={styles.topicRow}
                        onPress={() => toggleTopic(key)}
                      >
                        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                          {isChecked && <Ionicons name="checkmark" size={12} color="#fff" />}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.topicTitle}>{topic.title}</Text>
                          <Text style={styles.topicMeta}>
                            {topic.duration} · {topic.type}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                  {chapter.hasTest && (
                    <TouchableOpacity style={styles.testBtn}>
                      <Text style={styles.testBtnText}>{chapter.title} Test</Text>
                      <Text style={styles.testBtnMeta}>20 Questions</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}

          {detail.quote && (
            <View style={styles.quoteBox}>
              <Text style={styles.quoteMark}>“</Text>
              <Text style={styles.quoteText}>{detail.quote.text}</Text>
              <Text style={styles.quoteAuthor}>— {detail.quote.author}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: {
    height: 190,
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTagline: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 10 },
  body: { padding: 20 },
  subjectName: { fontSize: 24, fontWeight: '800', color: colors.textDark, marginBottom: 16 },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  progressPercent: { fontSize: 14, fontWeight: '700', color: colors.primaryBlue },
  progressSub: { fontSize: 12, color: colors.textGray },
  chaptersHeading: { fontSize: 18, fontWeight: '800', color: colors.textDark, marginBottom: 12 },
  chapterCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  chapterNum: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumText: { fontSize: 13, fontWeight: '700', color: colors.textDark },
  chapterTitle: { fontSize: 14, fontWeight: '700', color: colors.textDark },
  chapterMeta: { fontSize: 12, color: colors.textGray, marginTop: 2 },
  topicsList: { paddingHorizontal: 14, paddingBottom: 12 },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 9,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: { backgroundColor: colors.primaryBlue, borderColor: colors.primaryBlue },
  topicTitle: { fontSize: 13, color: colors.textDark, fontWeight: '500' },
  topicMeta: { fontSize: 11, color: colors.textLightGray, marginTop: 2 },
  testBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.tagPurpleBg,
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  testBtnText: { fontSize: 13, fontWeight: '700', color: colors.tagPurpleText },
  testBtnMeta: { fontSize: 12, fontWeight: '600', color: colors.tagPurpleText },
  quoteBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
    alignItems: 'center',
  },
  quoteMark: { fontSize: 30, color: colors.primaryBlue, lineHeight: 30 },
  quoteText: {
    fontSize: 13,
    color: colors.textDark,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteAuthor: { fontSize: 12, color: colors.textGray, fontWeight: '600' },
});
