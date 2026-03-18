import { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";
import { RecordingControls } from "./RecordingControls";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { Colors } from "@/lib/constants";

const colors = Colors.dark;
const FAB_SIZE = 56;
const EXPANDED_WIDTH = 220;
const EXPANDED_HEIGHT = 56;
const EDGE_MARGIN = 16;
const RESULT_FLASH_MS = 2000;

interface OverlayFABProps {
  visible: boolean;
}

export function OverlayFAB({ visible }: OverlayFABProps) {
  const {
    state,
    rawText,
    cleanedText,
    meterLevel,
    startRecording,
    stopRecording,
    cancelRecording,
    copyResult,
    reset,
  } = useVoiceRecording({ mode: "free", source: "fab" });

  const [resultFlash, setResultFlash] = useState(false);
  const screen = Dimensions.get("window");

  // Position animation
  const pan = useRef(
    new Animated.ValueXY({
      x: screen.width - FAB_SIZE - EDGE_MARGIN,
      y: screen.height * 0.65,
    })
  ).current;

  // Scale animation for expand/collapse
  const expandAnim = useRef(new Animated.Value(0)).current;

  const isExpanded = state === "recording" || state === "processing" || state === "enhancing";

  useEffect(() => {
    Animated.spring(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 60,
    }).start();
  }, [isExpanded, expandAnim]);

  // Result flash when done
  useEffect(() => {
    if (state === "done" && (cleanedText || rawText)) {
      copyResult();
      setResultFlash(true);
      const timer = setTimeout(() => {
        setResultFlash(false);
        reset();
      }, RESULT_FLASH_MS);
      return () => clearTimeout(timer);
    }
  }, [state, cleanedText, rawText, copyResult, reset]);

  // Drag handler (only when collapsed)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isExpanded,
      onMoveShouldSetPanResponder: (_, gesture) =>
        !isExpanded && (Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5),
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();

        // Snap to nearest horizontal edge
        const currentX = gesture.moveX - FAB_SIZE / 2;
        const snapX =
          currentX < screen.width / 2
            ? EDGE_MARGIN
            : screen.width - FAB_SIZE - EDGE_MARGIN;

        // Clamp Y
        const clampedY = Math.max(
          EDGE_MARGIN + 50, // below status bar
          Math.min(screen.height - FAB_SIZE - EDGE_MARGIN - 80, gesture.moveY - FAB_SIZE / 2)
        );

        Animated.spring(pan, {
          toValue: { x: snapX, y: clampedY },
          useNativeDriver: false,
          friction: 7,
        }).start();
      },
    })
  ).current;

  // Handle FAB tap
  const handleFABPress = useCallback(() => {
    if (state === "idle") {
      startRecording();
    }
  }, [state, startRecording]);

  if (!visible) return null;

  // Interpolate width for expand animation
  const containerWidth = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [FAB_SIZE, EXPANDED_WIDTH],
  });

  const containerHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [FAB_SIZE, EXPANDED_HEIGHT],
  });

  const fabOpacity = expandAnim.interpolate({
    inputRange: [0, 0.3],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const controlsOpacity = expandAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: pan.getTranslateTransform(),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={[
          styles.container,
          {
            width: containerWidth,
            height: containerHeight,
          },
          resultFlash && styles.containerResult,
        ]}
      >
        {/* Collapsed state: FAB button */}
        <Animated.View style={[styles.fabContent, { opacity: fabOpacity }]}>
          <Pressable onPress={handleFABPress} style={styles.fabPressable}>
            <Text style={styles.fabIcon}>🎙</Text>
          </Pressable>
        </Animated.View>

        {/* Expanded state: Recording controls */}
        <Animated.View
          style={[styles.expandedContent, { opacity: controlsOpacity }]}
          pointerEvents={isExpanded ? "auto" : "none"}
        >
          <RecordingControls
            state={state}
            meterLevel={meterLevel}
            onCancel={cancelRecording}
            onDone={stopRecording}
            compact
          />
        </Animated.View>

        {/* Result flash */}
        {resultFlash && (
          <View style={styles.resultFlash}>
            <Text style={styles.resultIcon}>✓</Text>
            <Text style={styles.resultText}>Copied!</Text>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    zIndex: 9999,
    elevation: 20,
  },
  container: {
    backgroundColor: colors.primary,
    borderRadius: FAB_SIZE / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    overflow: "hidden",
  },
  containerResult: {
    backgroundColor: colors.success,
  },
  fabContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  fabPressable: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  fabIcon: {
    fontSize: 24,
  },
  expandedContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  resultFlash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  resultIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  resultText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
