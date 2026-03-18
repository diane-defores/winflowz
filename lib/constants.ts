export const Colors = {
  dark: {
    background: "#0f172a",
    surface: "#1e293b",
    surfaceLight: "#334155",
    primary: "#6366f1",
    primaryLight: "#818cf8",
    accent: "#22d3ee",
    text: "#f8fafc",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    danger: "#ef4444",
    success: "#22c55e",
    border: "#334155",
  },
  light: {
    background: "#f8fafc",
    surface: "#ffffff",
    surfaceLight: "#f1f5f9",
    primary: "#6366f1",
    primaryLight: "#818cf8",
    accent: "#0891b2",
    text: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#94a3b8",
    danger: "#ef4444",
    success: "#22c55e",
    border: "#e2e8f0",
  },
} as const;

export const APP_NAME = "VoiceFlowz";
export const RECORDING_MAX_DURATION_MS = 5 * 60 * 1000; // 5 minutes
