import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/platform/android_overlay_bridge.dart';
import '../../../core/platform/platform_capabilities.dart';
import '../../../data/supabase/supabase_client_provider.dart';
import '../data/secure_secret_store.dart';

final _secretStoreProvider = Provider<SecureSecretStore>(
  (ref) => SecureSecretStore(),
);
final _storageStatusProvider = FutureProvider<SecretStorageStatus>(
  (ref) => ref.watch(_secretStoreProvider).status(),
);

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  late final TextEditingController _openAiController;
  late final TextEditingController _anthropicController;
  bool _loading = true;
  bool _saving = false;
  AndroidOverlayStatus? _overlayStatus;
  bool _overlayBusy = false;
  String? _message;

  @override
  void initState() {
    super.initState();
    _openAiController = TextEditingController();
    _anthropicController = TextEditingController();
    _loadSecrets();
    _loadOverlayState();
  }

  @override
  void dispose() {
    _openAiController.dispose();
    _anthropicController.dispose();
    super.dispose();
  }

  Future<void> _loadSecrets() async {
    final store = ref.read(_secretStoreProvider);
    final openAiKey = await store.readOpenAiKey() ?? '';
    final anthropicKey = await store.readAnthropicKey() ?? '';
    if (!mounted) {
      return;
    }
    setState(() {
      _openAiController.text = openAiKey;
      _anthropicController.text = anthropicKey;
      _loading = false;
    });
  }

  Future<void> _saveSecrets() async {
    final store = ref.read(_secretStoreProvider);
    setState(() {
      _saving = true;
      _message = null;
    });
    try {
      await store.writeOpenAiKey(_openAiController.text);
      await store.writeAnthropicKey(_anthropicController.text);
      setState(() => _message = 'Keys saved locally.');
    } catch (error) {
      setState(() => _message = 'Unable to save keys: $error');
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  Future<void> _loadOverlayState() async {
    if (!PlatformCapabilities.overlaySupported) {
      return;
    }
    setState(() => _overlayBusy = true);
    try {
      final status = await AndroidOverlayBridge.getStatus();
      if (!mounted) {
        return;
      }
      setState(() {
        _overlayStatus = status;
      });
    } on AndroidOverlayBridgeException catch (error) {
      if (!mounted) {
        return;
      }
      setState(
        () =>
            _message = 'Overlay status error (${error.code}): ${error.message}',
      );
    } finally {
      if (mounted) {
        setState(() => _overlayBusy = false);
      }
    }
  }

  Future<void> _openOverlaySettings() async {
    try {
      await AndroidOverlayBridge.openPermissionSettings();
      await _loadOverlayState();
    } catch (error) {
      if (!mounted) {
        return;
      }
      setState(() => _message = 'Unable to open overlay settings: $error');
    }
  }

  Future<void> _toggleOverlay(bool value) async {
    setState(() => _overlayBusy = true);
    try {
      final status = await AndroidOverlayBridge.setOverlayEnabled(value);
      if (!mounted) {
        return;
      }
      setState(() {
        _overlayStatus = status;
      });
    } on AndroidOverlayBridgeException catch (error) {
      if (!mounted) {
        return;
      }
      setState(
        () => _message =
            'Unable to toggle overlay (${error.code}): ${error.message}',
      );
    } finally {
      if (mounted) {
        setState(() => _overlayBusy = false);
      }
    }
  }

  Future<void> _startOverlay() async {
    setState(() => _overlayBusy = true);
    try {
      final status = await AndroidOverlayBridge.startRecording();
      if (!mounted) {
        return;
      }
      setState(() {
        _overlayStatus = status;
        _message = 'Overlay recording started.';
      });
    } on AndroidOverlayBridgeException catch (error) {
      if (!mounted) {
        return;
      }
      setState(
        () => _message =
            'Unable to start overlay (${error.code}): ${error.message}',
      );
    } finally {
      if (mounted) {
        setState(() => _overlayBusy = false);
      }
    }
  }

  Future<void> _stopOverlay() async {
    setState(() => _overlayBusy = true);
    try {
      final status = await AndroidOverlayBridge.stopRecording();
      if (!mounted) {
        return;
      }
      setState(() {
        _overlayStatus = status;
        _message = 'Overlay recording stopped.';
      });
    } on AndroidOverlayBridgeException catch (error) {
      if (!mounted) {
        return;
      }
      setState(
        () => _message =
            'Unable to stop overlay (${error.code}): ${error.message}',
      );
    } finally {
      if (mounted) {
        setState(() => _overlayBusy = false);
      }
    }
  }

  Future<void> _cancelOverlay() async {
    setState(() => _overlayBusy = true);
    try {
      final status = await AndroidOverlayBridge.cancelRecording();
      if (!mounted) {
        return;
      }
      setState(() {
        _overlayStatus = status;
        _message = 'Overlay recording canceled.';
      });
    } on AndroidOverlayBridgeException catch (error) {
      if (!mounted) {
        return;
      }
      setState(
        () => _message =
            'Unable to cancel overlay (${error.code}): ${error.message}',
      );
    } finally {
      if (mounted) {
        setState(() => _overlayBusy = false);
      }
    }
  }

  Future<void> _openAccessibilitySettings() async {
    try {
      await AndroidOverlayBridge.openAccessibilitySettings();
      await _loadOverlayState();
    } on AndroidOverlayBridgeException catch (error) {
      if (!mounted) {
        return;
      }
      setState(
        () => _message =
            'Unable to open accessibility settings (${error.code}): ${error.message}',
      );
    }
  }

  Future<void> _signOut() async {
    final client = ref.read(supabaseClientProvider);
    if (client == null) {
      return;
    }
    await client.auth.signOut();
  }

  @override
  Widget build(BuildContext context) {
    final storageStatusAsync = ref.watch(_storageStatusProvider);
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    final overlayStatus = _overlayStatus;
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        storageStatusAsync.when(
          data: (status) {
            if (status == SecretStorageStatus.available) {
              return const ListTile(
                leading: Icon(Icons.verified_user_outlined),
                title: Text('Local secure storage available'),
              );
            }
            return const ListTile(
              leading: Icon(Icons.warning_amber_outlined),
              title: Text('Secure storage degraded'),
              subtitle: Text(
                'Web/Linux may not provide equivalent keystore/keychain guarantees. '
                'Treat cloud AI mode as degraded until explicitly accepted.',
              ),
            );
          },
          loading: () =>
              const ListTile(title: Text('Checking storage capabilities...')),
          error: (error, stack) =>
              ListTile(title: Text('Storage status error: $error')),
        ),
        const SizedBox(height: 16),
        TextField(
          controller: _openAiController,
          obscureText: true,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'OpenAI API key',
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _anthropicController,
          obscureText: true,
          decoration: const InputDecoration(
            border: OutlineInputBorder(),
            labelText: 'Anthropic API key',
          ),
        ),
        const SizedBox(height: 16),
        if (_message != null) Text(_message!),
        Row(
          children: [
            Expanded(
              child: FilledButton(
                onPressed: _saving ? null : _saveSecrets,
                child: const Text('Save local keys'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: OutlinedButton(
                onPressed: _saving ? null : _signOut,
                child: const Text('Sign out'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        const Divider(),
        ListTile(
          leading: const Icon(Icons.mic_none),
          title: Text(
            PlatformCapabilities.localSpeechSupported
                ? 'Local speech available'
                : 'Local speech unavailable',
          ),
          subtitle: const Text(
            'Linux falls back to advanced recording + Whisper.',
          ),
        ),
        ListTile(
          leading: const Icon(Icons.bubble_chart_outlined),
          title: Text(
            PlatformCapabilities.overlaySupported
                ? 'Android overlay supported'
                : 'Android overlay unavailable on this platform',
          ),
        ),
        if (PlatformCapabilities.overlaySupported)
          Card(
            child: Column(
              children: [
                SwitchListTile(
                  value: overlayStatus?.enabled ?? false,
                  onChanged:
                      (overlayStatus?.overlayPermissionGranted ?? false) &&
                          !_overlayBusy
                      ? _toggleOverlay
                      : null,
                  title: const Text('Enable Android overlay bridge'),
                  subtitle: Text(
                    (overlayStatus?.overlayPermissionGranted ?? false)
                        ? 'Overlay bridge enabled. Foreground recording can run from Android controls.'
                        : 'Overlay permission required before enabling.',
                  ),
                ),
                ListTile(
                  title: const Text('Overlay runtime status'),
                  subtitle: Text(
                    'enabled=${overlayStatus?.enabled ?? false} | '
                    'running=${overlayStatus?.running ?? false} | '
                    'delivery=${overlayStatus?.deliveryMode.name ?? 'clipboardOnly'}',
                  ),
                ),
                if (overlayStatus?.accessibilityPermissionGranted == false)
                  const ListTile(
                    leading: Icon(Icons.info_outline),
                    title: Text('Accessibility disabled'),
                    subtitle: Text(
                      'Overlay dictation will deliver clipboard only until accessibility service is enabled.',
                    ),
                  ),
                Padding(
                  padding: const EdgeInsets.only(
                    left: 16,
                    right: 16,
                    bottom: 8,
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _openOverlaySettings,
                          icon: const Icon(Icons.open_in_new),
                          label: const Text('Overlay permission'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _openAccessibilitySettings,
                          icon: const Icon(Icons.accessibility_new),
                          label: const Text('Accessibility settings'),
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                  child: Row(
                    children: [
                      Expanded(
                        child: FilledButton(
                          onPressed: _overlayBusy ? null : _startOverlay,
                          child: const Text('Start'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: _overlayBusy ? null : _stopOverlay,
                          child: const Text('Stop'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextButton(
                          onPressed: _overlayBusy ? null : _cancelOverlay,
                          child: const Text('Cancel'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
