import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/supabase/snippet_repository.dart';
import '../../../data/supabase/supabase_client_provider.dart';

class SnippetsScreen extends ConsumerStatefulWidget {
  const SnippetsScreen({super.key});

  @override
  ConsumerState<SnippetsScreen> createState() => _SnippetsScreenState();
}

class _SnippetsScreenState extends ConsumerState<SnippetsScreen> {
  final _triggerController = TextEditingController();
  final _contentController = TextEditingController();
  final _labelController = TextEditingController();
  bool _busy = false;
  String? _message;
  List<SnippetRecord> _items = const [];

  @override
  void initState() {
    super.initState();
    Future<void>.microtask(_load);
  }

  @override
  void dispose() {
    _triggerController.dispose();
    _contentController.dispose();
    _labelController.dispose();
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
      final rows = await SnippetRepository(client).list();
      if (mounted) {
        setState(() => _items = rows);
      }
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Erreur chargement snippets: $error');
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
      await SnippetRepository(client).insert(
        trigger: _triggerController.text,
        content: _contentController.text,
        label: _labelController.text,
      );
      _triggerController.clear();
      _contentController.clear();
      _labelController.clear();
      await _load();
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Insertion snippet impossible: $error');
      }
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _edit(SnippetRecord item) async {
    final client = ref.read(supabaseClientProvider);
    if (client == null) {
      return;
    }
    final trigger = TextEditingController(text: item.trigger);
    final content = TextEditingController(text: item.content);
    final label = TextEditingController(text: item.label ?? '');
    final submit = await showDialog<bool>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Edit snippet'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: trigger,
                  decoration: const InputDecoration(labelText: 'Trigger'),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: content,
                  minLines: 2,
                  maxLines: 5,
                  decoration: const InputDecoration(labelText: 'Content'),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: label,
                  decoration: const InputDecoration(labelText: 'Label'),
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

    if (submit != true) {
      trigger.dispose();
      content.dispose();
      label.dispose();
      return;
    }

    setState(() => _busy = true);
    try {
      await SnippetRepository(client).update(
        id: item.id,
        trigger: trigger.text,
        content: content.text,
        label: label.text,
      );
      await _load();
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Mise à jour snippet impossible: $error');
      }
    } finally {
      trigger.dispose();
      content.dispose();
      label.dispose();
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
      await SnippetRepository(client).softDelete(id);
      await _load();
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Suppression snippet impossible: $error');
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
          controller: _triggerController,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Trigger',
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _contentController,
          minLines: 2,
          maxLines: 4,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Content',
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _labelController,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Label (optional)',
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: FilledButton.icon(
                onPressed: _busy ? null : _add,
                icon: const Icon(Icons.add),
                label: const Text('Add snippet'),
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
          'Snippets (Supabase CRUD)',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        if (_items.isEmpty)
          const Card(child: ListTile(title: Text('No snippet yet.'))),
        for (final item in _items)
          Card(
            child: ListTile(
              title: Text(item.trigger),
              subtitle: Text(
                '${item.label == null || item.label!.isEmpty ? '' : '[${item.label}] '}${item.content}',
              ),
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
