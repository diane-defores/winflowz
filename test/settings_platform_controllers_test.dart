import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:winflowz_app/features/keyboard/domain/keyboard_models.dart';
import 'package:winflowz_app/features/settings/application/settings_platform_controllers.dart';

const _keyboardChannel = MethodChannel('winflowz_app/keyboard');

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  tearDown(() {
    debugDefaultTargetPlatformOverride = null;
    TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
        .setMockMethodCallHandler(_keyboardChannel, null);
  });

  test(
    'SettingsKeyboardController merges preference patch with current status',
    () async {
      debugDefaultTargetPlatformOverride = TargetPlatform.android;
      final calls = <MethodCall>[];
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
          .setMockMethodCallHandler(_keyboardChannel, (call) async {
            calls.add(call);
            return Map<Object?, Object?>.from(call.arguments as Map);
          });

      final current = AndroidKeyboardStatus.fromMap({
        'supported': true,
        'enabled': true,
        'active': true,
        'voiceEnabled': true,
        'clipboardSyncDesired': false,
        'mediaControlsEnabled': true,
        'mediaVolumeStepPercent': 15,
        'mediaBrightnessStepPercent': 20,
        'layoutProfile': 'qwerty',
        'cornerModeEnabled': false,
        'debugTouchOverlayEnabled': false,
        'keyVibrationEnabled': true,
        'keySoundEnabled': false,
        'spellingSuggestionsEnabled': true,
        'specialKeyCornersEnabled': false,
        'frenchLanguageEnabled': true,
        'englishLanguageEnabled': true,
        'doubleSpacePeriodEnabled': true,
        'punctuationAutoSpacingEnabled': false,
        'actionRowHeightScale': 0.6,
        'privacyMode': 'auto',
        'lastKeyboardError': 'token=[REDACTED_SECRET]',
        'lastKeyboardErrorAt': '2026-05-16T08:00:00Z',
        'keyboardRecoveryCount': 2,
      });

      final status = await const SettingsKeyboardController().setPreferences(
        current: current,
        layoutProfile: KeyboardLayoutProfile.azerty,
        clipboardSyncDesired: true,
        privacyMode: KeyboardPrivacyMode.strict,
      );

      expect(status.layoutProfile, KeyboardLayoutProfile.azerty);
      expect(status.clipboardSyncDesired, isTrue);
      expect(status.mediaVolumeStepPercent, 15);
      expect(status.mediaBrightnessStepPercent, 20);
      expect(status.actionRowHeightScale, 0.6);
      expect(status.privacyMode, KeyboardPrivacyMode.strict);
      expect(status.voiceEnabled, isTrue);
      expect(calls.single.method, 'setKeyboardPreferences');
      expect(calls.single.arguments, containsPair('layoutProfile', 'azerty'));
      expect(
        calls.single.arguments,
        containsPair('clipboardSyncDesired', true),
      );
      expect(calls.single.arguments, containsPair('voiceEnabled', true));
      expect(
        calls.single.arguments,
        containsPair('mediaVolumeStepPercent', 15),
      );
      expect(
        calls.single.arguments,
        containsPair('mediaBrightnessStepPercent', 20),
      );
      expect(calls.single.arguments, containsPair('actionRowHeightScale', 0.6));
    },
  );

  test(
    'SettingsKeyboardController clears native keyboard diagnostics',
    () async {
      debugDefaultTargetPlatformOverride = TargetPlatform.android;
      final calls = <MethodCall>[];
      TestDefaultBinaryMessengerBinding.instance.defaultBinaryMessenger
          .setMockMethodCallHandler(_keyboardChannel, (call) async {
            calls.add(call);
            return <Object?, Object?>{
              'supported': true,
              'enabled': true,
              'active': true,
              'lastKeyboardError': '',
              'lastKeyboardErrorAt': '',
              'keyboardRecoveryCount': 0,
            };
          });

      final status = await const SettingsKeyboardController()
          .clearDiagnostics();

      expect(calls.single.method, 'clearKeyboardDiagnostics');
      expect(status.keyboardRecoveryCount, 0);
      expect(status.lastKeyboardError, isNull);
      expect(status.lastKeyboardErrorAt, isNull);
    },
  );

  test('AndroidKeyboardStatus parses redacted keyboard diagnostic fields', () {
    final status = AndroidKeyboardStatus.fromMap({
      'supported': true,
      'lastKeyboardError':
          'keyboard_recovered=true; message=token=[REDACTED_SECRET]',
      'lastKeyboardErrorAt': '2026-05-16T08:05:00Z',
      'keyboardRecoveryCount': 3,
    });

    expect(status.lastKeyboardError, contains('[REDACTED_SECRET]'));
    expect(status.lastKeyboardError, isNot(contains('abc123')));
    expect(status.lastKeyboardErrorAt, '2026-05-16T08:05:00Z');
    expect(status.keyboardRecoveryCount, 3);
  });
}
