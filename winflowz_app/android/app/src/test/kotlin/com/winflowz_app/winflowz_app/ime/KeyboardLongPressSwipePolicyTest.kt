package com.winflowz_app.winflowz_app.ime

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class KeyboardLongPressSwipePolicyTest {
    @Test
    fun `does not activate while pointer stays inside the start key`() {
        val activate =
            KeyboardLongPressSwipePolicy.canActivateFromKeyExit(
                consumedByProtectedInteraction = false,
                longPressTriggered = false,
                keyEnabled = true,
                pointerInsideStartKey = true,
            )

        assertFalse(activate)
    }

    @Test
    fun `does not activate after an immobile long press consumed the action`() {
        val activate =
            KeyboardLongPressSwipePolicy.canActivateFromKeyExit(
                consumedByProtectedInteraction = false,
                longPressTriggered = true,
                keyEnabled = true,
                pointerInsideStartKey = false,
            )

        assertFalse(activate)
    }

    @Test
    fun `activates only when an eligible pointer exits before long press consumption`() {
        val activate =
            KeyboardLongPressSwipePolicy.canActivateFromKeyExit(
                consumedByProtectedInteraction = false,
                longPressTriggered = false,
                keyEnabled = true,
                pointerInsideStartKey = false,
            )

        assertTrue(activate)
    }

    @Test
    fun `chooses the only target action even when the pointer is centered`() {
        val selection =
            KeyboardLongPressSwipePolicy.chooseTargetSelection(
                candidates = listOf(GestureSelection.Up),
                targetX = 50f,
                targetY = 50f,
                centerX = 50f,
                centerY = 50f,
            )

        assertEquals(GestureSelection.Up, selection)
    }

    @Test
    fun `chooses the first available target action by priority`() {
        val right =
            KeyboardLongPressSwipePolicy.chooseTargetSelection(
                candidates = listOf(GestureSelection.Left, GestureSelection.Right),
                targetX = 24f,
                targetY = 50f,
                centerX = 50f,
                centerY = 50f,
            )
        val up =
            KeyboardLongPressSwipePolicy.chooseTargetSelection(
                candidates = listOf(GestureSelection.Down, GestureSelection.Up),
                targetX = 76f,
                targetY = 50f,
                centerX = 50f,
                centerY = 50f,
            )

        assertEquals(GestureSelection.Right, right)
        assertEquals(GestureSelection.Up, up)
    }

    @Test
    fun `ignores pointer side once priority has resolved the action`() {
        val leftSide =
            KeyboardLongPressSwipePolicy.chooseTargetSelection(
                candidates = listOf(GestureSelection.Up, GestureSelection.Down),
                targetX = 50f,
                targetY = 24f,
                centerX = 50f,
                centerY = 50f,
            )
        val rightSide =
            KeyboardLongPressSwipePolicy.chooseTargetSelection(
                candidates = listOf(GestureSelection.Up, GestureSelection.Down),
                targetX = 50f,
                targetY = 76f,
                centerX = 50f,
                centerY = 50f,
            )

        assertEquals(GestureSelection.Up, leftSide)
        assertEquals(GestureSelection.Up, rightSide)
    }
}
