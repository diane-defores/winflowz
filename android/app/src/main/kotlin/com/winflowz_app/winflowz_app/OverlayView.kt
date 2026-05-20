package com.winflowz_app.winflowz_app

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.RectF
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import kotlin.math.roundToInt

class OverlayView(context: Context) : FrameLayout(context) {

    var onBubbleTap: (() -> Unit)? = null
    var onRecordStop: (() -> Unit)? = null
    var onRecordCancel: (() -> Unit)? = null
    var onBubbleLongPress: (() -> Unit)? = null

    private var currentState = "collapsed"
    private val handler = android.os.Handler(android.os.Looper.getMainLooper())

    private val fabSize = dpToPx(50f)
    private val expandedWidth = dpToPx(244f)
    private val expandedHeight = dpToPx(58f)
    private val buttonSize = dpToPx(30f)
    private val dragHandleWidth = dpToPx(20f)
    private val cornerRadius = dpToPx(26f)

    private val primaryColor = Color.parseColor("#2563eb")
    private val dangerColor = Color.parseColor("#dc2626")
    private val successColor = Color.parseColor("#16a34a")
    private val surfaceColor = Color.parseColor("#111827")
    private val surfaceStrokeColor = Color.parseColor("#334155")
    private val handleColor = Color.parseColor("#94a3b8")

    private val fabView: TextView
    private val expandedContainer: LinearLayout
    private val dragHandle: DragHandleView
    private val cancelButton: TextView
    private val waveformView: WaveformView
    private val doneButton: TextView

    init {
        fabView = TextView(context).apply {
            layoutParams = LayoutParams(fabSize, fabSize)
            text = "REC"
            textSize = 14f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            visibility = VISIBLE
            setPadding(0, 0, 0, 0)
            letterSpacing = 0.08f
            contentDescription = "WinFlowz overlay. Double tap to start dictation. Drag to move."
            elevation = dpToPx(8f).toFloat()
        }
        fabView.background = BubbleDrawable(primaryColor, surfaceStrokeColor)
        addView(fabView)

        expandedContainer = LinearLayout(context).apply {
            orientation = LinearLayout.HORIZONTAL
            layoutParams = LayoutParams(expandedWidth, expandedHeight)
            gravity = Gravity.CENTER_VERTICAL
            setPadding(
                dpToPx(10f),
                dpToPx(7f),
                dpToPx(10f),
                dpToPx(7f),
            )
            visibility = GONE
            elevation = dpToPx(12f).toFloat()
            contentDescription = "WinFlowz recording controls."
        }
        expandedContainer.background =
            RoundRectDrawable(surfaceColor, cornerRadius.toFloat(), surfaceStrokeColor)

        dragHandle = DragHandleView(context, handleColor).apply {
            layoutParams =
                LinearLayout.LayoutParams(
                    dragHandleWidth,
                    LinearLayout.LayoutParams.MATCH_PARENT,
                ).apply {
                    setMargins(0, 0, dpToPx(8f), 0)
                }
            contentDescription = "Drag handle. Drag to move the overlay."
        }
        expandedContainer.addView(dragHandle)

        cancelButton = TextView(context).apply {
            layoutParams = LinearLayout.LayoutParams(buttonSize, buttonSize).apply {
                setMargins(0, 0, dpToPx(8f), 0)
            }
            text = "X"
            textSize = 14f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            background = CircleDrawable(dangerColor)
            contentDescription = "Cancel recording"
            setOnClickListener {
                onRecordCancel?.invoke()
            }
        }
        expandedContainer.addView(cancelButton)

        waveformView = WaveformView(context).apply {
            layoutParams = LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.MATCH_PARENT, 1f)
        }
        expandedContainer.addView(waveformView)

        doneButton = TextView(context).apply {
            layoutParams = LinearLayout.LayoutParams(buttonSize, buttonSize).apply {
                setMargins(dpToPx(8f), 0, 0, 0)
            }
            text = "OK"
            textSize = 12f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            background = CircleDrawable(successColor)
            contentDescription = "Finish recording"
            setOnClickListener {
                onRecordStop?.invoke()
            }
        }
        expandedContainer.addView(doneButton)
        addView(expandedContainer)

