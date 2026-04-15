const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Uses same-origin requests locally, or a configured backend origin in split deployments.
 */
export function apiUrl(path: string): string {
  const normalizedPath = normalizePath(path);
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
}
