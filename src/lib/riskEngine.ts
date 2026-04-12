export function calculateRisk(temp: number, humidity: number) {
  let score = 0;

  // Heat risk
  if (temp > 40) score += 40;
  else if (temp > 35) score += 30;
  else if (temp > 30) score += 20;
  else score += 10;

  // Humidity risk
  if (humidity > 70) score += 20;
  else if (humidity > 50) score += 10;

  return Math.min(score, 100);
}

/** 0–100 heat stress from measured air temperature (°C). */
export function heatStressPercent(temp: number): number {
  if (temp <= 10) return Math.max(5, Math.round(8 + temp * 0.5));
  if (temp <= 22) return Math.round(15 + (temp - 10) * 2.5);
  if (temp <= 28) return Math.round(45 + (temp - 22) * 5);
  if (temp <= 32) return Math.round(75 + (temp - 28) * 4);
  if (temp <= 36) return Math.round(91 + (temp - 32) * 2.25);
  return Math.min(100, Math.round(100));
}

/** 0–100 humidity stress from relative humidity (%). */
export function humidityStressPercent(humidity: number): number {
  if (humidity <= 30) return Math.round(15 + humidity * 0.5);
  if (humidity <= 50) return Math.round(30 + (humidity - 30) * 0.9);
  if (humidity <= 65) return Math.round(48 + (humidity - 50) * 1.4);
  if (humidity <= 80) return Math.round(69 + (humidity - 65) * 1.6);
  return Math.min(100, Math.round(93 + (humidity - 80) * 0.45));
}

/**
 * 0–100 “feels vs air” gap from OpenWeather `feels_like` vs `temp` (real API fields).
 */
export function feelsLikeGapPercent(temp: number, feelsLike: number): number {
  const delta = Math.abs(feelsLike - temp);
  return Math.min(100, Math.round(delta * 14));
}

/** m/s → km/h for display */
export function windMsToKmh(ms: number): number {
  return Math.round(ms * 3.6 * 10) / 10;
}