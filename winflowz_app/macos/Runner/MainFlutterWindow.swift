import Cocoa
import FlutterMacOS

class MainFlutterWindow: NSWindow {
  private var overlayEnabled = false
  private var overlayVisible = false
  private var hotkeyRegistered = false
  private var overlaySizeScale = 1.0
  private var overlayOpacity = 0.9
  private var lastErrorCode: String?
  private var lastErrorMessage: String?
  private var overlayEvents: [[String: Any]] = []
  private var globalHotKeyMonitor: Any?
  private weak var lastActiveApplication: NSRunningApplication?

  override func awakeFromNib() {
    let flutterViewController = FlutterViewController()
    let windowFrame = self.frame
    self.contentViewController = flutterViewController
    self.setFrame(windowFrame, display: true)

    RegisterGeneratedPlugins(registry: flutterViewController)
    registerMacOSOverlayChannel(flutterViewController: flutterViewController)

    super.awakeFromNib()
  }

  private func registerMacOSOverlayChannel(
    flutterViewController: FlutterViewController
  ) {
    let channel = FlutterMethodChannel(
      name: "winflowz_app/macos_overlay",
      binaryMessenger: flutterViewController.engine.binaryMessenger
    )
    channel.setMethodCallHandler { [weak self] call, result in
      guard let self else {
        result(
          FlutterError(
            code: "MACOS_OVERLAY_UNAVAILABLE",
            message: "The macOS overlay host is unavailable.",
            details: nil
          )
        )
        return
      }

      switch call.method {
      case "getMacOSOverlayStatus":
        result(self.overlayStatus())
      case "setMacOSOverlayEnabled":
        let args = call.arguments as? [String: Any]
        let enabled = args?["enabled"] as? Bool ?? false
        if self.setOverlayEnabled(enabled) {
          result(self.overlayStatus())
        } else {
          result(
            FlutterError(
              code: self.lastErrorCode ?? "HOTKEY_REGISTRATION_FAILED",
              message: self.lastErrorMessage ?? "Global hotkey registration failed.",
              details: nil
            )
          )
        }
      case "showMacOSOverlay":
        self.showOverlay()
        result(self.overlayStatus())
      case "hideMacOSOverlay":
        self.hideOverlay()
        result(self.overlayStatus())
      case "setMacOSOverlayAppearance":
        let args = call.arguments as? [String: Any]
        if let sizeScale = args?["sizeScale"] as? Double {
          self.overlaySizeScale = min(max(sizeScale, 0.8), 1.4)
        }
        if let opacity = args?["opacity"] as? Double {
          self.overlayOpacity = min(max(opacity, 0.5), 1.0)
          self.alphaValue = self.overlayOpacity
        }
        result(self.overlayStatus())
      case "deliverMacOSOverlayText":
        let args = call.arguments as? [String: Any]
        let text = args?["text"] as? String ?? ""
        result(self.deliverText(text))
      case "drainMacOSOverlayEvents":
        let events = self.overlayEvents
        self.overlayEvents.removeAll()
        result(events)
      default:
        result(FlutterMethodNotImplemented)
      }
    }
  }

  private func setOverlayEnabled(_ enabled: Bool) -> Bool {
    lastErrorCode = nil
    lastErrorMessage = nil
    if enabled && globalHotKeyMonitor == nil {
      globalHotKeyMonitor = NSEvent.addGlobalMonitorForEvents(
        matching: .keyDown
      ) { [weak self] event in
        guard
          event.keyCode == 49,
          event.modifierFlags.contains(.control),
          event.modifierFlags.contains(.option)
        else {
          return
        }
        self?.pushOverlayEvent(trigger: "hotkey")
        self?.showOverlay()
      }
      if globalHotKeyMonitor == nil {
        lastErrorCode = "HOTKEY_REGISTRATION_FAILED"
        lastErrorMessage = "Control+Option+Space is unavailable."
        overlayEnabled = false
        hotkeyRegistered = false
        return false
      }
      hotkeyRegistered = true
    }
    if !enabled, let monitor = globalHotKeyMonitor {
      NSEvent.removeMonitor(monitor)
      globalHotKeyMonitor = nil
      hotkeyRegistered = false
    }
    overlayEnabled = enabled
    return true
  }

