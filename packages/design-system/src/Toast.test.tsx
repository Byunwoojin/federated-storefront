import { render, screen } from "@testing-library/react";

import Toast from "./Toast";
test("message가 화면에 보인다", () => {
  render(<Toast message="담았습니다" onDismiss={() => {}} />);
  expect(screen.getByText("담았습니다")).toBeInTheDocument();
});

test("duration이 지나면 onDismiss가 호출된다", () => {
  jest.useFakeTimers();
  const handleDismiss = jest.fn();
  render(
    <Toast message="담았습니다" duration={1500} onDismiss={handleDismiss} />,
  );
  expect(handleDismiss).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1499);
  expect(handleDismiss).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1);
  expect(handleDismiss).toHaveBeenCalledTimes(1);
  jest.useRealTimers();
});


