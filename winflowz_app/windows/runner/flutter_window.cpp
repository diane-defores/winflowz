#include "flutter_window.h"

#include <chrono>
#include <cstring>
#include <optional>

#include <flutter/method_result_functions.h>
#include <flutter/standard_method_codec.h>

#include "flutter/generated_plugin_registrant.h"

namespace {

constexpr const char kWindowsOverlayChannelName[] =
    "winflowz_app/windows_overlay";

int64_t CurrentEpochMillis() {
  const auto now = std::chrono::system_clock::now();
  return std::chrono::duration_cast<std::chrono::milliseconds>(
             now.time_since_epoch())
      .count();
}

}  // namespace

FlutterWindow::FlutterWindow(const flutter::DartProject& project)
    : project_(project) {}

FlutterWindow::~FlutterWindow() {}

bool FlutterWindow::OnCreate() {
  if (!Win32Window::OnCreate()) {
    return false;
  }

  RECT frame = GetClientArea();

  // The size here must match the window dimensions to avoid unnecessary surface
  // creation / destruction in the startup path.
  flutter_controller_ = std::make_unique<flutter::FlutterViewController>(
      frame.right - frame.left, frame.bottom - frame.top, project_);
  // Ensure that basic setup of the controller was successful.
  if (!flutter_controller_->engine() || !flutter_controller_->view()) {
    return false;
  }
  RegisterPlugins(flutter_controller_->engine());
  RegisterWindowsOverlayChannel();
  SetChildContent(flutter_controller_->view()->GetNativeWindow());

  flutter_controller_->engine()->SetNextFrameCallback([&]() {
    this->Show();
  });

  // Flutter can complete the first frame before the "show window" callback is
  // registered. The following call ensures a frame is pending to ensure the
  // window is shown. It is a no-op if the first frame hasn't completed yet.
  flutter_controller_->ForceRedraw();

  return true;
}

void FlutterWindow::OnDestroy() {
  if (hotkey_registered_) {
    UnregisterHotKey(GetHandle(), kWindowsOverlayHotkeyId);
    hotkey_registered_ = false;
  }
  if (flutter_controller_) {
    flutter_controller_ = nullptr;
  }

  Win32Window::OnDestroy();
}

LRESULT
FlutterWindow::MessageHandler(HWND hwnd, UINT const message,
                              WPARAM const wparam,
                              LPARAM const lparam) noexcept {
  // Give Flutter, including plugins, an opportunity to handle window messages.
  if (flutter_controller_) {
    std::optional<LRESULT> result =
        flutter_controller_->HandleTopLevelWindowProc(hwnd, message, wparam,
                                                      lparam);
    if (result) {
      return *result;
    }
  }

  switch (message) {
    case WM_HOTKEY:
      if (wparam == kWindowsOverlayHotkeyId) {
        PushWindowsOverlayEvent("hotkey");
        ShowWindowsOverlay();
        return 0;
      }
      break;
    case WM_FONTCHANGE:
      flutter_controller_->engine()->ReloadSystemFonts();
      break;
  }

  return Win32Window::MessageHandler(hwnd, message, wparam, lparam);
}

