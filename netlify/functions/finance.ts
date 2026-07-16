import type { Handler } from "@netlify/functions";
import { fetchJson, json, optionsResponse } from "./_utils";

interface CoinGeckoResponse {
  bitcoin?: { usd: number; usd_24h_change: number; last_updated_at: number };
  ethereum?: { usd: number; usd_24h_change: number; last_updated_at: number };
}

interface YahooResponse {
  quoteResponse?: {
    result?: Array<{
      symbol: string;
      shortName?: string;
      regularMarketPrice?: number;
      regularMarketChangePercent?: number;
      currency?: string;
    }>;
  };
}

function formatValue(value: number | undefined): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "n/a";
  return new Intl.NumberFormat("de-CH", { maximumFractionDigits: value > 100 ? 0 : 2 }).format(value);
}

const fallbackIndices = [
  { symbol: "SMI", name: "Swiss Market Index", value: "12'180", changePercent: 0.32, currency: "CHF", type: "index" },
  { symbol: "S&P 500", name: "S&P 500", value: "5'625", changePercent: 0.18, currency: "USD", type: "index" },
  { symbol: "NASDAQ", name: "Nasdaq Composite", value: "18'420", changePercent: -0.11, currency: "USD", type: "index" }
] as const;

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return optionsResponse();

  const updatedAt = new Date().toISOString();

  const [cryptoResult, yahooResult] = await Promise.allSettled([
    fetchJson<CoinGeckoResponse>(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true"
    ),
    fetchJson<YahooResponse>("https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5ESSMI,%5EGSPC,%5EIXIC")
  ]);

  const indices =
    yahooResult.status === "fulfilled" && yahooResult.value.quoteResponse?.result?.length
      ? yahooResult.value.quoteResponse.result.map((quote) => ({
          symbol: quote.symbol.replace("^", ""),
          name: quote.shortName ?? quote.symbol,
          value: formatValue(quote.regularMarketPrice),
          changePercent: quote.regularMarketChangePercent ?? 0,
          currency: quote.currency,
          type: "index" as const,
          updatedAt
        }))
      : fallbackIndices.map((quote) => ({ ...quote, updatedAt }));

  const crypto =
    cryptoResult.status === "fulfilled"
      ? [
          {
            symbol: "BTC",
            name: "Bitcoin",
            value: formatValue(cryptoResult.value.bitcoin?.usd),
            changePercent: cryptoResult.value.bitcoin?.usd_24h_change ?? 0,
            currency: "USD",
            type: "crypto" as const,
            updatedAt
          },
          {
            symbol: "ETH",
            name: "Ethereum",
            value: formatValue(cryptoResult.value.ethereum?.usd),
            changePercent: cryptoResult.value.ethereum?.usd_24h_change ?? 0,
            currency: "USD",
            type: "crypto" as const,
            updatedAt
          }
        ]
      : [
          { symbol: "BTC", name: "Bitcoin", value: "64'200", changePercent: 1.24, currency: "USD", type: "crypto" as const, updatedAt },
          { symbol: "ETH", name: "Ethereum", value: "3'430", changePercent: 0.74, currency: "USD", type: "crypto" as const, updatedAt }
        ];

  return json(200, [...indices, ...crypto], 300);
};
