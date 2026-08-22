import { create } from "zustand";

interface OrderedItem {
  productId: string;
  quantity: number;
}

interface StockState {
  orderedQuantityByProductId: Record<string, number>;
  recordOrder: (items: OrderedItem[]) => void;
}

export const useStockStore = create<StockState>()((set) => ({
  orderedQuantityByProductId: {},
  recordOrder: (items) => {
    set((state) => {
      const orderedQuantityByProductId = {
        ...state.orderedQuantityByProductId,
      };
      items.forEach((item) => {
        orderedQuantityByProductId[item.productId] =
          (orderedQuantityByProductId[item.productId] ?? 0) + item.quantity;
      });
      return { orderedQuantityByProductId };
    });
  },
}));

interface StockCheckableItem {
  productId: string;
  quantity: number;
  stock: number;
}
export interface InsufficientStockItem<T extends StockCheckableItem> {
  item: T;
  remaining: number;
}

export function findInsufficientStockItems<T extends StockCheckableItem>(
  items: T[],
  orderedQuantityByProductId: Record<string, number>,
): InsufficientStockItem<T>[] {
  return items
    .map((item) => ({
      item,
      remaining: Math.max(
        0,
        item.stock - (orderedQuantityByProductId[item.productId] ?? 0),
      ),
    }))
    .filter(({ item, remaining }) => item.quantity > remaining);
}
