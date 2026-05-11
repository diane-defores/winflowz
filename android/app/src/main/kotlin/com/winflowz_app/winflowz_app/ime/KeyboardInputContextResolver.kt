package com.winflowz_app.winflowz_app.ime

import android.text.InputType
import android.view.inputmethod.EditorInfo

data class KeyboardInputContext(
    val fieldContext: KeyboardFieldContextMode,
    val enterLabel: String,
    val actionId: Int,
    val selectionModeAllowed: Boolean,
)

object KeyboardInputContextResolver {
    fun resolve(editorInfo: EditorInfo?): KeyboardInputContext {
        val info = editorInfo ?: return defaultContext()
        val action = info.imeOptions and EditorInfo.IME_MASK_ACTION
        val fieldContext = contextFromInputType(info.inputType, action)
        return KeyboardInputContext(
            fieldContext = fieldContext,
            enterLabel = enterLabel(info),
            actionId = actionId(info),
            selectionModeAllowed = selectionModeAllowed(info.inputType),
        )
    }

    private fun defaultContext(): KeyboardInputContext {
        return KeyboardInputContext(
            fieldContext = KeyboardFieldContextMode.Text,
            enterLabel = "Enter",
            actionId = EditorInfo.IME_ACTION_NONE,
            selectionModeAllowed = false,
        )
    }

    private fun contextFromInputType(
        inputType: Int,
        action: Int,
    ): KeyboardFieldContextMode {
        val klass = inputType and InputType.TYPE_MASK_CLASS
        val variation = inputType and InputType.TYPE_MASK_VARIATION
        if (action == EditorInfo.IME_ACTION_SEARCH) {
            return KeyboardFieldContextMode.Search
        }
        if (klass == InputType.TYPE_CLASS_PHONE) {
            return KeyboardFieldContextMode.Phone
        }
        if (klass == InputType.TYPE_CLASS_NUMBER || klass == InputType.TYPE_CLASS_DATETIME) {
            return KeyboardFieldContextMode.Number
        }
        if (klass == InputType.TYPE_CLASS_TEXT && variation == InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS) {
            return KeyboardFieldContextMode.Email
        }
        if (klass == InputType.TYPE_CLASS_TEXT && variation == InputType.TYPE_TEXT_VARIATION_WEB_EMAIL_ADDRESS) {
            return KeyboardFieldContextMode.Email
        }
        if (klass == InputType.TYPE_CLASS_TEXT && variation == InputType.TYPE_TEXT_VARIATION_URI) {
            return KeyboardFieldContextMode.Url
        }
        return KeyboardFieldContextMode.Text
    }

    private fun enterLabel(info: EditorInfo): String {
        val action = info.imeOptions and EditorInfo.IME_MASK_ACTION
        return when {
            info.actionLabel != null -> info.actionLabel.toString()
            action == EditorInfo.IME_ACTION_SEARCH -> "Search"
            action == EditorInfo.IME_ACTION_SEND -> "Send"
            action == EditorInfo.IME_ACTION_GO -> "Go"
            action == EditorInfo.IME_ACTION_NEXT -> "Next"
            action == EditorInfo.IME_ACTION_DONE -> "Done"
            else -> "Enter"
        }
    }

    private fun actionId(info: EditorInfo): Int {
        if (info.actionLabel != null) {
            return info.actionId
        }
        return info.imeOptions and EditorInfo.IME_MASK_ACTION
    }

    private fun selectionModeAllowed(inputType: Int): Boolean {
        return (inputType and InputType.TYPE_MASK_CLASS) != InputType.TYPE_NULL
    }
}
