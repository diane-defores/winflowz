import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:winflowz_app/features/auth/application/auth_session_provider.dart';
import 'package:winflowz_app/features/auth/domain/auth_session_store.dart';
import 'package:winflowz_app/features/clipboard/application/clipboard_store_provider.dart';
import 'package:winflowz_app/features/clipboard/data/in_memory_clipboard_history_store.dart';
import 'package:winflowz_app/features/dictionary/application/dictionary_store_provider.dart';
import 'package:winflowz_app/features/dictionary/data/in_memory_dictionary_store.dart';
import 'package:winflowz_app/features/snippets/application/snippet_store_provider.dart';
import 'package:winflowz_app/features/snippets/data/in_memory_snippet_store.dart';
import 'package:winflowz_app/features/voice/application/transcription_store_provider.dart';
import 'package:winflowz_app/features/voice/data/in_memory_transcription_store.dart';

void main() {
  test('local mode keeps every product store on local implementations', () {
    final container = ProviderContainer(
      overrides: [
        authSessionProvider.overrideWith(
          (ref) => Stream.value(const AuthSessionSnapshot.localFallback()),
        ),
      ],
    );
    addTearDown(container.dispose);

    expect(
      container.read(transcriptionStoreProvider),
      isA<InMemoryTranscriptionStore>(),
    );
    expect(
      container.read(clipboardStoreProvider),
      isA<InMemoryClipboardHistoryStore>(),
    );
    expect(container.read(snippetStoreProvider), isA<InMemorySnippetStore>());
    expect(
      container.read(dictionaryStoreProvider),
      isA<InMemoryDictionaryStore>(),
    );
  });
}
