import { createRoot } from "react-dom/client";
import App from "./App";
import Formula1App from "./Formula1App";
import "./index.css";

// Check if we're in the Formula 1 route
const isFormula1Route = window.location.pathname === '/f1';

// Render the appropriate app based on the route
createRoot(document.getElementById("root")!).render(
  isFormula1Route ? <Formula1App /> : <App />
);
