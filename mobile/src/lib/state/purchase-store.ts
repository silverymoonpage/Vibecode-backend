import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface PurchaseStore {
  isUnlocked: boolean;
  setUnlocked: (val: boolean) => void;
}

const usePurchaseStore = create<PurchaseStore>()(
  persist(
    (set) => ({
      isUnlocked: false,
      setUnlocked: (val: boolean) => set({ isUnlocked: val }),
    }),
    {
      name: "purchase-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePurchaseStore;
