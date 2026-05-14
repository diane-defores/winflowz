import 'package:google_sign_in/google_sign_in.dart';

import '../domain/auth_failure.dart';

class GoogleAuthResult {
  const GoogleAuthResult({required this.idToken});

  final String? idToken;
}

abstract class GoogleAuthClient {
  Future<void> initialize();

  bool supportsAuthenticate();

  Future<GoogleAuthResult> authenticate();
}

class PluginGoogleAuthClient implements GoogleAuthClient {
  PluginGoogleAuthClient({GoogleSignIn? googleSignIn})
    : _googleSignIn = googleSignIn ?? GoogleSignIn.instance;

  final GoogleSignIn _googleSignIn;
  var _initialized = false;

  @override
  Future<void> initialize() async {
    if (_initialized) {
      return;
    }
    await _googleSignIn.initialize();
    _initialized = true;
  }

  @override
  bool supportsAuthenticate() => _googleSignIn.supportsAuthenticate();

  @override
  Future<GoogleAuthResult> authenticate() async {
    try {
      final account = await _googleSignIn.authenticate();
      return GoogleAuthResult(idToken: account.authentication.idToken);
    } on GoogleSignInException catch (error) {
      throw GoogleAuthFailureMapper.fromException(error);
    }
  }
}

class GoogleAuthFailureMapper {
  GoogleAuthFailureMapper._();

  static AuthFailure fromException(GoogleSignInException error) {
    final code = error.code;
    final detail =
        'Google Sign-In error (${code.name}): '
        '${AuthFailure.redact(error.description ?? error.toString())}';
    switch (code) {
      case GoogleSignInExceptionCode.canceled:
        final text = '${error.description ?? ''} ${error.details ?? ''}'
            .toLowerCase();
        if (_looksLikeConfigurationFailure(text)) {
          return AuthFailure.googleConfiguration(
            code: code.name,
            detail: detail,
          );
        }
        return AuthFailure.googleCanceled(detail: detail);
      case GoogleSignInExceptionCode.interrupted:
        return AuthFailure.googleInterrupted(code: code.name, detail: detail);
      case GoogleSignInExceptionCode.clientConfigurationError:
      case GoogleSignInExceptionCode.providerConfigurationError:
        return AuthFailure.googleConfiguration(code: code.name, detail: detail);
      case GoogleSignInExceptionCode.uiUnavailable:
      case GoogleSignInExceptionCode.userMismatch:
        return AuthFailure.googleUnavailable(code: code.name, detail: detail);
      case GoogleSignInExceptionCode.unknownError:
        return AuthFailure.googleConfiguration(code: code.name, detail: detail);
    }
  }

  static bool _looksLikeConfigurationFailure(String text) {
    return text.contains('configuration') ||
        text.contains('client') ||
        text.contains('serverclientid') ||
        text.contains('server client') ||
        text.contains('sha') ||
        text.contains('package') ||
        text.contains('oauth');
  }
}
