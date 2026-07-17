import type { Handler } from "@netlify/functions";
import { fetchJson, json, optionsResponse } from "./_utils";

interface GeocodeResponse {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }>;
}

interface ForecastResponse {
  current?: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m?: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
}

const codeMap: Record<string, { condition: string; icon: string }> = {
  "0": { condition: "Klar", icon: "sunny" },
  "1": { condition: "Überwiegend sonnig", icon: "sunny" },
  "2": { condition: "Leicht bewölkt", icon: "partly-cloudy" },
  "3": { condition: "Bewölkt", icon: "cloudy" },
  "45": { condition: "Nebel", icon: "fog" },
  "48": { condition: "Nebel", icon: "fog" },
  "51": { condition: "Nieselregen", icon: "rain" },
  "53": { condition: "Nieselregen", icon: "rain" },
  "55": { condition: "Nieselregen", icon: "rain" },
  "61": { condition: "Regen", icon: "rain" },
  "63": { condition: "Regen", icon: "rain" },
  "65": { condition: "Starker Regen", icon: "rain" },
  "71": { condition: "Schnee", icon: "snow" },
  "73": { condition: "Schnee", icon: "snow" },
  "75": { condition: "Starker Schnee", icon: "snow" },
  "80": { condition: "Regenschauer", icon: "rain" },
  "81": { condition: "Regenschauer", icon: "rain" },
  "82": { condition: "Starke Schauer", icon: "rain" },
  "95": { condition: "Gewitter", icon: "storm" }
};

function weatherFor(code?: number) {
  return codeMap[String(code ?? 2)] ?? { condition: "Leicht bewölkt", icon: "partly-cloudy" };
}

function hourlyForecast(forecast: ForecastResponse) {
  const hourly = forecast.hourly;
  if (!hourly?.time?.length) return [];

  const now = Date.now();
  const startIndex = hourly.time.findIndex((time) => new Date(time).getTime() >= now - 1000 * 60 * 45);
  const start = startIndex >= 0 ? startIndex : 0;

  return hourly.time.slice(start, start + 12).map((time, offset) => {
    const index = start + offset;
    const hourWeather = weatherFor(hourly.weather_code?.[index]);
    return {
      label: time.slice(11, 16),
      temperature: hourly.temperature_2m?.[index] ?? forecast.current?.temperature_2m ?? 0,
      rainProbability: hourly.precipitation_probability?.[index] ?? 0,
      icon: hourWeather.icon,
      condition: hourWeather.condition
    };
  });
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return optionsResponse();

  const location = event.queryStringParameters?.location?.trim() || "Hedingen";

  try {
    const geocode = await fetchJson<GeocodeResponse>(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=de&format=json`
    );
    const place = geocode.results?.[0];
    if (!place) throw new Error("Location not found");

    const forecast = await fetchJson<ForecastResponse>(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&forecast_days=5&timezone=auto`
    );

    const currentWeather = weatherFor(forecast.current?.weather_code);
    const daily = forecast.daily;
    const labels = ["Heute", "Morgen", "Übermorgen", "Tag 4", "Tag 5"];

    return json(
      200,
      {
        location: [place.name, place.admin1, place.country].filter(Boolean).join(", "),
        temperature: forecast.current?.temperature_2m ?? 0,
        condition: currentWeather.condition,
        icon: currentWeather.icon,
        high: daily?.temperature_2m_max?.[0] ?? forecast.current?.temperature_2m ?? 0,
        low: daily?.temperature_2m_min?.[0] ?? forecast.current?.temperature_2m ?? 0,
        rainProbability: daily?.precipitation_probability_max?.[0] ?? 0,
        windKph: forecast.current?.wind_speed_10m,
        forecast:
          daily?.time?.map((_, index) => {
            const dayWeather = weatherFor(daily.weather_code[index]);
            return {
              label: labels[index] ?? `Tag ${index + 1}`,
              high: daily.temperature_2m_max[index],
              low: daily.temperature_2m_min[index],
              icon: dayWeather.icon,
              condition: dayWeather.condition
            };
          }) ?? [],
        hourly: hourlyForecast(forecast),
        updatedAt: new Date().toISOString()
      },
      900
    );
  } catch {
    return json(
      200,
      {
        location,
        temperature: 22,
        condition: "Wetter momentan nicht verfügbar",
        icon: "partly-cloudy",
        high: 24,
        low: 16,
        rainProbability: 0,
        forecast: [],
        hourly: [],
        updatedAt: new Date().toISOString()
      },
      120
    );
  }
};
