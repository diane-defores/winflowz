import { useState, useCallback, useEffect } from "react";
import { Platform } from "react-native";

// Dynamic import — module only available after native build
let FloatingOverlay: typeof import("@/modules/floating-overlay/index") | null =
  null;

try {
  FloatingOverlay = require("@/modules/floating-overlay/index");
} catch {
  // Native module not available (e.g. Expo Go, web, iOS)
}

export interface OverlayPermissions {
  isAvailable: boolean;
  hasOverlayPermission: boolean;
  hasAccessibilityPermission: boolean;
  overlayEnabled: boolean;

  requestOverlayPermission: () => Promise<boolean>;
  openAccessibilitySettings: () => void;
  showBubble: () => void;
  hideBubble: () => void;
  refreshPermissions: () => void;
}

export function useOverlayPermissions(): OverlayPermissions {
  const isAvailable = Platform.OS === "android" && FloatingOverlay != null;
  const [hasOverlayPermission, setHasOverlayPermission] = useState(false);
  const [hasAccessibilityPermission, setHasAccessibilityPermission] = useState(false);
  const [overlayEnabled, setOverlayEnabled] = useState(false);

  const refreshPermissions = useCallback(() => {
    if (!isAvailable || !FloatingOverlay) return;
    setHasOverlayPermission(FloatingOverlay.hasOverlayPermission());
    setHasAccessibilityPermission(FloatingOverlay.hasAccessibilityPermission());
  }, [isAvailable]);

  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  const requestOverlayPermission = useCallback(async (): Promise<boolean> => {
    if (!FloatingOverlay) return false;
    const granted = await FloatingOverlay.requestOverlayPermission();
    setHasOverlayPermission(granted);
    return granted;
  }, []);

  const openAccessibilitySettings = useCallback(() => {
    if (!FloatingOverlay) return;
    FloatingOverlay.openAccessibilitySettings();
  }, []);

  const showBubble = useCallback(() => {
    if (!FloatingOverlay || !hasOverlayPermission) return;
    FloatingOverlay.showBubble();
    setOverlayEnabled(true);
  }, [hasOverlayPermission]);

  const hideBubble = useCallback(() => {
    if (!FloatingOverlay) return;
    FloatingOverlay.hideBubble();
    setOverlayEnabled(false);
  }, []);

  return {
    isAvailable,
    hasOverlayPermission,
    hasAccessibilityPermission,
    overlayEnabled,
    requestOverlayPermission,
    openAccessibilitySettings,
    showBubble,
    hideBubble,
    refreshPermissions,
  };
}
