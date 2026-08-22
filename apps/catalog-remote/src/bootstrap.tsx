import "@mfe/design-system/dist/style.css";
import "./styles.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import CatalogPage from "./pages/CatalogPage";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <BrowserRouter>
      <CatalogPage />
    </BrowserRouter>,
  );
}
