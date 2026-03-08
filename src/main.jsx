import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App.jsx";

// Configure axios default base URL
// Use VITE_API_URL when set (production). Otherwise use a relative URL so
// Vite dev server proxy (configured in vite.config.js) forwards /api requests
// to the backend and avoids mixed-content or CORS/network errors during dev.
const API_BASE_URL = import.meta.env.VITE_API_URL || "";
axios.defaults.baseURL = API_BASE_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
