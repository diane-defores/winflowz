import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/platform/platform_capabilities.dart';
import '../../clipboard/presentation/clipboard_screen.dart';
import '../../dictionary/presentation/dictionary_screen.dart';
import '../../settings/presentation/settings_screen.dart';
import '../../snippets/presentation/snippets_screen.dart';
import '../../voice/presentation/voice_screen.dart';

class AppShellScreen extends ConsumerStatefulWidget {
  const AppShellScreen({super.key});

  @override
  ConsumerState<AppShellScreen> createState() => _AppShellScreenState();
}

class _AppShellScreenState extends ConsumerState<AppShellScreen> {
  int _index = 0;

  @override
  Widget build(BuildContext context) {
    final pages = const [
      VoiceScreen(),
      ClipboardScreen(),
      SnippetsScreen(),
      DictionaryScreen(),
      SettingsScreen(),
    ];
    const titles = ['Voice', 'Clipboard', 'Snippets', 'Dictionary', 'Settings'];

    return Scaffold(
      appBar: AppBar(title: Text('VoiceFlowz • ${titles[_index]}')),
      body: Column(
        children: [
          if (!PlatformCapabilities.localSpeechSupported)
            const MaterialBanner(
              content: Text(
                'Local speech is unavailable on Linux. Use advanced Whisper mode.',
              ),
              actions: [SizedBox.shrink()],
            ),
          if (!PlatformCapabilities.overlaySupported)
            const MaterialBanner(
              content: Text('Android overlay is unavailable on this platform.'),
              actions: [SizedBox.shrink()],
            ),
          Expanded(child: pages[_index]),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (value) => setState(() => _index = value),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.keyboard_voice_outlined),
            label: 'Voice',
          ),
          NavigationDestination(
            icon: Icon(Icons.content_paste_outlined),
            label: 'Clipboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.text_snippet_outlined),
            label: 'Snippets',
          ),
          NavigationDestination(
            icon: Icon(Icons.auto_fix_high_outlined),
            label: 'Dictionary',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
