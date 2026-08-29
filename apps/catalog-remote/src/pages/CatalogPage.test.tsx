import { useCartStore, useStockStore } from "@mfe/cart-store";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import CatalogPage from "./CatalogPage";

beforeEach(() => {
  useCartStore.setState({ items: [] });
  useStockStore.setState({ orderedQuantityByProductId: {} });
});

function renderCatalogPage() {
  return render(
    <MemoryRouter>
      <CatalogPage />
    </MemoryRouter>,
  );
}

test("상품 목록이 화면에 보인다", () => {
  renderCatalogPage();
  expect(screen.getByText("기본 반팔 티셔츠")).toBeInTheDocument();
  expect(screen.getByText("데님 팬츠")).toBeInTheDocument();
});

test("담기 버튼을 누르면 장바구니에 담기고 토스트가 뜬다.", async () => {
  const user = userEvent.setup();
  renderCatalogPage();

  const addButtons = screen.getAllByRole("button", { name: "담기" });
  await user.click(addButtons[0]); // 기본 반팔 티셔츠

  expect(useCartStore.getState().items).toHaveLength(1);
  expect(useCartStore.getState().items[0]).toMatchObject({
    productId: "1",
    name: "기본 반팔 티셔츠",
    price: 15000,
    stock: 8,
    quantity: 1,
  });
  expect(screen.getByRole("status")).toHaveTextContent(
    "기본 반팔 티셔츠을(를) 담았습니다.",
  );
});

test("남은 재고가 0이면 품절로 표시되고 버튼이 비활성화된다", () => {
  // 데님 팬츠(id:2)는 재고가 3개
  useStockStore.setState({ orderedQuantityByProductId: { "2": 3 } });
  renderCatalogPage();
  expect(screen.getByRole("button", { name: "품절" })).toBeDisabled();
});

test("카드를 클릭하면 상세 페이지 경로로 이동한다", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={["/catalog"]}>
      <Routes>
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:id" element={<div>상세 페이지</div>} />
      </Routes>
    </MemoryRouter>,
  );
  await user.click(screen.getByText("기본 반팔 티셔츠"));
  expect(await screen.findByText("상세 페이지")).toBeInTheDocument();
});
