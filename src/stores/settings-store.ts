import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  tableDensity: "compact" | "normal";
  setTableDensity: (density: "compact" | "normal") => void;
  pageSize: number;
  setPageSize: (size: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      tableDensity: "normal",
      setTableDensity: (density) => set({ tableDensity: density }),
      pageSize: 10,
      setPageSize: (size) => set({ pageSize: size }),
    }),
    {
      name: "settings-storage",
    },
  ),
);
