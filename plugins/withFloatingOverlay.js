const { withAndroidManifest } = require("@expo/config-plugins");

const withFloatingOverlay = (config) => {
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // Ensure uses-permission array exists
    if (!manifest["uses-permission"]) {
      manifest["uses-permission"] = [];
    }

    const permissions = manifest["uses-permission"];
    const requiredPermissions = [
      "android.permission.SYSTEM_ALERT_WINDOW",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_MICROPHONE",
      "android.permission.POST_NOTIFICATIONS",
    ];

    for (const perm of requiredPermissions) {
      const exists = permissions.some(
        (p) => p.$["android:name"] === perm
      );
      if (!exists) {
        permissions.push({ $: { "android:name": perm } });
      }
    }

    // Add services to application
    const application = manifest.application?.[0];
    if (application) {
      if (!application.service) {
        application.service = [];
      }

      // Overlay foreground service
      const overlayServiceExists = application.service.some(
        (s) => s.$["android:name"]?.includes("FloatingOverlayService")
      );
      if (!overlayServiceExists) {
        application.service.push({
          $: {
            "android:name":
              "expo.modules.floatingoverlay.FloatingOverlayService",
            "android:foregroundServiceType": "microphone",
            "android:exported": "false",
          },
        });
      }

      // Accessibility service for text injection
      const a11yServiceExists = application.service.some(
        (s) =>
          s.$["android:name"]?.includes("TextInjectionAccessibilityService")
      );
      if (!a11yServiceExists) {
        application.service.push({
          $: {
            "android:name":
              "expo.modules.floatingoverlay.TextInjectionAccessibilityService",
            "android:permission":
              "android.permission.BIND_ACCESSIBILITY_SERVICE",
            "android:exported": "false",
          },
          "intent-filter": [
            {
              action: [
                {
                  $: {
                    "android:name":
                      "android.accessibilityservice.AccessibilityService",
                  },
                },
              ],
            },
          ],
          "meta-data": [
            {
              $: {
                "android:name": "android.accessibilityservice",
                "android:resource": "@xml/accessibility_service_config",
              },
            },
          ],
        });
      }
    }

    return config;
  });

  return config;
};

module.exports = withFloatingOverlay;
