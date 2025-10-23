import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "light",  // ✅ default light
  setTheme: (theme) => {
    console.debug("useThemeStore.setTheme called", theme);
    localStorage.setItem("chat-theme", theme);
    set({ theme }); // ✅ updates Zustand state
  },
  animationsEnabled: localStorage.getItem('chat-animations') !== 'false',
  setAnimationsEnabled: (enabled) => {
    console.debug('useThemeStore.setAnimations', enabled);
    localStorage.setItem('chat-animations', enabled ? 'true' : 'false');
    set({ animationsEnabled: enabled });
  },
}));

