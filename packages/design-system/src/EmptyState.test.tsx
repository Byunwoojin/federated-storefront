import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EmptyState from "./EmptyState";

test("메시지가 화면에 보인다", () => {
  render(<EmptyState message="장바구니가 비어있습니다" />);
  expect(screen.getByText("장바구니가 비어있습니다")).toBeInTheDocument();
});

test("actionLabel과 onAction이 없으면 버튼이 없다.", () => {
  render(<EmptyState message="비어있습니다" />);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("actionLabel과 onAction이 있으면 버튼 클릭 시 onAction이 호출된다", async () => {
  const user = userEvent.setup();
  const handleAction = jest.fn();
  render(
    <EmptyState
      message="비어있습니다"
      actionLabel="상품 보러가기"
      onAction={handleAction}
    />,
  );
  await user.click(screen.getByRole("button", { name: "상품 보러가기" }));
  expect(handleAction).toHaveBeenCalledTimes(1);
});


