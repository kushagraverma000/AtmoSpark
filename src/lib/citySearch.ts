/**
 * Light client-side checks before calling the weather API.
 * Final validation is always OpenWeather (unknown cities return an error).
 */
export function validateCityQuery(
  raw: string,
): { ok: true; query: string } | { ok: false; message: string } {
  const q = raw.trim().replace(/\s+/g, " ");
  if (q.length < 2) {
    return { ok: false, message: "Enter at least 2 characters." };
  }
  if (q.length > 100) {
    return { ok: false, message: "That search is too long." };
  }
  if (!/\p{L}/u.test(q)) {
    return {
      ok: false,
      message: "Use a real place name with letters (e.g. Mumbai or Paris, FR).",
    };
  }
  if (/^[\d\s,.+_-]+$/u.test(q)) {
    return { ok: false, message: "Include a city or town name, not only numbers or symbols." };
  }
  return { ok: true, query: q };
}
