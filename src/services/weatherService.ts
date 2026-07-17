import { demoWeather } from "./demoData";
import { fetchJsonWithCache } from "./api";
import type { WeatherData } from "../types/content";

export function getWeather(location: string, signal?: AbortSignal): Promise<WeatherData> {
  const normalizedLocation = location.trim() || "Hedingen";
  return fetchJsonWithCache<WeatherData>(
    `/api/weather?location=${encodeURIComponent(normalizedLocation)}`,
    {
      cacheKey: `weather.${normalizedLocation.toLowerCase()}`,
      maxAgeMs: 1000 * 60 * 10,
      fallback: { ...demoWeather, location: normalizedLocation, updatedAt: new Date().toISOString() },
      signal
    }
  );
}
