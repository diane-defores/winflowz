import * as SecureStore from "expo-secure-store";

const KEYS = {
  OPENAI_API_KEY: "voiceflowz_openai_key",
  ANTHROPIC_API_KEY: "voiceflowz_anthropic_key",
  PREFERRED_LANGUAGE: "voiceflowz_language",
} as const;

export async function getOpenAIKey(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.OPENAI_API_KEY);
}

export async function setOpenAIKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.OPENAI_API_KEY, key);
}

export async function getAnthropicKey(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.ANTHROPIC_API_KEY);
}

export async function setAnthropicKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.ANTHROPIC_API_KEY, key);
}

export async function getPreferredLanguage(): Promise<string> {
  return (await SecureStore.getItemAsync(KEYS.PREFERRED_LANGUAGE)) ?? "auto";
}

export async function setPreferredLanguage(lang: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.PREFERRED_LANGUAGE, lang);
}
