import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/router/app_router.dart';
import '../core/theme/app_theme.dart';

class AppThemeModeController extends Notifier<AppThemeMode> {
  @override
  AppThemeMode build() => AppThemeMode.system;

  void setMode(AppThemeMode value) {
    state = value;
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
