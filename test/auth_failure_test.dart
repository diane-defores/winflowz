import 'package:flutter_test/flutter_test.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:winflowz_app/features/auth/data/google_auth_client.dart';
import 'package:winflowz_app/features/auth/domain/auth_failure.dart';

void main() {
  test('redacts tokens api keys and password-like values', () {
    final detail = AuthFailure.redact(
      'apiKey=AIza123456789012345678901234 token=eyJabcdefghijklmnopqrst password=secret',
    );

    expect(detail, contains('<redacted>'));
    expect(detail, isNot(contains('AIza123')));
    expect(detail, isNot(contains('eyJabcdefghijklmnopqrst')));
    expect(detail, isNot(contains('secret')));
  });

  test('maps firebase invalid credentials without account enumeration', () {
    final failure = AuthFailure.firebase(
      code: 'invalid-credential',
      message: 'bad credential',
      signup: false,
    );

    expect(failure.kind, AuthFailureKind.invalidCredentials);
    expect(failure.userMessage, 'Email ou mot de passe incorrect.');
  });

  test('maps google canceled config hints as configuration failure', () {
    final failure = GoogleAuthFailureMapper.fromException(
      const GoogleSignInException(
        code: GoogleSignInExceptionCode.canceled,
        description: 'Missing server client ID configuration',
      ),
    );

    expect(failure.kind, AuthFailureKind.googleConfiguration);
    expect(failure.reportToSentry, isTrue);
  });

  test('maps plain google canceled as non-sentry cancellation', () {
    final failure = GoogleAuthFailureMapper.fromException(
      const GoogleSignInException(
        code: GoogleSignInExceptionCode.canceled,
        description: 'The user canceled sign in',
      ),
    );

    expect(failure.kind, AuthFailureKind.googleCanceled);
    expect(failure.reportToSentry, isFalse);
  });
}
