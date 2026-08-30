import { useOrderStore } from "@mfe/cart-store";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import OrderCompletePage from "./OrderCompletePage";

const order = {
  orderId: "ORD-1",
  items: [
    {
      productId: "1",
      name: "기본 반팔 티셔츠",
      price: 15000,
      stock: 8,
      quantity: 2,
    },
  ],
  subtotal: 30000,
  status: "placed" as const,
  createdAt: 1,
};
beforeEach(() => {
  useOrderStore.setState({ orders: [] });
});

function renderOrderComplePage(orderId: string) {
  return render(
    <MemoryRouter initialEntries={[`/order-complete?orderId=${orderId}`]}>
      <Routes>
        <Route path="/order-complete" element={<OrderCompletePage />} />
        <Route path="/catalog" element={<div>카탈로그 페이지</div>} />
        <Route path="/orders" element={<div>주문내역 페이지</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

test("존재하지 않는 주문번호면 안내 문구가 보인다", () => {
  renderOrderComplePage("ORD-999");
  expect(screen.getByText("주문 정보를 찾을 수 없습니다.")).toBeInTheDocument();
});

test("주문 정보가 화면에 보인다", () => {
  useOrderStore.setState({ orders: [order] });
  renderOrderComplePage("ORD-1");

  expect(screen.getByText("주문번호: ORD-1")).toBeInTheDocument();
  expect(screen.getByText("총 30,000원")).toBeInTheDocument();
});

test("계속 쇼핑하기를 누르면 카탈로그 페이지로 이동한다", async () => {
  const user = userEvent.setup();
  useOrderStore.setState({ orders: [order] });
  renderOrderComplePage("ORD-1");

  await user.click(screen.getByRole("button", { name: "계속 쇼핑하기" }));
  expect(await screen.findByText("카탈로그 페이지")).toBeInTheDocument();
});

test("주문내역 보기를 누르면 주문내역 페이지로 이동한다", async () => {
  const user = userEvent.setup();
  useOrderStore.setState({ orders: [order] });
  renderOrderComplePage("ORD-1");

  await user.click(screen.getByRole("button", { name: "주문내역 보기" }));
  expect(await screen.findByText("주문내역 페이지")).toBeInTheDocument();
});
