import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PurchaseStore {
  isUnlocked: boolean;
  setUnlocked: (val: boolean) => void;
  hasUsedFreeOracle: boolean;
  setHasUsedFreeOracle: (val: boolean) => void;
}

const usePurchaseStore = create<PurchaseStore>()(
  persist(
    (set) => ({
      isUnlocked: true,
      setUnlocked: (val: boolean) => set({ isUnlocked: val }),
      hasUsedFreeOracle: false,
      setHasUsedFreeOracle: (val: boolean) => set({ hasUsedFreeOracle: val }),
    }),
    {
      name: "purchase-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isUnlocked: state.isUnlocked,
        hasUsedFreeOracle: state.hasUsedFreeOracle,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isUnlocked = true;
        }
      },
    }
  )
);

export default usePurchaseStore;
