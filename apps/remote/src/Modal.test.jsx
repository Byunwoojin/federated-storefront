import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";

test("isOpen이 false면 아무것도 렌더링하지 않는다", () => {
  render(
    <Modal isOpen={false} onClose={jest.fn()} title="타이틀">
      내용
    </Modal>,
  );

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("isOpen이 true면 title과 children이 보인다", () => {
  render(
    <Modal isOpen onClose={jest.fn()} title="타이틀">
      <p>본문</p>
    </Modal>,
  );

  expect(screen.getByRole("dialog", { name: "타이틀" })).toBeInTheDocument();
  expect(screen.getByText("본문")).toBeInTheDocument();
});

test("오버레이를 클릭하면 onClose가 호출된다", async () => {
  const user = userEvent.setup();
  const handleClose = jest.fn();

  render(
    <Modal isOpen onClose={handleClose} title="타이틀">
      내용
    </Modal>,
  );
  await user.click(screen.getByRole("dialog"));

  expect(handleClose).toHaveBeenCalledTimes(1);
});

test("닫기 버튼을 클릭하면 onClose가 정확히 한 번만 호출된다", async () => {
  const user = userEvent.setup();
  const handleClose = jest.fn();

  render(
    <Modal isOpen onClose={handleClose} title="타이틀">
      내용
    </Modal>,
  );
  await user.click(screen.getByRole("button", { name: "닫기" }));

  expect(handleClose).toHaveBeenCalledTimes(1);
});
