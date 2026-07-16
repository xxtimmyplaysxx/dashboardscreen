import { loadCache, saveCache } from "./storageService";

interface CacheOptions<T> {
  cacheKey: string;
  maxAgeMs: number;
  fallback: T;
  signal?: AbortSignal;
}

export async function fetchJsonWithCache<T>(url: string, options: CacheOptions<T>): Promise<T> {
  const cached = loadCache<T>(options.cacheKey);
  const fresh = cached && Date.now() - cached.timestamp < options.maxAgeMs;
  if (fresh) return cached.data;

  try {
    const response = await fetch(url, {
      signal: options.signal,
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("request failed");
    const data = (await response.json()) as T;
    saveCache(options.cacheKey, data);
    return data;
  } catch (error) {
    if ((error as DOMException).name === "AbortError") throw error;
    return cached?.data ?? options.fallback;
  }
}
