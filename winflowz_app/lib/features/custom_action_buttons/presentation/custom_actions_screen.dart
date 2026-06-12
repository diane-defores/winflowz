import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/diagnostics/app_diagnostics.dart';
import '../../../core/platform/android_keyboard_bridge.dart';
import '../../../core/platform/platform_capabilities.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_components.dart';
import '../../settings/application/settings_store_provider.dart';
import '../application/custom_action_bar_preferences.dart';
import '../domain/custom_action_buttons.dart';
import '../../snippets/presentation/custom_action_buttons_panel.dart';

class CustomActionsScreen extends ConsumerStatefulWidget {
  const CustomActionsScreen({super.key});

  @override
  ConsumerState<CustomActionsScreen> createState() =>
      _CustomActionsScreenState();
}

class _CustomActionsScreenState extends ConsumerState<CustomActionsScreen> {
  List<CustomActionButtonRecord> _items = const [];
  bool _itemsLoaded = false;
  bool _syncBusy = false;
  bool? _pendingSyncEnabled;
  String? _syncMessage;

  @override
  void initState() {
    super.initState();
    Future<void>.microtask(() {
      ref.read(customActionBarEnabledProvider.notifier).syncFromSettings();
    });
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<bool>(customActionBarEnabledProvider, (previous, next) {
      if (previous != null && previous != next) {
        _requestKeyboardConfigSync(enabled: next);
      }
    });
    return CustomActionButtonsPanel(
      surfaceSelector: _ActionsPageHeader(
        syncBusy: _syncBusy,
        syncMessage: _syncMessage,
        compatibleCount: _items.toAndroidImeActions().length,
        totalCount: _items.length,
        onSync: () {
          final enabled = ref.read(customActionBarEnabledProvider);
          _requestKeyboardConfigSync(enabled: enabled, force: true);
        },
      ),
      onItemsChanged: (items) {
        if (mounted) {
          setState(() {
            _items = items;
            _itemsLoaded = true;
          });
        } else {
          _items = items;
          _itemsLoaded = true;
        }
        final enabled = ref.read(customActionBarEnabledProvider);
        _requestKeyboardConfigSync(enabled: enabled);
      },
    );
  }

  void _requestKeyboardConfigSync({required bool enabled, bool force = false}) {
    if (!_itemsLoaded && !force) {
      _pendingSyncEnabled = enabled;
      return;
    }
    if (_syncBusy) {
      _pendingSyncEnabled = enabled;
      return;
    }
    _pendingSyncEnabled = null;
    unawaited(_syncKeyboardConfig(enabled: enabled));
  }

  Future<void> _syncKeyboardConfig({required bool enabled}) async {
    if (!PlatformCapabilities.keyboardImeSupported) {
      return;
    }
    setState(() {
      _syncBusy = true;
      _syncMessage = null;
    });
    try {
      final settingsStore = ref.read(settingsStoreProvider);
      final current = await settingsStore.load();
      if (current.customActionBarEnabled != enabled) {
        await settingsStore.save(
          current.copyWith(customActionBarEnabled: enabled),
        );
      }
      final status = await AndroidKeyboardBridge.setCustomActionBarConfig(
        CustomActionButtonImeConfig(
          enabled: enabled,
          actions: _items.toAndroidImeActions(),
        ),
      );
      if (!mounted) {
        return;
      }
      setState(
        () => _syncMessage = status.customActionBarEnabled
            ? 'Barre synchronisée avec le clavier Android.'
            : 'Barre désactivée dans le clavier Android.',
      );
      AppDiagnostics.record(
        'custom_action_bar_sync',
        'enabled=$enabled; actions=${_items.toAndroidImeActions().length}',
      );
    } on AndroidKeyboardBridgeException catch (error) {
      if (!mounted) {
        return;
      }
      setState(
        () => _syncMessage =
            'Synchronisation clavier impossible (${error.code}) : ${error.message}',
      );
      AppDiagnostics.record('custom_action_bar_sync_error', error);
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(
        () => _syncMessage = 'Synchronisation clavier impossible: $error',
      );
      AppDiagnostics.record('custom_action_bar_sync_error', error);
    } finally {
      if (mounted) {
        setState(() => _syncBusy = false);
      }
      final pending = _pendingSyncEnabled;
      _pendingSyncEnabled = null;
      if (pending != null && pending != enabled) {
        _requestKeyboardConfigSync(enabled: pending, force: true);
      } else if (pending != null && _itemsLoaded) {
        _requestKeyboardConfigSync(enabled: pending, force: true);
      }
    }
  }
}

class _ActionsPageHeader extends StatelessWidget {
  const _ActionsPageHeader({
    required this.syncBusy,
    required this.syncMessage,
    required this.compatibleCount,
    required this.totalCount,
    required this.onSync,
  });

  final bool syncBusy;
  final String? syncMessage;
  final int compatibleCount;
  final int totalCount;
  final VoidCallback onSync;

  @override
  Widget build(BuildContext context) {
    return AppSectionCard(
      title: 'Actions',
      subtitle:
          'Compose une barre d’action unique, scrollable, puis active-la dans le clavier Android.',
      leading: const Icon(Icons.smart_button_outlined),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          ProductSummaryStrip(
            children: [
              AppMetricPill(
                icon: Icons.view_week_outlined,
                label: '$totalCount',
                value: 'boutons',
              ),
              AppMetricPill(
                icon: Icons.keyboard_outlined,
                label: '$compatibleCount',
                value: 'compatibles IME',
              ),
            ],
          ),
          if (syncMessage != null) ...[
            AppGaps.x2,
            AppBannerCard(
              icon: syncMessage!.contains('impossible')
                  ? Icons.info_outline
                  : Icons.check_circle_outline,
              title: 'Synchronisation clavier',
              message: syncMessage!,
            ),
          ],
          AppGaps.x2,
          Align(
            alignment: Alignment.centerLeft,
            child: OutlinedButton.icon(
              onPressed: syncBusy ? null : onSync,
              icon: syncBusy
                  ? const SizedBox.square(
                      dimension: AppIconMetrics.sm,
                      child: CircularProgressIndicator(
                        strokeWidth: AppIconMetrics.progressStroke,
                      ),
                    )
                  : const Icon(Icons.sync_outlined),
              label: const Text('Synchroniser le clavier'),
            ),
          ),
        ],
      ),
    );
  }
}
