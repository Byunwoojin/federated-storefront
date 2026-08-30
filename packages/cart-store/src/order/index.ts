import { create } from "zustand";

import type { CartItem } from "../cart";
import { useStockStore } from "../stock";

export type OrderStatus = "placed" | "shipping" | "delivered" | "cancelled";

export interface Order {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  status: OrderStatus;
  createdAt: number;
}

interface OrderState {
  orders: Order[];
  placeOrder: (items: CartItem[], subtotal: number) => string;
  updateStatus: (orderId: string, status: OrderStatus) => void;
}

let orderSequence = 0;

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],

  placeOrder: (items, subtotal) => {
    orderSequence += 1;
    const orderId = `ORD-${Date.now()}-${orderSequence}`;
    set((state) => ({
      orders: [
        { orderId, items, subtotal, status: "placed", createdAt: Date.now() },
        ...state.orders,
      ],
    }));
    useStockStore.getState().recordOrder(items);
    return orderId;
  },

  updateStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.orderId === orderId ? { ...o, status } : o,
      ),
    })),
}));
export const statusLabel: Record<OrderStatus, string> = {
  placed: "주문완료",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};
