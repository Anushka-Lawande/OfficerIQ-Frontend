import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTimer } from '../context/TimerContext';
import { colors } from '../theme/colors';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function GlobalFocusBar({ onPress }) {
  const { hasStarted, isRunning, remaining, pause, resume, stop } = useTimer();

  if (!hasStarted) return null;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <TouchableOpacity
        style={styles.pill}
        activeOpacity={0.9}
        onPress={onPress}
      >
        <View style={styles.timeWrap}>
          <Text style={styles.time}>{formatTime(remaining)}</Text>
          <Text style={styles.label}>{isRunning ? 'FOCUSING' : 'PAUSED'}</Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => (isRunning ? pause() : resume())}
        >
          <Ionicons name={isRunning ? 'pause' : 'play'} size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn} onPress={stop}>
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 10,
    top: '42%',
    zIndex: 999,
    elevation: 999,
  },
  pill: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.primaryBlueDark || colors.primaryBlue,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  timeWrap: { alignItems: 'center', marginBottom: 2 },
  time: { color: '#fff', fontSize: 13, fontWeight: '800' },
  label: { color: 'rgba(255,255,255,0.85)', fontSize: 8, fontWeight: '700', letterSpacing: 0.5 },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
