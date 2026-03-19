import { useState, useCallback, useEffect, useRef } from "react";
import { Platform, AppState } from "react-native";

// Dynamic import — module only available after native build
let FloatingOverlay: typeof import("@/modules/floating-overlay/index") | null =
  null;

try {
  if (Platform.OS === "android") {
    FloatingOverlay = require("@/modules/floating-overlay/index");
  }
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
  const [hasAccessibilityPermission, setHasAccessibilityPermission] =
    useState(false);
  const [overlayEnabled, setOverlayEnabled] = useState(false);
  const appStateRef = useRef(AppState.currentState);

  const refreshPermissions = useCallback(() => {
    if (!isAvailable || !FloatingOverlay) return;
    setHasOverlayPermission(FloatingOverlay.hasOverlayPermission());
    setHasAccessibilityPermission(
      FloatingOverlay.hasAccessibilityPermission()
    );
  }, [isAvailable]);

  // Refresh on mount
  useEffect(() => {
    refreshPermissions();
  }, [refreshPermissions]);

  // Refresh when app returns from background (user was in Android settings)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        refreshPermissions();
      }
      appStateRef.current = nextState;
    });
    return () => sub.remove();
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
    if (!FloatingOverlay) return;
    // Re-check permission right before showing
    if (!FloatingOverlay.hasOverlayPermission()) {
      setHasOverlayPermission(false);
      return;
    }
    FloatingOverlay.showBubble();
    setOverlayEnabled(true);
  }, []);

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
