package com.winflowz_app.winflowz_app.ime

import android.content.Intent
import android.inputmethodservice.InputMethodService
import android.view.inputmethod.InputMethodSubtype
import android.view.KeyEvent
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import com.winflowz_app.winflowz_app.MainActivity

class WinFlowzAppInputMethodService : InputMethodService(), WinFlowzAppKeyboardView.Callbacks {
    private lateinit var stateStore: KeyboardStateStore
    private lateinit var mediaController: KeyboardMediaController
    private lateinit var clipboardController: KeyboardClipboardController
    private lateinit var voiceController: KeyboardVoiceController
    private var keyboardView: WinFlowzAppKeyboardView? = null
    private var fieldPolicy =
        KeyboardSecurityPolicy.evaluate(null, KeyboardStateStore.PRIVACY_AUTO)
    private var inputContext = KeyboardInputContextResolver.resolve(null)
    private var selectionState = KeyboardSelectionState.Unavailable

    override fun onCreate() {
        super.onCreate()
        stateStore = KeyboardStateStore(this)
        mediaController = KeyboardMediaController(this)
        clipboardController = KeyboardClipboardController(this)
        voiceController =
            KeyboardVoiceController(
                context = this,
                onState = { message -> keyboardView?.setStatus(message) },
                onResult = { text ->
                    val editor = editor()
                    if (!editor.hasActiveConnection()) {
                        showStatus("Dictation result ignored: no active field")
                        return@KeyboardVoiceController
                    }
                    val committed = editor.commitText(text)
                    if (!committed.reportFailure("Dictation text rejected by field")) {
                        return@KeyboardVoiceController
                    }
                    if (stateStore.clipboardSyncDesired && fieldPolicy.clipboardAllowed) {
                        KeyboardClipboardEventQueue.enqueue(
                            context = this,
                            content = text,
                            source = "keyboard_voice",
                            action = "voice_result",
                        )
                    }
                },
            )
    }

    override fun onCreateInputView(): View {
        val view = WinFlowzAppKeyboardView(this, this)
        keyboardView = view
        view.applyPolicy(fieldPolicy)
        applyRuntimePreferencesToView()
        view.applyInputContext(
            contextMode = inputContext.fieldContext,
            enterActionLabel = inputContext.enterLabel,
        )
        return view
    }

    override fun onStartInput(attribute: EditorInfo?, restarting: Boolean) {
        super.onStartInput(attribute, restarting)
        refreshInputState(attribute)
    }

    override fun onStartInputView(
        info: EditorInfo?,
        restarting: Boolean,
    ) {
        super.onStartInputView(info, restarting)
        refreshInputState(info)
    }

    override fun onCurrentInputMethodSubtypeChanged(newSubtype: InputMethodSubtype?) {
        super.onCurrentInputMethodSubtypeChanged(newSubtype)
        refreshInputState(currentInputEditorInfo)
    }

    override fun onEvaluateFullscreenMode(): Boolean {
        return false
    }

    override fun onEvaluateInputViewShown(): Boolean {
        super.onEvaluateInputViewShown()
        return true
    }

    private fun refreshInputState(attribute: EditorInfo?) {
        fieldPolicy = KeyboardSecurityPolicy.evaluate(attribute, stateStore.privacyMode)
        inputContext = KeyboardInputContextResolver.resolve(attribute)
        selectionState =
            KeyboardSelectionState.fromEditorBounds(
                selectionStart = attribute?.initialSelStart ?: -1,
                selectionEnd = attribute?.initialSelEnd ?: -1,
            )
        keyboardView?.applyPolicy(fieldPolicy)
        applyRuntimePreferencesToView()
        keyboardView?.applyInputContext(
            contextMode = inputContext.fieldContext,
            enterActionLabel = inputContext.enterLabel,
        )
    }

