import { demoFinance } from "./demoData";
import { fetchJsonWithCache } from "./api";
import type { FinanceQuote } from "../types/content";

export function getFinance(signal?: AbortSignal): Promise<FinanceQuote[]> {
  return fetchJsonWithCache<FinanceQuote[]>("/api/finance", {
    cacheKey: "finance.core",
    maxAgeMs: 1000 * 60 * 10,
    fallback: demoFinance,
    signal
  });
}
