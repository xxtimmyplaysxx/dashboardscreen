import { demoImages } from "./demoData";
import { fetchJsonWithCache } from "./api";
import type { ImageItem } from "../types/content";

export function getImages(categories: string[], signal?: AbortSignal): Promise<ImageItem[]> {
  const normalized = categories.length ? categories : ["Natur", "Berge", "Seen"];
  const freshness = Math.floor(Date.now() / (1000 * 60 * 15)).toString();
  const params = new URLSearchParams({ categories: normalized.join(","), freshness });
  return fetchJsonWithCache<ImageItem[]>(`/api/images?${params.toString()}`, {
    cacheKey: `images.${normalized.join("-").toLowerCase()}.${freshness}`,
    maxAgeMs: 1000 * 60 * 15,
    fallback: demoImages,
    signal
  });
}
