import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/diagnostics/app_diagnostics.dart';
import '../domain/auth_failure.dart';
import '../application/auth_session_provider.dart';
import '../../shell/presentation/app_shell_screen.dart';
import 'sign_in_screen.dart';

class AuthGateScreen extends ConsumerWidget {
  const AuthGateScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sessionAsync = ref.watch(authSessionProvider);
    return sessionAsync.when(
      data: (session) {
        if (!session.isSignedIn && !session.isLocalFallback) {
          return const SignInScreen();
        }
        return const AppShellScreen();
      },
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) {
        final detail = AuthFailure.redact(error);
        AppDiagnostics.record('auth_state_error', detail);
        return Scaffold(
          body: Center(
            child: Text('Session indisponible pour le moment. $detail'),
          ),
        );
      },
    );
  }
}
