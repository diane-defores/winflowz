import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../domain/settings_store.dart';
import '../domain/user_retention_policy.dart';

class LocalSettingsStore implements SettingsStore {
  LocalSettingsStore({FlutterSecureStorage? storage})
    : _storage = storage ?? const FlutterSecureStorage();

  static const _themeModeKey = 'settings_theme_mode';
  static const _retentionPolicyKey = 'settings_retention_policy';
  static const _clipboardAutoSyncKey = 'settings_clipboard_auto_sync';
  static const _transcriptionSyncKey = 'settings_transcription_sync';

  final FlutterSecureStorage _storage;
  final _controller = StreamController<UserSettingsSnapshot>.broadcast();

  @override
  Future<UserSettingsSnapshot> load() async {
    final themeMode = _themeModeFromValue(await _read(_themeModeKey));
    final retentionPolicy = UserRetentionPolicy.fromValue(
      await _read(_retentionPolicyKey) ?? UserRetentionPolicy.sevenDays.value,
    );
    final clipboardAutoSync = _boolFromValue(
      await _read(_clipboardAutoSyncKey),
      fallback: true,
    );
    final transcriptionSync = _boolFromValue(
      await _read(_transcriptionSyncKey),
      fallback: true,
    );
    return UserSettingsSnapshot.defaults().copyWith(
      themeMode: themeMode,
      retentionPolicy: retentionPolicy,
      clipboardAutoSync: clipboardAutoSync,
      transcriptionSync: transcriptionSync,
    );
  }

  @override
  Future<void> save(UserSettingsSnapshot settings) async {
    await _write(_themeModeKey, settings.themeMode.name);
    await _write(_retentionPolicyKey, settings.retentionPolicy.value);
    await _write(_clipboardAutoSyncKey, settings.clipboardAutoSync.toString());
    await _write(_transcriptionSyncKey, settings.transcriptionSync.toString());
    _controller.add(settings);
  }

  @override
  Stream<UserSettingsSnapshot> watch() async* {
    yield await load();
    yield* _controller.stream;
  }

  Future<String?> _read(String key) async {
    try {
      return _storage.read(key: key);
    } catch (_) {
      return null;
    }
  }

  Future<void> _write(String key, String value) async {
    try {
      await _storage.write(key: key, value: value);
    } catch (_) {
      // Local settings are best-effort so UI development never crashes when
      // platform secure storage is unavailable.
    }
  }

  static ThemeMode _themeModeFromValue(String? value) {
    return ThemeMode.values.firstWhere(
      (mode) => mode.name == value,
      orElse: () => ThemeMode.system,
    );
  }

  static bool _boolFromValue(String? value, {required bool fallback}) {
    if (value == null) {
      return fallback;
    }
    return value == 'true';
  }
}