    override fun onUpdateSelection(
        oldSelStart: Int,
        oldSelEnd: Int,
        newSelStart: Int,
        newSelEnd: Int,
        candidatesStart: Int,
        candidatesEnd: Int,
    ) {
        super.onUpdateSelection(
            oldSelStart,
            oldSelEnd,
            newSelStart,
            newSelEnd,
            candidatesStart,
            candidatesEnd,
        )
        selectionState =
            KeyboardSelectionState(
                selectionStart = newSelStart,
                selectionEnd = newSelEnd,
                candidatesStart = candidatesStart,
                candidatesEnd = candidatesEnd,
            )
    }

    override fun onFinishInput() {
        voiceController.cancel()
        selectionState = KeyboardSelectionState.Unavailable
        super.onFinishInput()
    }

    override fun onDestroy() {
        voiceController.destroy()
        super.onDestroy()
    }

    override fun onText(text: String): Boolean {
        if (!fieldPolicy.inputAllowed) {
            showStatus("Input unavailable")
            return false
        }
        val editor = editor()
        if (!editor.hasActiveConnection()) {
            showStatus("Input unavailable: no active field")
            return false
        }
        return commitWithTypingCorrections(editor, text)
    }

    override fun onEmojiInserted(emoji: String) {
        stateStore.pushEmojiRecent(emoji, privateMode = fieldPolicy.privateMode)
        applyRuntimePreferencesToView()
    }

    override fun onBackspace(): Boolean {
        val editor = editor()
        if (!editor.hasActiveConnection()) {
            showStatus("Delete unavailable: no active field")
            return false
        }
        if (selectionState.hasSelection || !editor.selectedText().isNullOrEmpty()) {
            return editor.commitText("").reportFailure("Delete selection rejected by field")
        }
        val deleted = editor.deleteCodePointsBefore(1)
        if (!deleted.applied) {
            showStatus("Delete rejected by field")
        }
        return deleted.applied
    }

    override fun onDeleteWordBefore(): Boolean {
        val editor = editor()
        if (!editor.hasActiveConnection()) {
            return false
        }
        if (selectionState.hasSelection || !editor.selectedText().isNullOrEmpty()) {
            return editor.commitText("").reportFailure("Delete selection rejected by field")
        }
        val before = editor.textBeforeCursor(128)?.toString().orEmpty()
        if (before.isEmpty()) {
            return false
        }
        var index = before.length - 1
        while (index >= 0 && before[index].isWhitespace()) {
            index--
        }
        if (index < 0) {
            return editor.deleteCodePointsBefore(before.codePointCount(0, before.length)).applied
        }
        while (index >= 0 && !before[index].isWhitespace()) {
            index--
        }
        val segment = before.substring(index + 1)
        val codePointCount = segment.codePointCount(0, segment.length)
        return editor.deleteCodePointsBefore(codePointCount).applied
    }

    override fun onEnter(): Boolean {
        val editor = editor()
        if (!editor.hasActiveConnection()) {
            showStatus("Enter unavailable: no active field")
            return false
        }
        val actionId = inputContext.actionId
        if (actionId != EditorInfo.IME_ACTION_NONE) {
            if (editor.performEditorAction(actionId).applied) {
                return true
            }
        } else {
            return sendSoftKey(KeyEvent.KEYCODE_ENTER, 0)
        }
        return sendSoftKey(KeyEvent.KEYCODE_ENTER, 0)
    }

    override fun onVoice() {
        if (!stateStore.voiceEnabled) {
            showStatus("Dictation disabled in WinFlowzApp settings")
            return
        }
        if (!fieldPolicy.voiceAllowed) {
            showStatus("Dictation disabled for private field")
            return
        }
        voiceController.start()
    }

    override fun onCopySelection() {
        if (!fieldPolicy.clipboardAllowed) {
            showStatus("Clipboard capture disabled for private field")
            return
        }
        val copied =
            clipboardController.copySelection(
                currentInputConnection,
                syncDesired = stateStore.clipboardSyncDesired,
            )
        showStatus(if (copied) "Selection copied" else "No selectable text")
    }

