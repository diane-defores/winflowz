export interface WhisperResult {
  text: string;
  language: string;
  duration: number;
}

export async function transcribeAudio(
  audioUri: string,
  apiKey: string,
  language?: string
): Promise<WhisperResult> {
  const formData = new FormData();

  // Read the audio file and append to form data
  const audioFile = {
    uri: audioUri,
    type: "audio/m4a",
    name: "recording.m4a",
  } as unknown as Blob;

  formData.append("file", audioFile);
  formData.append("model", "whisper-1");
  formData.append("response_format", "verbose_json");

  if (language) {
    formData.append("language", language);
  }

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Whisper API error: ${response.status} - ${error}`);
  }

  const data = await response.json();

  return {
    text: data.text,
    language: data.language ?? "unknown",
    duration: data.duration ?? 0,
  };
}
