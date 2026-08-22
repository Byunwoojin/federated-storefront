import {
  CartItem,
  findInsufficientStockItems,
  InsufficientStockItem,
  remainingStock,
  selectSubtotal,
  useCartStore,
  useStockStore,
} from "@mfe/cart-store";
import { Button, EmptyState, Modal, QuantityStepper } from "@mfe/design-system";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);

  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore(selectSubtotal);
  const orderedQuantityByProductId = useStockStore(
    (state) => state.orderedQuantityByProductId,
  );
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [pendingDelete, setPendingDelete] = useState<{
    productId: string;
    name: string;
  } | null>(null);
  const [insufficientItems, setInsufficientItems] = useState<
    InsufficientStockItem<CartItem>[]
  >([]);

  useEffect(() => {
    if (searchParams.has("stockIssue")) {
      setInsufficientItems(
        findInsufficientStockItems(items, orderedQuantityByProductId),
      );
      setSearchParams({}, { replace: true });
    }
    // 체크아웃에서 넘어왔을 때 한 번만 확인하면 되므로 마운트 시에만 실행
  }, []);

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      removeItem(pendingDelete.productId);
    }
    setPendingDelete(null);
  };

  const handleGoToCheckout = () => {
    const insufficient = findInsufficientStockItems(
      items,
      orderedQuantityByProductId,
    );
    if (insufficient.length > 0) {
      setInsufficientItems(insufficient);
      return;
    }
    setInsufficientItems([]);
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="cart-remote-scope">
        <div className="p-6">
          <h1 className="text-heading text-text-primary">장바구니</h1>
          <EmptyState message="장바구니가 비어있습니다" />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-remote-scope">
      <div className="p-6">
        <h1 className="text-heading text-text-primary">장바구니</h1>
        {insufficientItems.length > 0 && (
          <div className="mt-4 rounded-md border border-red-500 bg-red-50 p-4 text-sm text-red-500">
            <p>재고가 부족해 주문할 수 없는 상품이 있어요.</p>
            <ul className="mt-1 list-disc pl-5">
              {insufficientItems.map(({ item, remaining }) => (
                <li key={item.productId}>
                  {item.name}: 최대 {remaining}개까지 주문 가능해요.
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="mt-4 flex flex-col gap-4">
          {items.map((item) => {
            const availableForThisItem = remainingStock(
              item.stock,
              item.productId,
              orderedQuantityByProductId,
            );
            return (
              <li
                key={item.productId}
                className="flex flex-col gap-3 border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-text-secondary">
                    {item.price.toLocaleString()}원
                  </p>
                  {item.quantity >= availableForThisItem && (
                    <p className="text-sm text-red-500">
                      재고한도({availableForThisItem})개 까지 담았어요
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <QuantityStepper
                    quantity={item.quantity}
                    onDecrement={() => decrement(item.productId)}
                    onIncrement={() => increment(item.productId)}
                    decrementDisabled={item.quantity <= 1}
                    incrementDisabled={item.quantity >= availableForThisItem}
                  />
                  <button
                    onClick={() =>
                      setPendingDelete({
                        productId: item.productId,
                        name: item.name,
                      })
                    }
                    className="ml-2 text-sm text-text-secondary underline"
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-lg font-semibold">
            총 {subtotal.toLocaleString()}원
          </p>
          <Button onClick={handleGoToCheckout}>주문하기</Button>
        </div>
        <Modal
          isOpen={pendingDelete !== null}
          onClose={() => setPendingDelete(null)}
          title="상품 삭제"
        >
          <p className="mt-2 text-text-secondary">
            {pendingDelete?.name}을(를) 삭제할까요?
          </p>
          <div className="mt-4">
            <Button onClick={handleConfirmDelete}>삭제</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
