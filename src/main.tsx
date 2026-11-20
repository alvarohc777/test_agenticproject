import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { compose } from "./composition";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App services={compose()} />
  </StrictMode>,
);
