import { create } from "zustand";

interface GlobalState {
  menu: boolean;           // sidebar toggle state
  toggleMenu: () => void;  // function to toggle sidebar
  openMenu: () => void;    // explicitly open sidebar
  closeMenu: () => void;   // explicitly close sidebar
}

export const useGlobalStore = create<GlobalState>((set) => ({
  menu: false,
  toggleMenu: () => set((state) => ({ menu: !state.menu })),
  openMenu: () => set({ menu: true }),
  closeMenu: () => set({ menu: false }),
}));
