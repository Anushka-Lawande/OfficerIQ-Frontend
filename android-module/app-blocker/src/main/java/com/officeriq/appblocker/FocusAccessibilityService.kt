package com.officeriq.appblocker

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

/**
 * Detects the foreground app via window-state-changed accessibility events.
 * When focus mode is active and the foreground app is in the blocked list,
 * it launches the OfficerIQ blocking overlay activity on top of it.
 */
class FocusAccessibilityService : AccessibilityService() {

    private var lastForegroundPackage: String? = null

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val packageName = event.packageName?.toString() ?: return
        if (packageName == lastForegroundPackage) return
        lastForegroundPackage = packageName

        // Ignore our own app / system UI
        if (packageName == applicationContext.packageName) return

        UsageTracker.recordForegroundApp(applicationContext, packageName)

        if (!BlockedAppsStore.isFocusActive(applicationContext)) return
        val blocked = BlockedAppsStore.getBlockedApps(applicationContext)
        if (blocked.contains(packageName)) {
            showBlockOverlay(packageName)
        }
    }

    private fun showBlockOverlay(blockedPackage: String) {
        val intent = Intent(this, BlockOverlayActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        intent.putExtra("blockedPackage", blockedPackage)
        startActivity(intent)
    }

    override fun onInterrupt() {}
}
