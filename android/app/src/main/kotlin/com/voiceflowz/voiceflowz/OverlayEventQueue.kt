package com.voiceflowz.voiceflowz

import java.util.ArrayDeque

object OverlayEventQueue {
    private const val MAX_EVENTS = 100
    private val events = ArrayDeque<Map<String, Any>>()

    @Synchronized
    fun enqueue(eventType: String, payload: Map<String, Any>? = null) {
        if (eventType.isBlank()) {
            return
        }
        while (events.size >= MAX_EVENTS) {
            events.removeFirst()
        }
        events.addLast(
            buildMap {
                put("type", eventType)
                put("capturedAtEpochMillis", System.currentTimeMillis())
                if (!payload.isNullOrEmpty()) {
                    put("payload", HashMap(payload))
                }
            },
        )
    }

    @Synchronized
    fun drain(): List<Map<String, Any>> {
        val drained = events.toList()
        events.clear()
        return drained
    }

    @Synchronized
    fun size(): Int = events.size
}
