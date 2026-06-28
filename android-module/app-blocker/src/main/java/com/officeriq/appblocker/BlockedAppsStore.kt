package com.officeriq.appblocker

import android.content.Context

/**
 * Simple SharedPreferences-backed store so the Accessibility Service,
 * Foreground Service and React Native module all see the same state.
 */
object BlockedAppsStore {
    private const val PREFS = "officeriq_blocker_prefs"
    private const val KEY_BLOCKED_APPS = "blocked_apps"
    private const val KEY_BLOCKED_NOTIFS = "blocked_notification_apps"
    private const val KEY_FOCUS_ACTIVE = "focus_active"

    fun setBlockedApps(ctx: Context, packages: List<String>) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putStringSet(KEY_BLOCKED_APPS, packages.toSet())
            .apply()
    }

    fun getBlockedApps(ctx: Context): Set<String> {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getStringSet(KEY_BLOCKED_APPS, emptySet()) ?: emptySet()
    }

    fun setBlockedNotificationApps(ctx: Context, packages: List<String>) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putStringSet(KEY_BLOCKED_NOTIFS, packages.toSet())
            .apply()
    }

    fun getBlockedNotificationApps(ctx: Context): Set<String> {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getStringSet(KEY_BLOCKED_NOTIFS, emptySet()) ?: emptySet()
    }

    fun setFocusActive(ctx: Context, active: Boolean) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putBoolean(KEY_FOCUS_ACTIVE, active)
            .apply()
    }

    fun isFocusActive(ctx: Context): Boolean {
        return ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            .getBoolean(KEY_FOCUS_ACTIVE, false)
    }
}
