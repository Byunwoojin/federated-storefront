import { useCartStore } from "@mfe/cart-store";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import CartPage from "./CartPage";

const seedItem = {
  productId: "1",
  name: "기본 반팔 티셔츠",
  price: 15000,
  stock: 8,
  quantity: 2,
};

beforeEach(() => {
  useCartStore.setState({ items: [seedItem] });
});

function renderCartPage() {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>,
  );
}

test("삭제 버튼을 눌러도 즉시 지워지지 않고 확인 모달이 뜬다", async () => {
  const user = userEvent.setup();
  renderCartPage();
  await user.click(screen.getByRole("button", { name: "삭제" }));

  const dialog = screen.getByRole("dialog");
  expect(within(dialog).getByText(/삭제할까요/)).toBeInTheDocument();
  expect(useCartStore.getState().items).toHaveLength(1);
});

test("모달을 닫으면(취소) 아이템이 그대로 남아있다", async () => {
  const user = userEvent.setup();
  renderCartPage();

  await user.click(screen.getByRole("button", { name: "삭제" }));
  await user.click(screen.getByRole("button", { name: "닫기" }));

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(useCartStore.getState().items).toHaveLength(1);
});

test("모달에서 확인하면 실제로 store에서 지워지고 모달도 닫힌다.", async () => {
  const user = userEvent.setup();
  renderCartPage();

  await user.click(screen.getByRole("button", { name: "삭제" }));
  const dialog = screen.getByRole("dialog");
  await user.click(within(dialog).getByRole("button", { name: "삭제" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  expect(useCartStore.getState().items).toHaveLength(0);
});
