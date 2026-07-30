import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import App from "./App";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { UIProvider } from "./context/UIContext";
import { store } from "./store/store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <UIProvider>
        <ErrorBoundary>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "rgb(var(--color-surface))",
                color: "rgb(var(--color-text-main))",
                border: "1px solid rgb(var(--color-border) / 0.2)",
                borderRadius: "18px",
                boxShadow: "0 18px 50px rgb(var(--shadow-color) / 0.28)",
              },
            }}
          />
        </ErrorBoundary>
      </UIProvider>
    </Provider>
  </React.StrictMode>
);
