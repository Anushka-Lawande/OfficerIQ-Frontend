package com.officeriq.appblocker

import android.app.Activity
import android.os.Bundle
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.view.Gravity
import android.graphics.Color

/**
 * Full-screen "OfficerIQ" overlay shown when the user opens a blocked app
 * while Focus Mode is active. Built programmatically (no XML layout) to
 * keep the module self-contained / easy to drop into any RN app.
 */
class BlockOverlayActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.addFlags(
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        )

        val blockedPackage = intent.getStringExtra("blockedPackage") ?: ""

        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor("#13182B"))
            setPadding(48, 48, 48, 48)
        }

        val title = TextView(this).apply {
            text = "Stay Focused 🎯"
            textSize = 24f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
        }

        val subtitle = TextView(this).apply {
            text = "$blockedPackage is blocked during your Focus session.\nGet back to your UPSC/MPSC prep!"
            textSize = 14f
            setTextColor(Color.parseColor("#9CA3AF"))
            gravity = Gravity.CENTER
            setPadding(0, 24, 0, 40)
        }

        val backBtn = Button(this).apply {
            text = "Back to OfficerIQ"
            setOnClickListener {
                val launchIntent = packageManager.getLaunchIntentForPackage(applicationContext.packageName)
                if (launchIntent != null) startActivity(launchIntent)
                finish()
            }
        }

        val closeBtn = Button(this).apply {
            text = "Go to Home Screen"
            setOnClickListener {
                val homeIntent = android.content.Intent(android.content.Intent.ACTION_MAIN)
                homeIntent.addCategory(android.content.Intent.CATEGORY_HOME)
                startActivity(homeIntent)
                finish()
            }
        }

        root.addView(title)
        root.addView(subtitle)
        root.addView(backBtn)
        root.addView(closeBtn)
        setContentView(root)
    }

    override fun onBackPressed() {
        // Disable back button so the user can't dismiss the overlay back
        // into the blocked app — they must choose one of the buttons.
        moveTaskToBack(true)
    }
}
