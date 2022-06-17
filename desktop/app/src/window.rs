use crate::window_ext::WindowExt;
use log::debug;
use serde::Serialize;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{
  plugin::{Builder as PluginBuilder, TauriPlugin},
  AppHandle, Manager, Runtime, WindowBuilder, WindowUrl, Wry,
};

#[derive(Debug, thiserror::Error)]
enum Error {
  #[error(transparent)]
  Tauri(#[from] tauri::Error),
}

impl Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::Serializer,
  {
    serializer.serialize_str(&self.to_string())
  }
}

#[tauri::command]
async fn open(app_handle: AppHandle, path: &str) -> Result<(), Error> {
  for (_, win) in app_handle.windows() {
    let win_url = win.url()?;

    let requested_url = {
      let mut url = win_url.clone();
      url.set_path(path);
      url
    };

    debug!(
      "comparing win url {}  to requested {}, equal: {}",
      win_url,
      requested_url,
      win_url == requested_url
    );
    if win_url == requested_url {
      return win.set_focus().map_err(Into::into);
    }
  }

  let label = window_label();

  WindowBuilder::new(&app_handle, label, WindowUrl::App(path.into()))
    .min_inner_size(500.0, 500.0)
    .build()?;

  Ok(())
}

pub fn new_window<R: Runtime, M: Manager<R>>(manager: &M) -> tauri::Result<()> {
  let label = window_label();

  WindowBuilder::new(manager, label, WindowUrl::App("index.html".into()))
    .min_inner_size(500.0, 500.0)
    .build()?;

  Ok(())
}

pub fn close_all_windows<R: Runtime, M: Manager<R>>(manager: &M) -> tauri::Result<()> {
  for window in manager.windows().values() {
    window.close()?;
  }

  Ok(())
}

fn window_label() -> String {
  SystemTime::now()
    .duration_since(UNIX_EPOCH)
    .expect("Failed to construct unix timestamp")
    .as_millis()
    .to_string()
}

pub fn init() -> TauriPlugin<Wry> {
  PluginBuilder::new("window")
    .invoke_handler(tauri::generate_handler![open])
    .build()
}
