import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

test("버튼에 넣은 텍스트가 화면에 보인다", () => {
  render(<Button>확인</Button>);

  expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
});

test("버튼을 클릭하면 onClick이 실행된다", async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();

  render(<Button onClick={handleClick}>클릭</Button>);
  await user.click(screen.getByRole("button", { name: "클릭" }));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
