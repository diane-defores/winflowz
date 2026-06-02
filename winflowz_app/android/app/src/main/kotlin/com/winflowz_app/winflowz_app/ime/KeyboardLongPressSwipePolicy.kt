package com.winflowz_app.winflowz_app.ime

internal object KeyboardLongPressSwipePolicy {
    private val targetSelections =
        listOf(
            GestureSelection.Up,
            GestureSelection.Right,
            GestureSelection.Down,
            GestureSelection.Left,
        )

    fun canActivateFromKeyExit(
        consumedByProtectedInteraction: Boolean,
        longPressTriggered: Boolean,
        keyEnabled: Boolean,
        pointerInsideStartKey: Boolean,
    ): Boolean {
        return !consumedByProtectedInteraction &&
            !longPressTriggered &&
            keyEnabled &&
            !pointerInsideStartKey
    }

    fun chooseTargetSelection(
        candidates: Collection<GestureSelection>,
        targetX: Float,
        targetY: Float,
        centerX: Float,
        centerY: Float,
    ): GestureSelection? {
        return targetSelections.firstOrNull { it in candidates }
    }
}
