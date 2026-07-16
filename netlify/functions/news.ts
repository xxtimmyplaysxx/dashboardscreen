import type { Handler } from "@netlify/functions";
import { XMLParser } from "fast-xml-parser";
import { json, optionsResponse, stripHtml } from "./_utils";

const feeds = [
  { id: "srf", source: "SRF", category: "Schweiz", url: "https://www.srf.ch/news/bnf/rss/1646" },
  { id: "20min", source: "20 Minuten", category: "Schweiz", url: "https://www.20min.ch/rss" },
  { id: "tagi", source: "Tages-Anzeiger", category: "Schweiz", url: "https://www.tagesanzeiger.ch/rss.html" },
  { id: "blick", source: "Blick", category: "Schweiz", url: "https://www.blick.ch/news/rss.xml" },
  { id: "heise", source: "Heise", category: "Technik", url: "https://www.heise.de/rss/heise-atom.xml" },
  { id: "formula1", source: "Formula 1", category: "Formel 1", url: "https://www.formula1.com/en/latest/all.xml" }
];

const demo = [
  {
    id: "fallback-1",
    title: "Nachrichten momentan nur aus dem Zwischenspeicher verfügbar",
    description: "Die App zeigt automatisch neue Meldungen an, sobald die Quellen erreichbar sind.",
    source: "Dashboard",
    category: "Schweiz",
    publishedAt: new Date().toISOString()
  }
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text"
});

function asArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value: unknown): string {
  if (typeof value === "string") return stripHtml(value);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record["#text"] === "string") return stripHtml(record["#text"]);
    if (typeof record["@_url"] === "string") return record["@_url"];
  }
  return "";
}

function imageFrom(item: Record<string, unknown>): string | undefined {
  const media = item["media:content"] as Record<string, unknown> | undefined;
  const thumbnail = item["media:thumbnail"] as Record<string, unknown> | undefined;
  const enclosure = item.enclosure as Record<string, unknown> | undefined;
  return [media?.["@_url"], thumbnail?.["@_url"], enclosure?.["@_url"]].find((value): value is string => typeof value === "string");
}

async function loadFeed(feed: (typeof feeds)[number]) {
  const response = await fetch(feed.url, {
    headers: {
      accept: "application/rss+xml, application/atom+xml, text/xml",
      "user-agent": "SignakomDashboard/1.0"
    }
  });
  if (!response.ok) throw new Error("Feed failed");
  const parsed = parser.parse(await response.text()) as Record<string, unknown>;
  const rss = parsed.rss as Record<string, unknown> | undefined;
  const channel = rss?.channel as Record<string, unknown> | undefined;
  const atom = parsed.feed as Record<string, unknown> | undefined;
  const items = asArray((channel?.item ?? atom?.entry) as Record<string, unknown> | Record<string, unknown>[] | undefined);

  return items.slice(0, 10).map((item, index) => ({
    id: `${feed.id}-${text(item.guid ?? item.id ?? item.link ?? item.title) || index}`,
    title: text(item.title) || "Nachricht",
    description: text(item.description ?? item.summary ?? item.content).slice(0, 220),
    source: feed.source,
    category: feed.category,
    publishedAt: text(item.pubDate ?? item.published ?? item.updated) || new Date().toISOString(),
    image: imageFrom(item),
    url: text(item.link)
  }));
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return optionsResponse();

  const selectedSources = new Set((event.queryStringParameters?.sources ?? "").split(",").filter(Boolean));
  const selected = feeds.filter((feed) => selectedSources.size === 0 || selectedSources.has(feed.id));

  try {
    const settled = await Promise.allSettled(selected.map(loadFeed));
    const items = settled
      .filter((result): result is PromiseFulfilledResult<Awaited<ReturnType<typeof loadFeed>>> => result.status === "fulfilled")
      .flatMap((result) => result.value)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 40);

    return json(200, items.length ? items : demo, 300);
  } catch {
    return json(200, demo, 120);
  }
};
