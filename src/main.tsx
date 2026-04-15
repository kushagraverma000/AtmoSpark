import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const env = import.meta.env;
const viteKeys = Object.keys(env).filter((k) => k.startsWith("VITE_"));
console.log("ENV CHECK:", {
  MODE: env.MODE,
  PROD: env.PROD,
  viteKeys,
  VITE_WEATHER_API_KEY: env.VITE_WEATHER_API_KEY ? "[set]" : "[missing]",
  VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY ? "[set]" : "[missing]",
  VITE_OPENROUTER_API_KEY: env.VITE_OPENROUTER_API_KEY ? "[set]" : "[unset]",
});

createRoot(document.getElementById("root")!).render(<App />);
