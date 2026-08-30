import { OrderStatus, statusLabel, useOrderStore } from "@mfe/cart-store";
import { Button, EmptyState, StatusBadge } from "@mfe/design-system";

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "shipping",
  shipping: "delivered",
};

export default function OrderHistoryPage() {
  const orders = useOrderStore((state) => state.orders);
  const updateStatus = useOrderStore((state) => state.updateStatus);

  if (orders.length == 0) {
    return (
      <div className="order-remote-scope">
        <div className="p-6">
          <h1 className="text-heading text-text-primary">주문내역</h1>
          <EmptyState message="아직 주문내역이 없습니다" />
        </div>
      </div>
    );
  }
  return (
    <div className="order-remote-scope">
      <div className="p-6">
        <h1 className="text-heading text-text-primary">주문내역</h1>
        {/* 데스크탑: 테이블*/}
        <table className="hidden md:table mt-4 w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-text-secondary">
              <th className="py-2">주문번호</th>
              <th className="py-2">상품</th>
              <th className="py-2">금액</th>
              <th className="py-2">상태</th>
              <th className="py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId} className="border-b">
                <td className="py-3">{order.orderId}</td>
                <td className="py-3">
                  {order.items
                    .map((i) => `${i.name} x ${i.quantity}`)
                    .join(", ")}
                </td>
                <td className="py-3">{order.subtotal.toLocaleString()}원</td>
                <td className="py-3">
                  <StatusBadge label={statusLabel[order.status]} />
                </td>
                <td className="py-3">
                  {nextStatus[order.status] && (
                    <Button
                      onClick={() =>
                        updateStatus(order.orderId, nextStatus[order.status]!)
                      }
                    >
                      {statusLabel[nextStatus[order.status]!]}(으)로 변경
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 모바일:  카드*/}
        <ul className="md:hidden mt-4 flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.orderId} className="border rounded-lg p-4">
              <p className="text-sm text-text-secondary">{order.orderId}</p>
              <p className="mt-1">
                {order.items.map((i) => `${i.name} x ${i.quantity}`).join(", ")}
              </p>
              <p className="mt-1 font-semibold">
                {order.subtotal.toLocaleString()}원
              </p>
              <div className="mt-2">
                <StatusBadge label={statusLabel[order.status]} />
              </div>
              {nextStatus[order.status] && (
                <div className="mt-2">
                  <Button
                    onClick={() => {
                      updateStatus(order.orderId, nextStatus[order.status]!);
                    }}
                  >
                    {statusLabel[nextStatus[order.status]!]}(으)로 변경
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
