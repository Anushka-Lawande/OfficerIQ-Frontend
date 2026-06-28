import { colors } from '../theme/colors';

export const userStats = { done: 68, rank: 12, streak: 7 };

export const overallProgress = { level: 4, percent: 62 };

export const continueLearning = [
  {
    subject: 'Polity',
    chapter: 'Ch 3 — Fundamental Rights',
    percent: 72,
    tagBg: colors.tagPurpleBg,
    tagColor: colors.tagPurpleText,
  },
  {
    subject: 'History',
    chapter: 'Ch 5 — Revolt of 1857',
    percent: 58,
    tagBg: colors.tagPinkBg,
    tagColor: colors.tagPinkText,
  },
  {
    subject: 'Geography',
    chapter: 'Ch 2 — Climatology',
    percent: 44,
    tagBg: colors.tagGreenBg,
    tagColor: colors.tagGreenText,
  },
  {
    subject: 'Economy',
    chapter: 'Ch 4 — Banking System',
    percent: 35,
    tagBg: colors.tagYellowBg,
    tagColor: colors.tagYellowText,
  },
  {
    subject: 'Science',
    chapter: 'Ch 1 — Physics Basics',
    percent: 60,
    tagBg: colors.tagTealBg,
    tagColor: colors.tagTealText,
  },
  {
    subject: 'Environment',
    chapter: 'Ch 2 — Biodiversity',
    percent: 28,
    tagBg: colors.tagGreenBg,
    tagColor: colors.tagGreenText,
  },
  {
    subject: 'Current Affairs',
    chapter: 'May 2026 Highlights',
    percent: 15,
    tagBg: colors.tagIndigoBg,
    tagColor: colors.tagIndigoText,
  },
];

export const focusPresets = [1.5, 5, 15, 25, 45];
export const defaultPreset = 25;
