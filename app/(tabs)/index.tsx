import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AudioWaveform } from "@/components/AudioWaveform";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { Colors } from "@/lib/constants";

const colors = Colors.dark;
const TEMP_USER_ID = "local-user";
const SHARED_CLIPBOARD_SOURCE = "voice-transcript";

export default function VoiceScreen() {
  const history = useQuery(api.transcriptions.list, { userId: TEMP_USER_ID });
  const updateTranscription = useMutation(api.transcriptions.update);
  const addClipboardItem = useMutation(api.clipboard.add);
  const {
    state,
    rawText,
    cleanedText,
    error,
    meterLevel,
    hasApiKeys,
    mode,
    setMode,
    startRecording,
    stopRecording,
    enhanceWithAI,
    copyResult,
  } = useVoiceRecording({ mode: "free" });

  const isRecording = state === "recording";
  const isProcessing = state === "processing" || state === "enhancing";
  const displayText = cleanedText || rawText;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [sharingId, setSharingId] = useState<string | null>(null);

  const historyItems = useMemo<any[]>(() => history ?? [], [history]);

  const handleCopy = useCallback(async () => {
    await copyResult();
    Alert.alert("Copied!", "Text copied to clipboard.");
  }, [copyResult]);

  const handleCopyText = useCallback(async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", "Text copied to clipboard.");
  }, []);

  const handleStartEditing = useCallback((id: string, text: string) => {
    setEditingId(id);
    setDraftText(text);
  }, []);

  const handleSaveEdit = useCallback(
    async (id: string, currentText: string) => {
      if (isSavingEdit) return;

      const nextText = draftText.trim();
      if (!nextText || nextText === currentText) {
        setEditingId(null);
        setDraftText("");
        return;
      }

      setIsSavingEdit(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateTranscription({
          id: id as any,
          rawText: nextText,
          cleanedText: nextText,
        });
      } catch (error) {
        Alert.alert("Save failed", `Couldn't update transcript: ${error}`);
      } finally {
        setIsSavingEdit(false);
        setEditingId(null);
        setDraftText("");
      }
    },
    [draftText, isSavingEdit, updateTranscription]
  );

  const handleShareTranscript = useCallback(
    async (text: string, id: string) => {
      const content = text.trim();
      if (!content) return;

      setSharingId(id);
      try {
        await addClipboardItem({
          userId: TEMP_USER_ID,
          content,
          contentType: "text",
          source: SHARED_CLIPBOARD_SOURCE,
        });
        Alert.alert("Sent", "Transcript added to shared clipboard.");
      } catch (error) {
        Alert.alert("Share failed", `Couldn't send transcript: ${error}`);
      } finally {
        setSharingId(null);
      }
    },
    [addClipboardItem]
  );

  const formatTimestamp = useCallback((timestamp: number) => {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(timestamp));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>VoiceFlowz</Text>
        <Text style={styles.subtitle}>Speak. Transcribe. Ship.</Text>
      </View>

      {/* Mode toggle */}
      <View style={styles.modeContainer}>
        <Pressable
          onPress={() => setMode("free")}
          style={[styles.modeBtn, mode === "free" && styles.modeBtnActive]}
        >
          <Text
            style={[
              styles.modeBtnText,
              mode === "free" && styles.modeBtnTextActive,
            ]}
          >
            Free
          </Text>
          <Text style={styles.modeBtnHint}>On-device</Text>
        </Pressable>
        <Pressable
          onPress={() => setMode("advanced")}
          style={[
            styles.modeBtn,
            mode === "advanced" && styles.modeBtnActive,
            !hasApiKeys && styles.modeBtnLocked,
          ]}
        >
          <Text
            style={[
              styles.modeBtnText,
              mode === "advanced" && styles.modeBtnTextActive,
            ]}
          >
            Advanced
          </Text>
          <Text style={styles.modeBtnHint}>
            {hasApiKeys ? "Whisper + AI" : "Needs API key"}
          </Text>
        </Pressable>
      </View>

      {/* Transcription result */}
      <ScrollView
        style={styles.resultContainer}
        keyboardShouldPersistTaps="handled"
      >
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isProcessing && (
          <View style={styles.processingBox}>
            <Text style={styles.processingText}>
              {state === "enhancing"
                ? "Enhancing with AI..."
                : mode === "advanced"
                  ? "Transcribing with Whisper..."
                  : "Processing..."}
            </Text>
          </View>
        )}

        {displayText ? (
          <View>
            <Pressable onPress={handleCopy} style={styles.textBox}>
              <Text style={styles.resultText}>{displayText}</Text>
              <Text style={styles.tapHint}>Tap to copy</Text>
            </Pressable>

            <View style={styles.resultActions}>
              <Pressable
                onPress={() => handleShareTranscript(displayText, "current")}
                style={styles.secondaryActionBtn}
              >
                <Text style={styles.secondaryActionText}>
                  {sharingId === "current" ? "Sending..." : "Send to shared clipboard"}
                </Text>
              </Pressable>
            </View>

            {/* Enhance button — only in free mode */}
            {mode === "free" && state === "done" && (
              <Pressable onPress={enhanceWithAI} style={styles.enhanceBtn}>
                <Text style={styles.enhanceBtnText}>Enhance with AI</Text>
                <Text style={styles.enhanceBtnHint}>Uses API credits</Text>
              </Pressable>
            )}
          </View>
        ) : (
          !isProcessing &&
          !isRecording &&
          !error && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎙</Text>
              <Text style={styles.emptyText}>
                {mode === "free"
                  ? "Press record and speak.\nOn-device transcription — free, private."
                  : "Press record and speak.\nWhisper API — highest accuracy."}
              </Text>
            </View>
          )
        )}

        {/* Live partial transcript + waveform (while recording) */}
        {isRecording && (
          <View style={styles.liveBox}>
            <View style={styles.liveHeader}>
              <Text style={styles.liveLabel}>Listening...</Text>
              <AudioWaveform meterLevel={meterLevel} isActive={true} />
            </View>
            {rawText ? (
              <Text style={styles.liveText}>{rawText}</Text>
            ) : null}
          </View>
        )}

        {/* Show original if cleaned is different */}
        {rawText && cleanedText && rawText !== cleanedText && !isRecording && (
          <View style={styles.rawBox}>
            <Text style={styles.rawLabel}>Original:</Text>
            <Text style={styles.rawText}>{rawText}</Text>
          </View>
        )}

        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>History</Text>
            <Text style={styles.sectionSubtitle}>
              Tap a transcript to edit it. Blur saves automatically.
            </Text>
          </View>

          {historyItems.length === 0 ? (
            <View style={styles.historyEmptyState}>
              <Text style={styles.historyEmptyText}>
                Your saved transcripts will appear here.
              </Text>
            </View>
          ) : (
            historyItems.map((item: any) => {
              const transcriptText = item.cleanedText || item.rawText;
              const isEditing = editingId === item._id;

              return (
                <View key={item._id} style={styles.historyCard}>
                  <View style={styles.historyCardHeader}>
                    <View>
                      <Text style={styles.historyMeta}>{formatTimestamp(item._creationTime)}</Text>
                      <Text style={styles.historySource}>{item.source}</Text>
                    </View>
                    <Pressable
                      onPress={() => handleShareTranscript(transcriptText, item._id)}
                      style={styles.iconActionBtn}
                    >
                      <Text style={styles.iconActionText}>
                        {sharingId === item._id ? "..." : "↗"}
                      </Text>
                    </Pressable>
                  </View>

                  {isEditing ? (
                    <TextInput
                      value={draftText}
                      onChangeText={setDraftText}
                      onBlur={() => handleSaveEdit(item._id, transcriptText)}
                      multiline
                      autoFocus
                      style={styles.historyInput}
                      placeholder="Edit transcript"
                      placeholderTextColor={colors.textMuted}
                    />
                  ) : (
                    <Pressable
                      onPress={() => handleStartEditing(item._id, transcriptText)}
                    >
                      <Text style={styles.historyText}>{transcriptText}</Text>
                    </Pressable>
                  )}

                  <View style={styles.historyActions}>
                    <Pressable
                      onPress={() => handleCopyText(transcriptText)}
                      style={styles.historyActionBtn}
                    >
                      <Text style={styles.historyActionText}>Copy</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleStartEditing(item._id, transcriptText)}
                      style={styles.historyActionBtn}
                    >
                      <Text style={styles.historyActionText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleShareTranscript(transcriptText, item._id)}
                      style={styles.historyActionBtn}
                    >
                      <Text style={styles.historyActionText}>Send</Text>
                    </Pressable>
                  </View>

                  {item.rawText !== item.cleanedText && !isEditing ? (
                    <View style={styles.historyOriginal}>
                      <Text style={styles.historyOriginalLabel}>Original</Text>
                      <Text style={styles.historyOriginalText}>{item.rawText}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Record button */}
      <View style={styles.controls}>
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive,
            isProcessing && styles.recordButtonDisabled,
          ]}
        >
          <Text style={styles.recordButtonText}>
            {isProcessing ? "..." : isRecording ? "■" : "●"}
          </Text>
        </Pressable>
        <Text style={styles.recordLabel}>
          {isProcessing
            ? "Processing"
            : isRecording
              ? "Tap to stop"
              : "Tap to record"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  // Mode toggle
  modeContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 10,
    marginTop: 12,
  },
  modeBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  modeBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "18",
  },
  modeBtnLocked: { opacity: 0.5 },
  modeBtnText: { color: colors.textSecondary, fontSize: 15, fontWeight: "600" },
  modeBtnTextActive: { color: colors.primaryLight },
  modeBtnHint: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  // Results
  resultContainer: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  errorBox: {
    backgroundColor: "#7f1d1d",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  errorText: { color: "#fca5a5", fontSize: 14 },
  processingBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  processingText: { color: colors.primaryLight, fontSize: 16 },
  textBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultText: { color: colors.text, fontSize: 16, lineHeight: 24 },
  tapHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 12,
    textAlign: "right",
  },
  resultActions: {
    marginTop: 10,
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  secondaryActionBtn: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryActionText: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: "600",
  },
  enhanceBtn: {
    marginTop: 10,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary + "40",
  },
  enhanceBtnText: { color: colors.primaryLight, fontSize: 14, fontWeight: "600" },
  enhanceBtnHint: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  // Live
  liveBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.accent + "40",
  },
  liveHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  liveLabel: { color: colors.accent, fontSize: 12, fontWeight: "600" },
  liveText: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: "italic",
  },
  // Original
  rawBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    opacity: 0.7,
  },
  rawLabel: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  rawText: { color: colors.textSecondary, fontSize: 14, lineHeight: 20 },
  historySection: {
    marginTop: 20,
    paddingBottom: 12,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  historyEmptyState: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyEmptyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  historyMeta: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  historySource: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  iconActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary + "55",
    backgroundColor: colors.primary + "18",
  },
  iconActionText: {
    color: colors.primaryLight,
    fontSize: 16,
    fontWeight: "700",
  },
  historyText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  historyInput: {
    minHeight: 96,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary + "55",
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: "top",
  },
  historyActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  historyActionBtn: {
    paddingVertical: 4,
  },
  historyActionText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: "600",
  },
  historyOriginal: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  historyOriginalLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  historyOriginalText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  // Empty
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  // Controls
  controls: { alignItems: "center", paddingVertical: 24, paddingBottom: 32 },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  recordButtonActive: { backgroundColor: colors.danger },
  recordButtonDisabled: { backgroundColor: colors.textMuted, opacity: 0.5 },
  recordButtonText: { fontSize: 32, color: "#fff" },
  recordLabel: { color: colors.textMuted, fontSize: 13, marginTop: 8 },
});
