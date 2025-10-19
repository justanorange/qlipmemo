import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isLogoSpinning: boolean;
  startLogoSpin: () => void;
  stopLogoSpin: () => void;
  toggleLogoSpin: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isLogoSpinning: false,
      startLogoSpin: () => set({ isLogoSpinning: true }),
      stopLogoSpin: () => set({ isLogoSpinning: false }),
      toggleLogoSpin: () => set((state) => ({ isLogoSpinning: !state.isLogoSpinning })),
    }),
    { name: 'UI Store' }
  )
)
