import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;

import '../../../core/bootstrap/firebase_bootstrap.dart';
import '../../../data/supabase/supabase_client_provider.dart';
import '../../auth/application/auth_session_provider.dart';
import '../data/in_memory_dictionary_store.dart';
import '../data/firebase_dictionary_store.dart';
import '../data/supabase_dictionary_store.dart';
import '../domain/dictionary_store.dart';

final localDictionaryStoreProvider = Provider<InMemoryDictionaryStore>(
  (ref) => InMemoryDictionaryStore(),
);

final dictionaryStoreProvider = Provider<DictionaryStore>((ref) {
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
    return FirebaseDictionaryStore();
  }

  if (!FirebaseBootstrap.isConfigured && hasRemoteSession) {
    final client = ref.watch(supabaseClientProvider);
    if (client != null) {
      return SupabaseDictionaryStore(client);
    }
  }

  return ref.watch(localDictionaryStoreProvider);
});
