import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_theme.dart';
import '../application/auth_session_provider.dart';

class SignInScreen extends ConsumerStatefulWidget {
  const SignInScreen({super.key});

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit({required bool signup}) async {
    final store = ref.read(authSessionStoreProvider);

    setState(() {
      _busy = true;
      _error = null;
    });

    try {
      final email = _emailController.text.trim();
      final password = _passwordController.text;
      if (signup) {
        await store.createAccountWithEmailPassword(
          email: email,
          password: password,
        );
      } else {
        await store.signInWithEmailPassword(email: email, password: password);
      }
    } on UnsupportedError catch (error) {
      setState(() => _error = error.message);
    } catch (error) {
      setState(() => _error = 'Unexpected error: $error');
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _continueLocally() async {
    final store = ref.read(authSessionStoreProvider);
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await store.signInAnonymously();
    } on UnsupportedError catch (error) {
      setState(() => _error = error.message);
    } catch (error) {
      setState(() => _error = 'Unexpected error: $error');
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _signInWithGoogle() async {
    final store = ref.read(authSessionStoreProvider);
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      await store.signInWithGoogle();
    } on UnsupportedError catch (error) {
      setState(() => _error = error.message);
    } catch (error) {
      setState(() => _error = 'Unexpected error: $error');
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Sign in')),
      body: Padding(
        padding: AppInsets.screen,
        child: Column(
          children: [
            TextField(
              controller: _emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            AppGaps.x3,
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
            ),
            AppGaps.x4,
            if (_error != null)
              Text(
                _error!,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: Theme.of(context).colorScheme.error,
                ),
              ),
            AppGaps.x2,
            Row(
              children: [
                Expanded(
                  child: FilledButton(
                    onPressed: _busy ? null : () => _submit(signup: false),
                    child: const Text('Sign in'),
                  ),
                ),
                AppGaps.horizontalX3,
                Expanded(
                  child: OutlinedButton(
                    onPressed: _busy ? null : () => _submit(signup: true),
                    child: const Text('Create account'),
                  ),
                ),
              ],
            ),
            AppGaps.x3,
            OutlinedButton(
              onPressed: _busy ? null : _continueLocally,
              child: const Text('Continue anonymously'),
            ),
            AppGaps.x2,
            OutlinedButton.icon(
              onPressed: _busy ? null : _signInWithGoogle,
              icon: const Icon(Icons.login_outlined),
              label: const Text('Continue with Google'),
            ),
            if (_busy)
              const Padding(
                padding: AppInsets.progress,
                child: CircularProgressIndicator(),
              ),
          ],
        ),
      ),
    );
  }
}