        fabView.setOnClickListener { onBubbleTap?.invoke() }
    }

    fun getCurrentState(): String = currentState

    fun setSizeScale(scale: Float) {
        val normalized = scale.coerceIn(0.8f, 1.4f)
        scaleX = normalized
        scaleY = normalized
        pivotX = if (width > 0) width / 2f else fabSize / 2f
        pivotY = if (height > 0) height / 2f else fabSize / 2f
    }

    fun setState(state: String) {
        currentState = normalizeState(state)
        when (currentState) {
            "collapsed" -> {
                fabView.visibility = VISIBLE
                fabView.background = BubbleDrawable(primaryColor, surfaceStrokeColor)
                expandedContainer.visibility = GONE
                layoutParams?.width = fabSize
                layoutParams?.height = fabSize
            }
            "recording" -> {
                fabView.visibility = GONE
                expandedContainer.visibility = VISIBLE
                cancelButton.isEnabled = true
                doneButton.isEnabled = true
                cancelButton.alpha = 1f
                doneButton.alpha = 1f
                waveformView.setProcessing(false)
                layoutParams?.width = expandedWidth
                layoutParams?.height = expandedHeight
            }
            "processing" -> {
                fabView.visibility = GONE
                expandedContainer.visibility = VISIBLE
                cancelButton.isEnabled = false
                doneButton.isEnabled = false
                cancelButton.alpha = 0.35f
                doneButton.alpha = 0.35f
                waveformView.setProcessing(true)
                layoutParams?.width = expandedWidth
                layoutParams?.height = expandedHeight
            }
            "result" -> {
                fabView.visibility = VISIBLE
                fabView.background = BubbleDrawable(successColor, surfaceStrokeColor)
                expandedContainer.visibility = GONE
                layoutParams?.width = fabSize
                layoutParams?.height = fabSize
                handler.removeCallbacksAndMessages(null)
                handler.postDelayed({ setState("collapsed") }, 1400)
            }
        }
        requestLayout()
    }

    fun showResult() {
        setState("result")
    }

    fun updateMeter(level: Float) {
        waveformView.setLevel(level)
    }

    override fun performClick(): Boolean {
        super.performClick()
        if (currentState == "collapsed") {
            onBubbleTap?.invoke()
        }
        return true
    }

    fun emitLongPress() {
        onBubbleLongPress?.invoke()
    }

    fun setDragHandleTouchListener(listener: View.OnTouchListener?) {
        dragHandle.setOnTouchListener(listener)
    }

    private fun normalizeState(state: String): String {
        return if (state in setOf("collapsed", "recording", "processing", "result")) {
            state
        } else {
            "collapsed"
        }
    }

    private fun dpToPx(dp: Float): Int {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            dp,
            resources.displayMetrics,
        ).roundToInt()
    }

    private class DragHandleView(context: Context, private val color: Int) : View(context) {
        private val paint =
            Paint(Paint.ANTI_ALIAS_FLAG).apply {
                this.color = color
                style = Paint.Style.FILL
            }
        private val barWidth =
            TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 3f, resources.displayMetrics)
        private val barHeight =
            TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 18f, resources.displayMetrics)
        private val barGap =
            TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, 4f, resources.displayMetrics)
        private val radius = barWidth / 2f

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            val totalWidth = barWidth * 2f + barGap
            val startX = (width - totalWidth) / 2f
            val top = (height - barHeight) / 2f
            canvas.drawRoundRect(
                startX,
                top,
                startX + barWidth,
                top + barHeight,
                radius,
                radius,
                paint,
            )
            val secondX = startX + barWidth + barGap
            canvas.drawRoundRect(
                secondX,
                top,
                secondX + barWidth,
                top + barHeight,
                radius,
                radius,
                paint,
            )
        }
    }

    private class CircleDrawable(private val color: Int) : android.graphics.drawable.Drawable() {
        private val paint =
            Paint(Paint.ANTI_ALIAS_FLAG).apply {
                this.color = color
                style = Paint.Style.FILL
            }

        override fun draw(canvas: Canvas) {
            val cx = bounds.exactCenterX()
            val cy = bounds.exactCenterY()
            val radius = minOf(cx, cy)
            canvas.drawCircle(cx, cy, radius, paint)
        }

        override fun setAlpha(alpha: Int) {
            paint.alpha = alpha
        }

        override fun setColorFilter(cf: android.graphics.ColorFilter?) {
            paint.colorFilter = cf
        }

        @Deprecated("Deprecated in Java")
        override fun getOpacity(): Int = android.graphics.PixelFormat.TRANSLUCENT
    }

    private class BubbleDrawable(
        private val color: Int,
        private val strokeColor: Int,
    ) : android.graphics.drawable.Drawable() {
        private val fillPaint =
            Paint(Paint.ANTI_ALIAS_FLAG).apply {
                this.color = color
                style = Paint.Style.FILL
            }
        private val strokePaint =
            Paint(Paint.ANTI_ALIAS_FLAG).apply {
                this.color = strokeColor
                style = Paint.Style.STROKE
                strokeWidth = 2f
            }

        override fun draw(canvas: Canvas) {
            val cx = bounds.exactCenterX()
            val cy = bounds.exactCenterY()
            val radius = minOf(cx, cy)
            canvas.drawCircle(cx, cy, radius, fillPaint)
            canvas.drawCircle(cx, cy, radius - strokePaint.strokeWidth, strokePaint)
        }

        override fun setAlpha(alpha: Int) {
            fillPaint.alpha = alpha
            strokePaint.alpha = alpha
        }

        override fun setColorFilter(cf: android.graphics.ColorFilter?) {
            fillPaint.colorFilter = cf
            strokePaint.colorFilter = cf
        }

        @Deprecated("Deprecated in Java")
        override fun getOpacity(): Int = android.graphics.PixelFormat.TRANSLUCENT
    }

    private class RoundRectDrawable(
        private val color: Int,
        private val radius: Float,
        private val strokeColor: Int,
    ) : android.graphics.drawable.Drawable() {
        private val paint =
            Paint(Paint.ANTI_ALIAS_FLAG).apply {
                this.color = color
                style = Paint.Style.FILL
            }
        private val strokePaint =
            Paint(Paint.ANTI_ALIAS_FLAG).apply {
                this.color = strokeColor
                style = Paint.Style.STROKE
                strokeWidth = 2f
            }
        private val rect = RectF()

        override fun draw(canvas: Canvas) {
            rect.set(bounds)
            canvas.drawRoundRect(rect, radius, radius, paint)
            rect.inset(strokePaint.strokeWidth / 2f, strokePaint.strokeWidth / 2f)
            canvas.drawRoundRect(rect, radius, radius, strokePaint)
        }

        override fun setAlpha(alpha: Int) {
            paint.alpha = alpha
            strokePaint.alpha = alpha
        }

        override fun setColorFilter(cf: android.graphics.ColorFilter?) {
            paint.colorFilter = cf
            strokePaint.colorFilter = cf
        }

        @Deprecated("Deprecated in Java")
        override fun getOpacity(): Int = android.graphics.PixelFormat.TRANSLUCENT
    }
}
