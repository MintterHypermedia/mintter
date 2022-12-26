#![allow(non_snake_case)]
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod daemon;
mod error;
// mod exts;
mod menu;
mod system_tray;
mod window;
mod window_ext;

use env_logger::filter::Builder as FilterBuilder;
use log::LevelFilter;
use sentry::IntoDsn;
use tauri::{AppHandle, Manager, Runtime, WindowEvent};
use tauri_plugin_log::{LogTarget, LoggerBuilder};
use tauri_plugin_store::PluginBuilder as StorePluginBuilder;
use window_ext::WindowExt as _;

#[cfg(debug_assertions)]
use tauri_plugin_log::fern::colors::ColoredLevelConfig;

pub use error::Error;
pub type Result<T> = std::result::Result<T, error::Error>;

#[tauri::command]
#[tracing::instrument(skip(app_handle))]
async fn emit_all<R: Runtime>(
  app_handle: AppHandle<R>,
  event: String,
  payload: Option<String>,
) -> Result<()> {
  app_handle.emit_all(&event, payload).map_err(Into::into)
}

/// This is the main entrypoint of the app. It sets up all plugins, app state and then runs Tauri's event loop.
fn main() {
  #[cfg(not(debug_assertions))]
  secmem_proc::harden_process().expect("could not harden process");

  // Setting up the sentry plugin for crash and error reporting.
  let sentry_options = sentry::ClientOptions {
    dsn:
      "https://35b415b705dc4f41bc8a118759fc748a@o4504088793841664.ingest.sentry.io/4504088879169536"
        .into_dsn()
        .expect("failed to parse DSN"),
    release: sentry::release_name!(),
    traces_sample_rate: 1.0,
    ..Default::default()
  };
  let init_opts = sentry_options.clone();

  // This function wraps the regular Tauri initialization logic in a closure so we can recover from panics and send them off to sentry
  sentry_tauri::init(
    |_| sentry::init(init_opts),
    move |sentry_plugin| {
      // Setting up the log plugin.
      let log_plugin = {
        let targets = [
          LogTarget::LogDir,
          #[cfg(debug_assertions)]
          LogTarget::Stdout,
          #[cfg(debug_assertions)]
          LogTarget::Webview,
        ];

        // take the log filter configuration from the RUST_LOG environment variable.
        let filter = std::env::var("RUST_LOG")
          .map(|ref filter| FilterBuilder::new().parse(filter).build().filter())
          .unwrap_or(LevelFilter::Debug);

        let builder = LoggerBuilder::new().targets(targets).level(filter);

        #[cfg(debug_assertions)]
        let builder = builder.with_colors(ColoredLevelConfig::default());

        builder.build()
      };

      // Intialize the Tauri app
      let app = tauri::Builder::default()
        .plugin(sentry_plugin)
        .plugin(log_plugin)
        .plugin(StorePluginBuilder::default().build())
        .plugin(daemon::init())
        .plugin(window::init())
        // .plugin(exts::init())
        .system_tray(system_tray::get_tray())
        .on_system_tray_event(system_tray::event_handler)
        .setup(move |app| {
          app.manage(sentry_options);

          // Start the daemon!
          daemon::start_daemon(
            app.handle(),
            app.state::<daemon::Connection>(),
            app.state::<daemon::Flags>(),
            app.state::<sentry::ClientOptions>(),
          );

          let win = app.get_window("main").unwrap();
          win.set_transparent_titlebar(true);

          Ok(())
        })
        .on_window_event(|event| {
          // changing the window decorations only works when the window has been constructed.
          // Tauri currently doesn't expose a way to attach listeners to the Window Builder directly,
          // so listen for the focus event here since the window **must** exist in order to be focused.
          if let WindowEvent::Focused(_) = event.event() {
            event.window().set_transparent_titlebar(true);

            if event.window().label() == "preferences" {
              event.window().set_minimizable(false);
              event.window().set_resizable(false).unwrap();
            }
          }
        });

      // Set the native menu only on macOS, on Linux and Windows we're replicating it using HTML,CSS, and JS.
      #[cfg(target_os = "macos")]
      let app = {
        app
          .menu(menu::get_menu())
          .on_menu_event(menu::event_handler)
          .invoke_handler(tauri::generate_handler![emit_all])
      };

      // Expose a couple commands from the menu module that are needed to replicate the titplebar menu.
      #[cfg(not(target_os = "macos"))]
      let app = {
        app.invoke_handler(tauri::generate_handler![
          emit_all,
          menu::open_about,
          menu::open_preferences,
          menu::open_documentation,
          menu::open_release_notes,
          menu::open_acknowledgements,
          window::new_window,
          window::close_all_windows
        ])
      };

      // Run the app!
      app
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    },
  );
}
