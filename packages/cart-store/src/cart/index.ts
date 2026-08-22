import { create } from "zustand";

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
  updateQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item, quantity = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        const nextQuantity = Math.min(
          existing.quantity + quantity,
          existing.stock,
        );
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
          { ...item, quantity: Math.min(quantity, item.stock) },
        ],
      };
    }),
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
  },
  updateQuantity: (proudctId, quantity) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === proudctId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          : i,
      ),
    }));
  },
  increment: (productId) => {
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId
          ? {
              ...i,
              quantity: Math.min(i.quantity + 1, i.stock),
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
