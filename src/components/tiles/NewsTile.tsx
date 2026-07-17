import { formatRelativeTime } from "../../utils/date";
import type { NewsItem, TileSize } from "../../types/content";
import { TileFrame } from "./TileFrame";

interface NewsTileProps {
  size: TileSize;
  items: NewsItem[];
  index: number;
  label: string;
}

function formatPublishedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("de-CH", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function newsMeta(item: NewsItem): string[] {
  return [
    item.source,
    item.domain,
    item.author ? `Autor: ${item.author}` : "",
    ...((item.tags?.length ? item.tags : [item.category]).filter(Boolean)),
    formatPublishedAt(item.publishedAt)
  ].filter((value, index, values): value is string => Boolean(value) && values.indexOf(value) === index);
}

export function NewsTile({ size, items, index, label }: NewsTileProps) {
  const item = items.length ? items[index % items.length] : undefined;

  if (!item) {
    return (
      <TileFrame size={size} className="tile-muted">
        <p className="eyebrow">{label}</p>
        <h2 className="tile-title-small">Neue Nachrichten konnten nicht geladen werden</h2>
      </TileFrame>
    );
  }

  const showImage = size !== "small" && item.image;
  return (
    <TileFrame size={size} className={`news-tile ${showImage ? "has-media" : ""}`} ariaLabel={item.title}>
      {showImage && <img src={item.image} alt="" loading="lazy" />}
      <div className="news-content">
        <p className="eyebrow">
          {item.source} · {formatRelativeTime(item.publishedAt)}
        </p>
        <h2 className={size === "small" ? "tile-title-small" : "tile-title"}>{item.title}</h2>
        {size === "large" && <p className="tile-copy">{item.description}</p>}
      </div>
    </TileFrame>
  );
}

export function NewsFullscreenView({ items, index, label }: Omit<NewsTileProps, "size">) {
  const item = items.length ? items[index % items.length] : undefined;
  if (!item) return <NewsTile size="fullscreen" items={items} index={index} label={label} />;

  return (
    <TileFrame size="fullscreen" className={`news-fullscreen ${item.image ? "has-background" : ""}`} ariaLabel={item.title} flush>
      {item.image && <img src={item.image} alt="" loading="lazy" />}
      <div className="fullscreen-copy">
        <p className="eyebrow">
          {label} · {item.source} · {formatRelativeTime(item.publishedAt)}
        </p>
        <h1>{item.title}</h1>
        {item.description && <p>{item.description}</p>}
        <div className="news-meta-row">
          {newsMeta(item).map((meta) => (
            <span key={meta}>{meta}</span>
          ))}
          <span>{formatRelativeTime(item.publishedAt)}</span>
        </div>
      </div>
    </TileFrame>
  );
}
