import { render, screen } from "@testing-library/react";
import Card from "./Card";

test("title과 description이 화면에 보인다", () => {
  render(<Card title="제목" description="설명" />);
  expect(screen.getByText("제목")).toBeInTheDocument();
  expect(screen.getByText("설명")).toBeInTheDocument();
});

test("footer를 안 넘기면 렌더링되지 않는다", () => {
  render(<Card title="제목" description="설명" />);

  expect(screen.queryByText("푸터 내용")).not.toBeInTheDocument();
});

test("footer를 넘기면 화면에 보인다", () => {
  render(<Card title="제목" description="설명" footer="푸터 내용" />);
  expect(screen.getByText("푸터 내용")).toBeInTheDocument();
});
