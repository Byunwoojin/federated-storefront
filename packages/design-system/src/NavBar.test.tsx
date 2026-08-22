import { render, screen } from "@testing-library/react";

import NavBar from "./NavBar";
test("nav 랜드마크로 렌더링된다", () => {
  render(<NavBar>내용</NavBar>);
  expect(screen.getByRole("navigation")).toBeInTheDocument();
});

test("children이 그대로 렌더링된다", () => {
  render(
    <NavBar>
      <a href="/a">A</a>
      <a href="/b">B</a>
    </NavBar>,
  );
  expect(screen.getByRole("link", { name: "A" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "B" })).toBeInTheDocument();
});
