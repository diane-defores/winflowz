import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, APP_NAME } from "@/lib/constants";
import { useOverlayPermissions } from "@/hooks/useOverlayPermissions";
import {
  getOpenAIKey,
  setOpenAIKey,
  getAnthropicKey,
  setAnthropicKey,
  getPreferredLanguage,
  setPreferredLanguage,
} from "@/lib/storage";

const colors = Colors.dark;

const LANGUAGES = [
  { code: "auto", label: "Auto-detect" },
  { code: "fr", label: "Fran\u00e7ais" },
  { code: "en", label: "English" },
  { code: "es", label: "Espa\u00f1ol" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Portugu\u00eas" },
  { code: "it", label: "Italiano" },
  { code: "nl", label: "Nederlands" },
  { code: "ja", label: "Japanese" },
  { code: "zh", label: "Chinese" },
];

export default function SettingsScreen() {
  const [openaiKey, setOpenaiKeyState] = useState("");
  const [anthropicKey, setAnthropicKeyState] = useState("");
  const [language, setLanguage] = useState("auto");
  const [saved, setSaved] = useState(false);

  const overlay = useOverlayPermissions();

  useEffect(() => {
    (async () => {
      const oai = await getOpenAIKey();
      const ant = await getAnthropicKey();
      const lang = await getPreferredLanguage();
      if (oai) setOpenaiKeyState(oai);
      if (ant) setAnthropicKeyState(ant);
      setLanguage(lang);
    })();
  }, []);

  const handleSave = useCallback(async () => {
    if (!openaiKey.trim()) {
      Alert.alert("Required", "OpenAI API key is required for transcription.");
      return;
    }
    await setOpenAIKey(openaiKey.trim());
    if (anthropicKey.trim()) {
      await setAnthropicKey(anthropicKey.trim());
    }
    await setPreferredLanguage(language);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [openaiKey, anthropicKey, language]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* OpenAI Key */}
        <View style={styles.section}>
          <Text style={styles.label}>OpenAI API Key *</Text>
          <Text style={styles.hint}>
            Required for Whisper transcription (~$0.006/min)
          </Text>
          <TextInput
            style={styles.input}
            value={openaiKey}
            onChangeText={setOpenaiKeyState}
            placeholder="sk-..."
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Anthropic Key */}
        <View style={styles.section}>
          <Text style={styles.label}>Anthropic API Key</Text>
          <Text style={styles.hint}>
            Optional. Enables AI text cleanup with Claude Haiku (~$0.001/req)
          </Text>
          <TextInput
            style={styles.input}
            value={anthropicKey}
            onChangeText={setAnthropicKeyState}
            placeholder="sk-ant-..."
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Floating Button */}
        <View style={styles.section}>
          <Text style={styles.label}>Floating Button</Text>
          <Text style={styles.hint}>
            Show a recording button over other apps (Android only)
          </Text>

          {overlay.isAvailable ? (
            <View style={{ gap: 8 }}>
              {/* Overlay permission */}
              <Pressable
                onPress={
                  overlay.hasOverlayPermission
                    ? overlay.showBubble
                    : overlay.requestOverlayPermission
                }
                style={[
                  styles.toggleBtn,
                  overlay.hasOverlayPermission && styles.toggleBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    !overlay.hasOverlayPermission && {
                      color: colors.primaryLight,
                    },
                  ]}
                >
                  {overlay.hasOverlayPermission
                    ? "Show Floating Button"
                    : "Enable Overlay Permission"}
                </Text>
              </Pressable>

              {/* Accessibility service (optional) */}
              {overlay.hasOverlayPermission && (
                <Pressable
                  onPress={
                    overlay.hasAccessibilityPermission
                      ? undefined
                      : overlay.openAccessibilitySettings
                  }
                  style={[
                    styles.toggleBtn,
                    overlay.hasAccessibilityPermission &&
                      styles.toggleBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      !overlay.hasAccessibilityPermission && {
                        color: colors.primaryLight,
                      },
                    ]}
                  >
                    {overlay.hasAccessibilityPermission
                      ? "Text Injection: Enabled"
                      : "Enable Text Injection (optional)"}
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <Pressable
              style={[styles.toggleBtn, styles.toggleBtnActive]}
              disabled
            >
              <Text style={styles.toggleBtnText}>
                In-app FAB active
              </Text>
            </Pressable>
          )}
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.label}>Transcription Language</Text>
          <View style={styles.languageGrid}>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => setLanguage(lang.code)}
                style={[
                  styles.languageBtn,
                  language === lang.code && styles.languageBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.languageBtnText,
                    language === lang.code && styles.languageBtnTextActive,
                  ]}
                >
                  {lang.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Save */}
        <Pressable onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>
            {saved ? "Saved!" : "Save Settings"}
          </Text>
        </Pressable>

        {/* About */}
        <View style={styles.about}>
          <Text style={styles.aboutText}>
            {APP_NAME} v1.0.0{"\n"}
            Voice typing & clipboard sync{"\n"}
            Part of the WinFlowz ecosystem
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    color: colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  languageBtn: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  languageBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  languageBtnTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  toggleBtn: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  toggleBtnActive: {
    borderColor: colors.success,
    backgroundColor: colors.success + "18",
  },
  toggleBtnText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  about: {
    marginTop: 32,
    alignItems: "center",
  },
  aboutText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
