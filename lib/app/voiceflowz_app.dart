import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/router/app_router.dart';
import '../core/theme/app_theme.dart';
import '../features/settings/application/settings_store_provider.dart';
import '../features/settings/domain/settings_store.dart';

class AppThemeModeController extends Notifier<AppThemeMode> {
  @override
  AppThemeMode build() {
    Future<void>.microtask(_load);
    return AppThemeMode.system;
  }

  void setMode(AppThemeMode value) {
    state = value;
    final store = ref.read(settingsStoreProvider);
    store.save(
      UserSettingsSnapshot.defaults().copyWith(themeMode: value.materialMode),
    );
  }

  Future<void> _load() async {
    final settings = await ref.read(settingsStoreProvider).load();
    state = AppThemeMode.values.firstWhere(
      (mode) => mode.materialMode == settings.themeMode,
      orElse: () => AppThemeMode.system,
    );
  }
}

final appThemeModeProvider =
    NotifierProvider<AppThemeModeController, AppThemeMode>(
      AppThemeModeController.new,
    );

class VoiceFlowzApp extends ConsumerWidget {
  const VoiceFlowzApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final themeMode = ref.watch(appThemeModeProvider);
    return MaterialApp.router(
      title: 'VoiceFlowz',
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: themeMode.materialMode,
      routerConfig: router,
    );
  }
}
