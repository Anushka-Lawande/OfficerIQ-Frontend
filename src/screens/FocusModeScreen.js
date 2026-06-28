import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AppBlocker } from '../native/AppBlockerModule';

function formatMinutes(ms) {
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export default function FocusModeScreen() {
  const [apps, setApps] = useState([]);
  const [selected, setSelected] = useState({});
  const [permissions, setPermissions] = useState({
    accessibility: false,
    overlay: false,
    usageAccess: false,
    notifications: false,
  });
  const [focusActive, setFocusActive] = useState(false);
  const [usage, setUsage] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [installed, perms, active, usageStats] = await Promise.all([
      AppBlocker.getInstalledApps(),
      AppBlocker.checkPermissions(),
      AppBlocker.isFocusModeActive(),
      AppBlocker.getUsageStats(),
    ]);
    setApps(installed);
    setPermissions(perms);
    setFocusActive(active);
    setUsage(usageStats || {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const toggleApp = (pkg) => {
    setSelected((prev) => ({ ...prev, [pkg]: !prev[pkg] }));
  };

  const selectedPackages = Object.keys(selected).filter((k) => selected[k]);
  const allPermissionsGranted =
    permissions.accessibility && permissions.overlay && permissions.usageAccess;

  const onStartFocus = async () => {
    if (selectedPackages.length === 0) {
      Alert.alert('Select apps', 'Choose at least one app to block during Focus Mode.');
      return;
    }
    if (!AppBlocker.isNativeAvailable) {
      Alert.alert(
        'Demo mode',
        'Real app-blocking needs the native Android module (not available in Expo Go). Build a dev client / standalone APK to enable real blocking. Turning on demo Focus Mode now.'
      );
    } else if (!allPermissionsGranted) {
      Alert.alert(
        'Permissions needed',
        'Please grant Accessibility, Overlay and Usage Access permissions first.'
      );
      return;
    }
    await AppBlocker.startFocusMode(selectedPackages);
    await AppBlocker.setBlockedNotificationApps(selectedPackages);
    setFocusActive(true);
  };

  const onStopFocus = async () => {
    await AppBlocker.stopFocusMode();
    setFocusActive(false);
  };

  const PermissionRow = ({ label, granted, onPress }) => (
    <TouchableOpacity style={styles.permRow} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.permLeft}>
        <Ionicons
          name={granted ? 'checkmark-circle' : 'alert-circle-outline'}
          size={18}
          color={granted ? '#16A34A' : '#D97706'}
        />
        <Text style={styles.permLabel}>{label}</Text>
      </View>
      {!granted && <Text style={styles.permAction}>Grant</Text>}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Focus Mode</Text>
      <Text style={styles.subtitle}>
        Block distracting apps while you study and track where your time really goes.
      </Text>

      <LinearGradient
        colors={focusActive ? ['#16A34A', '#15803D'] : [colors.gradientStart, colors.gradientEnd]}
        style={styles.statusCard}
      >
        <Ionicons
          name={focusActive ? 'lock-closed' : 'lock-open-outline'}
          size={26}
          color={colors.white}
        />
        <Text style={styles.statusTitle}>
          {focusActive ? 'Focus Mode is ON' : 'Focus Mode is OFF'}
        </Text>
        <Text style={styles.statusSub}>
          {focusActive
            ? `${selectedPackages.length || Object.keys(usage).length} apps currently blocked`
            : 'Select apps below and start focusing'}
        </Text>
        <TouchableOpacity
          style={styles.statusBtn}
          onPress={focusActive ? onStopFocus : onStartFocus}
        >
          <Text style={styles.statusBtnText}>{focusActive ? 'Stop Focus Mode' : 'Start Focus Mode'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      {!AppBlocker.isNativeAvailable && (
        <View style={styles.noticeBox}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textGray} />
          <Text style={styles.noticeText}>
            Native blocking module not detected — running in demo mode. Build with a custom dev
            client to enable real app blocking, overlay & usage tracking on Android.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Permissions</Text>
      <View style={styles.permCard}>
        <PermissionRow
          label="Accessibility Service (app detection)"
          granted={permissions.accessibility}
          onPress={() => AppBlocker.requestAccessibilityPermission()}
        />
        <PermissionRow
          label="Display over other apps (block overlay)"
          granted={permissions.overlay}
          onPress={() => AppBlocker.requestOverlayPermission()}
        />
        <PermissionRow
          label="Usage Access (app-wise time tracking)"
          granted={permissions.usageAccess}
          onPress={() => AppBlocker.requestUsageAccessPermission()}
        />
        <PermissionRow
          label="Notification Access (mute blocked apps)"
          granted={permissions.notifications}
          onPress={() => AppBlocker.requestNotificationAccessPermission()}
        />
      </View>

      <Text style={styles.sectionTitle}>Select apps to block</Text>
      <View style={styles.appsCard}>
        {apps.map((app) => (
          <View key={app.packageName} style={styles.appRow}>
            <View style={styles.appLeft}>
              <View style={styles.appIconFallback}>
                <Ionicons name="apps-outline" size={16} color={colors.primaryBlue} />
              </View>
              <View>
                <Text style={styles.appName}>{app.appName}</Text>
                <Text style={styles.appUsage}>
                  {usage[app.packageName]
                    ? `Used ${formatMinutes(usage[app.packageName])} today`
                    : 'No usage data yet'}
                </Text>
              </View>
            </View>
            <Switch
              value={!!selected[app.packageName]}
              onValueChange={() => toggleApp(app.packageName)}
              trackColor={{ false: colors.border, true: colors.pillBlueBg }}
              thumbColor={selected[app.packageName] ? colors.primaryBlue : '#fff'}
            />
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Today's app usage</Text>
      <View style={styles.appsCard}>
        {Object.keys(usage).length === 0 ? (
          <Text style={styles.emptyText}>
            No usage tracked yet. Once the background monitoring service runs, app-wise usage
            time will show up here.
          </Text>
        ) : (
          Object.entries(usage).map(([pkg, ms]) => (
            <View key={pkg} style={styles.usageRow}>
              <Text style={styles.usagePkg}>{pkg}</Text>
              <Text style={styles.usageTime}>{formatMinutes(ms)}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingTop: 60, paddingBottom: 140 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textDark },
  subtitle: { fontSize: 13, color: colors.textGray, marginTop: 6, marginBottom: 20 },
  statusCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  statusTitle: { color: colors.white, fontSize: 18, fontWeight: '800', marginTop: 10 },
  statusSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4, marginBottom: 16 },
  statusBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statusBtnText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  noticeBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noticeText: { flex: 1, fontSize: 11.5, color: colors.textGray, lineHeight: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textDark, marginBottom: 10, marginTop: 4 },
  permCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 20,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  permLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  permLabel: { fontSize: 12.5, color: colors.textDark, flex: 1 },
  permAction: { color: colors.primaryBlue, fontSize: 12, fontWeight: '700' },
  appsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 20,
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appIconFallback: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.pillBlueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: 13.5, fontWeight: '700', color: colors.textDark },
  appUsage: { fontSize: 11, color: colors.textLightGray, marginTop: 2 },
  emptyText: { fontSize: 12, color: colors.textGray, paddingVertical: 16, lineHeight: 17 },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  usagePkg: { fontSize: 12, color: colors.textDark, flex: 1 },
  usageTime: { fontSize: 12, fontWeight: '700', color: colors.primaryBlue },
});
