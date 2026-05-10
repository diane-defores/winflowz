import 'firebase_bootstrap.dart';
import 'supabase_bootstrap.dart';

class AppBootstrap {
  static Future<void> init() async {
    await FirebaseBootstrap.init();

    // Supabase remains a legacy adapter during the Firebase migration. Missing
    // config must keep the app in local mode rather than fail startup.
    await SupabaseBootstrap.init();
  }
}
