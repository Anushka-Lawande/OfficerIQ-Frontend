package com.officeriq.appblocker

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

/**
 * Cancels notifications from apps the user selected to mute, as long as
 * Focus Mode is active. Requires the user to grant Notification Access
 * (a special permission, separate from POST_NOTIFICATIONS) in Settings.
 */
class NotificationBlockerService : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        if (sbn == null) return
        if (!BlockedAppsStore.isFocusActive(applicationContext)) return

        val blockedNotifApps = BlockedAppsStore.getBlockedNotificationApps(applicationContext)
        if (blockedNotifApps.contains(sbn.packageName)) {
            cancelNotification(sbn.key)
        }
    }
}
