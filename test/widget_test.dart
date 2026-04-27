import 'package:flutter_test/flutter_test.dart';
import 'package:voiceflowz/features/voice/domain/transcription_draft.dart';

void main() {
  test('transcription draft validates non-empty payload and known source', () {
    const valid = TranscriptionDraft(
      rawText: 'hello',
      cleanedText: 'Hello.',
      language: 'en',
      source: 'advanced',
      durationMs: 1200,
    );
    const invalid = TranscriptionDraft(
      rawText: ' ',
      cleanedText: '',
      language: 'en',
      source: 'unknown',
      durationMs: -1,
    );

    expect(valid.isValid, isTrue);
    expect(invalid.isValid, isFalse);
  });
}
