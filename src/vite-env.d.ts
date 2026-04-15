/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  /** Legacy alias; prefer VITE_GEMINI_API_KEY for OpenRouter on Vercel */
  readonly VITE_OPENROUTER_API_KEY?: string;
  readonly VITE_OPENROUTER_MODEL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
