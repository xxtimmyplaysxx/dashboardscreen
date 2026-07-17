export type ContentType =
  | "clock"
  | "date"
  | "clockDate"
  | "greeting"
  | "weather"
  | "weatherForecast"
  | "newsSwiss"
  | "newsInternational"
  | "newsTech"
  | "newsBusiness"
  | "newsSport"
  | "formula1"
  | "natureImage"
  | "carImage"
  | "spaceImage"
  | "quote"
  | "fact"
  | "finance"
  | "crypto";

export type TileSize = "small" | "medium" | "large" | "fullscreen";

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
  rainProbability: number;
  windKph?: number;
  forecast: Array<{
    label: string;
    high: number;
    low: number;
    icon: string;
    condition: string;
  }>;
  hourly?: Array<{
    label: string;
    temperature: number;
    rainProbability: number;
    icon: string;
    condition: string;
  }>;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  category: string;
  publishedAt: string;
  image?: string;
  url?: string;
  author?: string;
  domain?: string;
  tags?: string[];
}

export interface ImageItem {
  id: string;
  url: string;
  alt: string;
  category: string;
  source: string;
  photographer?: string;
  location?: string;
  title?: string;
  link?: string;
}

export interface FinanceQuote {
  symbol: string;
  name: string;
  value: string;
  changePercent: number;
  currency?: string;
  updatedAt: string;
  type: "stock" | "crypto" | "index";
}

export interface TextSnippet {
  id: string;
  text: string;
  author?: string;
  category: "quote" | "fact";
}

export interface ContentResources {
  weather?: WeatherData;
  news: NewsItem[];
  images: ImageItem[];
  finance: FinanceQuote[];
  quotes: TextSnippet[];
  facts: TextSnippet[];
  updatedAt?: string;
  errors: Partial<Record<"weather" | "news" | "images" | "finance", string>>;
}

export interface ContentOption {
  type: ContentType;
  label: string;
  description: string;
  allowedSizes: TileSize[];
}
