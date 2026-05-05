import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/bootstrap/supabase_bootstrap.dart';
import '../../../data/supabase/clipboard_repository.dart';
import '../../../data/supabase/supabase_client_provider.dart';

class ClipboardScreen extends ConsumerStatefulWidget {
  const ClipboardScreen({super.key});

  @override
  ConsumerState<ClipboardScreen> createState() => _ClipboardScreenState();
}

class _ClipboardScreenState extends ConsumerState<ClipboardScreen> {
  final _contentController = TextEditingController();
  String _source = 'manual';
  bool _busy = false;
  String? _message;
  List<ClipboardItemRecord> _items = const [];

  static String get _cloudSyncDisabledMessage =>
      '${SupabaseBootstrap.initError ?? 'Cloud sync is disabled.'} '
      'Clipboard and keyboard local testing remains available.';

  @override
  void initState() {
    super.initState();
    Future<void>.microtask(_load);
  }

  @override
  void dispose() {
    _contentController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final client = ref.read(supabaseClientProvider);
    if (client == null) {
      setState(() => _message = _cloudSyncDisabledMessage);
      return;
    }
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      final rows = await ClipboardRepository(client).list();
      if (mounted) {
        setState(() => _items = rows);
      }
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Erreur chargement clipboard: $error');
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
      setState(() => _message = _cloudSyncDisabledMessage);
      return;
    }
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      await ClipboardRepository(
        client,
      ).insert(content: _contentController.text, source: _source);
      _contentController.clear();
      await _load();
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Insertion impossible: $error');
      }
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _togglePin(ClipboardItemRecord item) async {
    final client = ref.read(supabaseClientProvider);
    if (client == null) {
      return;
    }
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      await ClipboardRepository(
        client,
      ).togglePin(id: item.id, pinned: !item.pinned);
      await _load();
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Pin update impossible: $error');
      }
    } finally {
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
    setState(() {
      _busy = true;
      _message = null;
    });
    try {
      await ClipboardRepository(client).softDelete(id);
      await _load();
    } catch (error) {
      if (mounted) {
        setState(() => _message = 'Suppression impossible: $error');
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
          controller: _contentController,
          minLines: 2,
          maxLines: 4,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Clipboard content',
          ),
        ),
        const SizedBox(height: 8),
        DropdownButtonFormField<String>(
          initialValue: _source,
          items: const [
            DropdownMenuItem(value: 'manual', child: Text('manual')),
            DropdownMenuItem(value: 'voice', child: Text('voice')),
            DropdownMenuItem(value: 'overlay', child: Text('overlay')),
            DropdownMenuItem(value: 'system', child: Text('system')),
          ],
          onChanged: _busy
              ? null
              : (value) => setState(() => _source = value ?? 'manual'),
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Source',
          ),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: FilledButton.icon(
                onPressed: _busy ? null : _add,
                icon: const Icon(Icons.add),
                label: const Text('Add clipboard item'),
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
          'Clipboard items (Supabase CRUD)',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        if (_items.isEmpty)
          const Card(child: ListTile(title: Text('No clipboard item yet.'))),
        for (final item in _items)
          Card(
            child: ListTile(
              title: Text(item.content),
              subtitle: Text('source: ${item.source}'),
              trailing: Wrap(
                spacing: 4,
                children: [
                  IconButton(
                    tooltip: item.pinned ? 'Unpin' : 'Pin',
                    onPressed: _busy ? null : () => _togglePin(item),
                    icon: Icon(
                      item.pinned ? Icons.push_pin : Icons.push_pin_outlined,
                    ),
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
