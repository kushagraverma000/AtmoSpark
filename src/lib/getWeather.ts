import { calculateRisk } from "@/lib/riskEngine";

/** Same-origin `/api` in dev (Vite proxy) and prod (Express). */
// const weatherUrl = (path: string, query: string) => `/api/weather${path}?${query}`;

res = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=${encoded}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
);

export type CurrentWeatherData = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: { speed: number };
  coord: { lat: number; lon: number };
  /** Seconds offset from UTC for this location (OpenWeather). */
  timezone: number;
};

export type WeatherFetchError = {
  ok: false;
  message: string;
};

export type WeatherFetchOk = {
  ok: true;
  data: CurrentWeatherData;
};

export type WeatherFetchResult = WeatherFetchOk | WeatherFetchError;

function parseCod(data: unknown): number | null {
  if (data && typeof data === "object" && "cod" in data) {
    const c = (data as { cod: unknown }).cod;
    if (typeof c === "number") return c;
    if (typeof c === "string") {
      const n = Number(c);
      return Number.isFinite(n) ? n : null;
    }
  }
  return null;
}

function errorMessageFromBody(data: unknown): string {
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === "string" && m.trim()) {
      return m.charAt(0).toUpperCase() + m.slice(1);
    }
  }
  return "Could not load weather for that location.";
}

/**
 * Current weather by city name. Invalid or unknown cities return `{ ok: false }` — never fake data.
 */
export async function getWeather(city: string): Promise<WeatherFetchResult> {
  const q = city.trim();
  if (!q) {
    return { ok: false, message: "Enter a city name." };
  }

  const encoded = encodeURIComponent(q);
  let res: Response;
  try {
    res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`
    );
  } catch {
    return { ok: false, message: "Network error. Check your connection and try again." };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, message: "Invalid response from weather service." };
  }

  const cod = parseCod(data);
  if (!res.ok || cod !== 200) {
    return { ok: false, message: errorMessageFromBody(data) };
  }

  const d = data as Record<string, unknown>;
  const main = d.main as Record<string, unknown> | undefined;
  const wind = d.wind as Record<string, unknown> | undefined;
  const coord = d.coord as Record<string, unknown> | undefined;

  if (
    !main ||
    typeof main.temp !== "number" ||
    typeof main.humidity !== "number" ||
    typeof main.feels_like !== "number" ||
    !wind ||
    typeof wind.speed !== "number" ||
    !coord ||
    typeof coord.lat !== "number" ||
    typeof coord.lon !== "number" ||
    typeof d.name !== "string"
  ) {
    return { ok: false, message: "Weather data was incomplete. Try again." };
  }

  const tz = typeof d.timezone === "number" ? d.timezone : 0;

  return {
    ok: true,
    data: {
      name: d.name,
      main: {
        temp: main.temp,
        feels_like: main.feels_like,
        humidity: main.humidity,
      },
      wind: { speed: wind.speed },
      coord: { lat: coord.lat, lon: coord.lon },
      timezone: tz,
    },
  };
}

export type OutlookDay = { label: string; risk: number };

/** Local calendar date key (YYYY-MM-DD) in the location's offset. */
function localDayKey(dtUtcSec: number, tzOffsetSec: number): string {
  const ms = dtUtcSec * 1000 + tzOffsetSec * 1000;
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 5-day / 3-hour forecast → up to 4 daily risk scores (today + next days) using real API data.
 */
export async function getForecastOutlook(
  lat: number,
  lon: number,
  timezoneSec: number,
): Promise<OutlookDay[] | null> {
  let res: Response;
  try {
    res = await fetch(
      weatherUrl("/forecast", `lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`),
    );
  } catch {
    return null;
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return null;
  }

  const cod = parseCod(data);
  if (!res.ok || cod !== 200) return null;

  const list = (data as { list?: unknown }).list;
  if (!Array.isArray(list) || list.length === 0) return null;

  type Slot = { dt: number; main: { temp: number; humidity: number } };
  const byDay = new Map<string, { temps: number[]; hums: number[] }>();

  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const dt = o.dt;
    const main = o.main as Record<string, unknown> | undefined;
    if (typeof dt !== "number" || !main || typeof main.temp !== "number" || typeof main.humidity !== "number") {
      continue;
    }
    const key = localDayKey(dt, timezoneSec);
    const g = byDay.get(key) ?? { temps: [], hums: [] };
    g.temps.push(main.temp);
    g.hums.push(main.humidity);
    byDay.set(key, g);
  }

  const sortedKeys = [...byDay.keys()].sort();
  if (sortedKeys.length === 0) return null;

  const days: OutlookDay[] = sortedKeys.slice(0, 4).map((key, i) => {
    const { temps, hums } = byDay.get(key)!;
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const avgHum = hums.reduce((a, b) => a + b, 0) / hums.length;
    const risk = calculateRisk(avgTemp, avgHum);

    let label: string;
    if (i === 0) label = "Today";
    else {
      const [yy, mm, dd] = key.split("-").map(Number);
      const noon = Date.UTC(yy, mm - 1, dd, 12, 0, 0);
      label = new Date(noon).toLocaleDateString(undefined, { weekday: "short" });
    }

    return { label, risk: Math.round(risk) };
  });

  return days;
}
