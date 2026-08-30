import { useOrderStore } from "@mfe/cart-store";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import OrderHistoryPage from "./OrderHistoryPage";

const order1 = {
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

const order2 = {
  orderId: "ORD-2",
  items: [
    { productId: "2", name: "데님 팬츠", price: 39000, stock: 3, quantity: 1 },
  ],
  subtotal: 39000,
  status: "placed" as const,
  createdAt: 2,
};

beforeEach(() => {
  useOrderStore.setState({ orders: [] });
});

test("주문내역이 없으면 안내 문구가 보인다", () => {
  render(<OrderHistoryPage />);
  expect(screen.getByText("아직 주문내역이 없습니다")).toBeInTheDocument();
});

test("주문 정보가 화면에 보인다.", () => {
  useOrderStore.setState({ orders: [order1] });
  render(<OrderHistoryPage />);

  expect(screen.getAllByText("ORD-1").length).toBeGreaterThan(0);
  expect(screen.getAllByText("기본 반팔 티셔츠").length).toBeGreaterThan(0);
  expect(screen.getAllByText("30,000원").length).toBeGreaterThan(0);
  expect(screen.getAllByText("주문완료").length).toBeGreaterThan(0);
});

test("상태가 같은 주문이 여러 건이면 특정 행 안에서 범위를 좁혀 확인해야 한다.", () => {
  useOrderStore.setState({ orders: [order1, order2] });

  render(<OrderHistoryPage />);
  // 데스크탑 테이블 + 모바일 카드가 동시에 렌더링되고, 둘 다 "주문완료" 상태라
  // 전역으로 찾으면 몇번째 뱃지인지 특정할 수 없다
  expect(screen.getAllByText("주문완료").length).toBeGreaterThan(1);

  // ORD-1이 속한 행 (tr) 안으로 범위를 좁히면 그 주문의 상태만 정확히 확인 가능
  const row = screen.getAllByText("ORD-1")[0].closest("tr")!;
  expect(within(row).getByText("주문완료")).toBeInTheDocument();
});

test("상태 변경 버튼을 누르면 다음 상태로 바뀐다", async () => {
  const user = userEvent.setup();
  useOrderStore.setState({ orders: [order1] });
  render(<OrderHistoryPage />);

  const [changeButton] = screen.getAllByRole("button", {
    name: "배송중(으)로 변경",
  });
  await user.click(changeButton);

  expect(useOrderStore.getState().orders[0].status).toBe("shipping");
});

test("배송 완료 상태면 더 이상 상태 변경 버튼이 없다", () => {
  useOrderStore.setState({ orders: [{ ...order1, status: "delivered" }] });
  render(<OrderHistoryPage />);

  expect(
    screen.queryByRole("button", { name: /\(으\)으로 변경/ }),
  ).not.toBeInTheDocument();
});
