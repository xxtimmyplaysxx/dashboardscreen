import { demoNews } from "./demoData";
import { fetchJsonWithCache } from "./api";
import type { NewsItem } from "../types/content";
import type { DashboardSettings } from "../types/settings";

export function getNews(settings: DashboardSettings, signal?: AbortSignal): Promise<NewsItem[]> {
  const params = new URLSearchParams({
    sources: settings.newsSources.join(","),
    categories: settings.newsCategories.join(",")
  });

  return fetchJsonWithCache<NewsItem[]>(`/api/news?${params.toString()}`, {
    cacheKey: `news.${settings.newsSources.join("-")}.${settings.newsCategories.join("-")}`,
    maxAgeMs: 1000 * 60 * 8,
    fallback: demoNews,
    signal
  });
}
