import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app";

import "./styles.css";

const root = document.querySelector("#root");
if (!root) {
  throw new Error("缺少 #root 节点");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
