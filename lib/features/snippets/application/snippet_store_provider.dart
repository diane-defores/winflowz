import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;

import '../../../core/bootstrap/firebase_bootstrap.dart';
import '../../../data/supabase/supabase_client_provider.dart';
import '../data/firebase_snippet_store.dart';
import '../data/in_memory_snippet_store.dart';
import '../data/supabase_snippet_store.dart';
import '../domain/snippet_store.dart';

final localSnippetStoreProvider = Provider<InMemorySnippetStore>(
  (ref) => InMemorySnippetStore(),
);

final snippetStoreProvider = Provider<SnippetStore>((ref) {
  if (FirebaseBootstrap.isConfigured &&
      firebase_auth.FirebaseAuth.instance.currentUser != null) {
    return FirebaseSnippetStore();
  }

  if (!FirebaseBootstrap.isConfigured) {
    final client = ref.watch(supabaseClientProvider);
    if (client == null) {
      return ref.watch(localSnippetStoreProvider);
    }
    return SupabaseSnippetStore(client);
  }

  return ref.watch(localSnippetStoreProvider);
});
