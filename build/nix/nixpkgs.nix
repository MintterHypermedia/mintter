# This file assembles a pinned version of nixpkgs with our custom overlay
# defined in overlay.nix. This file can be imported in place of normal <nixpkgs>.
let
  pkgs = import <nixpkgs> {};
  # Nixpkgs as of 2022-03-28.
  # Update sha256 with `nix-prefetch fetchFromGitHub --owner NixOS --repo nixpkgs --rev <commit>`.
  pinnedNixpkgs = pkgs.fetchFromGitHub {
    owner = "NixOS";
    repo = "nixpkgs";
    rev = "30d3d79b7d3607d56546dd2a6b49e156ba0ec634";
    sha256 = "sha256-Ctij+dOi0ZZIfX5eMhgwugfvB+WZSrvVNAyAuANOsnQ=";
  };
  # Rust overlay as of 2022-01-24.
  # Update sha256 with `nix-prefetch fetchFromGitHub --owner oxalica --repo rust-overlay --rev <commit>`.
  rustOverlay = import (pkgs.fetchFromGitHub {
    owner = "oxalica";
    repo = "rust-overlay";
    rev = "6ae180c1af192475b29e269f10d9da2d5abec4f0";
    sha256 = "sha256-6TRk5POjjevXZUzBnQ7Nlac1It4l12mEAltw5sRfQg8=";
  });
  mintterOverlay = import ./overlay.nix;
in

{ 
  system ? builtins.currentSystem,
  nixpkgs ? pinnedNixpkgs,
  config ? {},
}:

import nixpkgs {
  overlays = [
    # Order matters here. We use rust overlay inside our custom overlay.
    rustOverlay
    mintterOverlay
  ];
  inherit system;
  config = config;
}
