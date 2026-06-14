import { create } from "zustand";
import type { PrivacyMode } from "@/lib/privacy";

type SettingsState = {
  privacyMode: PrivacyMode;
  animationIntensity: number;
  reducedMotion: boolean;
  showDebugMetadata: boolean;
  theme: "ricks-basement";
  setReducedMotion: (value: boolean) => void;
  setShowDebugMetadata: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  privacyMode: "minimal",
  animationIntensity: 0.82,
  reducedMotion: false,
  showDebugMetadata: false,
  theme: "ricks-basement",
  setReducedMotion: (value) => set({ reducedMotion: value }),
  setShowDebugMetadata: (value) => set({ showDebugMetadata: value })
}));
