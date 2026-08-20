import "catalog_remote/styles";
import "cart_remote/styles";
import "@mfe/design-system/dist/style.css";
import { createRoot } from "react-dom/client";
import { Suspense, lazy, useState } from "react";
import { Button } from "@mfe/design-system";

const CatalogPage = lazy(() => import("catalog_remote/CatalogPage"));
const CartPage = lazy(() => import("cart_remote/CartPage"));

type Tab = "catalog" | "cart";

function App() {
  const [tab, setTab] = useState<Tab>("catalog");

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: 8,
          padding: 16,
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <Button onClick={() => setTab("catalog")}>상품 목록</Button>
        <Button onClick={() => setTab("cart")}>장바구니</Button>
      </nav>

      <Suspense fallback={<p style={{ padding: 24 }}>불러오는 중...</p>}>
        {tab === "catalog" ? <CatalogPage /> : <CartPage />}
      </Suspense>
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
