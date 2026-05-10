import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;

import '../../../core/bootstrap/firebase_bootstrap.dart';
import '../../../data/supabase/supabase_client_provider.dart';
import '../../auth/application/auth_session_provider.dart';
import '../data/firebase_transcription_store.dart';
import '../../../data/supabase/transcription_repository.dart';
import '../data/in_memory_transcription_store.dart';
import '../data/supabase_transcription_store.dart';
import 'transcription_store.dart';

final localTranscriptionStoreProvider = Provider<InMemoryTranscriptionStore>((
  ref,
) {
  return InMemoryTranscriptionStore();
});

final transcriptionStoreProvider = Provider<TranscriptionStore>((ref) {
  final session = ref.watch(
    authSessionProvider.select(
      (value) =>
          value.maybeWhen(data: (session) => session, orElse: () => null),
    ),
  );
  final hasRemoteSession =
      session != null && session.isSignedIn && !session.isLocalFallback;

  if (FirebaseBootstrap.isConfigured &&
      hasRemoteSession &&
      firebase_auth.FirebaseAuth.instance.currentUser != null) {
    return FirebaseTranscriptionStore();
  }

  if (!FirebaseBootstrap.isConfigured && hasRemoteSession) {
    final client = ref.watch(supabaseClientProvider);
    if (client != null) {
      return SupabaseTranscriptionStore(TranscriptionRepository(client));
    }
  }

  return ref.watch(localTranscriptionStoreProvider);
});
