import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:winflowz_app/core/theme/app_theme.dart';
import 'package:winflowz_app/core/sync/sync_status.dart';
import 'package:winflowz_app/features/auth/application/auth_session_provider.dart';
import 'package:winflowz_app/features/auth/domain/auth_session_store.dart';
import 'package:winflowz_app/features/auth/presentation/sign_in_screen.dart';

class _ThrowingAuthSessionStore implements AuthSessionStore {
  var emailPasswordCalls = 0;
  var createAccountCalls = 0;
  var anonymousCalls = 0;

  @override
  Future<AuthSessionSnapshot> currentSession() async => _signedOut;

  @override
  Stream<AuthSessionSnapshot> watchSession() => Stream.value(_signedOut);

  @override
  Future<void> signInAnonymously() async {
    anonymousCalls += 1;
    throw firebase_auth.FirebaseAuthException(
      code: 'invalid-api-key',
      message: 'API key not valid. Please pass a valid API key.',
    );
  }

  @override
  Future<void> signInWithEmailPassword({
    required String email,
    required String password,
  }) async {
    emailPasswordCalls += 1;
    throw firebase_auth.FirebaseAuthException(
      code: 'invalid-api-key',
      message: 'API key not valid. Please pass a valid API key.',
    );
  }

  @override
  Future<void> createAccountWithEmailPassword({
    required String email,
    required String password,
  }) async {
    createAccountCalls += 1;
    throw firebase_auth.FirebaseAuthException(
      code: 'invalid-api-key',
      message: 'API key not valid. Please pass a valid API key.',
    );
  }

  @override
  Future<void> signInWithGoogle() async {}

  @override
  Future<void> signOut() async {}
}

const _signedOut = AuthSessionSnapshot(
  user: null,
  syncStatus: SyncStatus.unavailable(),
);

Widget _testWidget(AuthSessionStore store) {
  return ProviderScope(
    overrides: [authSessionStoreProvider.overrideWithValue(store)],
    child: MaterialApp(theme: AppTheme.light, home: const SignInScreen()),
  );
}

void main() {
  testWidgets('sign in validates fields before calling auth', (tester) async {
    final store = _ThrowingAuthSessionStore();
    await tester.pumpWidget(_testWidget(store));

    await tester.tap(find.text('Se connecter'));
    await tester.pumpAndSettle();

    expect(find.text('Renseigne ton email.'), findsOneWidget);
    expect(find.text('Renseigne ton mot de passe.'), findsOneWidget);
    expect(
      find.text('Corrige les champs indiqués avant de continuer.'),
      findsOneWidget,
    );
    expect(store.emailPasswordCalls, 0);
  });

  testWidgets('firebase config errors show friendly copyable detail', (
    tester,
  ) async {
    final store = _ThrowingAuthSessionStore();
    await tester.pumpWidget(_testWidget(store));

    await tester.enterText(
      find.byType(TextFormField).first,
      'test@example.com',
    );
    await tester.enterText(find.byType(TextFormField).last, 'password');
    await tester.tap(find.text('Créer un compte'));
    await tester.pumpAndSettle();

    expect(
      find.text(
        'La configuration Firebase de cette version est invalide. Le détail technique peut être copié pour correction.',
      ),
      findsOneWidget,
    );
    expect(find.text('Copier le détail'), findsOneWidget);
    expect(store.createAccountCalls, 1);
  });

  testWidgets('continue locally bypasses the active remote auth store', (
    tester,
  ) async {
    final store = _ThrowingAuthSessionStore();
    await tester.pumpWidget(_testWidget(store));

    await tester.tap(find.text('Continuer en local'));
    await tester.pumpAndSettle();

    expect(find.textContaining('API key'), findsNothing);
    expect(
      find.text(
        'La configuration Firebase de cette version est invalide. Le détail technique peut être copié pour correction.',
      ),
      findsNothing,
    );
    expect(store.anonymousCalls, 0);
  });
}
