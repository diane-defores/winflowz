import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Colors } from "@/lib/constants";

const colors = Colors.dark;

// TODO: Replace with Clerk userId when auth is wired up
const TEMP_USER_ID = "local-user";
const DEVICE_NAME = "android-phone";

export default function ClipboardScreen() {
  const items = useQuery(api.clipboard.list, { userId: TEMP_USER_ID });
  const addItem = useMutation(api.clipboard.add);
  const togglePin = useMutation(api.clipboard.togglePin);
  const removeItem = useMutation(api.clipboard.remove);
  const [lastClipboard, setLastClipboard] = useState("");

  // Poll clipboard for changes (every 2 seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      const content = await Clipboard.getStringAsync();
      if (content && content !== lastClipboard) {
        setLastClipboard(content);
        const contentType = content.startsWith("http") ? "url" : "text";
        await addItem({
          userId: TEMP_USER_ID,
          content,
          contentType,
          source: DEVICE_NAME,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [lastClipboard, addItem]);

  const handleCopy = useCallback(async (content: string) => {
    await Clipboard.setStringAsync(content);
    setLastClipboard(content);
    Alert.alert("Copied!", "Text copied to clipboard.");
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await removeItem({ id: id as any });
    },
    [removeItem]
  );

  const sortedItems = items
    ? [...items].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
      })
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clipboard Sync</Text>
        <Text style={styles.subtitle}>
          {items?.length ?? 0} items synced across devices
        </Text>
      </View>

      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>
              Copy something to get started.{"\n"}Items sync automatically
              across devices.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => handleCopy(item.content)} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardMeta}>
                <Text style={styles.badge}>
                  {item.contentType === "url" ? "🔗" : "📝"} {item.contentType}
                </Text>
                {item.pinned && <Text style={styles.pinBadge}>📌</Text>}
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  onPress={() => togglePin({ id: item._id })}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionText}>
                    {item.pinned ? "Unpin" : "Pin"}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleDelete(item._id)}
                  style={styles.actionBtn}
                >
                  <Text style={[styles.actionText, { color: colors.danger }]}>
                    Del
                  </Text>
                </Pressable>
              </View>
            </View>
            <Text style={styles.cardContent} numberOfLines={4}>
              {item.content}
            </Text>
            <Text style={styles.cardSource}>{item.source}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    color: colors.textMuted,
    fontSize: 12,
  },
  pinBadge: {
    fontSize: 12,
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    padding: 4,
  },
  actionText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  cardSource: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
