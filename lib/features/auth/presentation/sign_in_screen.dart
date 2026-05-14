import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import '../../../core/bootstrap/sentry_bootstrap.dart';
import '../../../core/diagnostics/app_diagnostics.dart';
import '../../../core/theme/app_theme.dart';
import '../application/auth_session_provider.dart';

class SignInScreen extends ConsumerStatefulWidget {
  const SignInScreen({super.key});

  @override
  ConsumerState<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends ConsumerState<SignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _busy = false;
  String? _error;
  String? _errorDetail;
  AutovalidateMode _autovalidateMode = AutovalidateMode.disabled;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit({required bool signup}) async {
    setState(() {
      _autovalidateMode = AutovalidateMode.onUserInteraction;
      _error = null;
      _errorDetail = null;
    });

    if (!(_formKey.currentState?.validate() ?? false)) {
      setState(() {
        _error = 'Corrige les champs indiqués avant de continuer.';
      });
      return;
    }

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
    } on firebase_auth.FirebaseAuthException catch (error, stackTrace) {
      await _presentAuthError(error, stackTrace, signup: signup);
    } on UnsupportedError catch (error, stackTrace) {
      await _presentError(
        userMessage: _unsupportedErrorMessage(error),
        category: 'auth_unsupported_error',
        error: error,
        stackTrace: stackTrace,
      );
    } catch (error, stackTrace) {
      await _presentError(
        userMessage:
            'Connexion impossible pour le moment. Réessaie dans quelques instants.',
        category: 'auth_unexpected_error',
        error: error,
        stackTrace: stackTrace,
      );
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  Future<void> _continueLocally() async {
    setState(() {
      _busy = true;
      _error = null;
      _errorDetail = null;
    });
    try {
      ref.read(localAuthModeProvider.notifier).enable();
      final store = ref.read(localAuthSessionStoreProvider);
      await store.signInAnonymously();
    } on firebase_auth.FirebaseAuthException catch (error, stackTrace) {
      await _presentAuthError(error, stackTrace, signup: false);
    } on UnsupportedError catch (error, stackTrace) {
      await _presentError(
        userMessage: _unsupportedErrorMessage(error),
        category: 'auth_local_unsupported_error',
        error: error,
        stackTrace: stackTrace,
      );
    } catch (error, stackTrace) {
      await _presentError(
        userMessage: 'Mode local indisponible pour le moment.',
        category: 'auth_local_unexpected_error',
        error: error,
        stackTrace: stackTrace,
      );
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
      _errorDetail = null;
    });
    try {
      await store.signInWithGoogle();
    } on firebase_auth.FirebaseAuthException catch (error, stackTrace) {
      await _presentAuthError(error, stackTrace, signup: false);
    } catch (error, stackTrace) {
      if (_isGoogleCancellation(error)) {
        _setError('Connexion Google annulée.');
      } else if (error is UnsupportedError) {
        await _presentError(
          userMessage: _unsupportedErrorMessage(error),
          category: 'auth_google_unsupported_error',
          error: error,
          stackTrace: stackTrace,
        );
      } else {
        await _presentError(
          userMessage:
              'Connexion Google impossible pour le moment. Réessaie plus tard.',
          category: 'auth_google_unexpected_error',
          error: error,
          stackTrace: stackTrace,
        );
      }
    } finally {
      if (mounted) {
        setState(() => _busy = false);
      }
    }
  }

  void _setError(String message, {String? detail}) {
    if (!mounted) {
      return;
    }
    setState(() {
      _error = message;
      _errorDetail = detail;
    });
  }

  Future<void> _presentAuthError(
    firebase_auth.FirebaseAuthException error,
    StackTrace stackTrace, {
    required bool signup,
  }) async {
    await _presentError(
      userMessage: _authErrorMessage(error, signup: signup),
      category: 'auth_firebase_error',
      error: error,
      stackTrace: stackTrace,
      detail:
          'Firebase Auth error (${error.code}): ${_sanitizeErrorDetail(error.message ?? error.toString())}',
    );
  }

  Future<void> _presentError({
    required String userMessage,
    required String category,
    required Object error,
    required StackTrace stackTrace,
    String? detail,
  }) async {
    final safeDetail = detail ?? _sanitizeErrorDetail(error);
    AppDiagnostics.record(category, safeDetail);
    if (SentryBootstrap.isInitialized) {
      await Sentry.captureException(error, stackTrace: stackTrace);
    }
    _setError(userMessage, detail: safeDetail);
  }

  Future<void> _copyErrorDetail() async {
    final detail = _errorDetail;
    if (detail == null || detail.isEmpty) {
      return;
    }
    await Clipboard.setData(ClipboardData(text: detail));
    if (!mounted) {
      return;
    }
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(const SnackBar(content: Text('Détail technique copié.')));
  }

