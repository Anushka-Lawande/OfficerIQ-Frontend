package com.officeriq.appblocker

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.text.TextUtils
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class AppBlockerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "OfficerIQAppBlocker"

    private fun sendEvent(name: String, params: Any?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(name, params)
    }

    // ---------- Permissions ----------

    private fun isAccessibilityEnabled(): Boolean {
        val expectedComponentName = "${reactApplicationContext.packageName}/${FocusAccessibilityService::class.java.canonicalName}"
        val enabledServices = Settings.Secure.getString(
            reactApplicationContext.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: return false
        val colonSplitter = TextUtils.SimpleStringSplitter(':')
        colonSplitter.setString(enabledServices)
        while (colonSplitter.hasNext()) {
            if (colonSplitter.next().equals(expectedComponentName, ignoreCase = true)) return true
        }
        return false
    }

    private fun hasOverlayPermission(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Settings.canDrawOverlays(reactApplicationContext)
        } else true
    }

    private fun hasUsageAccess(): Boolean {
        val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = appOps.checkOpNoThrow(
            AppOpsManager.OPSTR_GET_USAGE_STATS,
            android.os.Process.myUid(),
            reactApplicationContext.packageName
        )
        return mode == AppOpsManager.MODE_ALLOWED
    }

    private fun hasNotificationAccess(): Boolean {
        val enabled = Settings.Secure.getString(
            reactApplicationContext.contentResolver,
            "enabled_notification_listeners"
        ) ?: return false
        return enabled.contains(reactApplicationContext.packageName)
    }

    @ReactMethod
    fun checkPermissions(promise: Promise) {
        val map = Arguments.createMap()
        map.putBoolean("accessibility", isAccessibilityEnabled())
        map.putBoolean("overlay", hasOverlayPermission())
        map.putBoolean("usageAccess", hasUsageAccess())
        map.putBoolean("notifications", hasNotificationAccess())
        promise.resolve(map)
    }

    @ReactMethod
    fun openAccessibilitySettings(promise: Promise) {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
        promise.resolve(null)
    }

    @ReactMethod
    fun openOverlaySettings(promise: Promise) {
        val intent = Intent(
            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:${reactApplicationContext.packageName}")
        )
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
        promise.resolve(null)
    }

    @ReactMethod
    fun openUsageAccessSettings(promise: Promise) {
        val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
        promise.resolve(null)
    }

    @ReactMethod
    fun openNotificationAccessSettings(promise: Promise) {
        val intent = Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS")
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        reactApplicationContext.startActivity(intent)
        promise.resolve(null)
    }

    // ---------- Installed apps ----------

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val apps = pm.getInstalledApplications(PackageManager.GET_META_DATA)
            val result = Arguments.createArray()
            for (appInfo in apps) {
                // Only list apps with a launcher icon (user-facing apps)
                val launchIntent = pm.getLaunchIntentForPackage(appInfo.packageName)
                if (launchIntent != null) {
                    val map = Arguments.createMap()
                    map.putString("packageName", appInfo.packageName)
                    map.putString("appName", pm.getApplicationLabel(appInfo).toString())
                    result.pushMap(map)
                }
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERR_INSTALLED_APPS", e)
        }
    }

    // ---------- Focus mode control ----------

    @ReactMethod
    fun startFocusMode(blockedPackages: ReadableArray, options: ReadableMap, promise: Promise) {
        val list = ArrayList<String>()
        for (i in 0 until blockedPackages.size()) list.add(blockedPackages.getString(i))

        BlockedAppsStore.setBlockedApps(reactApplicationContext, list)
        BlockedAppsStore.setFocusActive(reactApplicationContext, true)

        val serviceIntent = Intent(reactApplicationContext, MonitoringForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactApplicationContext.startForegroundService(serviceIntent)
        } else {
            reactApplicationContext.startService(serviceIntent)
        }

        val result = Arguments.createMap()
        result.putBoolean("started", true)
        promise.resolve(result)
    }

    @ReactMethod
    fun stopFocusMode(promise: Promise) {
        BlockedAppsStore.setFocusActive(reactApplicationContext, false)
        val serviceIntent = Intent(reactApplicationContext, MonitoringForegroundService::class.java)
        reactApplicationContext.stopService(serviceIntent)
        val result = Arguments.createMap()
        result.putBoolean("stopped", true)
        promise.resolve(result)
    }

    @ReactMethod
    fun isFocusModeActive(promise: Promise) {
        promise.resolve(BlockedAppsStore.isFocusActive(reactApplicationContext))
    }

    // ---------- Usage stats ----------

    @ReactMethod
    fun getUsageStats(rangeMs: Double, promise: Promise) {
        try {
            val usm = reactApplicationContext.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
            val end = System.currentTimeMillis()
            val start = end - rangeMs.toLong()
            val statsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, start, end)
            val map = Arguments.createMap()
            statsList?.forEach { stat ->
                if (stat.totalTimeInForeground > 0) {
                    val existing = if (map.hasKey(stat.packageName)) map.getDouble(stat.packageName) else 0.0
                    map.putDouble(stat.packageName, existing + stat.totalTimeInForeground)
                }
            }
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject("ERR_USAGE_STATS", e)
        }
    }

    // ---------- Notification blocking ----------

    @ReactMethod
    fun setBlockedNotificationApps(packages: ReadableArray, promise: Promise) {
        val list = ArrayList<String>()
        for (i in 0 until packages.size()) list.add(packages.getString(i))
        BlockedAppsStore.setBlockedNotificationApps(reactApplicationContext, list)
        val result = Arguments.createMap()
        result.putBoolean("ok", true)
        promise.resolve(result)
    }

    // Required for RN built-in Event Emitter calls
    @ReactMethod
    fun addListener(eventName: String) {}
    @ReactMethod
    fun removeListeners(count: Int) {}
}
