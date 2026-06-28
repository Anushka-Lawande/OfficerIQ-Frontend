# OfficerIQ native AppBlocker module (Android)

This folder contains the **real, native Android engine** for:
- ✅ Detecting the foreground app (Accessibility Service)
- ✅ Blocking selected apps with a full-screen overlay during Focus Mode
- ✅ Notification blocking (Notification Listener Service)
- ✅ App-wise usage tracking (UsageStatsManager + live event-driven tracker)
- ✅ Battery-efficient background monitoring (event-driven foreground service, no polling)

## Why this can't run inside Expo Go
Expo Go is a fixed, pre-built binary — it cannot include custom native code
(Accessibility Services, overlay windows, notification listeners). These are
OS-level capabilities only available in a **custom dev client** or a
**standalone production build**. The React Native side of the app
(`src/screens/FocusModeScreen.js`, `src/native/AppBlockerModule.js`) already
detects this and falls back to a safe demo/mock mode automatically, so you
can keep building and testing the UI in Expo Go right now.

## How to enable the real native blocking (when you're ready)

1. **Eject to a dev client / bare workflow** (one-time):
   ```bash
   npx expo install expo-dev-client
   npx expo prebuild --platform android
   ```
   This generates an `android/` folder in your project.

2. **Copy the Kotlin module** into your generated Android project:
   - Copy everything in `android-module/app-blocker/src/main/java/com/officeriq/appblocker/`
     into `android/app/src/main/java/com/officeriq/appblocker/`.
   - Copy `android-module/app-blocker/src/main/res/xml/accessibility_service_config.xml`
     into `android/app/src/main/res/xml/`.

3. **Register the native package** in
   `android/app/src/main/java/com/officeriq/MainApplication.kt` (or `.java`),
   inside the `getPackages()` list:
   ```kotlin
   packages.add(com.officeriq.appblocker.AppBlockerPackage())
   ```

4. **Merge manifest entries**: copy the permissions/services/activity from
   `android-module/AndroidManifest.additions.xml` into
   `android/app/src/main/AndroidManifest.xml`.

5. **Add the string resource** from `android-module/strings.additions.xml`
   into `android/app/src/main/res/values/strings.xml`.

6. **Build the dev client and run on a real device or emulator**
   (Accessibility/Usage/Overlay permissions don't work well on some
   emulators — a physical Android device is recommended):
   ```bash
   npx expo run:android
   ```

7. Open the app → **Focus tab** → grant the 4 permissions listed there →
   select apps to block → **Start Focus Mode**.

## Notes
- `MonitoringForegroundService` is intentionally minimal (no polling loops,
  no wake locks) — all detection is event-driven via
  `FocusAccessibilityService`, which is what keeps battery usage low.
- `getUsageStats()` uses Android's own `UsageStatsManager` (system-tracked,
  zero extra battery cost) for the usage screen; `UsageTracker.kt` is a
  lightweight supplementary live counter.
- iOS does **not** allow third-party app blocking or foreground-app
  detection at the OS level — this module is Android-only by design.
