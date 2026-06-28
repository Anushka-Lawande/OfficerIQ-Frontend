import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const GRADUATION_OPTIONS = [
  'Arts (BA)',
  'Commerce (B.Com)',
  'Science (B.Sc)',
  'Engineering (B.E/B.Tech)',
  'Law (LLB)',
  'Other',
];

const ATTEMPT_OPTIONS = [
  { label: '1st attempt', value: 1 },
  { label: '2nd attempt', value: 2 },
  { label: '3rd attempt', value: 3 },
  { label: '4th attempt or more', value: 4 },
];

const STEPS = ['name', 'graduation', 'attempt'];

export default function OnboardingScreen() {
  const { user, saveProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(user?.name || '');
  const [graduation, setGraduation] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [busy, setBusy] = useState(false);

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const finish = async () => {
    setBusy(true);
    await saveProfile({
      name,
      graduation,
      attempt,
      onboardingComplete: true,
    });
    setBusy(false);
  };

  const canContinue =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && !!graduation) ||
    (step === 2 && !!attempt);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.progressRow}>
          {STEPS.map((s, i) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                i <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {step === 0 && (
          <View style={styles.stepBlock}>
            <Text style={styles.question}>What's your name?</Text>
            <Text style={styles.hint}>This helps us personalise your prep journey.</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color={colors.textLightGray} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textLightGray}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.stepBlock}>
            <Text style={styles.question}>Which graduation did you complete?</Text>
            <Text style={styles.hint}>Pick the option closest to your background.</Text>
            <View style={styles.optionsWrap}>
              {GRADUATION_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.option, graduation === opt && styles.optionActive]}
                  onPress={() => setGraduation(opt)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.optionText,
                      graduation === opt && styles.optionTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                  {graduation === opt && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.primaryBlue} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepBlock}>
            <Text style={styles.question}>Which attempt is this?</Text>
            <Text style={styles.hint}>We'll tailor your study plan accordingly.</Text>
            <View style={styles.optionsWrap}>
              {ATTEMPT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.option, attempt === opt.value && styles.optionActive]}
                  onPress={() => setAttempt(opt.value)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.optionText,
                      attempt === opt.value && styles.optionTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {attempt === opt.value && (
                    <Ionicons name="checkmark-circle" size={18} color={colors.primaryBlue} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.navRow}>
          {step > 0 ? (
            <TouchableOpacity style={styles.backBtn} onPress={goBack}>
              <Ionicons name="chevron-back" size={20} color={colors.textGray} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}

          <TouchableOpacity
            onPress={goNext}
            disabled={!canContinue || busy}
            activeOpacity={0.85}
            style={{ flex: 1, opacity: !canContinue || busy ? 0.5 : 1 }}
          >
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              style={styles.nextBtn}
            >
              <Text style={styles.nextBtnText}>
                {step === STEPS.length - 1 ? "Let's start" : 'Continue'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  progressDotActive: {
    backgroundColor: colors.primaryBlue,
  },
  stepBlock: {
    flex: 1,
  },
  question: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: colors.textGray,
    marginBottom: 26,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
  },
  optionsWrap: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  optionActive: {
    borderColor: colors.primaryBlue,
    backgroundColor: colors.pillBlueBg,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  optionTextActive: {
    color: colors.primaryBlue,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 30,
  },
  backBtn: {
    width: 40,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
