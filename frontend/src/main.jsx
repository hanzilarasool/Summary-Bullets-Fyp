import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <React.StrictMode>
        <App />
        <ToastContainer
          position="top-right" // Position of the toast
          autoClose={5000} // Auto close after 5 seconds
          hideProgressBar={false} // Show progress bar
          newestOnTop={false} // Newest toast on top
          closeOnClick // Close on click
          rtl={false} // Right-to-left direction
          pauseOnFocusLoss // Pause on losing focus
          draggable // Allow dragging
          pauseOnHover // Pause on hover
          theme="light" // Theme (light, dark, colored)
        />
      </React.StrictMode>
    </Provider>
  </PersistGate>
);
