---
"create-rnstack": patch
---

Bump the template to the Expo SDK 57.0.14 patch (expo, expo-constants, expo-router, expo-splash-screen). Keeps a fresh scaffold in sync with the latest Expo Go build so it doesn't hit "Project is incompatible with this version of Expo Go". Also pins `@expo/metro-runtime` via an override to work around a stuck pnpm store resolution.
