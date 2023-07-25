const path = require('path')

const devProjectRoot = path.join(process.cwd(), '../../..')
const daemonBinaryPath = path.join(
  devProjectRoot,
  // TODO: parametrize this for each platform
  'plz-out/bin/backend/mintterd-aarch64-apple-darwin',
)

let iconsPath = process.env.NIGHTLY_RELEASE
  ? path.resolve(__dirname, 'assets/icons-nightly/icon')
  : path.resolve(__dirname, 'assets/icons/icon')

module.exports = {
  packagerConfig: {
    asar: true, // or an object containing your asar options
    osxSign: {}, // object must exist even if empty
    // osxNotarize: {
    //   tool: 'notarytool',
    //   appleId: process.env.APPLE_ID,
    //   appleIdPassword: process.env.APPLE_PASSWORD,
    //   teamId: process.env.APPLE_TEAM_ID,
    // },
    icon: iconsPath,
    extraResource: [daemonBinaryPath],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    // {
    //   name: '@electron-forge/maker-dmg',
    //   config: {
    //     // background: './assets/dmg-background.png',
    //     format: 'ULFO',
    //     debug: true,
    //     overwrite: true,
    //     icon: `${iconsPath}.icns`,
    //   },
    // },
    // {
    //   name: '@electron-forge/maker-deb',
    //   config: {
    //     options: {
    //       icon: `${iconsPath}.png`,
    //     },
    //   },
    // },
    // {
    //   name: '@electron-forge/maker-squirrel',
    //   config: {
    //     // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
    //     iconUrl: 'https://url/to/icon.ico',
    //     // The ICO file to use as the icon for the generated Setup.exe
    //     setupIcon: `${iconsPath}.ico`,
    //   },
    // },
  ],
  plugins: [
    // {
    //   name: '@electron-forge/plugin-electronegativity',
    //   config: {
    //     isSarif: true,
    //   },
    // },
    // {
    //   name: '@electron-forge/plugin-auto-unpack-natives',
    //   config: {},
    // },
    {
      name: '@electron-forge/plugin-vite',
      config: {
        // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
        // If you are familiar with Vite configuration, it will look really familiar.
        build: [
          {
            // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
            entry: 'src/main.ts',
            config: 'vite.main.config.ts',
          },
          {
            entry: 'src/preload.ts',
            config: 'vite.preload.config.ts',
          },
        ],
        renderer: [
          {
            name: 'main_window',
            config: 'vite.renderer.config.ts',
          },
        ],
      },
    },
    // {
    //   name: '@electron-forge/publisher-github',
    //   config: {
    //     repository: {
    //       owner: 'mintterteam',
    //       name: 'mintter',
    //     },
    //     draft: true,
    //     prerelease: true,
    //   },
    // },
  ],
}