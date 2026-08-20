import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "./Card";

const sampleProps = {
  imageUrl: "https://placehold.co/240x240",
  name: "기본 반팔 티셔츠",
  price: 15000,
  onAddToCart: () => {},
};

test("상품영과 가격이 화면에 보인다", () => {
  render(<Card {...sampleProps} />);
  expect(screen.getByText("기본 반팔 티셔츠")).toBeInTheDocument();
  expect(screen.getByText("15,000원")).toBeInTheDocument();
});

test("이미지의 alt 텍스트가 상품명과 같다", () => {
  render(<Card {...sampleProps} />);
  expect(screen.getByAltText("기본 반팔 티셔츠")).toBeInTheDocument();
});

test("담기 버튼을 클릭하면 onAddToCart가 호출된다", async () => {
  const user = userEvent.setup();
  const handleAdd = jest.fn();

  render(<Card {...sampleProps} onAddToCart={handleAdd} />);
  await user.click(screen.getByRole("button", { name: "담기" }));
  expect(handleAdd).toHaveBeenCalledTimes(1);
});
