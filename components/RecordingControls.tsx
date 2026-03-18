import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { AudioWaveform } from "./AudioWaveform";
import { Colors } from "@/lib/constants";
import type { RecordingState } from "@/hooks/useVoiceRecording";

const colors = Colors.dark;

interface RecordingControlsProps {
  state: RecordingState;
  meterLevel: number;
  onCancel: () => void;
  onDone: () => void;
  compact?: boolean;
}

export function RecordingControls({
  state,
  meterLevel,
  onCancel,
  onDone,
  compact = false,
}: RecordingControlsProps) {
  if (state === "processing" || state === "enhancing") {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        <ActivityIndicator size="small" color={colors.primaryLight} />
        <Text style={styles.processingText}>
          {state === "enhancing" ? "Enhancing..." : "Transcribing..."}
        </Text>
      </View>
    );
  }

  if (state === "recording") {
    return (
      <View style={[styles.container, compact && styles.containerCompact]}>
        {/* Cancel button */}
        <Pressable onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelText}>✕</Text>
        </Pressable>

        {/* Waveform */}
        <View style={styles.waveformContainer}>
          <AudioWaveform meterLevel={meterLevel} isActive={true} />
        </View>

        {/* Done button */}
        <Pressable onPress={onDone} style={styles.doneBtn}>
          <Text style={styles.doneText}>✓</Text>
        </Pressable>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerCompact: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    gap: 8,
  },
  cancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.danger + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "700",
  },
  waveformContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.success + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  doneText: {
    color: colors.success,
    fontSize: 18,
    fontWeight: "700",
  },
  processingText: {
    color: colors.primaryLight,
    fontSize: 14,
    marginLeft: 8,
  },
});
