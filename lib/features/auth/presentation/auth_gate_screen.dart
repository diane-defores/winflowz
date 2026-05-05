import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/bootstrap/supabase_bootstrap.dart';
import '../../../data/supabase/supabase_client_provider.dart';
import '../../shell/presentation/app_shell_screen.dart';
import 'sign_in_screen.dart';

class AuthGateScreen extends ConsumerWidget {
  const AuthGateScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (!SupabaseBootstrap.isConfigured) {
      return const AppShellScreen();
    }

    final authStateAsync = ref.watch(authStateProvider);
    final client = ref.watch(supabaseClientProvider);
    final session = client?.auth.currentSession;
    if (session != null) {
      return const AppShellScreen();
    }

    return authStateAsync.when(
      data: (state) {
        if (state.session == null) {
          return const SignInScreen();
        }
        return const AppShellScreen();
      },
      loading: () =>
          const Scaffold(body: Center(child: CircularProgressIndicator())),
      error: (error, stack) =>
          Scaffold(body: Center(child: Text('Auth state error: $error'))),
    );
  }
}