void FlutterWindow::RegisterWindowsOverlayChannel() {
  windows_overlay_channel_ =
      std::make_unique<flutter::MethodChannel<flutter::EncodableValue>>(
          flutter_controller_->engine()->messenger(), kWindowsOverlayChannelName,
          &flutter::StandardMethodCodec::GetInstance());

  windows_overlay_channel_->SetMethodCallHandler(
      [this](const auto& call, auto result) {
        const std::string& method = call.method_name();
        if (method == "getWindowsOverlayStatus") {
          result->Success(WindowsOverlayStatus());
          return;
        }
        if (method == "setWindowsOverlayEnabled") {
          bool enabled = false;
          if (const auto* arguments =
                  std::get_if<flutter::EncodableMap>(call.arguments())) {
            const auto enabled_it = arguments->find(
                flutter::EncodableValue(std::string("enabled")));
            if (enabled_it != arguments->end()) {
              if (const auto* value = std::get_if<bool>(&enabled_it->second)) {
                enabled = *value;
              }
            }
          }
          if (!SetWindowsOverlayEnabled(enabled)) {
            result->Error(last_error_code_, last_error_message_);
            return;
          }
          result->Success(WindowsOverlayStatus());
          return;
        }
        if (method == "showWindowsOverlay") {
          if (!ShowWindowsOverlay()) {
            result->Error(last_error_code_, last_error_message_);
            return;
          }
          result->Success(WindowsOverlayStatus());
          return;
        }
        if (method == "hideWindowsOverlay") {
          if (!HideWindowsOverlay()) {
            result->Error(last_error_code_, last_error_message_);
            return;
          }
          result->Success(WindowsOverlayStatus());
          return;
        }
        if (method == "setWindowsOverlayAppearance") {
          if (const auto* arguments =
                  std::get_if<flutter::EncodableMap>(call.arguments())) {
            const auto size_it = arguments->find(
                flutter::EncodableValue(std::string("sizeScale")));
            if (size_it != arguments->end()) {
              if (const auto* value = std::get_if<double>(&size_it->second)) {
                windows_overlay_size_scale_ = *value;
              }
            }
            const auto opacity_it =
                arguments->find(flutter::EncodableValue(std::string("opacity")));
            if (opacity_it != arguments->end()) {
              if (const auto* value = std::get_if<double>(&opacity_it->second)) {
                windows_overlay_opacity_ = *value;
              }
            }
          }
          const BYTE alpha =
              static_cast<BYTE>(255.0 * windows_overlay_opacity_);
          SetLayeredWindowAttributes(GetHandle(), 0, alpha, LWA_ALPHA);
          result->Success(WindowsOverlayStatus());
          return;
        }
        if (method == "deliverWindowsOverlayText") {
          std::string text;
          if (const auto* arguments =
                  std::get_if<flutter::EncodableMap>(call.arguments())) {
            const auto text_it =
                arguments->find(flutter::EncodableValue(std::string("text")));
            if (text_it != arguments->end()) {
              if (const auto* value = std::get_if<std::string>(&text_it->second)) {
                text = *value;
              }
            }
          }
          if (text.empty()) {
            result->Success(WindowsOverlayDeliveryResult(
                false, false, false, "EMPTY_TEXT", "No text to deliver."));
            return;
          }
          const bool copied = CopyTextToClipboard(Utf8ToWide(text));
          if (!copied) {
            result->Success(WindowsOverlayDeliveryResult(
                false, false, false, last_error_code_, last_error_message_));
            return;
          }
          const bool pasted = DeliverClipboardToLastForeground();
          result->Success(WindowsOverlayDeliveryResult(
              copied, true, pasted, pasted ? "" : "PASTE_DELIVERY_FAILED",
              pasted ? "" : "Clipboard copied, but paste delivery failed."));
          return;
        }
        if (method == "drainWindowsOverlayEvents") {
          flutter::EncodableList events;
          events.reserve(windows_overlay_events_.size());
          for (const auto& event : windows_overlay_events_) {
            events.push_back(event);
          }
          windows_overlay_events_.clear();
          result->Success(flutter::EncodableValue(events));
          return;
        }
        result->NotImplemented();
      });
}

flutter::EncodableValue FlutterWindow::WindowsOverlayStatus() const {
  flutter::EncodableMap status;
  status[flutter::EncodableValue("supported")] = flutter::EncodableValue(true);
  status[flutter::EncodableValue("enabled")] =
      flutter::EncodableValue(windows_overlay_enabled_);
  status[flutter::EncodableValue("visible")] =
      flutter::EncodableValue(windows_overlay_visible_);
  status[flutter::EncodableValue("hotkeyRegistered")] =
      flutter::EncodableValue(hotkey_registered_);
  status[flutter::EncodableValue("hotkeyLabel")] =
      flutter::EncodableValue("Ctrl+Alt+Space");
  status[flutter::EncodableValue("deliveryMode")] =
      flutter::EncodableValue("paste_and_clipboard");
  status[flutter::EncodableValue("sizeScale")] =
      flutter::EncodableValue(windows_overlay_size_scale_);
  status[flutter::EncodableValue("opacity")] =
      flutter::EncodableValue(windows_overlay_opacity_);
  status[flutter::EncodableValue("eventQueueSize")] =
      flutter::EncodableValue(static_cast<int>(windows_overlay_events_.size()));
  if (!last_error_code_.empty()) {
    status[flutter::EncodableValue("lastErrorCode")] =
        flutter::EncodableValue(last_error_code_);
    status[flutter::EncodableValue("lastErrorMessage")] =
        flutter::EncodableValue(last_error_message_);
  }
  return flutter::EncodableValue(status);
}

flutter::EncodableValue FlutterWindow::WindowsOverlayDeliveryResult(
    bool clipboard_copied,
    bool paste_attempted,
    bool paste_succeeded,
    const std::string& error_code,
    const std::string& error_message) const {
  flutter::EncodableMap result;
  result[flutter::EncodableValue("status")] = flutter::EncodableValue(
      paste_succeeded ? "delivered"
                      : (clipboard_copied ? "clipboard_only" : "failed"));
  result[flutter::EncodableValue("clipboardCopied")] =
      flutter::EncodableValue(clipboard_copied);
  result[flutter::EncodableValue("pasteAttempted")] =
      flutter::EncodableValue(paste_attempted);
  result[flutter::EncodableValue("pasteSucceeded")] =
      flutter::EncodableValue(paste_succeeded);
  if (!error_code.empty()) {
    result[flutter::EncodableValue("errorCode")] =
        flutter::EncodableValue(error_code);
    result[flutter::EncodableValue("errorMessage")] =
        flutter::EncodableValue(error_message);
  }
  return flutter::EncodableValue(result);
}

