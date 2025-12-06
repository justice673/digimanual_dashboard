import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean; // For mobile: controls if sidebar is visible
  isCollapsed: boolean; // For desktop: controls if sidebar is collapsed
  toggle: () => void;
  setOpen: (open: boolean) => void;
  setCollapsed: (collapsed: boolean) => void;
  closeMobile: () => void; // Close sidebar on mobile
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false, // Start closed on mobile
  isCollapsed: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  closeMobile: () => set({ isOpen: false }),
}));

