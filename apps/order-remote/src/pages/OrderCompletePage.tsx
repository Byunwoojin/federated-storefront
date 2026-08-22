import { useOrderStore } from "@mfe/cart-store";
import { Button } from "@mfe/design-system";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OrderCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const order = useOrderStore((state) =>
    state.orders.find((o) => o.orderId === orderId),
  );

  if (!order) {
    return (
      <div className="order-remote-scope">
        <div className="p-6 text-center">
          <p className="text-text-secondary">주문 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate("/catalog")}>상품 목록으로</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="order-remote-scope">
      <div className="p-6 max-w-lg mx-auto text-center">
        <h1 className="text-heading text-text-primary">
          주문이 완료되었습니다.
        </h1>
        <p className="mt-2 text-text-secondary">주문번호: {order.orderId} </p>
        <p className="mt-1 text-lg font-semibold">
          총 {order.subtotal.toLocaleString()}원
        </p>
        <div className="mt-6 flex gap-2 justify-center">
          <Button onClick={() => navigate("/catalog")}>계속 쇼핑하기</Button>
          <Button onClick={() => navigate("/orders")}>주문내역 보기</Button>
        </div>
      </div>
    </div>
  );
}
