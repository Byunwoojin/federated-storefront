import { useStockStore } from "../stock";

import { selectItemCount, selectSubtotal, useCartStore } from ".";

const product = {
  productId: "1",
  name: "기본 반팔 티셔츠",
  price: 15000,
  stock: 8,
};
const product2 = {
  productId: "2",
  name: "데님 팬츠",
  price: 39000,
  stock: 3,
};

beforeEach(() => {
  useCartStore.setState({ items: [] });
  useStockStore.setState({ orderedQuantityByProductId: {} });
});

test("addItem: 새 상품을 기본 수량(1개)으로 담는다", () => {
  useCartStore.getState().addItem(product);
  expect(useCartStore.getState().items).toEqual([{ ...product, quantity: 1 }]);
});

test("addItem: 이미 담긴 상품이면 수량이 누적된다", () => {
  useCartStore.getState().addItem(product, 2);
  useCartStore.getState().addItem(product, 3);
  expect(useCartStore.getState().items).toHaveLength(1);
  expect(useCartStore.getState().items[0].quantity).toBe(5);
});

test("addItem: 재고를 넘어서는 수량은 재고만큼만 담긴다", () => {
  useCartStore.getState().addItem(product, 100);
  expect(useCartStore.getState().items[0].quantity).toBe(8);
});

test("addItem: 완료된 주문만큼 뺀 재고를 넘지 못한다", () => {
  useStockStore.setState({ orderedQuantityByProductId: { "1": 6 } });
  useCartStore.getState().addItem(product, 100);
  expect(useCartStore.getState().items[0].quantity).toBe(2);
});

test("removeItem: 해당 상품만 제거한다", () => {
  useCartStore.getState().addItem(product);
  useCartStore.getState().addItem({ ...product, productId: "2" });
  useCartStore.getState().removeItem("1");
  expect(useCartStore.getState().items).toHaveLength(1);
  expect(useCartStore.getState().items[0].productId).toBe("2");
});

test("increment: 수량이 1 늘어난다.", () => {
  useCartStore.getState().addItem(product, 1);
  useCartStore.getState().increment("1");
  expect(useCartStore.getState().items[0].quantity).toBe(2);
});

test("increment: 완료된 주문을 뺀 재고 상한을 넘지 못한다", () => {
  useStockStore.setState({ orderedQuantityByProductId: { "1": 7 } });
  useCartStore.getState().addItem(product, 1);
  useCartStore.getState().increment("1");
  expect(useCartStore.getState().items[0].quantity).toBe(1);
});

test("decrement: 수량이 1 줄어들되 1 밑으로는 안 내려간다.", () => {
  useCartStore.getState().addItem(product, 1);
  useCartStore.getState().decrement("1");
  expect(useCartStore.getState().items[0].quantity).toBe(1);
});

test("clear: 장바구니를 비운다", () => {
  useCartStore.getState().addItem(product);
  useCartStore.getState().clear();
  expect(useCartStore.getState().items).toEqual([]);
});

test("selectSubtotal: 가격 x 수량의 합", () => {
  useCartStore.setState({
    items: [
      { ...product, quantity: 2 },
      { ...product2, quantity: 1 },
    ],
  });
  expect(selectSubtotal(useCartStore.getState())).toBe(
    product.price * 2 + product2.price,
  );
});

test("selectItemCount: 수량의 합", () => {
  useCartStore.setState({
    items: [
      { ...product, quantity: 2 },
      { ...product2, quantity: 1 },
    ],
  });
  expect(selectItemCount(useCartStore.getState())).toBe(3);
});
