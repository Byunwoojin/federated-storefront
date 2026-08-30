import { useStockStore } from "../stock";

import { useOrderStore } from ".";

const items = [
  {
    productId: "1",
    name: "기본 반팔 티셔츠",
    price: 15000,
    stock: 8,
    quantity: 2,
  },
];

beforeEach(() => {
  useOrderStore.setState({ orders: [] });
  useStockStore.setState({ orderedQuantityByProductId: {} });
});

test("placeOrder: 주문을 생성하고 orderId를 반환한다", () => {
  const orderId = useOrderStore
    .getState()
    .placeOrder(items, items[0].price * items[0].quantity);
  expect(orderId).toMatch(/^ORD-/);
  expect(useOrderStore.getState().orders).toHaveLength(1);
  expect(useOrderStore.getState().orders[0]).toMatchObject({
    orderId,
    items,
    subtotal: items[0].price * items[0].quantity,
    status: "placed",
  });
});

test("placeOrder: 여러 번 주문하면 최신 주문이 맨 앞에 온다", () => {
  const firstOrderId = useOrderStore.getState().placeOrder(items, 10000);
  const secondOrderId = useOrderStore.getState().placeOrder(items, 20000);

  expect(secondOrderId).not.toBe(firstOrderId);
  expect(useOrderStore.getState().orders[0].orderId).toBe(secondOrderId);
  expect(useOrderStore.getState().orders).toHaveLength(2);
});

test("placeOrder: stock 슬라이스에 판매 수량이 기록된다", () => {
  useOrderStore.getState().placeOrder(items, 20000);
  expect(useStockStore.getState().orderedQuantityByProductId["1"]).toBe(2);
});

test("placeOrder: 같은 상품을 다시 주문하면 누적된다", () => {
  useOrderStore.getState().placeOrder(items, items[0].price * 2);
  useOrderStore.getState().placeOrder(items, items[0].price * 2);

  expect(useStockStore.getState().orderedQuantityByProductId["1"]).toBe(4);
});

test("updateStatus: 해당 주문의 상태만 바뀐다", () => {
  const orderId = useOrderStore
    .getState()
    .placeOrder(items, items[0].price * items[0].quantity);
  useOrderStore.getState().updateStatus(orderId, "shipping");
  expect(useOrderStore.getState().orders[0].status).toBe("shipping");
});
