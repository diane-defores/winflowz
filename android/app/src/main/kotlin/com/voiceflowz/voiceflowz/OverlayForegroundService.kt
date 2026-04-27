package com.voiceflowz.voiceflowz

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder

class OverlayForegroundService : Service() {
    companion object {
        const val ACTION_START = "com.voiceflowz.voiceflowz.overlay.START"
        const val ACTION_STOP = "com.voiceflowz.voiceflowz.overlay.STOP"
        const val ACTION_CANCEL = "com.voiceflowz.voiceflowz.overlay.CANCEL"

        private const val notificationChannelId = "voiceflowz_overlay_recording"
        private const val notificationChannelName = "VoiceFlowz Overlay Recording"
        private const val notificationId = 71011

        private val lock = Any()

        @Volatile
        private var running = false

        fun isRunning(): Boolean = running
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return when (intent?.action) {
            ACTION_START -> {
                handleStart()
                START_STICKY
            }
            ACTION_STOP, ACTION_CANCEL -> {
                handleStop()
                START_NOT_STICKY
            }
            else -> START_NOT_STICKY
        }
    }

    override fun onDestroy() {
        synchronized(lock) {
            running = false
        }
        super.onDestroy()
    }

    private fun handleStart() {
        synchronized(lock) {
            if (running) {
                return
            }
            createNotificationChannelIfNeeded()
            startForeground(notificationId, buildNotification())
            running = true
        }
    }

    private fun handleStop() {
        synchronized(lock) {
            if (!running) {
                return
            }
            running = false
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                stopForeground(STOP_FOREGROUND_REMOVE)
            } else {
                @Suppress("DEPRECATION")
                stopForeground(true)
            }
            stopSelf()
        }
    }

    private fun createNotificationChannelIfNeeded() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return
        }
        val manager =
            getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val existing = manager.getNotificationChannel(notificationChannelId)
        if (existing != null) {
            return
        }
        val channel =
            NotificationChannel(
                notificationChannelId,
                notificationChannelName,
                NotificationManager.IMPORTANCE_LOW,
            ).apply {
                description = "Foreground notification while overlay recording is active."
            }
        manager.createNotificationChannel(channel)
    }

    private fun buildNotification(): Notification {
        val builder =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Notification.Builder(this, notificationChannelId)
            } else {
                @Suppress("DEPRECATION")
                Notification.Builder(this)
            }
        return builder
            .setContentTitle("VoiceFlowz overlay recording")
            .setContentText("Recording in progress. Stop or cancel from VoiceFlowz.")
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setOngoing(true)
            .build()
    }
}
