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

function MiniWeatherGlyph({ icon }: { icon: string }) {
  return (
    <span className="weather-mini">
      <WeatherGlyph icon={icon} />
    </span>
  );
}

function WeatherUnavailable({ size }: { size: TileSize }) {
  return (
    <TileFrame size={size} className="tile-muted">
      <p className="eyebrow">Wetter</p>
      <h2 className="tile-title-small">Wetter momentan nicht verfuegbar</h2>
    </TileFrame>
  );
}

function WeatherFullscreen({ weather }: { weather: WeatherData }) {
  const hourly = weather.hourly?.slice(0, 12) ?? [];
  const forecast = weather.forecast.slice(0, 5);

  return (
    <TileFrame size="fullscreen" className="weather-tile weather-fullscreen" ariaLabel={`Wetter in ${weather.location}`}>
      <div className="weather-hero">
        <div className="weather-current">
          <p className="eyebrow">Aktuelles Wetter</p>
          <h1>{weather.location}</h1>
          <div className="weather-current-line">
            <span className="weather-temp">{Math.round(weather.temperature)}&deg;</span>
            <WeatherGlyph icon={weather.icon} />
          </div>
          <p className="weather-condition-large">{weather.condition}</p>
        </div>

        <div className="weather-detail-card" aria-label="Wetterdetails">
          <div>
            <span>Hoechstwert</span>
            <strong>{Math.round(weather.high)}&deg;</strong>
          </div>
          <div>
            <span>Tiefstwert</span>
            <strong>{Math.round(weather.low)}&deg;</strong>
          </div>
          <div>
            <span>Regen</span>
            <strong>{weather.rainProbability}%</strong>
          </div>
          <div>
            <span>Wind</span>
            <strong>{weather.windKph ? `${Math.round(weather.windKph)} km/h` : "-"}</strong>
          </div>
        </div>
      </div>

      <div className="weather-panels">
        <section className="weather-panel" aria-label="Tagesverlauf">
          <div className="weather-panel-heading">
            <p className="eyebrow">Heute</p>
            <h2>Tagesverlauf</h2>
          </div>
          <div className="hourly-strip">
            {(hourly.length ? hourly : fallbackHours(weather)).map((hour) => (
              <div className="hourly-card" key={hour.label}>
                <span>{hour.label}</span>
                <MiniWeatherGlyph icon={hour.icon} />
                <strong>{Math.round(hour.temperature)}&deg;</strong>
                <small>{hour.rainProbability}% Regen</small>
              </div>
            ))}
          </div>
        </section>

        <section className="weather-panel" aria-label="Vorhersage">
          <div className="weather-panel-heading">
            <p className="eyebrow">Ausblick</p>
            <h2>Naechste Tage</h2>
          </div>
          <div className="daily-grid">
            {(forecast.length ? forecast : fallbackForecast(weather)).map((day) => (
              <div className="daily-card" key={day.label}>
                <span>{day.label}</span>
                <MiniWeatherGlyph icon={day.icon} />
                <strong>
                  {Math.round(day.high)}&deg; / {Math.round(day.low)}&deg;
                </strong>
                <small>{day.condition}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </TileFrame>
  );
}

function fallbackHours(weather: WeatherData) {
  return ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"].map((label, index) => ({
    label,
    temperature: weather.temperature + index * 0.4,
    rainProbability: weather.rainProbability,
    icon: weather.icon,
    condition: weather.condition
  }));
}

function fallbackForecast(weather: WeatherData) {
  return [
    { label: "Heute", high: weather.high, low: weather.low, icon: weather.icon, condition: weather.condition },
    { label: "Morgen", high: weather.high - 1, low: weather.low, icon: weather.icon, condition: weather.condition },
    { label: "Tag 3", high: weather.high - 2, low: weather.low - 1, icon: weather.icon, condition: weather.condition }
  ];
}

export function WeatherTile({ size, weather }: { size: TileSize; weather?: WeatherData }) {
  if (!weather) return <WeatherUnavailable size={size} />;
  if (size === "fullscreen") return <WeatherFullscreen weather={weather} />;

  return (
    <TileFrame size={size} className="weather-tile" ariaLabel={`Wetter in ${weather.location}`}>
      <div className="weather-topline">
        <div>
          <p className="eyebrow">{weather.location}</p>
          <h2 className="weather-temp">{Math.round(weather.temperature)}&deg;</h2>
        </div>
        <WeatherGlyph icon={weather.icon} />
      </div>
      <p className="tile-copy">{weather.condition}</p>
      {size !== "small" && (
        <div className="metric-row">
          <span>H {Math.round(weather.high)}&deg;</span>
          <span>T {Math.round(weather.low)}&deg;</span>
          <span>Regen {weather.rainProbability}%</span>
        </div>
      )}
    </TileFrame>
  );
}

export function WeatherForecastTile({ size, weather }: { size: TileSize; weather?: WeatherData }) {
  if (!weather) return <WeatherUnavailable size={size} />;
  if (size === "fullscreen") return <WeatherFullscreen weather={weather} />;

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
              {Math.round(day.high)}&deg; / {Math.round(day.low)}&deg;
            </strong>
          </div>
        ))}
      </div>
    </TileFrame>
  );
}
