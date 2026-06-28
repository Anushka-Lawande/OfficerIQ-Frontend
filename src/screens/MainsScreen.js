import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function MainsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.quotaRow}>
          <Text style={styles.quotaText}>
            <Text style={styles.quotaBold}>3/3 FREE</Text> Evaluations left this month
          </Text>
          <TouchableOpacity style={styles.upgradeRow}>
            <Text style={styles.upgradeText}>Upgrade</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.tagPurpleText} />
          </TouchableOpacity>
        </View>

        <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.heroCard}>
          <Text style={styles.heroLabel}>GS  ✦  ESSAY  ✦  OPTIONAL</Text>

          <View style={styles.mockWrap}>
            <View style={styles.onCopyTag}>
              <Text style={styles.onCopyText}>on-copy</Text>
            </View>

            <View style={styles.mockCard}>
              <Text style={styles.mockHeader}>UPSC</Text>
              <Text style={styles.mockLineGreen}>Clear and relevant introduction</Text>
              <Text style={styles.mockLineGreen}>Examples used well</Text>
              <Text style={styles.mockLineRed}>Need analysis in body. Add more depth</Text>
              <Text style={styles.mockLineGreen}>Overall good answer, work on depth</Text>
            </View>

            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>5.5{'\n'}/ 10</Text>
            </View>
          </View>

          <View style={styles.heroIconsRow}>
            <Ionicons name="sparkles" size={18} color="rgba(255,255,255,0.85)" />
            <Text style={styles.heroEmoji}>✍️</Text>
          </View>
        </LinearGradient>

        <View style={styles.evalCard}>
          <Text style={styles.evalTitle}>Instant Answer Evaluation</Text>

          <TouchableOpacity style={styles.evalBtnWrap} activeOpacity={0.85}>
            <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.evalBtn}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.evalBtnText}>Evaluate Answer</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.sampleLink}>Try Sample Evaluation</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="document-text-outline" size={18} color={colors.primaryBlue} />
          <Text style={styles.infoText}>
            Upload a photo or type your answer. AI checks structure, content depth, examples and gives
            a score.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 20, paddingBottom: 130 },
  quotaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  quotaText: { fontSize: 13, color: colors.textGray },
  quotaBold: { color: '#16A34A', fontWeight: '800' },
  upgradeRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  upgradeText: { fontSize: 13, fontWeight: '700', color: colors.tagPurpleText },
  heroCard: { borderRadius: 22, padding: 20, marginBottom: 18 },
  heroLabel: { textAlign: 'center', color: '#fff', fontWeight: '800', fontSize: 13, marginBottom: 18 },
  mockWrap: { alignItems: 'center', justifyContent: 'center', height: 130, position: 'relative' },
  onCopyTag: {
    position: 'absolute',
    left: 16,
    top: 6,
    backgroundColor: '#FACC15',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    transform: [{ rotate: '-8deg' }],
  },
  onCopyText: { fontSize: 11, fontWeight: '800', color: '#7C2D12' },
  mockCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  mockHeader: { fontSize: 13, fontWeight: '800', color: colors.textDark, marginBottom: 6 },
  mockLineGreen: { fontSize: 9, color: '#16A34A', marginBottom: 4 },
  mockLineRed: { fontSize: 9, color: '#DC2626', marginBottom: 4 },
  scoreCircle: {
    position: 'absolute',
    right: 8,
    top: 14,
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: { color: '#fff', fontSize: 12, fontWeight: '800', textAlign: 'center' },
  heroIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: 6,
  },
  heroEmoji: { fontSize: 18 },
  evalCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  evalTitle: { fontSize: 17, fontWeight: '800', color: colors.textDark, marginBottom: 16 },
  evalBtnWrap: { width: '100%', marginBottom: 14 },
  evalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 16,
    gap: 8,
  },
  evalBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sampleLink: { color: colors.primaryBlue, fontSize: 13, fontWeight: '600' },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  infoText: { flex: 1, fontSize: 12, color: colors.textGray, lineHeight: 18 },
});
