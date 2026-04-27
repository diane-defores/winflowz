import 'package:supabase_flutter/supabase_flutter.dart';

class ClipboardItemRecord {
  const ClipboardItemRecord({
    required this.id,
    required this.content,
    required this.source,
    required this.pinned,
    required this.createdAt,
  });

  final String id;
  final String content;
  final String source;
  final bool pinned;
  final DateTime createdAt;

  factory ClipboardItemRecord.fromMap(Map<String, dynamic> row) {
    final createdAtRaw = row['created_at'] as String?;
    return ClipboardItemRecord(
      id: row['id'] as String,
      content: (row['content'] as String?) ?? '',
      source: (row['source'] as String?) ?? 'manual',
      pinned: (row['pinned'] as bool?) ?? false,
      createdAt: createdAtRaw == null
          ? DateTime.fromMillisecondsSinceEpoch(0)
          : DateTime.tryParse(createdAtRaw)?.toLocal() ??
                DateTime.fromMillisecondsSinceEpoch(0),
    );
  }
}

class ClipboardRepository {
  const ClipboardRepository(this._client);

  final SupabaseClient _client;

  Future<List<ClipboardItemRecord>> list() async {
    final rows = await _client
        .from('clipboard_items')
        .select()
        .isFilter('deleted_at', null)
        .order('created_at', ascending: false)
        .limit(100);

    return rows
        .map<ClipboardItemRecord>(
          (row) => ClipboardItemRecord.fromMap(Map<String, dynamic>.from(row)),
        )
        .toList(growable: false);
  }

  Future<void> insert({required String content, required String source}) async {
    final normalized = content.trim();
    if (normalized.isEmpty) {
      throw const FormatException('Clipboard content cannot be empty.');
    }
    await _client.from('clipboard_items').insert({
      'content': normalized,
      'source': source.trim().isEmpty ? 'manual' : source.trim(),
    });
  }

  Future<void> togglePin({required String id, required bool pinned}) async {
    await _client
        .from('clipboard_items')
        .update({'pinned': pinned})
        .eq('id', id);
  }

  Future<void> softDelete(String id) async {
    await _client
        .from('clipboard_items')
        .update({'deleted_at': DateTime.now().toUtc().toIso8601String()})
        .eq('id', id);
  }
}
