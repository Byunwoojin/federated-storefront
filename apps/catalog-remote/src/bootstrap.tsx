import "@mfe/design-system/dist/style.css";
import "./styles.css";
import { createRoot } from "react-dom/client";
import CatalogPage from "./CatalogPage";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<CatalogPage />);
}
