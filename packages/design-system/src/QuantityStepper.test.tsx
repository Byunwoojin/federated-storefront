import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import QuantityStepper from "./QuantityStepper";

test("quality가 화면에 보인다", () => {
  render(
    <QuantityStepper
      quantity={3}
      onIncrement={() => {}}
      onDecrement={() => {}}
    />,
  );

  expect(screen.getByText("3")).toBeInTheDocument();
});

test("+ 버튼을 클릭하면 onIncrement가 호출된다", async () => {
  const user = userEvent.setup();
  const handleIncrement = jest.fn();
  render(
    <QuantityStepper
      quantity={1}
      onIncrement={handleIncrement}
      onDecrement={() => {}}
    />,
  );

  await user.click(screen.getByRole("button", { name: "+" }));
  expect(handleIncrement).toHaveBeenCalledTimes(1);
});

test("- 버튼을 클릭하면 onDecrement 호출된다", async () => {
  const user = userEvent.setup();
  const handleDecrement = jest.fn();
  render(
    <QuantityStepper
      quantity={1}
      onIncrement={() => {}}
      onDecrement={handleDecrement}
    />,
  );

  await user.click(screen.getByRole("button", { name: "-" }));
  expect(handleDecrement).toHaveBeenCalledTimes(1);
});

test("incrementDisabled가 true면 + 버튼이 비활성화된다", () => {
  render(
    <QuantityStepper
      quantity={5}
      onIncrement={() => {}}
      onDecrement={() => {}}
      incrementDisabled
    />,
  );
  expect(screen.getByRole("button", { name: "+" })).toBeDisabled();
});

test("decrementDisabled가 true면 - 버튼이 비활성화된다", () => {
  render(
    <QuantityStepper
      quantity={5}
      onIncrement={() => {}}
      onDecrement={() => {}}
      decrementDisabled
    />,
  );
  expect(screen.getByRole("button", { name: "-" })).toBeDisabled();
});
