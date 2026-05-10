import 'package:firebase_auth/firebase_auth.dart' as firebase_auth;
import 'package:google_sign_in/google_sign_in.dart';

import '../../../core/sync/sync_status.dart';
import '../domain/auth_session_store.dart';

class FirebaseAuthSessionStore implements AuthSessionStore {
  FirebaseAuthSessionStore({
    firebase_auth.FirebaseAuth? auth,
    GoogleSignIn? googleSignIn,
  }) : _auth = auth ?? firebase_auth.FirebaseAuth.instance,
       _googleSignIn = googleSignIn ?? GoogleSignIn.instance;

  final firebase_auth.FirebaseAuth _auth;
  final GoogleSignIn _googleSignIn;
  var _googleInitialized = false;

  @override
  Future<AuthSessionSnapshot> currentSession() async {
    return _fromUser(_auth.currentUser);
  }

  @override
  Stream<AuthSessionSnapshot> watchSession() {
    return _auth.authStateChanges().map(_fromUser);
  }

  @override
  Future<void> signInAnonymously() async {
    await _auth.signInAnonymously();
  }

  @override
  Future<void> signInWithEmailPassword({
    required String email,
    required String password,
  }) async {
    await _auth.signInWithEmailAndPassword(email: email, password: password);
  }

  @override
  Future<void> createAccountWithEmailPassword({
    required String email,
    required String password,
  }) async {
    await _auth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );
  }

  @override
  Future<void> signInWithGoogle() async {
    if (!_googleInitialized) {
      await _googleSignIn.initialize();
      _googleInitialized = true;
    }
    final account = await _googleSignIn.authenticate();
    final auth = account.authentication;
    final credential = firebase_auth.GoogleAuthProvider.credential(
      idToken: auth.idToken,
    );
    await _auth.signInWithCredential(credential);
  }

  @override
  Future<void> signOut() async {
    await _auth.signOut();
  }

  static AuthSessionSnapshot _fromUser(firebase_auth.User? user) {
    if (user == null) {
      return const AuthSessionSnapshot(
        user: null,
        syncStatus: SyncStatus.unavailable(),
      );
    }

    return AuthSessionSnapshot(
      user: AuthUserSnapshot(
        id: user.uid,
        provider: _providerFromUser(user),
        email: user.email,
        isAnonymous: user.isAnonymous,
      ),
      syncStatus: SyncStatus(
        health: SyncHealth.synced,
        lastSyncedAt: DateTime.now().toUtc(),
      ),
    );
  }

  static AuthProviderKind _providerFromUser(firebase_auth.User user) {
    if (user.isAnonymous) {
      return AuthProviderKind.anonymous;
    }
    final providerIds = user.providerData.map((info) => info.providerId);
    if (providerIds.contains('google.com')) {
      return AuthProviderKind.google;
    }
    return AuthProviderKind.emailPassword;
  }
}
