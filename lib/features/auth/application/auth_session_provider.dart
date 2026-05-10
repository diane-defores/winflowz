import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/bootstrap/firebase_bootstrap.dart';
import '../../../data/supabase/supabase_auth_session_store.dart';
import '../../../data/supabase/supabase_client_provider.dart';
import '../data/firebase_auth_session_store.dart';
import '../data/local_auth_session_store.dart';
import '../domain/auth_session_store.dart';

final localAuthSessionStoreProvider = Provider<LocalAuthSessionStore>(
  (ref) => const LocalAuthSessionStore(),
);

final authSessionStoreProvider = Provider<AuthSessionStore>((ref) {
  if (FirebaseBootstrap.isConfigured) {
    return FirebaseAuthSessionStore();
  }

  final client = ref.watch(supabaseClientProvider);
  if (client == null) {
    return ref.watch(localAuthSessionStoreProvider);
  }

  // Legacy adapter kept only so existing Supabase environments continue to
  // compile and function while Firebase becomes the target backend.
  return SupabaseAuthSessionStore(client);
});

final authSessionProvider = StreamProvider<AuthSessionSnapshot>((ref) {
  final store = ref.watch(authSessionStoreProvider);
  return store.watchSession();
});
