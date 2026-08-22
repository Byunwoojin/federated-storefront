import { render, screen } from "@testing-library/react";

import StatusBadge from "./StatusBadge";

test("label이 화면에 보인다", () => {
  render(<StatusBadge label="배송중" />);
  expect(screen.getByText("배송중")).toBeInTheDocument();
});