bool FlutterWindow::SetWindowsOverlayEnabled(bool enabled) {
  last_error_code_.clear();
  last_error_message_.clear();
  if (enabled && !hotkey_registered_) {
    hotkey_registered_ = RegisterHotKey(
        GetHandle(), kWindowsOverlayHotkeyId, MOD_CONTROL | MOD_ALT, VK_SPACE);
    if (!hotkey_registered_) {
      last_error_code_ = "HOTKEY_REGISTRATION_FAILED";
      last_error_message_ = "Ctrl+Alt+Space is unavailable.";
      windows_overlay_enabled_ = false;
      return false;
    }
  }
  if (!enabled && hotkey_registered_) {
    UnregisterHotKey(GetHandle(), kWindowsOverlayHotkeyId);
    hotkey_registered_ = false;
  }
  windows_overlay_enabled_ = enabled;
  return true;
}

bool FlutterWindow::ShowWindowsOverlay() {
  last_foreground_window_ = GetForegroundWindow();
  SetWindowLongPtr(GetHandle(), GWL_EXSTYLE,
                   GetWindowLongPtr(GetHandle(), GWL_EXSTYLE) | WS_EX_TOPMOST |
                       WS_EX_LAYERED);
  const BYTE alpha = static_cast<BYTE>(255.0 * windows_overlay_opacity_);
  SetLayeredWindowAttributes(GetHandle(), 0, alpha, LWA_ALPHA);
  const bool shown = SetWindowPos(GetHandle(), HWND_TOPMOST, 0, 0, 0, 0,
                                  SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW) !=
                     0;
  windows_overlay_visible_ = shown;
  if (!shown) {
    last_error_code_ = "OVERLAY_SHOW_FAILED";
    last_error_message_ = "Windows refused to show the overlay window.";
  }
  return shown;
}

bool FlutterWindow::HideWindowsOverlay() {
  const bool hidden = ShowWindow(GetHandle(), SW_HIDE) != 0;
  windows_overlay_visible_ = false;
  return hidden || GetLastError() == 0;
}

bool FlutterWindow::CopyTextToClipboard(const std::wstring& text) const {
  if (!OpenClipboard(GetHandle())) {
    return false;
  }
  EmptyClipboard();
  const size_t bytes = (text.size() + 1) * sizeof(wchar_t);
  HGLOBAL memory = GlobalAlloc(GMEM_MOVEABLE, bytes);
  if (memory == nullptr) {
    CloseClipboard();
    return false;
  }
  void* locked_memory = GlobalLock(memory);
  if (locked_memory == nullptr) {
    GlobalFree(memory);
    CloseClipboard();
    return false;
  }
  memcpy(locked_memory, text.c_str(), bytes);
  GlobalUnlock(memory);
  if (SetClipboardData(CF_UNICODETEXT, memory) == nullptr) {
    GlobalFree(memory);
    CloseClipboard();
    return false;
  }
  CloseClipboard();
  return true;
}

bool FlutterWindow::DeliverClipboardToLastForeground() const {
  if (last_foreground_window_ == nullptr ||
      last_foreground_window_ == GetHandle()) {
    return false;
  }
  SetForegroundWindow(last_foreground_window_);
  INPUT inputs[4] = {};
  inputs[0].type = INPUT_KEYBOARD;
  inputs[0].ki.wVk = VK_CONTROL;
  inputs[1].type = INPUT_KEYBOARD;
  inputs[1].ki.wVk = 'V';
  inputs[2].type = INPUT_KEYBOARD;
  inputs[2].ki.wVk = 'V';
  inputs[2].ki.dwFlags = KEYEVENTF_KEYUP;
  inputs[3].type = INPUT_KEYBOARD;
  inputs[3].ki.wVk = VK_CONTROL;
  inputs[3].ki.dwFlags = KEYEVENTF_KEYUP;
  return SendInput(4, inputs, sizeof(INPUT)) == 4;
}

void FlutterWindow::PushWindowsOverlayEvent(const std::string& trigger) {
  flutter::EncodableMap event;
  event[flutter::EncodableValue("trigger")] = flutter::EncodableValue(trigger);
  event[flutter::EncodableValue("capturedAtEpochMillis")] =
      flutter::EncodableValue(CurrentEpochMillis());
  windows_overlay_events_.push_back(flutter::EncodableValue(event));
}

std::wstring FlutterWindow::Utf8ToWide(const std::string& value) const {
  if (value.empty()) {
    return L"";
  }
  const int size = MultiByteToWideChar(CP_UTF8, 0, value.data(),
                                       static_cast<int>(value.size()), nullptr,
                                       0);
  std::wstring wide(size, L'\0');
  MultiByteToWideChar(CP_UTF8, 0, value.data(), static_cast<int>(value.size()),
                      wide.data(), size);
  return wide;
}
