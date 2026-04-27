import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/supabase/dictionary_repository.dart';
import '../../../data/supabase/supabase_client_provider.dart';

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
    final client = ref.read(supabaseClientProvider);
    if (client == null) {
      setState(() => _message = 'Supabase non configuré.');
      return;
    }
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      final rows = await DictionaryRepository(client).list();
      if (mounted) {
        setState(() => _items = rows);
      }
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Erreur chargement dictionary: $error');
      }
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _add() async {
    final client = ref.read(supabaseClientProvider);
    if (client == null) {
      setState(() => _message = 'Supabase non configuré.');
      return;
    }
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      await DictionaryRepository(client).insert(
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
    final client = ref.read(supabaseClientProvider);
    if (client == null) {
      return;
    }
    final term = TextEditingController(text: item.term);
    final replacement = TextEditingController(text: item.replacement);
    bool caseSensitive = item.caseSensitive;
    final submit = await showDialog<bool>(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setLocalState) {
            return AlertDialog(
              title: const Text('Edit dictionary term'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: term,
                      decoration: const InputDecoration(labelText: 'Term'),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: replacement,
                      decoration: const InputDecoration(
                        labelText: 'Replacement',
                      ),
                    ),
                    const SizedBox(height: 8),
                    SwitchListTile(
                      dense: true,
                      contentPadding: EdgeInsets.zero,
                      value: caseSensitive,
                      onChanged: (value) =>
                          setLocalState(() => caseSensitive = value),
                      title: const Text('Case sensitive'),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  child: const Text('Cancel'),
                ),
                FilledButton(
                  onPressed: () => Navigator.of(context).pop(true),
                  child: const Text('Save'),
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
      await DictionaryRepository(client).update(
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
    final client = ref.read(supabaseClientProvider);
    if (client == null) {
      return;
    }
    setState(() => _busy = true);
    try {
      await DictionaryRepository(client).softDelete(id);
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

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        TextField(
          controller: _termController,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Term',
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _replacementController,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Replacement',
          ),
        ),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          value: _caseSensitive,
          onChanged: _busy
              ? null
              : (value) => setState(() => _caseSensitive = value),
          title: const Text('Case sensitive'),
        ),
        Row(
          children: [
            Expanded(
              child: FilledButton.icon(
                onPressed: _busy ? null : _add,
                icon: const Icon(Icons.add),
                label: const Text('Add term'),
              ),
            ),
            const SizedBox(width: 8),
            OutlinedButton(
              onPressed: _busy ? null : _load,
              child: const Text('Refresh'),
            ),
          ],
        ),
        if (_busy)
          const Padding(
            padding: EdgeInsets.only(top: 12),
            child: LinearProgressIndicator(),
          ),
        if (_message != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(_message!),
          ),
        const SizedBox(height: 16),
        const Text(
          'Dictionary terms (Supabase CRUD)',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        if (_items.isEmpty)
          const Card(child: ListTile(title: Text('No dictionary term yet.'))),
        for (final item in _items)
          Card(
            child: ListTile(
              title: Text(item.term),
              subtitle: Text(
                '${item.replacement}\ncaseSensitive: ${item.caseSensitive}',
              ),
              isThreeLine: true,
              trailing: Wrap(
                spacing: 4,
                children: [
                  IconButton(
                    tooltip: 'Edit',
                    onPressed: _busy ? null : () => _edit(item),
                    icon: const Icon(Icons.edit_outlined),
                  ),
                  IconButton(
                    tooltip: 'Delete',
                    onPressed: _busy ? null : () => _remove(item.id),
                    icon: const Icon(Icons.delete_outline),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
