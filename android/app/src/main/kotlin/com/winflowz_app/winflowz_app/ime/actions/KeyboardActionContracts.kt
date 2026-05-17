package com.winflowz_app.winflowz_app.ime.actions

import com.winflowz_app.winflowz_app.ime.KeyboardFieldPolicy
import com.winflowz_app.winflowz_app.ime.KeyboardKeyAction
import com.winflowz_app.winflowz_app.ime.KeyboardKeySpec
import com.winflowz_app.winflowz_app.ime.KeyboardLayoutMode
import com.winflowz_app.winflowz_app.ime.KeyboardPanelMode
import com.winflowz_app.winflowz_app.ime.KeyboardTextRule

enum class KeyboardActionLongPressBehavior(
    val wireValue: String,
) {
    PinAction("pin_action"),
    AttachContextRow("attach_context_row"),
    ;

    companion object {
        fun fromRaw(raw: String?): KeyboardActionLongPressBehavior {
            return entries.firstOrNull { it.wireValue == raw } ?: AttachContextRow
        }
    }
}

enum class KeyboardActionAvailabilityPolicy {
    Always,
    ClipboardAllowed,
    VoiceAllowed,
    SnippetsAllowed,
    MediaControlsEnabled,
}

enum class KeyboardActionRowClosePolicy {
    ManualOnly,
}

data class KeyboardActionDescriptor(
    val id: String,
    val label: String,
    val glyph: String,
    val accessibilityLabel: String,
    val tapAction: KeyboardKeyAction,
    val availabilityPolicy: KeyboardActionAvailabilityPolicy = KeyboardActionAvailabilityPolicy.Always,
    val pinnable: Boolean = true,
    val adaptiveEligible: Boolean = true,
    val sensitiveInPrivate: Boolean = false,
    val rowProvider: KeyboardActionRowProvider? = null,
)

data class KeyboardActionRowSpec(
    val rowId: String,
    val dedupeKey: String,
    val items: List<KeyboardKeySpec>,
    val visiblePageKeyCount: Int? = null,
    val pagedHorizontal: Boolean = false,
    val closePolicy: KeyboardActionRowClosePolicy = KeyboardActionRowClosePolicy.ManualOnly,
    val actionSurface: Boolean = true,
)

data class KeyboardActionProviderContext(
    val descriptor: KeyboardActionDescriptor,
    val fieldPolicy: KeyboardFieldPolicy,
    val snippets: List<KeyboardTextRule> = emptyList(),
)

fun interface KeyboardActionRowProvider {
    fun buildRows(context: KeyboardActionProviderContext): List<KeyboardActionRowSpec>
}

data class KeyboardAttachedActionRowState(
    val providerActionId: String,
    val rowId: String,
    val dedupeKey: String,
)

data class KeyboardActionBarState(
    val orderedActionIds: List<String> = emptyList(),
    val pinnedActionIds: Set<String> = emptySet(),
    val attachedRows: List<KeyboardAttachedActionRowState> = emptyList(),
    val rowPageById: Map<String, Int> = emptyMap(),
    val adaptiveUsageScoreById: Map<String, Long> = emptyMap(),
    val longPressBehavior: KeyboardActionLongPressBehavior = KeyboardActionLongPressBehavior.AttachContextRow,
)

fun KeyboardActionBarState.withAttachedClipboardActionRow(): KeyboardActionBarState {
    val nextRows =
        if (attachedRows.any { it.dedupeKey == CLIPBOARD_ACTION_ROW.dedupeKey }) {
            attachedRows
        } else {
            attachedRows + CLIPBOARD_ACTION_ROW
        }
    val nextPages =
        if (CLIPBOARD_ACTION_ROW.rowId in rowPageById) {
            rowPageById
        } else {
            rowPageById + (CLIPBOARD_ACTION_ROW.rowId to 0)
        }
    if (nextRows == attachedRows && nextPages == rowPageById) {
        return this
    }
    return copy(
        attachedRows = nextRows,
        rowPageById = nextPages,
    )
}

private val CLIPBOARD_ACTION_ROW =
    KeyboardAttachedActionRowState(
        providerActionId = "clipboard",
        rowId = "action-row-clipboard",
        dedupeKey = "clipboard",
    )

data class KeyboardActionEnvironment(
    val fieldPolicy: KeyboardFieldPolicy,
    val layoutMode: KeyboardLayoutMode,
    val panelMode: KeyboardPanelMode,
    val clipboardAllowed: Boolean,
    val voiceAllowed: Boolean,
    val snippetsAllowed: Boolean,
    val mediaControlsEnabled: Boolean,
    val snippets: List<KeyboardTextRule> = emptyList(),
)

data class KeyboardActionTapResult(
    val nextState: KeyboardActionBarState,
    val command: KeyboardKeyAction?,
    val status: String? = null,
)

data class KeyboardActionLongPressResult(
    val nextState: KeyboardActionBarState,
    val consumed: Boolean,
    val status: String? = null,
)

data class KeyboardActionRenderSnapshot(
    val state: KeyboardActionBarState,
    val mainRow: KeyboardActionRowSpec,
    val attachedRows: List<KeyboardActionRowSpec>,
)
