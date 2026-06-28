import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProgressBar from '../components/ProgressBar';
import StatPill from '../components/StatPill';
import ContinueCard from '../components/ContinueCard';
import FocusTimerCircle from '../components/FocusTimerCircle';
import { colors } from '../theme/colors';
import { useTimer } from '../context/TimerContext';
import { userStats, overallProgress, continueLearning } from '../data/homeData';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function HomeScreen({ navigation }) {
  const {
    durationSeconds,
    remaining,
    isRunning,
    hasStarted,
    setCustomDuration,
    start,
    pause,
    resume,
    restart,
    progressFraction,
  } = useTimer();

  const [minText, setMinText] = useState(String(Math.floor(durationSeconds / 60)));
  const [secText, setSecText] = useState(String(durationSeconds % 60).padStart(2, '0'));

  const applyDuration = (mins, secs) => {
    const m = parseInt(mins, 10);
    const s = parseInt(secs, 10);
    setCustomDuration(Number.isNaN(m) ? 0 : m, Number.isNaN(s) ? 0 : s);
  };

  const onChangeMin = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 3);
    setMinText(cleaned);
    applyDuration(cleaned, secText);
  };

  const onChangeSec = (text) => {
    let cleaned = text.replace(/[^0-9]/g, '').slice(0, 2);
    if (cleaned !== '' && parseInt(cleaned, 10) > 59) cleaned = '59';
    setSecText(cleaned);
    applyDuration(minText, cleaned);
  };

  const editingDisabled = isRunning;

  const onStart = () => {
    if (!isRunning && hasStarted && remaining > 0) {
      resume();
    } else {
      start();
    }
  };

  const statusLabel =
    remaining === 0 && hasStarted
      ? 'DONE'
      : isRunning
      ? 'RUNNING'
      : hasStarted
      ? 'PAUSED'
      : 'READY';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.avatarWrap}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              style={styles.avatar}
            >
              <Ionicons name="person" size={20} color="#fff" />
            </LinearGradient>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.pillsRow}>
            <StatPill emoji="📈" value={`${userStats.done}%`} bg={colors.pillBlueBg} />
            <StatPill emoji="🏆" value={`#${userStats.rank}`} bg={colors.pillYellowBg} />
            <StatPill emoji="🔥" value={`${userStats.streak}d`} bg={colors.pillOrangeBg} />
          </View>
        </View>

        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.heading}>Ready to learn today?</Text>

        {/* Overall Progress */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Overall Progress</Text>
            <View style={styles.levelPill}>
              <Text style={styles.levelPillText}>Level {overallProgress.level}</Text>
            </View>
          </View>
          <View style={{ marginTop: 14 }}>
            <ProgressBar percent={overallProgress.percent} height={8} />
          </View>
          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <Text style={styles.smallGray}>{overallProgress.percent}% complete</Text>
            <Text style={styles.smallGray}>Next: Level {overallProgress.level + 1}</Text>
          </View>
        </View>

        {/* Focus Timer */}
        <View style={styles.card}>
          <Text style={styles.timerLabel}>FOCUS TIMER</Text>
          <Text style={styles.timerSub}>Set your own session length</Text>

          <View style={styles.ringWrap}>
            <FocusTimerCircle progress={progressFraction} size={176} strokeWidth={10}>
              <Text style={styles.timeText}>{formatTime(remaining)}</Text>
              <Text style={styles.readyText}>{statusLabel}</Text>
            </FocusTimerCircle>
          </View>

          <View style={styles.editRow}>
            <View style={styles.editField}>
              <TextInput
                style={styles.editInput}
                value={minText}
                onChangeText={onChangeMin}
                keyboardType="number-pad"
                maxLength={3}
                editable={!editingDisabled}
                placeholder="00"
                placeholderTextColor={colors.textLightGray}
              />
              <Text style={styles.editUnit}>min</Text>
            </View>
            <Text style={styles.editColon}>:</Text>
            <View style={styles.editField}>
              <TextInput
                style={styles.editInput}
                value={secText}
                onChangeText={onChangeSec}
                keyboardType="number-pad"
                maxLength={2}
                editable={!editingDisabled}
                placeholder="00"
                placeholderTextColor={colors.textLightGray}
              />
              <Text style={styles.editUnit}>sec</Text>
            </View>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.controlBtnOutline} onPress={restart}>
              <Ionicons name="refresh" size={18} color={colors.textDark} />
              <Text style={styles.controlBtnOutlineText}>Restart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlBtnPrimary}
              onPress={isRunning ? pause : onStart}
            >
              <Ionicons name={isRunning ? 'pause' : 'play'} size={18} color="#fff" />
              <Text style={styles.controlBtnPrimaryText}>{isRunning ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Continue Learning */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Learn')}>
            <Text style={styles.sectionLink}>Learn  ›</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {continueLearning.map((item, idx) => (
            <ContinueCard key={idx} item={item} />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 130 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  pillsRow: { flexDirection: 'row' },
  greeting: { fontSize: 14, color: colors.textGray, marginBottom: 2 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.textDark, marginBottom: 18 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textDark },
  levelPill: {
    backgroundColor: colors.primaryBlueDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelPillText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  smallGray: { fontSize: 12, color: colors.textGray },
  timerLabel: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.textGray,
  },
  timerSub: { textAlign: 'center', fontSize: 12, color: colors.textLightGray, marginTop: 2 },
  ringWrap: { alignItems: 'center', marginVertical: 18 },
  timeText: { fontSize: 32, fontWeight: '800', color: colors.textDark },
  readyText: { fontSize: 11, fontWeight: '700', color: colors.textLightGray, marginTop: 2, letterSpacing: 1 },
  presetsRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 18 },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 18,
  },
  editField: { alignItems: 'center' },
  editInput: {
    width: 64,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
  },
  editUnit: { fontSize: 11, color: colors.textGray, marginTop: 4, fontWeight: '600' },
  editColon: { fontSize: 20, fontWeight: '800', color: colors.textLightGray, marginTop: -16 },
  controlsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 14 },
  controlBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  controlBtnOutlineText: { fontSize: 13, fontWeight: '700', color: colors.textDark },
  controlBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBlue,
    justifyContent: 'center',
  },
  controlBtnPrimaryText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textDark },
  sectionLink: { fontSize: 13, fontWeight: '600', color: colors.primaryBlue },
});
