import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/presentation/auth_gate_screen.dart';
import '../../features/clipboard/presentation/clipboard_screen.dart';
import '../../features/dictionary/presentation/dictionary_screen.dart';
import '../../features/settings/presentation/settings_screen.dart';
import '../../features/snippets/presentation/snippets_screen.dart';
import '../../features/voice/presentation/voice_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    routes: [
      GoRoute(path: '/', builder: (context, state) => const AuthGateScreen()),
      GoRoute(path: '/voice', builder: (context, state) => const VoiceScreen()),
      GoRoute(
        path: '/clipboard',
        builder: (context, state) => const ClipboardScreen(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/snippets',
        builder: (context, state) => const SnippetsScreen(),
      ),
      GoRoute(
        path: '/dictionary',
        builder: (context, state) => const DictionaryScreen(),
      ),
    ],
  );
});
