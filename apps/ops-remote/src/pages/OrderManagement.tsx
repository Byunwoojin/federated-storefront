import {
  CartItem,
  OrderStatus,
  statusLabel,
  useOrderStore,
} from "@mfe/cart-store";
import { Button, StatusBadge } from "@mfe/design-system";
import { useEffect, useMemo, useState } from "react";

const sampleOrders: { items: CartItem[]; status: OrderStatus }[] = [
  {
    items: [
      {
        productId: "1",
        name: "기본 반팔 티셔츠",
        price: 15000,
        stock: 8,
        quantity: 2,
      },
    ],
    status: "placed",
  },
  {
    items: [
      {
        productId: "2",
        name: "데님 팬츠",
        price: 39000,
        stock: 3,
        quantity: 1,
      },
    ],
    status: "shipping",
  },
  {
    items: [
      {
        productId: "3",
        name: "캔버스 스니커즈",
        price: 52000,
        stock: 5,
        quantity: 1,
      },
      {
        productId: "4",
        name: "니트 가디건",
        price: 45000,
        stock: 11,
        quantity: 1,
      },
    ],
    status: "delivered",
  },
  {
    items: [
      {
        productId: "5",
        name: "체크 셔츠",
        price: 32000,
        stock: 7,
        quantity: 3,
      },
    ],
    status: "placed",
  },
];

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "shipping",
  shipping: "delivered",
};

type StatusFilter = "all" | OrderStatus;

const filterOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "placed", label: "주문완료" },
  { value: "shipping", label: "배송중" },
  { value: "delivered", label: "배송완료" },
];

export default function OrderManagement() {
  const orders = useOrderStore((state) => state.orders);
  const updateStatus = useOrderStore((state) => state.updateStatus);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || orders.length > 0) return;
    sampleOrders.forEach(({ items, status }) => {
      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const orderId = useOrderStore.getState().placeOrder(items, subtotal);
      if (status !== "placed") {
        useOrderStore.getState().updateStatus(orderId, status);
      }
    });
    // 최초 마운트 시 store가 비어있을 때만 한 번 시딩 - orders를 deps에 넣으면 안 됨
  }, []);

  const filteredOrders = useMemo(
    () =>
      statusFilter == "all"
        ? orders
        : orders.filter((order) => order.status === statusFilter),
    [orders, statusFilter],
  );

  const selectedOrders = filteredOrders.filter((order) =>
    selectedOrderIds.has(order.orderId),
  );

  const selectedStatuses = new Set(selectedOrders.map((order) => order.status));
  const bulkTargetStatus =
    selectedOrders.length > 0 && selectedStatuses.size === 1
      ? nextStatus[selectedOrders[0].status]
      : undefined;

  const changeFilter = (value: StatusFilter) => {
    setStatusFilter(value);
    setSelectedOrderIds(new Set());
  };

  const toggleOrder = (orderId: string) => {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedOrderIds((prev) =>
      prev.size === filteredOrders.length
        ? new Set()
        : new Set(filteredOrders.map((order) => order.orderId)),
    );
  };

  const handleBulkUpdate = () => {
    if (!bulkTargetStatus) return;
    selectedOrderIds.forEach((orderId) =>
      updateStatus(orderId, bulkTargetStatus),
    );
    setSelectedOrderIds(new Set());
  };

  return (
    <div className="p-6">
      <h1 className="text-heading text-text-primary">주문 관리</h1>
      <div className="mt-4 flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => changeFilter(option.value)}
            className={`rounded-md border px-3 py-1 text-sm ${statusFilter === option.value ? "border-primary bg-primary text-white" : "border-border text-text-secondary"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {filteredOrders.length}건 중 {selectedOrderIds.size}건 선택
        </p>
        <Button onClick={handleBulkUpdate} disabled={!bulkTargetStatus}>
          {bulkTargetStatus
            ? `선택 항목 ${statusLabel[bulkTargetStatus]}(으)로 변경`
            : "선택 항목 일괄 상태 변경"}
        </Button>
      </div>
      {filteredOrders.length === 0 ? (
        <p className="mt-6 text-text-secondary">해당 상태의 주문이 없습니다.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b text-left text-text-secondary">
                <th className="py-2">
                  <input
                    type="checkbox"
                    aria-label="전체 선택"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedOrderIds.size === filteredOrders.length
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th className="py-2">주문번호</th>
                <th className="py-2">상품</th>
                <th className="py-2">금액</th>
                <th className="py-2">상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-b">
                  <td className="py-3">
                    <input
                      type="checkbox"
                      aria-label={`${order.orderId} 선택`}
                      checked={selectedOrderIds.has(order.orderId)}
                      onChange={() => toggleOrder(order.orderId)}
                    />
                  </td>
                  <td className="py-3">{order.orderId}</td>
                  <td className="py-3">
                    {order.items
                      .map((i) => `${i.name} x ${i.quantity}`)
                      .join(", ")}
                  </td>
                  <td className="py-3">{order.subtotal.toLocaleString()}</td>
                  <td className="py-3">
                    <StatusBadge label={statusLabel[order.status]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
