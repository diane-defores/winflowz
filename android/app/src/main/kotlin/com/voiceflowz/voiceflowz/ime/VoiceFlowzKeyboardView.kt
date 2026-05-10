package com.voiceflowz.voiceflowz.ime

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.graphics.Typeface
import android.view.HapticFeedbackConstants
import android.view.MotionEvent
import android.view.View
import android.view.View.MeasureSpec
import kotlin.math.max

class VoiceFlowzKeyboardView(
    context: Context,
    private val callbacks: Callbacks,
) : View(context) {
    interface Callbacks {
        fun onText(text: String)
        fun onBackspace()
        fun onEnter()
        fun onVoice()
        fun onCopySelection()
        fun onPasteClipboard()
        fun onSnippets()
        fun onSettings()
        fun onMediaPlayPause()
    }

    private enum class LayoutMode {
        Letters,
        Numbers,
        Accents,
        Symbols,
    }

    private enum class KeyAction {
        Text,
        Backspace,
        Enter,
        Shift,
        ModeLetters,
        ModeNumbers,
        ModeAccents,
        ModeSymbols,
        ToggleClipboard,
        CopySelection,
        PasteClipboard,
        ClosePanel,
        Voice,
        Snippets,
        Settings,
        Media,
    }

    private data class KeySpec(
        val id: String,
        val label: String,
        val output: String = label,
        val action: KeyAction = KeyAction.Text,
        val weight: Float = 1f,
        val enabled: Boolean = true,
        val active: Boolean = false,
        val secondaryTopLeft: String? = null,
        val secondaryTopRight: String? = null,
    )

    private data class RowSpec(
        val keys: List<KeySpec>,
        val leadingWeight: Float = 0f,
        val trailingWeight: Float = leadingWeight,
    )

    private data class KeyFrame(
        val key: KeySpec,
        val rect: RectF,
    )

    private var shifted = false
    private var layoutMode = LayoutMode.Letters
    private var clipboardPanelVisible = false
    private var fieldPolicy = KeyboardSecurityPolicy.evaluate(null, KeyboardStateStore.PRIVACY_AUTO)
    private var statusText = "VoiceFlowz"
    private var activeKeyId: String? = null
    private val keyFrames = mutableListOf<KeyFrame>()

    private val density = resources.displayMetrics.density
    private val outerPadding = dp(8f)
    private val keyGap = dp(5f)
    private val keyRadius = dp(8f)
    private val statusHeight = dp(30f)
    private val actionRowHeight = dp(40f)
    private val textRowHeight = dp(46f)
    private val controlRowHeight = dp(48f)
    private val clipboardRowHeight = dp(42f)

    private val backgroundPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(238, 241, 238)
    }
    private val privateBackgroundPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(246, 232, 226)
    }
    private val keyPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.WHITE
    }
    private val specialKeyPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(224, 230, 227)
    }
    private val activeKeyPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(23, 121, 93)
    }
    private val pressedKeyPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(202, 218, 211)
    }
    private val disabledKeyPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(214, 217, 215)
    }
    private val textPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(29, 35, 32)
        textAlign = Paint.Align.CENTER
        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
    }
    private val secondaryTextPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(92, 103, 98)
        textAlign = Paint.Align.CENTER
        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
    }
    private val statusPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.rgb(51, 61, 56)
        textAlign = Paint.Align.CENTER
        typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
    }

    init {
        isClickable = true
        isFocusable = true
        setBackgroundColor(Color.TRANSPARENT)
    }

    fun applyPolicy(policy: KeyboardFieldPolicy) {
        fieldPolicy = policy
        statusText =
            if (policy.privateMode) {
                "VoiceFlowz - private input (${policy.reason})"
            } else {
                "VoiceFlowz"
            }
        invalidate()
    }

    fun setStatus(message: String) {
        statusText = message
        invalidate()
    }

    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val width = MeasureSpec.getSize(widthMeasureSpec)
        val desiredHeight = desiredKeyboardHeight()
        setMeasuredDimension(width, resolveSize(desiredHeight, heightMeasureSpec))
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        keyFrames.clear()
        canvas.drawRect(
            0f,
            0f,
            width.toFloat(),
            height.toFloat(),
            if (fieldPolicy.privateMode) privateBackgroundPaint else backgroundPaint,
        )

        val left = outerPadding
        val right = width - outerPadding
        var y = outerPadding

        drawStatus(canvas, y, right - left)
        y += statusHeight + keyGap

        val rows = currentRows()
        rows.forEachIndexed { index, row ->
            val rowHeight = when {
                clipboardPanelVisible && index == 1 -> clipboardRowHeight
                index == 0 -> actionRowHeight
                index == rows.lastIndex -> controlRowHeight
                else -> textRowHeight
            }
            drawRow(canvas, row, left, y, right - left, rowHeight)
            y += rowHeight + keyGap
        }
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                val hit = hitTest(event.x, event.y)
                activeKeyId = hit?.key?.id
                invalidate()
                return true
            }
            MotionEvent.ACTION_MOVE -> {
                val hit = hitTest(event.x, event.y)
                val nextActive = hit?.key?.id
                if (nextActive != activeKeyId) {
                    activeKeyId = nextActive
                    invalidate()
                }
                return true
            }
            MotionEvent.ACTION_UP -> {
                val hit = hitTest(event.x, event.y)
                val active = activeKeyId
                activeKeyId = null
                invalidate()
                if (hit != null && hit.key.id == active && hit.key.enabled) {
                    dispatch(hit.key)
                }
                return true
            }
            MotionEvent.ACTION_CANCEL -> {
                activeKeyId = null
                invalidate()
                return true
            }
        }
        return super.onTouchEvent(event)
    }

    private fun drawStatus(canvas: Canvas, top: Float, contentWidth: Float) {
        statusPaint.textSize = sp(13f)
        val baseline = top + statusHeight / 2f - (statusPaint.descent() + statusPaint.ascent()) / 2f
        canvas.drawText(statusText, outerPadding + contentWidth / 2f, baseline, statusPaint)
    }

    private fun drawRow(
        canvas: Canvas,
        row: RowSpec,
        left: Float,
        top: Float,
        width: Float,
        height: Float,
    ) {
        val totalWeight =
            row.keys.sumOf { it.weight.toDouble() }.toFloat() + row.leadingWeight + row.trailingWeight
        val usableWidth = width - keyGap * max(0, row.keys.size - 1)
        val unit = usableWidth / totalWeight
        var x = left + unit * row.leadingWeight

        row.keys.forEach { key ->
            val keyWidth = unit * key.weight
            val rect = RectF(x, top, x + keyWidth, top + height)
            keyFrames.add(KeyFrame(key, rect))
            drawKey(canvas, key, rect)
            x += keyWidth + keyGap
        }
    }

    private fun drawKey(canvas: Canvas, key: KeySpec, rect: RectF) {
        val paint = when {
            !key.enabled -> disabledKeyPaint
            key.id == activeKeyId -> pressedKeyPaint
            key.active -> activeKeyPaint
            key.action == KeyAction.Text -> keyPaint
            else -> specialKeyPaint
        }
        canvas.drawRoundRect(rect, keyRadius, keyRadius, paint)

        val textColor =
            if (key.active) {
                Color.WHITE
            } else if (key.enabled) {
                Color.rgb(29, 35, 32)
            } else {
                Color.rgb(123, 130, 126)
            }
        textPaint.color = textColor
        textPaint.textSize = keyTextSize(key)
        val baseline = rect.centerY() - (textPaint.descent() + textPaint.ascent()) / 2f
        canvas.drawText(displayLabel(key), rect.centerX(), baseline, textPaint)

        if (key.secondaryTopLeft != null || key.secondaryTopRight != null) {
            secondaryTextPaint.textSize = sp(9f)
            secondaryTextPaint.color = if (key.enabled) Color.rgb(92, 103, 98) else Color.rgb(146, 151, 148)
            key.secondaryTopLeft?.let {
                canvas.drawText(it, rect.left + dp(10f), rect.top + dp(12f), secondaryTextPaint)
            }
            key.secondaryTopRight?.let {
                canvas.drawText(it, rect.right - dp(10f), rect.top + dp(12f), secondaryTextPaint)
            }
        }
    }

    private fun dispatch(key: KeySpec) {
        performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
        when (key.action) {
            KeyAction.Text -> {
                callbacks.onText(outputFor(key))
                if (shifted && layoutMode == LayoutMode.Letters) {
                    shifted = false
                    invalidate()
                }
            }
            KeyAction.Backspace -> callbacks.onBackspace()
            KeyAction.Enter -> callbacks.onEnter()
            KeyAction.Shift -> {
                shifted = !shifted
                invalidate()
            }
            KeyAction.ModeLetters -> {
                layoutMode = LayoutMode.Letters
                clipboardPanelVisible = false
                refreshLayout()
            }
            KeyAction.ModeNumbers -> {
                layoutMode = LayoutMode.Numbers
                clipboardPanelVisible = false
                refreshLayout()
            }
            KeyAction.ModeAccents -> {
                layoutMode = LayoutMode.Accents
                clipboardPanelVisible = false
                refreshLayout()
            }
            KeyAction.ModeSymbols -> {
                layoutMode = LayoutMode.Symbols
                clipboardPanelVisible = false
                refreshLayout()
            }
            KeyAction.ToggleClipboard -> {
                clipboardPanelVisible = !clipboardPanelVisible
                refreshLayout()
            }
            KeyAction.CopySelection -> callbacks.onCopySelection()
            KeyAction.PasteClipboard -> {
                callbacks.onPasteClipboard()
                clipboardPanelVisible = false
                refreshLayout()
            }
            KeyAction.ClosePanel -> {
                clipboardPanelVisible = false
                refreshLayout()
            }
            KeyAction.Voice -> callbacks.onVoice()
            KeyAction.Snippets -> callbacks.onSnippets()
            KeyAction.Settings -> callbacks.onSettings()
            KeyAction.Media -> callbacks.onMediaPlayPause()
        }
    }

    private fun currentRows(): List<RowSpec> {
        val rows = mutableListOf<RowSpec>()
        rows.add(actionRow())
        if (clipboardPanelVisible) {
            rows.add(clipboardRow())
        }
        rows.addAll(
            when (layoutMode) {
                LayoutMode.Letters -> letterRows()
                LayoutMode.Numbers -> numberRows()
                LayoutMode.Accents -> accentRows()
                LayoutMode.Symbols -> symbolRows()
            },
        )
        rows.add(controlRow())
        return rows
    }

    private fun actionRow(): RowSpec =
        RowSpec(
            listOf(
                modeKey("ABC", KeyAction.ModeLetters, layoutMode == LayoutMode.Letters),
                modeKey("123", KeyAction.ModeNumbers, layoutMode == LayoutMode.Numbers),
                modeKey("Acc", KeyAction.ModeAccents, layoutMode == LayoutMode.Accents),
                modeKey("Sym", KeyAction.ModeSymbols, layoutMode == LayoutMode.Symbols),
                KeySpec("clip", "Clip", action = KeyAction.ToggleClipboard, enabled = fieldPolicy.clipboardAllowed),
                KeySpec("mic", "Mic", action = KeyAction.Voice, enabled = fieldPolicy.voiceAllowed),
                KeySpec("snip", "Snip", action = KeyAction.Snippets, enabled = fieldPolicy.snippetsAllowed),
                KeySpec("gear", "Gear", action = KeyAction.Settings),
                KeySpec("media", ">||", action = KeyAction.Media),
            ),
        )

    private fun clipboardRow(): RowSpec =
        RowSpec(
            listOf(
                KeySpec("copy", "Copy", action = KeyAction.CopySelection, weight = 1.4f, enabled = fieldPolicy.clipboardAllowed),
                KeySpec("paste", "Paste", action = KeyAction.PasteClipboard, weight = 1.4f, enabled = fieldPolicy.clipboardAllowed),
                KeySpec("close", "Close", action = KeyAction.ClosePanel),
            ),
        )

    private fun letterRows(): List<RowSpec> =
        listOf(
            RowSpec("qwertyuiop".map { letterKey(it) }),
            RowSpec("asdfghjkl".map { letterKey(it) }, leadingWeight = 0.45f),
            RowSpec("zxcvbnm".map { letterKey(it) }, leadingWeight = 1.25f),
        )

    private fun numberRows(): List<RowSpec> =
        listOf(
            RowSpec("1234567890".map { textKey(it.toString()) }),
            RowSpec(listOf("-", "/", ":", ";", "(", ")", "$", "&", "@", "\"").map { textKey(it) }),
            RowSpec(listOf(".", ",", "?", "!", "'", "+", "=").map { textKey(it) }, leadingWeight = 1.2f),
        )

    private fun accentRows(): List<RowSpec> =
        listOf(
            RowSpec(
                listOf(
                    textKey("\u00e0"),
                    textKey("\u00e2"),
                    textKey("\u00e4"),
                    textKey("\u00e7"),
                    textKey("\u00e9"),
                    textKey("\u00e8"),
                    textKey("\u00ea"),
                    textKey("\u00eb"),
                ),
                leadingWeight = 0.4f,
            ),
            RowSpec(
                listOf(
                    textKey("\u00ee"),
                    textKey("\u00ef"),
                    textKey("\u00f4"),
                    textKey("\u00f6"),
                    textKey("\u00f9"),
                    textKey("\u00fb"),
                    textKey("\u00fc"),
                    textKey("\u00ff"),
                ),
                leadingWeight = 0.4f,
            ),
            RowSpec(
                listOf(
                    textKey("\u0153", weight = 1.2f),
                    textKey("\u00e6", weight = 1.2f),
                    textKey("\u00f1", weight = 1.2f),
                    textKey("\u2019", weight = 1.2f),
                    textKey("\u2014", weight = 1.2f),
                ),
                leadingWeight = 1.6f,
            ),
        )

    private fun symbolRows(): List<RowSpec> =
        listOf(
            RowSpec(listOf("[", "]", "{", "}", "#", "%", "^", "*", "+", "=").map { textKey(it) }),
            RowSpec(listOf("_", "\\", "|", "~", "<", ">", "\u20ac", "\u00a3", "\u00a5").map { textKey(it) }, leadingWeight = 0.45f),
            RowSpec(listOf(".", ",", "?", "!", "'", "`", "\u2022").map { textKey(it) }, leadingWeight = 1.2f),
        )

    private fun controlRow(): RowSpec =
        RowSpec(
            listOf(
                KeySpec("shift", "Maj", action = KeyAction.Shift, weight = 1.2f, active = shifted),
                KeySpec("comma", ",", output = ","),
                KeySpec("space", "Espace", output = " ", weight = 4.0f),
                KeySpec("period", ".", output = "."),
                KeySpec("enter", "Enter", action = KeyAction.Enter, weight = 1.3f),
                KeySpec("del", "Del", action = KeyAction.Backspace, weight = 1.2f),
            ),
        )

    private fun modeKey(label: String, action: KeyAction, active: Boolean): KeySpec =
        KeySpec(
            id = "mode-$label",
            label = label,
            action = action,
            active = active,
        )

    private fun letterKey(char: Char): KeySpec {
        val label = char.toString()
        return KeySpec(
            id = "letter-$label",
            label = label,
            output = label,
            secondaryTopLeft = secondaryFor(char, topLeft = true),
            secondaryTopRight = secondaryFor(char, topLeft = false),
        )
    }

    private fun textKey(label: String, output: String = label, weight: Float = 1f): KeySpec =
        KeySpec(
            id = "text-$label-$output",
            label = label,
            output = output,
            weight = weight,
        )

    private fun outputFor(key: KeySpec): String =
        if (shifted && layoutMode == LayoutMode.Letters && key.output.length == 1 && key.output[0].isLetter()) {
            key.output.uppercase()
        } else {
            key.output
        }

    private fun displayLabel(key: KeySpec): String =
        if (key.action == KeyAction.Text && key.output == " ") {
            key.label
        } else if (shifted && layoutMode == LayoutMode.Letters && key.label.length == 1 && key.label[0].isLetter()) {
            key.label.uppercase()
        } else {
            key.label
        }

    private fun keyTextSize(key: KeySpec): Float =
        when {
            key.label.length <= 1 -> sp(19f)
            key.weight >= 3f -> sp(15f)
            key.label.length >= 5 -> sp(11f)
            else -> sp(12.5f)
        }

    private fun hitTest(x: Float, y: Float): KeyFrame? =
        keyFrames.firstOrNull { it.rect.contains(x, y) }

    private fun desiredKeyboardHeight(): Int {
        val rowCount = 1 + modeRowCount() + 1 + if (clipboardPanelVisible) 1 else 0
        val rowsHeight =
            actionRowHeight +
                modeRowCount() * textRowHeight +
                controlRowHeight +
                (if (clipboardPanelVisible) clipboardRowHeight else 0f)
        return (outerPadding * 2 + statusHeight + rowsHeight + keyGap * rowCount).toInt()
    }

    private fun modeRowCount(): Int = 3

    private fun refreshLayout() {
        requestLayout()
        invalidate()
    }

    private fun secondaryFor(char: Char, topLeft: Boolean): String? =
        when (char) {
            'a' -> if (topLeft) "\u00e0" else "\u00e2"
            'e' -> if (topLeft) "\u00e9" else "\u00e8"
            'i' -> if (topLeft) "\u00ee" else null
            'o' -> if (topLeft) "\u00f4" else "\u00f6"
            'u' -> if (topLeft) "\u00f9" else "\u00fb"
            'c' -> if (topLeft) "\u00e7" else null
            'n' -> if (topLeft) "\u00f1" else null
            else -> null
        }

    private fun dp(value: Float): Float = value * density

    private fun sp(value: Float): Float = value * resources.displayMetrics.scaledDensity
}
