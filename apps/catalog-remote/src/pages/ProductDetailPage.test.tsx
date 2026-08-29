import { useCartStore, useStockStore } from "@mfe/cart-store";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import ProductDetailPage from "./ProductDetailPage";

beforeEach(() => {
  useCartStore.setState({ items: [] });
  useStockStore.setState({ orderedQuantityByProductId: {} });
});

function renderProductDetailPage(id: string) {
  return render(
    <MemoryRouter initialEntries={[`/catalog/${id}`]}>
      <Routes>
        <Route path="/catalog/:id" element={<ProductDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

test("존재하지 않는 상품이면 안내 문구가 보인다", () => {
  renderProductDetailPage("999");
  expect(screen.getByText("상품을 찾을 수 없습니다.")).toBeInTheDocument();
});

test("상품 정보가 화면에 보인다", () => {
  renderProductDetailPage("1");
  expect(screen.getByText("기본 반팔 티셔츠")).toBeInTheDocument();
  expect(screen.getByText("15,000원")).toBeInTheDocument();
});

test("+ 버튼으로 수량을 늘리고 담기를 누르면 그 수량만큼 장바구니에 담긴다", async () => {
  const user = userEvent.setup();
  renderProductDetailPage("1");

  await user.click(screen.getByRole("button", { name: "+" }));
  await user.click(screen.getByRole("button", { name: "+" }));
  await user.click(screen.getByRole("button", { name: "담기" }));

  expect(useCartStore.getState().items[0]).toMatchObject({
    productId: "1",
    quantity: 3,
  });
});

test("담고 나면 수량 선택이 1로 리셋되고 토스트가 뜬다", async () => {
  const user = userEvent.setup();
  renderProductDetailPage("1");

  await user.click(screen.getByRole("button", { name: "+" }));
  await user.click(screen.getByRole("button", { name: "담기" }));
  expect(screen.getByLabelText("현재 수량")).toHaveTextContent("1");
  expect(screen.getByRole("status")).toHaveTextContent(
    "기본 반팔 티셔츠을(를) 담았습니다.",
  );
});

test("이미 장바구니에 담긴 수량만을 선택 가능한 최대치가 줄어든다", async () => {
  const user = userEvent.setup();
  // 데님팬츠 (id:2)는 재고 3개, 이미 장바구니에 1개 담겨있는 상태

  useCartStore.setState({
    items: [
      {
        productId: "2",
        name: "데님 팬츠",
        price: 39000,
        stock: 3,
        quantity: 1,
      },
    ],
  });
  renderProductDetailPage("2");
  const incrementButton = screen.getByRole("button", { name: "+" });
  await user.click(incrementButton); // 1 -> 2 남은 2개까지가 한도

  expect(incrementButton).toBeDisabled();
  expect(screen.getByText(/\(2\)개 까지만 더 담을 수 있어요/)).toBeInTheDocument();
});

test("남은 재고가 0이면 품절로 표시되고 담기가 비활성화된다", () => {
  useStockStore.setState({ orderedQuantityByProductId: { "2": 3 } });
  renderProductDetailPage("2");
  expect(screen.getByRole("button", { name: "품절" })).toBeDisabled();
});
