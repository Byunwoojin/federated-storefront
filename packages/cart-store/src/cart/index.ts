import { create } from "zustand";

import { remainingStock, useStockStore } from "../stock";

export interface Product {
  productId: string;
  name: string;
  price: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item, quantity = 1) =>
    set((state) => {
      const available = remainingStock(
        item.stock,
        item.productId,
        useStockStore.getState().orderedQuantityByProductId,
      );
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, available);
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: nextQuantity }
              : i,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          { ...item, quantity: Math.min(quantity, available) },
        ],
      };
    }),
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
  },
  increment: (productId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: Math.min(
                i.quantity + 1,
                remainingStock(
                  i.stock,
                  i.productId,
                  useStockStore.getState().orderedQuantityByProductId,
                ),
              ),
            }
          : i,
      ),
    }));
  },
  decrement: (productId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: Math.max(1, i.quantity - 1),
            }
          : i,
      ),
    }));
  },
  clear: () => set({ items: [] }),
}));

// 합계 등 파생 값은 selector 함수로 분리 - 스토어 자체엔 원본 데이터만 유지
export const selectSubtotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const selectItemCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.quantity, 0);
