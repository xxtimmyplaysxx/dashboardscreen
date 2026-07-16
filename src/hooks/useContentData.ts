import { useEffect, useMemo, useState } from "react";
import { facts, quotes } from "../services/demoData";
import { getFinance } from "../services/financeService";
import { getImages } from "../services/imageService";
import { getNews } from "../services/newsService";
import { getWeather } from "../services/weatherService";
import type { ContentResources } from "../types/content";
import type { DashboardSettings } from "../types/settings";

const INITIAL_DATA: ContentResources = {
  news: [],
  images: [],
  finance: [],
  quotes,
  facts,
  errors: {}
};

export function useContentData(settings: DashboardSettings, online: boolean): ContentResources {
  const [resources, setResources] = useState<ContentResources>(INITIAL_DATA);

  const dependencies = useMemo(
    () => ({
      location: settings.location,
      sources: settings.newsSources.join(","),
      categories: settings.newsCategories.join(","),
      images: settings.imageCategories.join(",")
    }),
    [settings.imageCategories, settings.location, settings.newsCategories, settings.newsSources]
  );

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function loadAll() {
      const errors: ContentResources["errors"] = {};
      const [weatherResult, newsResult, imageResult, financeResult] = await Promise.allSettled([
        getWeather(settings.location, controller.signal),
        getNews(settings, controller.signal),
        getImages(settings.imageCategories, controller.signal),
        getFinance(controller.signal)
      ]);

      if (!mounted) return;
      setResources((current) => {
        const next: ContentResources = {
          ...current,
          updatedAt: new Date().toISOString(),
          errors
        };

        if (weatherResult.status === "fulfilled") next.weather = weatherResult.value;
        else errors.weather = "Wetter momentan nicht verfügbar";

        if (newsResult.status === "fulfilled") next.news = newsResult.value;
        else errors.news = "Neue Nachrichten konnten nicht geladen werden";

        if (imageResult.status === "fulfilled") next.images = imageResult.value;
        else errors.images = "Bilder konnten nicht geladen werden";

        if (financeResult.status === "fulfilled") next.finance = financeResult.value;
        else errors.finance = "Kurse momentan nicht verfügbar";

        return next;
      });
    }

    loadAll();
    const timer = window.setInterval(loadAll, online ? 1000 * 60 * 10 : 1000 * 60 * 2);

    return () => {
      mounted = false;
      controller.abort();
      window.clearInterval(timer);
    };
  }, [dependencies.categories, dependencies.images, dependencies.location, dependencies.sources, online, settings]);

  return resources;
}
