import 'package:flutter/services.dart';

import 'platform_capabilities.dart';

enum OverlayDeliveryMode { clipboardOnly, injectionAndClipboard }

class AndroidOverlayStatus {
  const AndroidOverlayStatus({
    required this.enabled,
    required this.requestedEnabled,
    required this.running,
    required this.overlayPermissionGranted,
    required this.accessibilityPermissionGranted,
    required this.deliveryMode,
  });

  final bool enabled;
  final bool requestedEnabled;
  final bool running;
  final bool overlayPermissionGranted;
  final bool accessibilityPermissionGranted;
  final OverlayDeliveryMode deliveryMode;

  factory AndroidOverlayStatus.fromMap(Map<Object?, Object?> map) {
    final modeRaw = map['deliveryMode'] as String? ?? 'clipboard_only';
    return AndroidOverlayStatus(
      enabled: map['enabled'] as bool? ?? false,
      requestedEnabled: map['requestedEnabled'] as bool? ?? false,
      running: map['running'] as bool? ?? false,
      overlayPermissionGranted:
          map['overlayPermissionGranted'] as bool? ?? false,
      accessibilityPermissionGranted:
          map['accessibilityPermissionGranted'] as bool? ?? false,
      deliveryMode: modeRaw == 'injection_and_clipboard'
          ? OverlayDeliveryMode.injectionAndClipboard
          : OverlayDeliveryMode.clipboardOnly,
    );
  }
}

class AndroidOverlayBridgeException implements Exception {
  const AndroidOverlayBridgeException({
    required this.code,
    required this.message,
    this.details,
  });

  final String code;
  final String message;
  final Object? details;

  @override
  String toString() => 'AndroidOverlayBridgeException($code): $message';
}

class AndroidOverlayBridge {
  AndroidOverlayBridge._();

  static const MethodChannel _channel = MethodChannel('voiceflowz/overlay');

  static Future<bool> isPermissionGranted() async {
    final status = await getStatus();
    return status.overlayPermissionGranted;
  }

  static Future<bool> isAccessibilityPermissionGranted() async {
    final status = await getStatus();
    return status.accessibilityPermissionGranted;
  }

  static Future<void> openPermissionSettings() async {
    if (!PlatformCapabilities.overlaySupported) {
      throw const AndroidOverlayBridgeException(
        code: 'OVERLAY_UNSUPPORTED',
        message: 'Android overlay is not supported on this platform.',
      );
    }
    await _invoke<void>('openOverlayPermissionSettings');
  }

  static Future<void> openAccessibilitySettings() async {
    if (!PlatformCapabilities.overlaySupported) {
      throw const AndroidOverlayBridgeException(
        code: 'OVERLAY_UNSUPPORTED',
        message: 'Android overlay is not supported on this platform.',
      );
    }
    await _invoke<void>('openAccessibilitySettings');
  }

  static Future<AndroidOverlayStatus> getStatus() async {
    if (!PlatformCapabilities.overlaySupported) {
      return const AndroidOverlayStatus(
        enabled: false,
        requestedEnabled: false,
        running: false,
        overlayPermissionGranted: false,
        accessibilityPermissionGranted: false,
        deliveryMode: OverlayDeliveryMode.clipboardOnly,
      );
    }
    final raw = await _invoke<Map<Object?, Object?>>('getOverlayStatus');
    return AndroidOverlayStatus.fromMap(raw ?? const {});
  }

  static Future<AndroidOverlayStatus> setOverlayEnabled(bool enabled) async {
    if (!PlatformCapabilities.overlaySupported) {
      throw const AndroidOverlayBridgeException(
        code: 'OVERLAY_UNSUPPORTED',
        message: 'Android overlay is not supported on this platform.',
      );
    }
    final raw = await _invoke<Map<Object?, Object?>>('setOverlayEnabled', {
      'enabled': enabled,
    });
    return AndroidOverlayStatus.fromMap(raw ?? const {});
  }

  static Future<AndroidOverlayStatus> startRecording() async {
    final raw = await _invoke<Map<Object?, Object?>>('startOverlayRecording');
    return AndroidOverlayStatus.fromMap(raw ?? const {});
  }

  static Future<AndroidOverlayStatus> stopRecording() async {
    final raw = await _invoke<Map<Object?, Object?>>('stopOverlayRecording');
    return AndroidOverlayStatus.fromMap(raw ?? const {});
  }

  static Future<AndroidOverlayStatus> cancelRecording() async {
    final raw = await _invoke<Map<Object?, Object?>>('cancelOverlayRecording');
    return AndroidOverlayStatus.fromMap(raw ?? const {});
  }

  static Future<T?> _invoke<T>(String method, [Object? arguments]) async {
    try {
      return await _channel.invokeMethod<T>(method, arguments);
    } on PlatformException catch (error) {
      throw AndroidOverlayBridgeException(
        code: error.code,
        message: error.message ?? 'Native overlay operation failed.',
        details: error.details,
      );
    }
  }
}
