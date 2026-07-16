import { CONTENT_OPTIONS } from "../../config/catalog";
import type { ContentResources, ContentType, NewsItem } from "../../types/content";
import type { DashboardTile } from "../../types/dashboard";
import type { DashboardSettings } from "../../types/settings";
import { ClockTile } from "../tiles/ClockTile";
import { CryptoTile, FinanceTile } from "../tiles/FinanceTile";
import { DateTile } from "../tiles/DateTile";
import { FactTile } from "../tiles/FactTile";
import { GreetingTile } from "../tiles/GreetingTile";
import { CarImageTile, NatureImageTile, SpaceImageTile } from "../tiles/ImageTiles";
import { NewsFullscreenView, NewsTile } from "../tiles/NewsTile";
import { QuoteTile } from "../tiles/QuoteTile";
import { WeatherForecastTile, WeatherTile } from "../tiles/WeatherTile";

const newsCategoryByType: Partial<Record<ContentType, string[]>> = {
  newsSwiss: ["schweiz", "swiss"],
  newsInternational: ["international", "world"],
  newsTech: ["technik", "tech", "it"],
  newsBusiness: ["wirtschaft", "business"],
  newsSport: ["sport"],
  formula1: ["formel", "formula", "f1", "motorsport"]
};

function optionLabel(type: ContentType): string {
  return CONTENT_OPTIONS.find((option) => option.type === type)?.label ?? "Inhalt";
}

function filterNews(items: NewsItem[], type: ContentType): NewsItem[] {
  const keys = newsCategoryByType[type];
  if (!keys) return items;
  const filtered = items.filter((item) => {
    const text = `${item.category} ${item.source} ${item.title}`.toLowerCase();
    return keys.some((key) => text.includes(key));
  });
  return filtered.length ? filtered : items;
}

interface TileRendererProps {
  tile: DashboardTile;
  data: ContentResources;
  settings: DashboardSettings;
  rotationIndex: number;
}

export function TileRenderer({ tile, data, settings, rotationIndex }: TileRendererProps) {
  switch (tile.contentType) {
    case "clock":
      return <ClockTile size={tile.size} />;
    case "date":
      return <DateTile size={tile.size} />;
    case "clockDate":
      return <ClockTile size={tile.size} userName={settings.userName} withDate withGreeting={tile.size !== "small"} />;
    case "greeting":
      return <GreetingTile size={tile.size} userName={settings.userName} />;
    case "weather":
      return <WeatherTile size={tile.size} weather={data.weather} />;
    case "weatherForecast":
      return <WeatherForecastTile size={tile.size} weather={data.weather} />;
    case "newsSwiss":
    case "newsInternational":
    case "newsTech":
    case "newsBusiness":
    case "newsSport":
    case "formula1": {
      const items = filterNews(data.news, tile.contentType);
      if (tile.size === "fullscreen") {
        return <NewsFullscreenView items={items} index={rotationIndex} label={optionLabel(tile.contentType)} />;
      }
      return <NewsTile size={tile.size} items={items} index={rotationIndex} label={optionLabel(tile.contentType)} />;
    }
    case "natureImage":
      return <NatureImageTile size={tile.size} images={data.images} index={rotationIndex} />;
    case "carImage":
      return <CarImageTile size={tile.size} images={data.images} index={rotationIndex} />;
    case "spaceImage":
      return <SpaceImageTile size={tile.size} images={data.images} index={rotationIndex} />;
    case "quote":
      return <QuoteTile size={tile.size} quotes={data.quotes} index={rotationIndex} />;
    case "fact":
      return <FactTile size={tile.size} facts={data.facts} index={rotationIndex} />;
    case "finance":
      return <FinanceTile size={tile.size} quotes={data.finance} />;
    case "crypto":
      return <CryptoTile size={tile.size} quotes={data.finance} />;
    default:
      return <ClockTile size={tile.size} />;
  }
}
