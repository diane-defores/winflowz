// Local text cleanup — no API calls, 100% free
// Removes filler words and basic grammar fixes

const FILLER_WORDS_FR = [
  /\b(euh|heu|hum|hmm|bah|ben|beh|genre|en fait|du coup|voilà|quoi)\b/gi,
];

const FILLER_WORDS_EN = [
  /\b(um|uh|uhm|hmm|like|you know|i mean|basically|actually|literally|so yeah)\b/gi,
];

const ALL_FILLERS = [...FILLER_WORDS_FR, ...FILLER_WORDS_EN];

export function cleanupLocal(text: string): string {
  if (!text.trim()) return "";

  let cleaned = text;

  // Remove filler words
  for (const pattern of ALL_FILLERS) {
    cleaned = cleaned.replace(pattern, "");
  }

  // Collapse multiple spaces
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // Capitalize first letter of sentences
  cleaned = cleaned.replace(/(^\s*\w|[.!?]\s+\w)/g, (match) =>
    match.toUpperCase()
  );

  // Trim
  cleaned = cleaned.trim();

  // Capitalize first character
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  // Ensure ends with punctuation
  if (cleaned && !/[.!?]$/.test(cleaned)) {
    cleaned += ".";
  }

  return cleaned;
}
