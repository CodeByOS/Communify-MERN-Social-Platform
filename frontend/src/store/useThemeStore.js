import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("communify-theme") || "night",
    setTheme: (theme) => {
        localStorage.setItem("communify-theme", theme);
        set({ theme });
    },
}));
