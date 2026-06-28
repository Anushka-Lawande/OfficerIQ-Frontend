package com.officeriq.appblocker

import android.content.Context

/**
 * Lightweight in-prefs usage tracker that accumulates foreground dwell time
 * per package, computed from consecutive foreground-app-change events fired
 * by FocusAccessibilityService. This complements UsageStatsManager (queried
 * directly from JS via getUsageStats) with a live, low-overhead counter.
 */
object UsageTracker {
    private const val PREFS = "officeriq_usage_prefs"
    private var lastPackage: String? = null
    private var lastTimestamp: Long = 0L

    fun recordForegroundApp(ctx: Context, packageName: String) {
        val now = System.currentTimeMillis()
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

        if (lastPackage != null && lastTimestamp > 0) {
            val elapsed = now - lastTimestamp
            // Guard against backgrounded/clock-skew spikes
            if (elapsed in 0..(10 * 60 * 1000)) {
                val key = "usage_$lastPackage"
                val existing = prefs.getLong(key, 0L)
                prefs.edit().putLong(key, existing + elapsed).apply()
            }
        }
        lastPackage = packageName
        lastTimestamp = now
    }

    fun getAllUsage(ctx: Context): Map<String, Long> {
        val prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        return prefs.all
            .filterKeys { it.startsWith("usage_") }
            .mapKeys { it.key.removePrefix("usage_") }
            .mapValues { (it.value as? Long) ?: 0L }
    }
}
