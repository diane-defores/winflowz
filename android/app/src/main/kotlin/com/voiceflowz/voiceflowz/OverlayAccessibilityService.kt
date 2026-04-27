package com.voiceflowz.voiceflowz

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent

class OverlayAccessibilityService : AccessibilityService() {
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Injection workflow is managed by explicit overlay actions.
    }

    override fun onInterrupt() {
        // Nothing to clean up yet.
    }
}
