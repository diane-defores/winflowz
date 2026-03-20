import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { OverlayBridge } from "@/components/OverlayBridge";

// TODO: Replace with your Convex URL from `npx convex dev`
const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL ?? "https://placeholder.convex.cloud"
);

function AppContent() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0f172a" },
        }}
      />
      <OverlayBridge />
    </>
  );
}

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <AppContent />
    </ConvexProvider>
  );
}
