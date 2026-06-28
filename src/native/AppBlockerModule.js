import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

/**
 * JS bridge for the native Android "AppBlocker" module.
 *
 * The real implementation lives in /android-module (AccessibilityService +
 * UsageStatsManager + WindowManager overlay + Foreground Service). It only
 * works in a custom dev client / standalone build (NOT Expo Go), because it
 * needs an AccessibilityService + SYSTEM_ALERT_WINDOW + PACKAGE_USAGE_STATS,
 * none of which Expo Go exposes.
 *
 * This wrapper detects whether the native module is linked. If it isn't
 * (e.g. running in Expo Go, or on iOS where this feature is not supported),
 * it falls back to a harmless in-memory mock so the UI/UX can still be built
 * and demoed without crashing.
 */

const { OfficerIQAppBlocker } = NativeModules;
const isNativeAvailable = Platform.OS === 'android' && !!OfficerIQAppBlocker;

let mockState = {
  blockedApps: [],
  focusActive: false,
  usage: {},
};

const mockEmitter = {
  listeners: {},
  addListener(event, cb) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(cb);
    return { remove: () => {} };
  },
};

export const AppBlockerEvents = isNativeAvailable
  ? new NativeEventEmitter(OfficerIQAppBlocker)
  : mockEmitter;

export const AppBlocker = {
  isNativeAvailable,

  // Permissions ---------------------------------------------------------
  async checkPermissions() {
    if (!isNativeAvailable) {
      return { accessibility: false, overlay: false, usageAccess: false, notifications: false };
    }
    return OfficerIQAppBlocker.checkPermissions();
  },

  async requestAccessibilityPermission() {
    if (!isNativeAvailable) return;
    return OfficerIQAppBlocker.openAccessibilitySettings();
  },

  async requestOverlayPermission() {
    if (!isNativeAvailable) return;
    return OfficerIQAppBlocker.openOverlaySettings();
  },

  async requestUsageAccessPermission() {
    if (!isNativeAvailable) return;
    return OfficerIQAppBlocker.openUsageAccessSettings();
  },

  async requestNotificationAccessPermission() {
    if (!isNativeAvailable) return;
    return OfficerIQAppBlocker.openNotificationAccessSettings();
  },

  // Installed apps --------------------------------------------------------
  async getInstalledApps() {
    if (!isNativeAvailable) {
      return [
        { packageName: 'com.instagram.android', appName: 'Instagram' },
        { packageName: 'com.zhiliaoapp.musically', appName: 'TikTok' },
        { packageName: 'com.whatsapp', appName: 'WhatsApp' },
        { packageName: 'com.google.android.youtube', appName: 'YouTube' },
        { packageName: 'com.twitter.android', appName: 'X / Twitter' },
        { packageName: 'com.facebook.katana', appName: 'Facebook' },
      ];
    }
    return OfficerIQAppBlocker.getInstalledApps();
  },

  // Focus mode control ------------------------------------------------------
  async startFocusMode(blockedPackageNames, options = {}) {
    if (!isNativeAvailable) {
      mockState.focusActive = true;
      mockState.blockedApps = blockedPackageNames;
      return { started: true, mock: true };
    }
    return OfficerIQAppBlocker.startFocusMode(blockedPackageNames, options);
  },

  async stopFocusMode() {
    if (!isNativeAvailable) {
      mockState.focusActive = false;
      return { stopped: true, mock: true };
    }
    return OfficerIQAppBlocker.stopFocusMode();
  },

  async isFocusModeActive() {
    if (!isNativeAvailable) return mockState.focusActive;
    return OfficerIQAppBlocker.isFocusModeActive();
  },

  // Usage tracking -----------------------------------------------------
  async getUsageStats(rangeMs = 24 * 60 * 60 * 1000) {
    if (!isNativeAvailable) {
      return mockState.usage;
    }
    return OfficerIQAppBlocker.getUsageStats(rangeMs);
  },

  // Notification blocking ------------------------------------------------
  async setBlockedNotificationApps(packageNames) {
    if (!isNativeAvailable) return { ok: true, mock: true };
    return OfficerIQAppBlocker.setBlockedNotificationApps(packageNames);
  },
};

export default AppBlocker;