    override fun onPasteClipboard(): Boolean {
        if (!fieldPolicy.clipboardAllowed) {
            showStatus("Clipboard paste disabled for private field")
            return false
        }
        val pasted =
            clipboardController.pastePrimaryText(
                currentInputConnection,
                syncDesired = stateStore.clipboardSyncDesired,
            )
        showStatus(if (pasted) "Clipboard pasted" else "No text clipboard")
        return pasted
    }

    override fun onSnippets() {
        if (!fieldPolicy.snippetsAllowed) {
            showStatus("Snippets disabled for private field")
            return
        }
        onSettings()
        showStatus("Open WinFlowzApp snippets from the app")
    }

    override fun onSettings() {
        val intent =
            Intent(this, MainActivity::class.java).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
        startActivity(intent)
    }

    override fun onMediaPlayPause() {
        if (!stateStore.mediaControlsEnabled) {
            showStatus("Media controls disabled")
            return
        }
        mediaController.playPause()
        showStatus("Play/pause sent")
    }

    override fun onMediaPrevious() {
        if (!stateStore.mediaControlsEnabled) {
            showStatus("Media controls disabled")
            return
        }
        mediaController.previous()
        showStatus("Previous sent")
    }

    override fun onMediaNext() {
        if (!stateStore.mediaControlsEnabled) {
            showStatus("Media controls disabled")
            return
        }
        mediaController.next()
        showStatus("Next sent")
    }

    override fun onNavigateCharLeft(): Boolean = sendSoftKey(KeyEvent.KEYCODE_DPAD_LEFT, 0)

    override fun onNavigateCharRight(): Boolean = sendSoftKey(KeyEvent.KEYCODE_DPAD_RIGHT, 0)

    override fun onNavigateWordLeft(): Boolean {
        val moved = if (inputContext.selectionModeAllowed) editor().moveWordCursor(left = true).applied else false
        return moved || sendSoftKey(KeyEvent.KEYCODE_DPAD_LEFT, KeyEvent.META_CTRL_ON)
    }

    override fun onNavigateWordRight(): Boolean {
        val moved = if (inputContext.selectionModeAllowed) editor().moveWordCursor(left = false).applied else false
        return moved || sendSoftKey(KeyEvent.KEYCODE_DPAD_RIGHT, KeyEvent.META_CTRL_ON)
    }

    override fun onNavigateLineStart(): Boolean {
        val moved = if (inputContext.selectionModeAllowed) editor().moveLineBoundary(start = true).applied else false
        return moved || sendSoftKey(KeyEvent.KEYCODE_MOVE_HOME, 0)
    }

    override fun onNavigateLineEnd(): Boolean {
        val moved = if (inputContext.selectionModeAllowed) editor().moveLineBoundary(start = false).applied else false
        return moved || sendSoftKey(KeyEvent.KEYCODE_MOVE_END, 0)
    }

    override fun onLayoutProfileChanged(profile: KeyboardLayoutProfile) {
        stateStore.layoutProfile = profile
        applyRuntimePreferencesToView()
        showStatus("Layout ${profile.name}")
    }

    override fun onCornerModeChanged(enabled: Boolean) {
        stateStore.cornerModeEnabled = enabled
        applyRuntimePreferencesToView()
        showStatus(if (enabled) "Corner mode enabled" else "Corner mode disabled")
    }

    override fun onDebugTouchOverlayChanged(enabled: Boolean) {
        stateStore.debugTouchOverlayEnabled = enabled
        applyRuntimePreferencesToView()
        showStatus(if (enabled) "Touch debug enabled" else "Touch debug disabled")
    }

    override fun onDoubleSpacePeriodChanged(enabled: Boolean) {
        stateStore.doubleSpacePeriodEnabled = enabled
        applyRuntimePreferencesToView()
        showStatus(if (enabled) "Double-space period enabled" else "Double-space period disabled")
    }

    override fun onPunctuationAutoSpacingChanged(enabled: Boolean) {
        stateStore.punctuationAutoSpacingEnabled = enabled
        applyRuntimePreferencesToView()
        showStatus(if (enabled) "Punctuation spacing enabled" else "Punctuation spacing disabled")
    }

