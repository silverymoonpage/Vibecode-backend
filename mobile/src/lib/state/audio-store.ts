import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AudioStore {
  isMuted: boolean;
  toggleMute: () => void;
}

const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      isMuted: false,
      toggleMute: () => set({ isMuted: !get().isMuted }),
    }),
    {
      name: "audio-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAudioStore;
