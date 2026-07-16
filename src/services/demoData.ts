import type { FinanceQuote, ImageItem, NewsItem, TextSnippet, WeatherData } from "../types/content";

export const demoWeather: WeatherData = {
  location: "Hedingen",
  temperature: 22,
  condition: "Leicht bewölkt",
  icon: "partly-cloudy",
  high: 25,
  low: 16,
  rainProbability: 18,
  windKph: 8,
  forecast: [
    { label: "Heute", high: 25, low: 16, icon: "partly-cloudy", condition: "Leicht bewölkt" },
    { label: "Morgen", high: 24, low: 15, icon: "sunny", condition: "Freundlich" },
    { label: "Samstag", high: 21, low: 14, icon: "rain", condition: "Schauer möglich" }
  ],
  updatedAt: new Date().toISOString()
};

export const demoNews: NewsItem[] = [
  {
    id: "demo-swiss-1",
    title: "Schweizer Unternehmen investieren stärker in digitale Arbeitsplätze",
    description: "Viele Betriebe modernisieren interne Abläufe und setzen auf einfache, lokal nutzbare Tools.",
    source: "Demo",
    category: "Schweiz",
    publishedAt: new Date().toISOString(),
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "demo-tech-1",
    title: "Neue Displays und sparsame Chips verbessern stationäre Tablet-Dashboards",
    description: "Helle Panels, lange Laufzeiten und gute Browserunterstützung machen Tablets zu robusten Anzeige-Geräten.",
    source: "Demo",
    category: "Technik",
    publishedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"
  },
  {
    id: "demo-business-1",
    title: "Märkte starten ruhig in den Handelstag",
    description: "Anleger achten weiter auf Unternehmenszahlen und Zinssignale.",
    source: "Demo",
    category: "Wirtschaft",
    publishedAt: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80"
  }
];

export const demoImages: ImageItem[] = [
  {
    id: "nature-alps",
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=82",
    alt: "Ruhige Berglandschaft bei Sonnenlicht",
    category: "Natur",
    source: "Unsplash",
    photographer: "Kuratierte Demo"
  },
  {
    id: "lake-mountains",
    url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=82",
    alt: "See vor Bergen",
    category: "Berge",
    source: "Unsplash",
    photographer: "Kuratierte Demo"
  },
  {
    id: "sports-car",
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=82",
    alt: "Sportwagen auf einer Strasse",
    category: "Sportwagen",
    source: "Unsplash",
    photographer: "Kuratierte Demo"
  },
  {
    id: "space-nebula",
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=82",
    alt: "Weltraumnebel",
    category: "Weltraum",
    source: "Unsplash",
    photographer: "Kuratierte Demo"
  },
  {
    id: "minimal-architecture",
    url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=82",
    alt: "Moderne Architektur mit klaren Linien",
    category: "moderne Architektur",
    source: "Unsplash",
    photographer: "Kuratierte Demo"
  }
];

export const demoFinance: FinanceQuote[] = [
  { symbol: "SMI", name: "Swiss Market Index", value: "12'180", changePercent: 0.32, currency: "CHF", updatedAt: new Date().toISOString(), type: "index" },
  { symbol: "S&P 500", name: "S&P 500", value: "5'625", changePercent: 0.18, currency: "USD", updatedAt: new Date().toISOString(), type: "index" },
  { symbol: "NASDAQ", name: "Nasdaq Composite", value: "18'420", changePercent: -0.11, currency: "USD", updatedAt: new Date().toISOString(), type: "index" },
  { symbol: "BTC", name: "Bitcoin", value: "64'200", changePercent: 1.24, currency: "USD", updatedAt: new Date().toISOString(), type: "crypto" },
  { symbol: "ETH", name: "Ethereum", value: "3'430", changePercent: 0.74, currency: "USD", updatedAt: new Date().toISOString(), type: "crypto" }
];

export const quotes: TextSnippet[] = [
  {
    id: "quote-1",
    text: "Qualität entsteht, wenn jedes Detail eine Aufgabe hat.",
    author: "Dashboard",
    category: "quote"
  },
  {
    id: "quote-2",
    text: "Ein guter Arbeitsplatz macht wichtige Informationen sichtbar, ohne laut zu werden.",
    author: "Dashboard",
    category: "quote"
  },
  {
    id: "quote-3",
    text: "Ruhe im Interface schafft Aufmerksamkeit für das Wesentliche.",
    author: "Dashboard",
    category: "quote"
  }
];

export const facts: TextSnippet[] = [
  {
    id: "fact-1",
    text: "Open-Meteo kann Wetterdaten ohne klassischen API-Schlüssel bereitstellen.",
    category: "fact"
  },
  {
    id: "fact-2",
    text: "Eine PWA kann auf iPadOS im Standalone-Modus ohne sichtbare Browserleiste starten.",
    category: "fact"
  },
  {
    id: "fact-3",
    text: "Lokale Browser-Einstellungen bleiben gerätebezogen und benötigen kein Benutzerkonto.",
    category: "fact"
  }
];
