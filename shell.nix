with import ./build/nix/nixpkgs.nix {};

let
  protoc-gen-ts_proto = writeShellScriptBin "protoc-gen-ts_proto" "yarn run protoc-gen-ts_proto";
  gqlgen = writeShellScriptBin "gqlgen" "go run github.com/99designs/gqlgen";
  protoc-gen-go = writeShellScriptBin "protoc-gen-go" "go run google.golang.org/protobuf/cmd/protoc-gen-go $@";
  protoc-gen-go-vtproto = writeShellScriptBin "protoc-gen-go-vtproto" "go run github.com/planetscale/vtprotobuf/cmd/protoc-gen-go-vtproto $@";
  gorun = callPackage ./tools/gorun {};
  shellCommon = {
    tools = [
      bash
      coreutils
      findutils
      protobuf
      go
      terraform
      bazel-wrapper
      rustup
      rustfmt
      nodejs
      yarn
      tauri.cli
      protoc-gen-ts_proto
      protoc-gen-go
      protoc-gen-go-vtproto
      golangci-lint
      gorun
      gqlgen
      # pkg-config
      # gcc
    ];
    libs = [
      # libiconv
    ];
  };
  shellDarwin = {
    tools = [
      impure-cc
    ];
    libs = [
      # darwin.apple_sdk.frameworks.AppKit
      # darwin.apple_sdk.frameworks.CoreFoundation
      # darwin.apple_sdk.frameworks.CoreVideo
      # darwin.apple_sdk.frameworks.CoreGraphics
      # darwin.apple_sdk.frameworks.Security
      # darwin.apple_sdk.frameworks.WebKit
      # darwin.apple_sdk.frameworks.Carbon
      # darwin.apple_sdk.frameworks.QuartzCore
      # darwin.apple_sdk.frameworks.Foundation
    ];
  };
  shellLinux = {
    tools = [
      gcc
      pkg-config
    ];
    libs = [
      gtk3
      openssl
      webkitgtk
      libappindicator
      libappindicator-gtk3
      libcanberra
    ];
  };
in
  mkShell {
    nativeBuildInputs = [
      (lib.optionals hostPlatform.isMacOS shellDarwin.tools)
      (lib.optionals hostPlatform.isLinux shellLinux.tools)
      shellCommon.tools
    ];
    buildInputs = [
      (lib.optionals hostPlatform.isMacOS shellDarwin.libs)
      (lib.optionals hostPlatform.isLinux shellLinux.libs)
      shellCommon.libs
    ];
    shellHook = ''
      export CURRENT_PLATFORM="$(go env GOOS)_$(go env GOARCH)"
      export BAZEL_SH="$(which bash)"
      export CGO_ENABLED="1"
    '';
  }
