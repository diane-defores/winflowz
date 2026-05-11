package com.winflowz_app.winflowz_app.ime

import android.view.KeyCharacterMap
import android.view.KeyEvent
import android.view.inputmethod.ExtractedText
import android.view.inputmethod.ExtractedTextRequest
import android.view.inputmethod.InputConnection

data class KeyboardSelectionState(
    val selectionStart: Int,
    val selectionEnd: Int,
    val candidatesStart: Int = -1,
    val candidatesEnd: Int = -1,
) {
    val isAvailable: Boolean
        get() = selectionStart >= 0 && selectionEnd >= 0

    val hasSelection: Boolean
        get() = isAvailable && selectionStart != selectionEnd

    companion object {
        val Unavailable = KeyboardSelectionState(-1, -1)

        fun fromEditorBounds(
            selectionStart: Int,
            selectionEnd: Int,
        ): KeyboardSelectionState {
            if (selectionStart < 0 || selectionEnd < 0) {
                return Unavailable
            }
            return KeyboardSelectionState(selectionStart, selectionEnd)
        }
    }
}

enum class KeyboardEditorResult {
    Applied,
    Unavailable,
    Rejected,
    Unconfirmed,
    ;

    val applied: Boolean
        get() = this == Applied
}

class InputConnectionEditor(
    private val inputConnection: InputConnection?,
) {
    fun hasActiveConnection(): Boolean = inputConnection != null

    fun selectedText(): CharSequence? = inputConnection?.getSelectedText(0)

    fun textBeforeCursor(
        maxChars: Int,
        flags: Int = 0,
    ): CharSequence? = inputConnection?.getTextBeforeCursor(maxChars, flags)

    fun commitText(text: String): KeyboardEditorResult {
        val connection = inputConnection ?: return KeyboardEditorResult.Unavailable
        return if (connection.commitText(text, 1)) {
            KeyboardEditorResult.Applied
        } else {
            KeyboardEditorResult.Rejected
        }
    }

    fun deleteCodePointsBefore(count: Int): KeyboardEditorResult {
        if (count <= 0) {
            return KeyboardEditorResult.Rejected
        }
        val connection = inputConnection ?: return KeyboardEditorResult.Unavailable
        if (connection.deleteSurroundingTextInCodePoints(count, 0)) {
            return KeyboardEditorResult.Applied
        }
        return if (connection.deleteSurroundingText(count, 0)) {
            KeyboardEditorResult.Applied
        } else {
            KeyboardEditorResult.Rejected
        }
    }

    fun performEditorAction(actionId: Int): KeyboardEditorResult {
        val connection = inputConnection ?: return KeyboardEditorResult.Unavailable
        return if (connection.performEditorAction(actionId)) {
            KeyboardEditorResult.Applied
        } else {
            KeyboardEditorResult.Rejected
        }
    }

    fun sendSoftKey(
        keyCode: Int,
        metaState: Int,
    ): KeyboardEditorResult {
        val connection = inputConnection ?: return KeyboardEditorResult.Unavailable
        val down =
            KeyEvent(
                0L,
                0L,
                KeyEvent.ACTION_DOWN,
                keyCode,
                0,
                metaState,
                KeyCharacterMap.VIRTUAL_KEYBOARD,
                0,
                KeyEvent.FLAG_SOFT_KEYBOARD,
            )
        val up =
            KeyEvent(
                0L,
                0L,
                KeyEvent.ACTION_UP,
                keyCode,
                0,
                metaState,
                KeyCharacterMap.VIRTUAL_KEYBOARD,
                0,
                KeyEvent.FLAG_SOFT_KEYBOARD,
            )
        return if (connection.sendKeyEvent(down) && connection.sendKeyEvent(up)) {
            KeyboardEditorResult.Applied
        } else {
            KeyboardEditorResult.Rejected
        }
    }

    fun moveWordCursor(left: Boolean): KeyboardEditorResult {
        val extracted = extractedText() ?: return KeyboardEditorResult.Unavailable
        val text = extracted.text?.toString() ?: return KeyboardEditorResult.Unavailable
        val selection = extracted.selectionStart.coerceIn(0, text.length)
        val target =
            if (left) {
                KeyboardTextNavigation.previousWordBoundary(text, selection)
            } else {
                KeyboardTextNavigation.nextWordBoundary(text, selection)
            }
        return moveSelectionFromExtracted(extracted, target)
    }

    fun moveLineBoundary(start: Boolean): KeyboardEditorResult {
        val extracted = extractedText() ?: return KeyboardEditorResult.Unavailable
        val text = extracted.text?.toString() ?: return KeyboardEditorResult.Unavailable
        val selection = extracted.selectionStart.coerceIn(0, text.length)
        val target = KeyboardTextNavigation.lineBoundary(text, selection, start)
        return moveSelectionFromExtracted(extracted, target)
    }

    private fun moveSelectionFromExtracted(
        extracted: ExtractedText,
        target: Int,
    ): KeyboardEditorResult {
        val connection = inputConnection ?: return KeyboardEditorResult.Unavailable
        val text = extracted.text?.toString() ?: return KeyboardEditorResult.Unavailable
        val selection = extracted.selectionStart.coerceIn(0, text.length)
        if (target == selection) {
            return KeyboardEditorResult.Unavailable
        }
        if (!connection.setSelection(target, target)) {
            return KeyboardEditorResult.Rejected
        }
        val confirmed = extractedText()
        if (confirmed != null && confirmed.selectionStart == target && confirmed.selectionEnd == target) {
            return KeyboardEditorResult.Applied
        }
        return KeyboardEditorResult.Unconfirmed
    }

    private fun extractedText(): ExtractedText? {
        return inputConnection?.getExtractedText(ExtractedTextRequest(), 0)
    }
}

object KeyboardTextNavigation {
    fun previousWordBoundary(
        text: String,
        cursor: Int,
    ): Int {
        if (cursor <= 0) {
            return 0
        }
        var index = cursor.coerceAtMost(text.length) - 1
        while (index >= 0 && text[index].isWhitespace()) {
            index--
        }
        while (index >= 0 && !text[index].isWhitespace()) {
            index--
        }
        return (index + 1).coerceAtLeast(0)
    }

    fun nextWordBoundary(
        text: String,
        cursor: Int,
    ): Int {
        if (cursor >= text.length) {
            return text.length
        }
        var index = cursor.coerceAtLeast(0)
        while (index < text.length && !text[index].isWhitespace()) {
            index++
        }
        while (index < text.length && text[index].isWhitespace()) {
            index++
        }
        return index.coerceAtMost(text.length)
    }

    fun lineBoundary(
        text: String,
        cursor: Int,
        start: Boolean,
    ): Int {
        val selection = cursor.coerceIn(0, text.length)
        return if (start) {
            val previousLineBreak = text.lastIndexOf('\n', maxOf(0, selection - 1))
            if (previousLineBreak < 0) 0 else previousLineBreak + 1
        } else {
            val nextLineBreak = text.indexOf('\n', selection)
            if (nextLineBreak < 0) text.length else nextLineBreak
        }
    }
}
