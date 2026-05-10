import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;

import '../../../core/bootstrap/firebase_bootstrap.dart';
import '../data/firebase_settings_store.dart';
import '../data/local_settings_store.dart';
import '../domain/settings_store.dart';

final localSettingsStoreProvider = Provider<LocalSettingsStore>(
  (ref) => LocalSettingsStore(),
);

final settingsStoreProvider = Provider<SettingsStore>((ref) {
  if (FirebaseBootstrap.isConfigured &&
      firebase_auth.FirebaseAuth.instance.currentUser != null) {
    return FirebaseSettingsStore();
  }
  return ref.watch(localSettingsStoreProvider);
});