  private func showOverlay() {
    lastActiveApplication = NSWorkspace.shared.frontmostApplication
    level = .floating
    collectionBehavior.insert(.canJoinAllSpaces)
    collectionBehavior.insert(.fullScreenAuxiliary)
    alphaValue = overlayOpacity
    makeKeyAndOrderFront(nil)
    NSApp.activate(ignoringOtherApps: true)
    overlayVisible = true
  }

  private func hideOverlay() {
    orderOut(nil)
    overlayVisible = false
  }

  private func deliverText(_ text: String) -> [String: Any] {
    guard !text.isEmpty else {
      return deliveryResult(
        clipboardCopied: false,
        pasteAttempted: false,
        pasteSucceeded: false,
        errorCode: "EMPTY_TEXT",
        errorMessage: "No text to deliver."
      )
    }
    NSPasteboard.general.clearContents()
    let copied = NSPasteboard.general.setString(text, forType: .string)
    if !copied {
      return deliveryResult(
        clipboardCopied: false,
        pasteAttempted: false,
        pasteSucceeded: false,
        errorCode: "CLIPBOARD_COPY_FAILED",
        errorMessage: "macOS refused clipboard write."
      )
    }
    let pasted = deliverClipboardToLastApplication()
    return deliveryResult(
      clipboardCopied: copied,
      pasteAttempted: true,
      pasteSucceeded: pasted,
      errorCode: pasted ? nil : "PASTE_DELIVERY_FAILED",
      errorMessage: pasted ? nil : "Clipboard copied, but paste delivery failed."
    )
  }

  private func deliverClipboardToLastApplication() -> Bool {
    guard let app = lastActiveApplication, app != NSRunningApplication.current else {
      return false
    }
    app.activate(options: [.activateIgnoringOtherApps])
    let source = CGEventSource(stateID: .combinedSessionState)
    let keyDown = CGEvent(keyboardEventSource: source, virtualKey: 9, keyDown: true)
    let keyUp = CGEvent(keyboardEventSource: source, virtualKey: 9, keyDown: false)
    keyDown?.flags = .maskCommand
    keyUp?.flags = .maskCommand
    keyDown?.post(tap: .cghidEventTap)
    keyUp?.post(tap: .cghidEventTap)
    return keyDown != nil && keyUp != nil
  }

  private func overlayStatus() -> [String: Any] {
    var status: [String: Any] = [
      "platform": "macos",
      "supported": true,
      "enabled": overlayEnabled,
      "visible": overlayVisible,
      "hotkeyRegistered": hotkeyRegistered,
      "hotkeyLabel": "Control+Option+Space",
      "deliveryMode": "paste_and_clipboard",
      "sizeScale": overlaySizeScale,
      "opacity": overlayOpacity,
      "eventQueueSize": overlayEvents.count,
    ]
    if let lastErrorCode {
      status["lastErrorCode"] = lastErrorCode
      status["lastErrorMessage"] = lastErrorMessage
    }
    return status
  }

  private func deliveryResult(
    clipboardCopied: Bool,
    pasteAttempted: Bool,
    pasteSucceeded: Bool,
    errorCode: String?,
    errorMessage: String?
  ) -> [String: Any] {
    var result: [String: Any] = [
      "status": pasteSucceeded
        ? "delivered"
        : (clipboardCopied ? "clipboard_only" : "failed"),
      "clipboardCopied": clipboardCopied,
      "pasteAttempted": pasteAttempted,
      "pasteSucceeded": pasteSucceeded,
    ]
    if let errorCode {
      result["errorCode"] = errorCode
      result["errorMessage"] = errorMessage
    }
    return result
  }

  private func pushOverlayEvent(trigger: String) {
    overlayEvents.append([
      "trigger": trigger,
      "capturedAtEpochMillis": Int64(Date().timeIntervalSince1970 * 1000),
    ])
  }
}
