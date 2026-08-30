import { useCartStore, useOrderStore, useStockStore } from "@mfe/cart-store";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import CheckoutPage from "./CheckoutPage";

const seedItem = {
  productId: "1",
  name: "기본 반팔 티셔츠",
  price: 15000,
  stock: 8,
  quantity: 2,
};

beforeEach(() => {
  useCartStore.setState({ items: [] });
  useOrderStore.setState({ orders: [] });
  useStockStore.setState({ orderedQuantityByProductId: {} });
});

function renderCheckoutPage() {
  return render(
    <MemoryRouter initialEntries={["/checkout"]}>
      <Routes>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-complete" element={<div>주문 완료 페이지</div>} />
        <Route path="/cart" element={<div>장바구니 페이지</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

test("장바구니가 비어있으면 안내 문구가 보인다", () => {
  renderCheckoutPage();
  expect(screen.getByText("주문할 상품이 없습니다")).toBeInTheDocument();
});

test("장바구니 아이템과 합계가 화면에 보인다", () => {
  useCartStore.setState({ items: [seedItem] });
  renderCheckoutPage();
  expect(screen.getByText("기본 반팔 티셔츠 x 2")).toBeInTheDocument();
  expect(screen.getAllByText("30,000원").length).toBeGreaterThan(0);
});

test("결제하기를 누르면 주문이 생성되고 장바구니가 비워지고 완료 페이지로 이동한다", async () => {
  const user = userEvent.setup();
  useCartStore.setState({ items: [seedItem] });
  renderCheckoutPage();

  const [payButton] = screen.getAllByRole("button", { name: "결제하기" });
  await user.click(payButton);

  expect(await screen.findByText("주문 완료 페이지")).toBeInTheDocument();
  expect(useOrderStore.getState().orders).toHaveLength(1);
  expect(useOrderStore.getState().orders[0]).toMatchObject({
    items: [seedItem],
    subtotal: 30000,
  });
  expect(useCartStore.getState().items).toHaveLength(0);
});

test("재고가 부족하면 주문을 생성하지 않고 장바구니 화면으로 돌아간다.", async () => {
  const user = userEvent.setup();
  useCartStore.setState({ items: [seedItem] });
  // 재고 8개 중 7개가 이미 다른 주문으로 소진 -> 남은 건 1개인데 장바구니엔 2개
  useStockStore.setState({ orderedQuantityByProductId: { "1": 7 } });
  renderCheckoutPage();
  const [payButton] = screen.getAllByRole("button", { name: "결제하기" });
  await user.click(payButton);

  expect(await screen.findByText("장바구니 페이지")).toBeInTheDocument();
  expect(useOrderStore.getState().orders).toHaveLength(0);
  expect(useCartStore.getState().items).toHaveLength(1);
});
