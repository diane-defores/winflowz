import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseBootstrap {
  static bool _initialized = false;
  static String? _initError;

  static bool get isInitialized => _initialized;
  static bool get isConfigured => _initialized && _initError == null;
  static String? get initError => _initError;

  static Future<void> init() async {
    final url = const String.fromEnvironment('SUPABASE_URL');
    final anonKey = const String.fromEnvironment('SUPABASE_ANON_KEY');
    if (url.isEmpty || anonKey.isEmpty) {
      _initError =
          'Missing SUPABASE_URL or SUPABASE_ANON_KEY. Provide both via --dart-define.';
      return;
    }

    await Supabase.initialize(url: url, anonKey: anonKey);
    _initialized = true;
    _initError = null;
  }
}
