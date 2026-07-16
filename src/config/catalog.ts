import type { ContentOption, ContentType } from "../types/content";

export const CONTENT_OPTIONS: ContentOption[] = [
  { type: "clock", label: "Uhr", description: "Grosse digitale Uhr", allowedSizes: ["small", "medium", "large", "fullscreen"] },
  { type: "date", label: "Datum", description: "Wochentag und Datum", allowedSizes: ["small", "medium", "large", "fullscreen"] },
  { type: "clockDate", label: "Uhr und Datum", description: "Kombinierte Zeitansicht", allowedSizes: ["medium", "large", "fullscreen"] },
  { type: "greeting", label: "Begrüssung", description: "Persönliche Tagesbegrüssung", allowedSizes: ["small", "medium", "large", "fullscreen"] },
  { type: "weather", label: "Wetter", description: "Aktuelles Wetter", allowedSizes: ["small", "medium", "large"] },
  { type: "weatherForecast", label: "Wettervorhersage", description: "Mehrere Tage im Überblick", allowedSizes: ["medium", "large"] },
  { type: "newsSwiss", label: "Schweizer News", description: "Nachrichten aus der Schweiz", allowedSizes: ["small", "medium", "large", "fullscreen"] },
  { type: "newsInternational", label: "Internationale News", description: "Internationale Schlagzeilen", allowedSizes: ["small", "medium", "large", "fullscreen"] },
  { type: "newsTech", label: "Technik-News", description: "IT und Technologie", allowedSizes: ["small", "medium", "large", "fullscreen"] },
  { type: "newsBusiness", label: "Wirtschaft", description: "Märkte und Unternehmen", allowedSizes: ["small", "medium", "large"] },
  { type: "newsSport", label: "Sport", description: "Sportmeldungen", allowedSizes: ["small", "medium", "large"] },
  { type: "formula1", label: "Formel 1", description: "Motorsport und F1", allowedSizes: ["small", "medium", "large", "fullscreen"] },
  { type: "natureImage", label: "Naturbild", description: "Ruhige Landschaften", allowedSizes: ["medium", "large", "fullscreen"] },
  { type: "carImage", label: "Autobild", description: "Sportwagen und Automobile", allowedSizes: ["medium", "large", "fullscreen"] },
  { type: "spaceImage", label: "Weltraumbild", description: "NASA und kuratierte Motive", allowedSizes: ["medium", "large", "fullscreen"] },
  { type: "quote", label: "Zitat", description: "Kurze seriöse Zitate", allowedSizes: ["medium", "large", "fullscreen"] },
  { type: "fact", label: "Fakt des Tages", description: "Wissenswerte kurze Fakten", allowedSizes: ["medium", "large", "fullscreen"] },
  { type: "finance", label: "Börse", description: "Indizes und ausgewählte Werte", allowedSizes: ["medium", "large"] },
  { type: "crypto", label: "Krypto", description: "Bitcoin und Ethereum", allowedSizes: ["small", "medium", "large"] }
];

export const NEWS_SOURCES = [
  { id: "srf", label: "SRF" },
  { id: "20min", label: "20 Minuten" },
  { id: "tagi", label: "Tages-Anzeiger" },
  { id: "blick", label: "Blick" },
  { id: "heise", label: "Heise" },
  { id: "formula1", label: "Formel 1" }
];

export const NEWS_CATEGORIES = [
  { id: "swiss", label: "Schweiz", contentType: "newsSwiss" },
  { id: "international", label: "International", contentType: "newsInternational" },
  { id: "tech", label: "Technik und IT", contentType: "newsTech" },
  { id: "business", label: "Wirtschaft", contentType: "newsBusiness" },
  { id: "sport", label: "Sport", contentType: "newsSport" },
  { id: "formula1", label: "Formel 1", contentType: "formula1" }
] satisfies Array<{ id: string; label: string; contentType: ContentType }>;

export const IMAGE_CATEGORIES = [
  "Schweizer Alpen",
  "Berge",
  "Seen",
  "Meer",
  "Wälder",
  "Natur",
  "Tiere",
  "Sonnenaufgänge",
  "Sonnenuntergänge",
  "Schnee",
  "Winter",
  "Weltraum",
  "Planeten",
  "Städte",
  "moderne Architektur",
  "Luxushotels",
  "Reiseziele",
  "Porsche",
  "Sportwagen",
  "Autos",
  "Motorräder",
  "Technologie",
  "futuristische Städte",
  "abstrakte minimalistische Hintergründe"
];

export const ROTATION_OPTIONS = [10, 15, 20, 25, 30] as const;
