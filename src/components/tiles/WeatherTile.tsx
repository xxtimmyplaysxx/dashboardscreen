import type { TileSize, WeatherData } from "../../types/content";
import { TileFrame } from "./TileFrame";

const weatherSymbols: Record<string, string> = {
  sunny: "Sonne",
  cloudy: "Wolken",
  "partly-cloudy": "Sonne und Wolken",
  rain: "Regen",
  snow: "Schnee",
  fog: "Nebel",
  storm: "Gewitter"
};

function WeatherGlyph({ icon }: { icon: string }) {
  const label = weatherSymbols[icon] ?? "Wetter";
  return (
    <span className={`weather-glyph weather-${icon}`} aria-label={label}>
      <span className="weather-sun" />
      <span className="weather-cloud" />
      <span className="weather-fog-lines" />
      <span className="weather-rain-drops">
        <i />
        <i />
        <i />
      </span>
      <span className="weather-snowflakes">
        <i />
        <i />
        <i />
      </span>
      <span className="weather-bolt" />
    </span>
  );
}

export function WeatherTile({ size, weather }: { size: TileSize; weather?: WeatherData }) {
  if (!weather) {
    return (
      <TileFrame size={size} className="tile-muted">
        <p className="eyebrow">Wetter</p>
        <h2 className="tile-title-small">Wetter momentan nicht verfügbar</h2>
      </TileFrame>
    );
  }

  return (
    <TileFrame size={size} className="weather-tile" ariaLabel={`Wetter in ${weather.location}`}>
      <div className="weather-topline">
        <div>
          <p className="eyebrow">{weather.location}</p>
          <h2 className="weather-temp">{Math.round(weather.temperature)}°</h2>
        </div>
        <WeatherGlyph icon={weather.icon} />
      </div>
      <p className="tile-copy">{weather.condition}</p>
      {size !== "small" && (
        <div className="metric-row">
          <span>H {Math.round(weather.high)}°</span>
          <span>T {Math.round(weather.low)}°</span>
          <span>Regen {weather.rainProbability}%</span>
        </div>
      )}
    </TileFrame>
  );
}

export function WeatherForecastTile({ size, weather }: { size: TileSize; weather?: WeatherData }) {
  if (!weather) return <WeatherTile size={size} weather={weather} />;
  return (
    <TileFrame size={size} className="weather-tile" ariaLabel="Wettervorhersage">
      <p className="eyebrow">Vorhersage</p>
      <h2 className="tile-title-small">{weather.location}</h2>
      <div className="forecast-list">
        {weather.forecast.slice(0, size === "medium" ? 3 : 5).map((day) => (
          <div className="forecast-row" key={day.label}>
            <span>{day.label}</span>
            <span>{day.condition}</span>
            <strong>
              {Math.round(day.high)}° / {Math.round(day.low)}°
            </strong>
          </div>
        ))}
      </div>
    </TileFrame>
  );
}
