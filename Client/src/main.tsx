import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/Errorboundary.tsx";
import { Toaster } from "react-hot-toast"
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={true}
      />
      <ErrorBoundary> 
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
