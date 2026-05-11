import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/bootstrap/firebase_bootstrap.dart';
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
  return ref.watch(localAuthSessionStoreProvider);
});

final authSessionProvider = StreamProvider<AuthSessionSnapshot>((ref) {
  final store = ref.watch(authSessionStoreProvider);
  return store.watchSession();
});