  String? _validateEmail(String? value) {
    final email = value?.trim() ?? '';
    if (email.isEmpty) {
      return 'Renseigne ton email.';
    }
    final hasBasicEmailShape = RegExp(
      r'^[^@\s]+@[^@\s]+\.[^@\s]+$',
    ).hasMatch(email);
    if (!hasBasicEmailShape) {
      return 'Entre un email valide, par exemple nom@domaine.com.';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    final password = value ?? '';
    if (password.isEmpty) {
      return 'Renseigne ton mot de passe.';
    }
    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    return null;
  }

  String _unsupportedErrorMessage(UnsupportedError error) {
    final message = error.message;
    if (message == null || message.isEmpty) {
      return 'Cette méthode de connexion n’est pas disponible.';
    }
    if (message.contains('Remote auth')) {
      return 'La connexion email n’est pas configurée sur cet environnement.';
    }
    if (message.contains('Google Sign-In')) {
      return 'La connexion Google n’est pas configurée sur cet environnement.';
    }
    return message;
  }

  String _authErrorMessage(
    firebase_auth.FirebaseAuthException error, {
    required bool signup,
  }) {
    switch (error.code) {
      case 'invalid-email':
        return 'L’email saisi n’est pas valide.';
      case 'user-disabled':
        return 'Ce compte a été désactivé.';
      case 'user-not-found':
      case 'wrong-password':
      case 'invalid-credential':
        return 'Email ou mot de passe incorrect.';
      case 'email-already-in-use':
        return 'Un compte existe déjà avec cet email.';
      case 'weak-password':
        return 'Choisis un mot de passe plus robuste.';
      case 'operation-not-allowed':
        return signup
            ? 'La création de compte email n’est pas activée.'
            : 'La connexion email n’est pas activée.';
      case 'invalid-api-key':
      case 'app-not-authorized':
        return 'La configuration Firebase de cette version est invalide. Le détail technique peut être copié pour correction.';
      case 'network-request-failed':
        return 'Connexion réseau indisponible. Vérifie ta connexion internet.';
      case 'too-many-requests':
        return 'Trop de tentatives. Réessaie dans quelques minutes.';
      case 'account-exists-with-different-credential':
        return 'Un compte existe déjà avec cet email via une autre méthode.';
      case 'popup-closed-by-user':
      case 'canceled':
        return 'Connexion annulée.';
      default:
        return signup
            ? 'Création de compte impossible pour le moment.'
            : 'Connexion impossible pour le moment.';
    }
  }

  bool _isGoogleCancellation(Object error) {
    if (error is GoogleSignInException) {
      final code = error.code.toString().toLowerCase();
      return code.contains('cancel') || code.contains('interrupted');
    }
    final text = error.toString().toLowerCase();
    return text.contains('cancel') || text.contains('interrupted');
  }

  String _sanitizeErrorDetail(Object? value) {
    var text = value?.toString() ?? 'Erreur inconnue';
    final redactionPatterns = [
      RegExp(r'AIza[0-9A-Za-z_-]{20,}'),
      RegExp(
        r'(api[_-]?key|token|secret|password)\s*[:=]\s*[^,\s;]+',
        caseSensitive: false,
      ),
    ];
    for (final pattern in redactionPatterns) {
      text = text.replaceAll(pattern, '<redacted>');
    }
    return text.replaceAll('\n', ' | ').replaceAll(RegExp(r'\s+'), ' ').trim();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(title: const Text('Connexion')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: AppInsets.screen,
          child: Form(
            key: _formKey,
            autovalidateMode: _autovalidateMode,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                TextFormField(
                  controller: _emailController,
                  enabled: !_busy,
                  keyboardType: TextInputType.emailAddress,
                  textInputAction: TextInputAction.next,
                  autofillHints: const [AutofillHints.email],
                  autocorrect: false,
                  validator: _validateEmail,
                  decoration: const InputDecoration(labelText: 'Email'),
                ),
                AppGaps.x3,
                TextFormField(
                  controller: _passwordController,
                  enabled: !_busy,
                  obscureText: true,
                  textInputAction: TextInputAction.done,
                  autofillHints: const [AutofillHints.password],
                  validator: _validatePassword,
                  onFieldSubmitted: (_) {
                    if (!_busy) {
                      _submit(signup: false);
                    }
                  },
                  decoration: const InputDecoration(labelText: 'Mot de passe'),
                ),
                AppGaps.x4,
                if (_error != null)
                  DecoratedBox(
                    decoration: BoxDecoration(
                      color: colorScheme.errorContainer,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Padding(
                      padding: AppInsets.compactCard,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _error!,
                            style: Theme.of(context).textTheme.bodyMedium
                                ?.copyWith(color: colorScheme.onErrorContainer),
                          ),
                          if (_errorDetail != null) ...[
                            AppGaps.x2,
                            Align(
                              alignment: Alignment.centerLeft,
                              child: TextButton.icon(
                                onPressed: _copyErrorDetail,
                                icon: const Icon(Icons.copy_outlined),
                                label: const Text('Copier le détail'),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                AppGaps.x2,
                Row(
                  children: [
                    Expanded(
                      child: FilledButton(
                        onPressed: _busy ? null : () => _submit(signup: false),
                        child: const Text('Se connecter'),
                      ),
                    ),
                    AppGaps.horizontalX3,
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _busy ? null : () => _submit(signup: true),
                        child: const Text('Créer un compte'),
                      ),
                    ),
                  ],
                ),
                AppGaps.x3,
                OutlinedButton(
                  onPressed: _busy ? null : _continueLocally,
                  child: const Text('Continuer en local'),
                ),
                AppGaps.x2,
                OutlinedButton.icon(
                  onPressed: _busy ? null : _signInWithGoogle,
                  icon: const Icon(Icons.login_outlined),
                  label: const Text('Continuer avec Google'),
                ),
                if (_busy)
                  const Padding(
                    padding: AppInsets.progress,
                    child: Center(child: CircularProgressIndicator()),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
