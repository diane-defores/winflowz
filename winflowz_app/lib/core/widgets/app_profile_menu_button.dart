import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/winflowz_app.dart';
import '../../features/auth/application/auth_session_provider.dart';
import '../theme/app_theme.dart';

enum AppProfileMenuAction {
  account,
  voice,
  keyboard,
  overlay,
  localKeys,
  maintenance,
  themeSystem,
  themeLight,
  themeDark,
}

class AppProfileMenuButton extends ConsumerWidget {
  const AppProfileMenuButton({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final session = ref.watch(authSessionProvider).asData?.value;
    final label = _profileLabel(session?.user?.email);
    final initials = _profileInitials(label);

    final activeTheme = ref.watch(appThemeModeProvider);

    return PopupMenuButton<AppProfileMenuAction>(
      tooltip: 'Mon espace',
      onSelected: (value) => _handleAction(context, ref, value),
      itemBuilder: (context) => [
        const PopupMenuItem<AppProfileMenuAction>(
          value: AppProfileMenuAction.account,
          child: ListTile(
            dense: true,
            leading: Icon(Icons.cloud_sync_outlined),
            title: Text('Mon compte'),
            subtitle: Text('Compte et synchronisation'),
          ),
        ),
        const PopupMenuItem<AppProfileMenuAction>(
          value: AppProfileMenuAction.voice,
          child: ListTile(
            dense: true,
            leading: Icon(Icons.graphic_eq_outlined),
            title: Text('Voix'),
            subtitle: Text('Dictée et packs locaux'),
          ),
        ),
        const PopupMenuItem<AppProfileMenuAction>(
          value: AppProfileMenuAction.keyboard,
          child: ListTile(
            dense: true,
            leading: Icon(Icons.keyboard_outlined),
            title: Text('Clavier'),
            subtitle: Text('Réglages du clavier'),
          ),
        ),
        const PopupMenuItem<AppProfileMenuAction>(
          value: AppProfileMenuAction.overlay,
          child: ListTile(
            dense: true,
            leading: Icon(Icons.bubble_chart_outlined),
            title: Text('Overlay'),
            subtitle: Text('Bulle et permissions'),
          ),
        ),
        const PopupMenuItem<AppProfileMenuAction>(
          value: AppProfileMenuAction.localKeys,
          child: ListTile(
            dense: true,
            leading: Icon(Icons.key_outlined),
            title: Text('Clés IA locales'),
            subtitle: Text('Secrets sur l’appareil'),
          ),
        ),
        const PopupMenuItem<AppProfileMenuAction>(
          value: AppProfileMenuAction.maintenance,
          child: ListTile(
            dense: true,
            leading: Icon(Icons.admin_panel_settings_outlined),
            title: Text('Maintenance'),
            subtitle: Text('Support et diagnostics'),
          ),
        ),
        const PopupMenuDivider(),
        CheckedPopupMenuItem<AppProfileMenuAction>(
          value: AppProfileMenuAction.themeSystem,
          checked: activeTheme == AppThemeMode.system,
          child: const Text('Thème système'),
        ),
        CheckedPopupMenuItem<AppProfileMenuAction>(
          value: AppProfileMenuAction.themeLight,
          checked: activeTheme == AppThemeMode.light,
          child: const Text('Thème clair'),
        ),
        CheckedPopupMenuItem<AppProfileMenuAction>(
          value: AppProfileMenuAction.themeDark,
          checked: activeTheme == AppThemeMode.dark,
          child: const Text('Thème sombre'),
        ),
      ],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          CircleAvatar(
            radius: 22,
            backgroundColor: Theme.of(
              context,
            ).colorScheme.primary.withValues(alpha: 0.12),
            foregroundColor: Theme.of(context).colorScheme.primary,
            child: Text(
              initials,
              style: Theme.of(
                context,
              ).textTheme.labelLarge?.copyWith(fontWeight: AppFontWeights.bold),
            ),
          ),
          AppGaps.x1,
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 112),
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.end,
              style: Theme.of(context).textTheme.labelSmall,
            ),
          ),
        ],
      ),
    );
  }

  static void _handleAction(
    BuildContext context,
    WidgetRef ref,
    AppProfileMenuAction action,
  ) {
    switch (action) {
      case AppProfileMenuAction.account:
        context.go('/settings?section=account_cloud');
      case AppProfileMenuAction.voice:
        context.go('/settings?section=voice_packs');
      case AppProfileMenuAction.keyboard:
        context.go('/settings?section=keyboard');
      case AppProfileMenuAction.overlay:
        context.go('/settings?section=overlay');
      case AppProfileMenuAction.localKeys:
        context.go('/settings?section=keys');
      case AppProfileMenuAction.maintenance:
        context.go('/settings?section=maintenance');
      case AppProfileMenuAction.themeSystem:
        ref.read(appThemeModeProvider.notifier).setMode(AppThemeMode.system);
      case AppProfileMenuAction.themeLight:
        ref.read(appThemeModeProvider.notifier).setMode(AppThemeMode.light);
      case AppProfileMenuAction.themeDark:
        ref.read(appThemeModeProvider.notifier).setMode(AppThemeMode.dark);
    }
  }

  static String _profileLabel(String? email) {
    final value = email?.trim();
    if (value == null || value.isEmpty) {
      return 'Local';
    }
    return value;
  }

  static String _profileInitials(String label) {
    if (label.contains('@')) {
      final localPart = label.split('@').first.trim();
      final letters = localPart.replaceAll(RegExp(r'[^A-Za-z0-9]'), '');
      if (letters.isEmpty) {
        return 'WF';
      }
      return letters.substring(0, letters.length >= 2 ? 2 : 1).toUpperCase();
    }

    final parts = label
        .split(RegExp(r'\s+'))
        .where((part) => part.trim().isNotEmpty)
        .toList(growable: false);
    if (parts.isEmpty) {
      return 'WF';
    }
    if (parts.length == 1) {
      final part = parts.first;
      return part.substring(0, part.length >= 2 ? 2 : 1).toUpperCase();
    }
    return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
  }
}
