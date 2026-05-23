import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UNLOCK_ALL_FOR_TESTING } from "@/lib/paywall-config";

interface PurchaseStore {
  isUnlocked: boolean;
  setUnlocked: (val: boolean) => void;
  hasUsedFreeOracle: boolean;
  setHasUsedFreeOracle: (val: boolean) => void;
}

const usePurchaseStore = create<PurchaseStore>()(
  persist(
    (set) => ({
      isUnlocked: UNLOCK_ALL_FOR_TESTING,
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
        if (state && UNLOCK_ALL_FOR_TESTING) {
          state.isUnlocked = true;
        }
      },
    }
  )
);

export default usePurchaseStore;
