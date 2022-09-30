use crate::daemon;
use tauri::{
  AppHandle, CustomMenuItem, Manager, Runtime, SystemTray, SystemTrayEvent, SystemTrayMenu,
};

pub fn get_tray() -> SystemTray {
  let tray = SystemTray::new();
  let tray_menu = SystemTrayMenu::new();

  #[cfg(target_os = "macos")]
  let tray_menu = tray_menu.add_item(
    CustomMenuItem::new("status", "Online").native_image(tauri::NativeImage::StatusAvailable),
  );

  #[cfg(not(target_os = "macos"))]
  let tray_menu = tray_menu.add_item(CustomMenuItem::new("status", "Online"));

  let tray_menu = tray_menu
    .add_item(CustomMenuItem::new("start", "Start Daemon"))
    .add_item(CustomMenuItem::new("stop", "Stop Daemon"))
    .add_item(CustomMenuItem::new("exit_app", "Quit"));

  tray.with_menu(tray_menu)
}

pub fn event_handler<R: Runtime>(app_handle: &AppHandle<R>, event: SystemTrayEvent) {
  if let SystemTrayEvent::MenuItemClick { id, .. } = event {
    match id.as_str() {
      "exit_app" => {
        // exit the app
        app_handle.exit(0);
      }
      "start" => {
        daemon::start_daemon(
          app_handle.clone(),
          app_handle.state::<daemon::Connection>(),
          app_handle.state::<daemon::Flags>(),
        );

        let status_handle = app_handle.tray_handle().get_item("status");

        status_handle.set_title("Online").unwrap();

        #[cfg(target_os = "macos")]
        status_handle
          .set_native_image(tauri::NativeImage::StatusAvailable)
          .unwrap();
      }
      "stop" => {
        daemon::stop_daemon(app_handle.state::<daemon::Connection>());
        let item_handle = app_handle.tray_handle().get_item("status");

        item_handle.set_title("Offline").unwrap();

        #[cfg(target_os = "macos")]
        item_handle
          .set_native_image(tauri::NativeImage::StatusNone)
          .unwrap();
      }
      _ => {}
    }
  }
}
