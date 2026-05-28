import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/diagnostics/app_diagnostics.dart';
import '../../../core/platform/android_keyboard_bridge.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_components.dart';
import '../../../core/widgets/confirm_action_dialog.dart';
import '../../../core/widgets/local_mode_notice.dart';
import '../../settings/application/settings_store_provider.dart';
import '../application/dictionary_store_provider.dart';
import '../domain/dictionary_store.dart';

class DictionaryScreen extends ConsumerStatefulWidget {
  const DictionaryScreen({super.key});

  @override
  ConsumerState<DictionaryScreen> createState() => _DictionaryScreenState();
}

class _DictionaryScreenState extends ConsumerState<DictionaryScreen> {
  final _termController = TextEditingController();
  final _replacementController = TextEditingController();
  bool _caseSensitive = false;
  bool _busy = false;
  String? _message;
  List<DictionaryTermRecord> _items = const [];

  @override
  void initState() {
    super.initState();
    Future<void>.microtask(_load);
  }

  @override
  void dispose() {
    _termController.dispose();
    _replacementController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      final store = ref.read(dictionaryStoreProvider);
      final rows = await store.list();
      await _syncKeyboardRules(rows);
      AppDiagnostics.record(
        'dictionary_load',
        'store=${store.runtimeType}; items=${rows.length}',
      );
      if (mounted) {
        setState(() => _items = rows);
      }
    } catch (error) {
      AppDiagnostics.record('dictionary_load_error', error);
      if (mounted) {
      setState(() => _message = 'Erreur lors du chargement du dictionnaire: $error');
      }
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _add() async {
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      final store = ref.read(dictionaryStoreProvider);
      await store.insert(
        term: _termController.text,
        replacement: _replacementController.text,
        caseSensitive: _caseSensitive,
      );
      _termController.clear();
      _replacementController.clear();
      setState(() => _caseSensitive = false);
      await _load();
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Insertion dictionnaire impossible: $error');
      }
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _edit(DictionaryTermRecord item) async {
    final term = TextEditingController(text: item.term);
    final replacement = TextEditingController(text: item.replacement);
    bool caseSensitive = item.caseSensitive;
    final submit = await showDialog<bool>(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setLocalState) {
            return AlertDialog(
              title: const Text('Modifier un terme'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: term,
                      decoration: const InputDecoration(labelText: 'Terme'),
                    ),
                    AppGaps.x2,
                    TextField(
                      controller: replacement,
                      decoration: const InputDecoration(
                        labelText: 'Remplacement',
                      ),
                    ),
                    AppGaps.x2,
                    SwitchListTile(
                      dense: true,
                      contentPadding: AppInsets.none,
                      value: caseSensitive,
                      onChanged: (value) =>
                          setLocalState(() => caseSensitive = value),
                      title: const Text('Respecter la casse'),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  child: const Text('Annuler'),
                ),
                FilledButton(
                  onPressed: () => Navigator.of(context).pop(true),
                  child: const Text('Enregistrer'),
                ),
              ],
            );
          },
        );
      },
    );

    if (submit != true) {
      term.dispose();
      replacement.dispose();
      return;
    }

    setState(() => _busy = true);
    try {
      final store = ref.read(dictionaryStoreProvider);
      await store.update(
        id: item.id,
        term: term.text,
        replacement: replacement.text,
        caseSensitive: caseSensitive,
      );
      await _load();
    } catch (error) {
      if (mounted) {
        setState(
          () => _message = 'Mise à jour dictionnaire impossible: $error',
        );
      }
    } finally {
      term.dispose();
      replacement.dispose();
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _remove(String id) async {
    final settings = await ref.read(settingsStoreProvider).load();
    if (!mounted) {
      return;
    }
    final confirmed = await showConfirmActionDialog(
      context: context,
      title: 'Supprimer le terme ?',
      message:
          'Cette action retire la règle du dictionnaire personnel. Elle ne peut pas être annulée depuis cet écran.',
      confirmLabel: 'Supprimer',
      destructive: true,
      confirmationEnabled: settings.confirmDestructiveActions,
    );
    if (!mounted || !confirmed) {
      return;
    }
    setState(() => _busy = true);
    try {
      final store = ref.read(dictionaryStoreProvider);
      await store.softDelete(id);
      await _load();
    } catch (error) {
      if (mounted) {
        setState(
          () => _message = 'Suppression terme dictionnaire impossible: $error',
        );
      }
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _syncKeyboardRules(List<DictionaryTermRecord> rows) async {
    try {
      await AndroidKeyboardBridge.setDictionaryRules(
        rows
            .map(
              (item) => AndroidKeyboardTextRule(
                trigger: item.term,
                replacement: item.replacement,
                caseSensitive: item.caseSensitive,
              ),
            )
            .toList(growable: false),
      );
    } catch (error) {
      AppDiagnostics.record('dictionary_keyboard_sync_error', error);
    }
  }

  @override
  Widget build(BuildContext context) {
    AppDiagnostics.record('screen_build', 'Dictionary');
    return ListView(
      padding: AppInsets.screen,
      children: [
        const LocalModeNotice(surface: 'Dictionary'),
        const LocalModeNoticeGap(),
        AppSectionCard(
          title: 'Nouveau terme',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextField(
                controller: _termController,
                decoration: const InputDecoration(labelText: 'Terme'),
              ),
              AppGaps.x2,
              TextField(
                controller: _replacementController,
                decoration: const InputDecoration(labelText: 'Remplacement'),
              ),
              SwitchListTile(
                contentPadding: AppInsets.none,
                value: _caseSensitive,
                onChanged: _busy
                    ? null
                    : (value) => setState(() => _caseSensitive = value),
                title: const Text('Respecter la casse'),
              ),
              AppFormActions(
                primaryLabel: 'Ajouter un terme',
                onPrimary: _busy ? null : _add,
                onSecondary: _busy ? null : _load,
              ),
            ],
          ),
        ),
        if (_busy)
          const Padding(
            padding: AppInsets.progress,
            child: LinearProgressIndicator(),
          ),
        if (_message != null)
          Padding(padding: AppInsets.message, child: Text(_message!)),
        AppGaps.x4,
        const AppEntityListHeader(title: 'Termes du dictionnaire'),
        AppGaps.x2,
        if (_items.isEmpty)
          const AppEmptyStateCard(
            title: 'Aucun terme',
            message:
                'Ajoute un terme personnalisé pour corriger tes expressions récurrentes.',
          ),
        for (final item in _items)
          AppEntityListTile(
            title: Text(item.term),
            subtitle: Text(
              '${item.replacement}\nRespecter la casse: ${item.caseSensitive ? 'Oui' : 'Non'}',
            ),
            isThreeLine: true,
            actions: [
              IconButton(
                tooltip: 'Modifier',
                onPressed: _busy ? null : () => _edit(item),
                icon: const Icon(Icons.edit_outlined),
              ),
              IconButton(
                tooltip: 'Supprimer',
                onPressed: _busy ? null : () => _remove(item.id),
                icon: const Icon(Icons.delete_outline),
              ),
            ],
          ),
      ],
    );
  }
}
