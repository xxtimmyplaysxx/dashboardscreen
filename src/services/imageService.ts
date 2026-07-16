import { demoImages } from "./demoData";
import { fetchJsonWithCache } from "./api";
import type { ImageItem } from "../types/content";

export function getImages(categories: string[], signal?: AbortSignal): Promise<ImageItem[]> {
  const normalized = categories.length ? categories : ["Natur", "Berge", "Seen"];
  const params = new URLSearchParams({ categories: normalized.join(",") });
  return fetchJsonWithCache<ImageItem[]>(`/api/images?${params.toString()}`, {
    cacheKey: `images.${normalized.join("-").toLowerCase()}`,
    maxAgeMs: 1000 * 60 * 30,
    fallback: demoImages,
    signal
  });
}