    private fun applyRuntimePreferencesToView() {
        val emojiRecents =
            if (fieldPolicy.privateMode) {
                emptyList()
            } else {
                stateStore.emojiRecents()
            }
        keyboardView?.applyRuntimePreferences(
            profile = stateStore.layoutProfile,
            cornersEnabled = stateStore.cornerModeEnabled,
            debugTouchOverlay = stateStore.debugTouchOverlayEnabled,
            doubleSpacePeriod = stateStore.doubleSpacePeriodEnabled,
            punctuationAutoSpacing = stateStore.punctuationAutoSpacingEnabled,
            recents = emojiRecents,
        )
    }

    private fun shouldSuppressAutoCorrections(): Boolean {
        if (fieldPolicy.privateMode) {
            return true
        }
        return inputContext.fieldContext in
            setOf(
                KeyboardFieldContextMode.Email,
                KeyboardFieldContextMode.Url,
                KeyboardFieldContextMode.Phone,
                KeyboardFieldContextMode.Number,
            )
    }

    private fun commitWithTypingCorrections(
        editor: InputConnectionEditor,
        text: String,
    ): Boolean {
        if (text.isEmpty()) {
            return true
        }

        if (!shouldSuppressAutoCorrections()) {
            if (stateStore.doubleSpacePeriodEnabled && text == " ") {
                when (applyDoubleSpacePeriod(editor)) {
                    TextCorrectionResult.Applied -> return true
                    TextCorrectionResult.Failed -> return false
                    TextCorrectionResult.NotApplied -> Unit
                }
            }
            if (stateStore.punctuationAutoSpacingEnabled) {
                val spaced = applyPunctuationAutoSpacing(editor, text)
                if (spaced != null) {
                    return editor.commitText(spaced).reportFailure("Punctuation insertion rejected by field")
                }
            }
        }

        return editor.commitText(text).reportFailure("Text input rejected by field")
    }

    private fun applyDoubleSpacePeriod(editor: InputConnectionEditor): TextCorrectionResult {
        val before = editor.textBeforeCursor(3)?.toString().orEmpty()
        if (!before.endsWith(" ") || before.length < 2) {
            return TextCorrectionResult.NotApplied
        }
        val previous = before[before.length - 2]
        if (!previous.isLetterOrDigit()) {
            return TextCorrectionResult.NotApplied
        }
        if (!editor.deleteCodePointsBefore(1).applied) {
            showStatus("Double-space correction rejected by field")
            return TextCorrectionResult.Failed
        }
        val committed = editor.commitText(". ").reportFailure("Double-space correction rejected by field")
        return if (committed) {
            TextCorrectionResult.Applied
        } else {
            TextCorrectionResult.Failed
        }
    }

    private fun applyPunctuationAutoSpacing(
        editor: InputConnectionEditor,
        text: String,
    ): String? {
        if (text.length != 1) {
            return null
        }
        val symbol = text[0]
        val before = editor.textBeforeCursor(1)?.toString().orEmpty()
        return when (symbol) {
            ':', ';', '!', '?' -> {
                val prefix = if (before.isNotEmpty() && !before.last().isWhitespace()) " " else ""
                "$prefix$symbol "
            }
            '.', ',' -> {
                if (before.isEmpty()) {
                    symbol.toString()
                } else {
                    "$symbol "
                }
            }
            else -> null
        }
    }

    private fun sendSoftKey(
        keyCode: Int,
        metaState: Int,
    ): Boolean = editor().sendSoftKey(keyCode, metaState).applied

    private fun editor(): InputConnectionEditor = InputConnectionEditor(currentInputConnection)

    private fun KeyboardEditorResult.reportFailure(failureStatus: String): Boolean {
        if (!applied) {
            showStatus(failureStatus)
        }
        return applied
    }

    private fun showStatus(message: String) {
        keyboardView?.setStatus(message)
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private enum class TextCorrectionResult {
        NotApplied,
        Applied,
        Failed,
    }
}
