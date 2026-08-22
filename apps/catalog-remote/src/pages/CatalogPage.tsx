import { useCartStore, useStockStore } from "@mfe/cart-store";
import { Card, Toast } from "@mfe/design-system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { products } from "../data/products";

export default function CatalogPage() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const orderedQuantityByProductId = useStockStore(
    (state) => state.orderedQuantityByProductId,
  );
  const [toast, setToast] = useState<string | null>(null);

  const handleAddToCart = (
    name: string,
    product: { id: string; name: string; price: number; stock: number },
  ) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
    });
    setToast(`${name}을(를) 담았습니다.`);
  };

  return (
    <div className="catalog-remote-scope">
      <div className="p-6">
        <h1 className="text-heading text-text-primary">상품 목록</h1>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const remaining = Math.max(
              0,
              p.stock - (orderedQuantityByProductId[p.id] ?? 0),
            );
            return (
              <Card
                key={p.id}
                imageUrl={p.imageUrl}
                name={p.name}
                price={p.price}
                soldOut={remaining <= 0}
                onClick={() => navigate(`/catalog/${p.id}`)}
                onAddToCart={() => handleAddToCart(p.name, p)}
              />
            );
          })}
        </div>
        {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      </div>
    </div>
  );
}
