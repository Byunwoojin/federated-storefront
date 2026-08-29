import { findInsufficientStockItems, remainingStock, useStockStore } from ".";

beforeEach(() => {
  useStockStore.setState({ orderedQuantityByProductId: {} });
});
test("recordOrder: 같은 상품에 여러번 기록하면 누적된다", () => {
  useStockStore.getState().recordOrder([{ productId: "1", quantity: 2 }]);
  useStockStore.getState().recordOrder([{ productId: "1", quantity: 3 }]);
  expect(useStockStore.getState().orderedQuantityByProductId["1"]).toBe(5);
});
test("recordOrder: 여러 상품을 한 번에 기록한다.", () => {
  useStockStore.getState().recordOrder([
    { productId: "1", quantity: 2 },
    { productId: "2", quantity: 1 },
  ]);
  expect(useStockStore.getState().orderedQuantityByProductId).toEqual({
    "1": 2,
    "2": 1,
  });
});

test("remainingStock: 재고에서 주문 누적을 뺀다", () => {
  expect(remainingStock(8, "1", { "1": 3 })).toBe(5);
});

test("remainingStock: 음수가 되지 않고 0으로 바닥한다.", () => {
  expect(remainingStock(8, "1", { "1": 20 })).toBe(0);
});

test("remainingStock: 기록이 없으면 전체 재고를 반환한다", () => {
  expect(remainingStock(8, "1", {})).toBe(8);
});

test("findInsufficientStockItems: 남은 재고보다 많이 담은 아이템만 걸러낸다", () => {
  const items = [
    { productId: "1", quantity: 5, stock: 8 },
    { productId: "2", quantity: 2, stock: 3 },
  ];

  const result = findInsufficientStockItems(items, { "1": 5 });
  expect(result).toHaveLength(1);
  expect(result[0].item.productId).toBe("1");
  expect(result[0].remaining).toBe(3);
});
