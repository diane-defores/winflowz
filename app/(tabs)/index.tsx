import { useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AudioWaveform } from "@/components/AudioWaveform";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { Colors } from "@/lib/constants";

const colors = Colors.dark;

export default function VoiceScreen() {
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

  const handleCopy = useCallback(async () => {
    await copyResult();
    Alert.alert("Copied!", "Text copied to clipboard.");
  }, [copyResult]);

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
      <ScrollView style={styles.resultContainer}>
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
