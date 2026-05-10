import 'package:flutter/material.dart';

import '../../../core/sync/sync_status.dart';
import 'user_retention_policy.dart';

class UserSettingsSnapshot {
  const UserSettingsSnapshot({
    required this.themeMode,
    required this.retentionPolicy,
    required this.clipboardAutoSync,
    required this.transcriptionSync,
    required this.syncStatus,
    this.updatedAt,
  });

  const UserSettingsSnapshot.defaults()
    : themeMode = ThemeMode.system,
      retentionPolicy = UserRetentionPolicy.sevenDays,
      clipboardAutoSync = true,
      transcriptionSync = true,
      syncStatus = const SyncStatus.localOnly(),
      updatedAt = null;

  final ThemeMode themeMode;
  final UserRetentionPolicy retentionPolicy;
  final bool clipboardAutoSync;
  final bool transcriptionSync;
  final SyncStatus syncStatus;
  final DateTime? updatedAt;

  UserSettingsSnapshot copyWith({
    ThemeMode? themeMode,
    UserRetentionPolicy? retentionPolicy,
    bool? clipboardAutoSync,
    bool? transcriptionSync,
    SyncStatus? syncStatus,
    DateTime? updatedAt,
  }) {
    return UserSettingsSnapshot(
      themeMode: themeMode ?? this.themeMode,
      retentionPolicy: retentionPolicy ?? this.retentionPolicy,
      clipboardAutoSync: clipboardAutoSync ?? this.clipboardAutoSync,
      transcriptionSync: transcriptionSync ?? this.transcriptionSync,
      syncStatus: syncStatus ?? this.syncStatus,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

abstract class SettingsStore {
  Future<UserSettingsSnapshot> load();

  Future<void> save(UserSettingsSnapshot settings);

  Stream<UserSettingsSnapshot> watch();
}
