const CLEANUP_PROMPT = `You are a voice transcription cleanup assistant. Clean up the following transcribed text:
- Remove filler words (um, uh, euh, hmm, like, you know, genre, en fait)
- Fix grammar and punctuation
- Keep the original meaning and tone
- Keep the same language as the input
- Do NOT add any commentary, just return the cleaned text
- If the text contains snippet triggers (words starting with /), leave them as-is`;

export async function cleanupTranscription(
  rawText: string,
  apiKey: string,
  dictionaryTerms: string[] = []
): Promise<string> {
  if (!rawText.trim()) return "";

  const dictionaryContext =
    dictionaryTerms.length > 0
      ? `\n\nPersonal dictionary (use these exact spellings): ${dictionaryTerms.join(", ")}`
      : "";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${CLEANUP_PROMPT}${dictionaryContext}\n\nTranscribed text:\n${rawText}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error("AI cleanup failed:", response.status);
    return rawText; // Fallback to raw text
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? rawText;
}
