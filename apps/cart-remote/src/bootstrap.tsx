import "@mfe/design-system/dist/style.css";
import "./styles.css";
import { createRoot } from "react-dom/client";
import CartPage from "./CartPage";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<CartPage />);
}
