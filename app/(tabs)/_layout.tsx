import { Tabs } from "expo-router";
import { Text } from "react-native";
import { Colors } from "@/lib/constants";

const colors = Colors.dark;

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{label}</Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Voice",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="🎙" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="clipboard"
        options={{
          title: "Clipboard",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="📋" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ focused }) => (
            <TabIcon label="⚙" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
