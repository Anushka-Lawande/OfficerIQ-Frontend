package com.officeriq.appblocker

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

/**
 * Minimal foreground service whose only job is to keep the process alive
 * with a low-priority persistent notification so Android doesn't kill the
 * accessibility-event listener / usage tracker. All real detection work
 * happens in FocusAccessibilityService (event-driven, not polling), which
 * is what keeps this battery-efficient — no busy-loops or periodic wake
 * locks are used here.
 */
class MonitoringForegroundService : Service() {

    private val channelId = "officeriq_focus_channel"

    override fun onCreate() {
        super.onCreate()
        createChannelIfNeeded()
        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("OfficerIQ Focus Mode")
            .setContentText("Blocking distracting apps while you study.")
            .setSmallIcon(android.R.drawable.ic_lock_lock)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_MIN)
            .build()
        startForeground(1001, notification)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // START_STICKY: let the OS restart the service if it's killed under
        // memory pressure, without us polling anything in the meantime.
        return START_STICKY
    }

    private fun createChannelIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)
            val channel = NotificationChannel(
                channelId,
                "Focus Mode",
                NotificationManager.IMPORTANCE_MIN
            )
            manager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
