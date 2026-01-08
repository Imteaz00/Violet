import { BagStoreActionsType, BagStoreStateType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useBagStore = create<BagStoreStateType & BagStoreActionsType>()(
  persist(
    (set) => ({
      bag: [],
      hasHydrated: false,
      addToBag: (product) =>
        set((state) => {
          const existingIndex = state.bag.findIndex((p) => p.id === product.id);
          if (existingIndex !== -1) {
            return {
              bag: state.bag.map((item, index) =>
                index === existingIndex
                  ? { ...item, shares: item.shares + (product.shares || 1) }
                  : item
              ),
            };
          }
          return { bag: [...state.bag, { ...product, shares: product.shares || 1 }] };
        }),
      removeFromBag: (product) =>
        set((state) => ({ bag: state.bag.filter((p) => p.id !== product.id) })),
      emptyBag: () => set({ bag: [] }),
    }),
    {
      name: "bag",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    }
  )
);

export default useBagStore;
