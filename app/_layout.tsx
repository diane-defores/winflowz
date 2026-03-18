import { useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { OverlayFAB } from "@/components/OverlayFAB";

// TODO: Replace with your Convex URL from `npx convex dev`
const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud"
);

export default function RootLayout() {
  // TODO: Persist this setting with AsyncStorage
  const [fabEnabled] = useState(true);

  return (
    <ConvexProvider client={convex}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0f172a" },
        }}
      />
      <OverlayFAB visible={fabEnabled} />
    </ConvexProvider>
  );
}
