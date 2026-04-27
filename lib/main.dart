import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/voiceflowz_app.dart';
import 'core/bootstrap/supabase_bootstrap.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SupabaseBootstrap.init();
  runApp(const ProviderScope(child: VoiceFlowzApp()));
}
