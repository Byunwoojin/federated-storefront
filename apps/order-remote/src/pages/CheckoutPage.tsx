import {
  findInsufficientStockItems,
  selectSubtotal,
  useCartStore,
  useOrderStore,
  useStockStore,
} from "@mfe/cart-store";
import { Button, EmptyState } from "@mfe/design-system";
import { useNavigate } from "react-router-dom";
export default function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore(selectSubtotal);
  const clearCart = useCartStore((state) => state.clear);
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const orderQuantityByProductId = useStockStore(
    (state) => state.orderedQuantityByProductId,
  );

  if (items.length === 0) {
    return (
      <div className="order-remote-scope">
        <div className="p-6">
          <EmptyState message="주문할 상품이 없습니다" />
        </div>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    const insuffificent = findInsufficientStockItems(
      items,
      orderQuantityByProductId,
    );
    if (insuffificent.length > 0) {
      navigate("/cart?stockIssue=1");
      return;
    }
    const orderId = placeOrder(items, subtotal);
    clearCart();
    navigate(`/order-complete?orderId=${orderId}`);
  };

  return (
    <div className="order-remote-scope">
      <div className="p-6 pb-28 md:pb-6 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <h1 className="text-heading text-text-primary">주문하기</h1>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between border-b pb-3"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{(item.price * item.quantity).toLocaleString()}원</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden md:block">
          <div className="sticky top-6 border rounded-lg p-4">
            <p className="text-lg font-semibold">
              총 {subtotal.toLocaleString()}원
            </p>
            <Button onClick={handlePlaceOrder}>결제하기</Button>
          </div>
        </div>
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between">
          <span className="text-lg font-semibold">
            {subtotal.toLocaleString()}원
          </span>
          <Button onClick={handlePlaceOrder}>결제하기</Button>
        </div>
      </div>
    </div>
  );
}
