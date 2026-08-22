import { useCartStore, useStockStore } from "@mfe/cart-store";
import { Button, QuantityStepper, Toast } from "@mfe/design-system";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { products } from "../data/products";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((state) => state.addItem);
  const orderedQuantityByProductId = useStockStore(
    (state) => state.orderedQuantityByProductId,
  );

  const [toast, setToast] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="catalog-remote-scope">
        <div className="p-6">
          <p className="text-body text-text-primary">
            상품을 찾을 수 없습니다.
          </p>
          <Link className="text-primary" to="/catalog">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }
  const remaining = Math.max(
    0,
    product.stock - (orderedQuantityByProductId[product.id] ?? 0),
  );
  const soldOut = remaining === 0;

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
      },
      quantity,
    );
    setToast(`${product.name}을(를) 담았습니다.`);
    setQuantity(1);
  };

  return (
    <div className="catalog-remote-scope">
      <div className="p-6">
        <Link className="text-primary" to="/catalog">
          ← 목록으로
        </Link>
        <div className="mt-4 flex gap-6">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-square w-[320px] rounded-lg object-cover"
          />
          <div>
            <h1 className="text-heading text-text-primary">
              {product.name}
            </h1>
            <p className="mt-2 text-price-text text-price">
              {product.price.toLocaleString()}원
            </p>
            {!soldOut && quantity >= remaining && (
              <p className="mt-2 text-sm text-red-500">
                재고한도({remaining})개 까지 담았어요
              </p>
            )}
            <div className="mt-4">
              <QuantityStepper
                quantity={quantity}
                onIncrement={() =>
                  setQuantity((q) => Math.min(q + 1, remaining))
                }
                onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
                decrementDisabled={quantity <= 1}
                incrementDisabled={quantity >= remaining}
              />
            </div>
            <div className="mt-4">
              <Button onClick={handleAddToCart} disabled={soldOut}>
                {soldOut ? "품절" : "담기"}
              </Button>
            </div>
          </div>
        </div>
        {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      </div>
    </div>
  );
}
