import type { Handler } from "@netlify/functions";
import { fetchJson, json, optionsResponse } from "./_utils";

const curated = [
  ["Schweizer Alpen", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=84", "Ruhige Berglandschaft", "Schweizer Alpen"],
  ["Berge", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2200&q=84", "See vor Bergen", "Moraine Lake, Kanada"],
  ["Seen", "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=2200&q=84", "Klarer See", "Bergsee"],
  ["Waelder", "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2200&q=84", "Wald im Morgenlicht", "Waldlandschaft"],
  ["Natur", "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2200&q=84", "Weite Landschaft", "Naturgebiet"],
  ["Natur", "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2200&q=84", "Tal mit Fluss", "Yosemite Valley, USA"],
  ["Schnee", "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=2200&q=84", "Winterlandschaft", "Winterberge"],
  ["Meer", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=84", "Kueste und Meer", "Kueste"],
  ["Sonnenuntergaenge", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2200&q=84", "Goldenes Abendlicht", "Wuestenlandschaft"],
  ["Reiseziele", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=2200&q=84", "Wuestenlandschaft", "Reiseziel"],
  ["Sportwagen", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=84", "Sportwagen", "Strasse"],
  ["Autos", "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=84", "Automobil Detail", "Studio"],
  ["Porsche", "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=2200&q=84", "Porsche auf einer Strasse", "Bergstrasse"],
  ["Sportwagen", "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=2200&q=84", "Rennwagen", "Rennstrecke"],
  ["Autos", "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=2200&q=84", "Auto bei Nacht", "Stadt bei Nacht"],
  ["Motorsport", "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=2200&q=84", "Sportwagen Cockpit", "Cockpit"],
  ["Autos", "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=2200&q=84", "Auto auf Strasse", "Landstrasse"],
  ["Sportwagen", "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=2200&q=84", "Sportwagen in Bewegung", "Strasse"],
  ["Weltraum", "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2200&q=84", "Weltraumnebel", "Weltraum"],
  ["Planeten", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=2200&q=84", "Erde aus dem Orbit", "Erdorbit"],
  ["Weltraum", "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=2200&q=84", "Sternenhimmel", "Sternenhimmel"],
  ["Galaxien", "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=2200&q=84", "Galaxie", "Galaxie"],
  ["Weltraum", "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=2200&q=84", "Sterne im All", "Weltraum"],
  ["moderne Architektur", "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=2200&q=84", "Moderne Architektur", "Architektur"],
  ["Staedte", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=84", "Stadtarchitektur", "Innenstadt"],
  ["Technologie", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2200&q=84", "Technisches Muster", "Technologie"],
  ["Technologie", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2200&q=84", "Laptop Arbeitsplatz", "Arbeitsplatz"],
  ["abstrakte minimalistische Hintergruende", "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2200&q=84", "Minimalistischer Hintergrund", "Abstrakt"],
  ["Luxushotels", "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=84", "Hotelpool", "Resort"],
  ["Reiseziele", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=84", "Reiseziel in den Bergen", "Bergregion"]
] as const;

interface UnsplashPhoto {
  id: string;
  alt_description?: string;
  urls: { regular: string };
  user: { name: string; links?: { html?: string } };
  links?: { html?: string };
  location?: {
    name?: string | null;
    city?: string | null;
    country?: string | null;
  } | null;
}

interface NasaApod {
  media_type?: string;
  title?: string;
  url?: string;
  hdurl?: string;
  copyright?: string;
}

function hash(value: string) {
  return value.split("").reduce((result, char) => ((result << 5) - result + char.charCodeAt(0)) | 0, 0);
}

function withFreshness(url: string, freshness: string, index: number) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}dashboard_fresh=${encodeURIComponent(`${freshness}-${index}`)}`;
}

function matchesSelection(category: string, alt: string, selected: string[]) {
  if (selected.length === 0) return true;
  const haystack = `${category} ${alt}`.toLowerCase();
  return selected.some((item) => {
    const lowered = item.toLowerCase();
    return haystack.includes(lowered) || lowered.includes(category.toLowerCase());
  });
}

function curatedImages(categories: string[], freshness: string) {
  const lowered = categories.map((category) => category.toLowerCase());
  const selected = curated.filter(([category, , alt]) => matchesSelection(category, alt, lowered));
  const salt = `${freshness}-${categories.join("|")}`;
  const sorted = [...(selected.length ? selected : curated)].sort((a, b) => hash(`${a[0]}-${a[1]}-${salt}`) - hash(`${b[0]}-${b[1]}-${salt}`));

  return sorted.map(([category, url, alt, location], index) => ({
    id: `curated-${Math.abs(hash(`${category}-${url}`))}`,
    url: withFreshness(url, freshness, index),
    alt,
    category,
    source: "Unsplash",
    photographer: "Kuratierte Quelle",
    location,
    title: alt
  }));
}

function rotatingOpenImages(categories: string[], freshness: string) {
  const wantsOpen = categories.length === 0 || categories.some((category) => /natur|berge|see|meer|stadt|architektur|technologie|reise/i.test(category));
  if (!wantsOpen) return [];

  return Array.from({ length: 8 }).map((_, index) => ({
    id: `picsum-${freshness}-${index}`,
    url: `https://picsum.photos/seed/dashboard-${encodeURIComponent(freshness)}-${index}/2200/1400`,
    alt: "Rotierendes Landschaftsbild",
    category: index % 2 === 0 ? "Natur" : "Reiseziele",
    source: "Lorem Picsum",
    photographer: "Oeffentliche Bildquelle",
    title: "Zufallsbild"
  }));
}

function unsplashLocation(photo: UnsplashPhoto): string | undefined {
  const values = [photo.location?.name, photo.location?.city, photo.location?.country]
    .filter((value): value is string => Boolean(value && value.trim()));
  return Array.from(new Set(values)).join(", ") || undefined;
}

async function loadUnsplash(categories: string[]) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];
  const query = categories.slice(0, 3).join(" ") || "minimal nature";
  const photos = await fetchJson<UnsplashPhoto[]>(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&count=18&client_id=${key}`
  );
  return photos.map((photo) => ({
    id: photo.id,
    url: photo.urls.regular,
    alt: photo.alt_description || query,
    category: query,
    source: "Unsplash",
    photographer: photo.user.name,
    location: unsplashLocation(photo),
    title: photo.alt_description || query,
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
      photographer: data.copyright,
      title: data.title,
      location: "NASA Astronomy Picture of the Day"
    }
  ];
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return optionsResponse();

  const categories = (event.queryStringParameters?.categories ?? "")
    .split(",")
    .map((category) => category.trim())
    .filter(Boolean);
  const freshness = event.queryStringParameters?.freshness || new Date().toISOString().slice(0, 13);

  try {
    const [unsplash, nasa] = await Promise.allSettled([loadUnsplash(categories), loadNasaIfNeeded(categories)]);
    const live = [
      ...(unsplash.status === "fulfilled" ? unsplash.value : []),
      ...(nasa.status === "fulfilled" ? nasa.value : [])
    ];
    return json(200, [...live, ...curatedImages(categories, freshness), ...rotatingOpenImages(categories, freshness)].slice(0, 36), 300);
  } catch {
    return json(200, [...curatedImages(categories, freshness), ...rotatingOpenImages(categories, freshness)].slice(0, 36), 120);
  }
};
