import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Colors } from "@/lib/constants";

const colors = Colors.dark;
const BAR_COUNT = 12;
const BAR_WIDTH = 3;
const BAR_GAP = 2;
const MAX_HEIGHT = 32;
const MIN_HEIGHT = 4;

interface AudioWaveformProps {
  meterLevel: number; // 0-1
  isActive: boolean;
  color?: string;
  barCount?: number;
}

export function AudioWaveform({
  meterLevel,
  isActive,
  color = colors.accent,
  barCount = BAR_COUNT,
}: AudioWaveformProps) {
  const bars = useRef(
    Array.from({ length: barCount }, () => new Animated.Value(MIN_HEIGHT))
  ).current;

  useEffect(() => {
    if (!isActive) {
      // Reset all bars to min
      bars.forEach((bar) => {
        Animated.timing(bar, {
          toValue: MIN_HEIGHT,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
      return;
    }

    // Animate bars based on meter level with variation
    bars.forEach((bar, i) => {
      // Create natural-looking variation per bar
      const phase = (i / barCount) * Math.PI * 2;
      const variation = Math.sin(phase + Date.now() / 200) * 0.3 + 0.7;
      const height =
        MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * meterLevel * variation;

      Animated.timing(bar, {
        toValue: Math.max(MIN_HEIGHT, height),
        duration: 80,
        useNativeDriver: false,
      }).start();
    });
  }, [meterLevel, isActive, bars, barCount]);

  return (
    <View style={styles.container}>
      {bars.map((barHeight, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            {
              height: barHeight,
              backgroundColor: color,
              opacity: isActive ? 1 : 0.3,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: BAR_GAP,
    height: MAX_HEIGHT,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: BAR_WIDTH / 2,
  },
});
