import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import "./styles/index.css";
import { BgmProvider } from "./stores/BgmContext";
import Cursor from "./components/Cursor";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BgmProvider>
      <Cursor />
      <App />
    </BgmProvider>
  </React.StrictMode>
);
