import type { Handler } from "@netlify/functions";
import { fetchJson, json, optionsResponse } from "./_utils";

const curated = [
  ["Schweizer Alpen", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=82", "Ruhige Berglandschaft"],
  ["Berge", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=82", "See vor Bergen"],
  ["Seen", "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1800&q=82", "Klarer See"],
  ["Wälder", "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1800&q=82", "Wald im Morgenlicht"],
  ["Sportwagen", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=82", "Sportwagen"],
  ["Porsche", "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1800&q=82", "Porsche auf einer Strasse"],
  ["Autos", "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1800&q=82", "Automobil Detail"],
  ["Weltraum", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=82", "Weltraumnebel"],
  ["Planeten", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=82", "Erde aus dem Orbit"],
  ["moderne Architektur", "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=82", "Moderne Architektur"],
  ["Technologie", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=82", "Technisches Muster"],
  ["abstrakte minimalistische Hintergründe", "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1800&q=82", "Minimalistischer Hintergrund"]
] as const;

interface UnsplashResponse {
  results: Array<{
    id: string;
    alt_description?: string;
    urls: { regular: string };
    user: { name: string; links?: { html?: string } };
    links?: { html?: string };
  }>;
}

interface NasaApod {
  media_type?: string;
  title?: string;
  url?: string;
  hdurl?: string;
  copyright?: string;
}

function curatedImages(categories: string[]) {
  const lowered = categories.map((category) => category.toLowerCase());
  const selected = curated.filter(([category]) => lowered.length === 0 || lowered.some((item) => category.toLowerCase().includes(item)));
  return (selected.length ? selected : curated).map(([category, url, alt], index) => ({
    id: `curated-${index}`,
    url,
    alt,
    category,
    source: "Unsplash",
    photographer: "Kuratierte Quelle"
  }));
}

async function loadUnsplash(categories: string[]) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  const query = categories.slice(0, 3).join(" ") || "minimal nature";
  const data = await fetchJson<UnsplashResponse>(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=12&client_id=${key}`
  );
  return data.results.map((photo) => ({
    id: photo.id,
    url: photo.urls.regular,
    alt: photo.alt_description || query,
    category: query,
    source: "Unsplash",
    photographer: photo.user.name,
    link: photo.links?.html ?? photo.user.links?.html
  }));
}

async function loadNasaIfNeeded(categories: string[]) {
  const wantsSpace = categories.some((category) => /weltraum|planet|galax|nebel/i.test(category));
  if (!wantsSpace) return [];
  const key = process.env.NASA_API_KEY || "DEMO_KEY";
  const data = await fetchJson<NasaApod>(`https://api.nasa.gov/planetary/apod?api_key=${key}&thumbs=true`);
  if (data.media_type !== "image" || (!data.hdurl && !data.url)) return [];
  return [
    {
      id: `nasa-${new Date().toISOString().slice(0, 10)}`,
      url: data.hdurl ?? data.url ?? "",
      alt: data.title ?? "NASA Astronomy Picture of the Day",
      category: "Weltraum",
      source: "NASA APOD",
      photographer: data.copyright
    }
  ];
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return optionsResponse();

  const categories = (event.queryStringParameters?.categories ?? "")
    .split(",")
    .map((category) => category.trim())
    .filter(Boolean);

  try {
    const [unsplash, nasa] = await Promise.allSettled([loadUnsplash(categories), loadNasaIfNeeded(categories)]);
    const live = [
      ...(unsplash.status === "fulfilled" ? unsplash.value : []),
      ...(nasa.status === "fulfilled" ? nasa.value : [])
    ];
    return json(200, [...live, ...curatedImages(categories)].slice(0, 18), 1800);
  } catch {
    return json(200, curatedImages(categories), 600);
  }
};
