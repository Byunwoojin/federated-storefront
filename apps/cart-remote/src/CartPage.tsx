import { useState } from "react";
import { Button, Modal } from "@mfe/design-system";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const cartItems: CartItem[] = [
  { id: 1, name: "기본 반팔 티셔츠", price: 15000, quantity: 2 },
  { id: 2, name: "데님 팬츠", price: 39000, quantity: 1 },
];

export default function CartPage() {
  const [isOpen, setIsOpen] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="p-6">
      <h1 className="text-heading text-text-primary">장바구니</h1>

      <ul className="mt-4 flex flex-col gap-3">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-border p-4"
          >
            <div>
              <p className="text-body text-text-primary">{item.name}</p>
              <p className="text-text-secondary">수량 {item.quantity}개</p>
            </div>
            <p className="text-price-text text-price">
              {(item.price * item.quantity).toLocaleString()}원
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-heading text-text-primary">
          총 {total.toLocaleString()}원
        </p>
        <Button onClick={() => setIsOpen(true)}>주문하기</Button>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="주문 확인">
        <p>총 {total.toLocaleString()}원을 결제하시겠습니까?</p>
      </Modal>
    </div>
  );
}
