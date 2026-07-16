# Bildschirmdashboard

Eine helle, tablet-optimierte Dashboard-Web-App mit React, TypeScript, Vite, lokaler Konfiguration, PWA-Unterstützung und Netlify Functions.

## Funktionen

- Ersteinrichtungsassistent mit Name, Wetterort, Interessen, Bildkategorien, Layout, Kachelbelegung, Rotation und Arbeitszeiten
- Lokale Speicherung pro Gerät über `localStorage`
- Versionierte Konfiguration mit Migrationslogik
- Sechs Layouts: Apple Minimal, Balanced Grid, Focus, Information, Fullscreen Rotation und Hybrid
- Frei belegbare Kacheln mit Grössenvalidierung
- Uhr, Datum, Begrüssung, Wetter, News, Bilder, Weltraum, Zitate, Fakten, Börse und Kryptowährungen
- Automatische Rotation zwischen 10 und 30 Sekunden
- Wischgesten für vorherige und nächste Ansicht
- Offline-Hinweis und PWA-Service-Worker
- Export und Import der vollständigen Konfiguration als JSON
- Netlify Functions für Wetter, News, Bilder und Finanzdaten

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Die App läuft danach standardmässig unter `http://localhost:5173`.

Für einen Produktionsbuild:

```bash
npm run build
```

## Netlify Deployment

Das Projekt ist direkt für Netlify vorbereitet.

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Node version: `22`
- Konfiguration: `netlify.toml`

Die App nutzt zusätzlich den Redirect `/api/* -> /.netlify/functions/:splat`, damit das Frontend kurze API-Routen verwenden kann.

## Optionale Environment Variables

Die App funktioniert auch ohne Schlüssel mit kuratierten Demo- und Fallback-Daten.

```bash
UNSPLASH_ACCESS_KEY=
NASA_API_KEY=
```

`UNSPLASH_ACCESS_KEY` aktiviert Live-Bildsuche über Unsplash. `NASA_API_KEY` erhöht das Limit für NASA APOD. Ohne NASA-Key wird `DEMO_KEY` verwendet.

## Datenschutz

Es gibt keine Anmeldung, keine Datenbank und keine zentrale Benutzerverwaltung. Einstellungen bleiben lokal im Browser des jeweiligen Geräts. Mehrere Tablets können dieselbe Netlify-Seite öffnen und unabhängig voneinander konfiguriert werden.

## Datenquellen und Fallbacks

- Wetter: Open-Meteo Geocoding und Forecast
- News: öffentliche RSS-/Atom-Feeds, vereinheitlicht über Netlify Functions
- Bilder: optionale Unsplash API, NASA APOD und kuratierte Fallback-Bilder
- Krypto: CoinGecko Simple Price
- Börsenindizes: Yahoo Finance Quote API mit Fallback-Werten

Bei nicht erreichbaren Quellen zeigt die App ruhige, verständliche Hinweise oder zuletzt gecachte Inhalte statt technischer Fehlermeldungen.
