import type { ImageItem, TileSize } from "../../types/content";
import { TileFrame } from "./TileFrame";

interface ImageTileProps {
  size: TileSize;
  images: ImageItem[];
  index: number;
  category: "nature" | "car" | "space";
  label: string;
}

function pickImage(images: ImageItem[], category: ImageTileProps["category"], index: number): ImageItem | undefined {
  const keywords = {
    nature: ["Natur", "Berge", "Seen", "Waelder", "Wälder", "Meer", "Schnee", "Winter", "Sonnen"],
    car: ["Porsche", "Sportwagen", "Autos", "Motorsport", "Fahrzeuge", "Motorraeder", "Motorräder"],
    space: ["Weltraum", "Planeten", "Galaxien", "Nebel"]
  }[category];
  const filtered = images.filter((image) => keywords.some((word) => image.category.toLowerCase().includes(word.toLowerCase())));
  const pool = filtered.length ? filtered : images;
  return pool.length ? pool[index % pool.length] : undefined;
}

function ImageTile({ size, images, index, category, label }: ImageTileProps) {
  const timeBucket = Math.floor(Date.now() / (1000 * 20));
  const image = pickImage(images, category, index + timeBucket);
  if (!image) {
    return (
      <TileFrame size={size} className="tile-muted">
        <p className="eyebrow">{label}</p>
        <h2 className="tile-title-small">Bilder konnten nicht geladen werden</h2>
      </TileFrame>
    );
  }

  const title = image.location ?? image.title ?? image.category;
  const detail = [image.title && image.title !== image.location ? image.title : "", image.category].filter(Boolean).join(" / ");

  return (
    <TileFrame size={size} className="image-tile" ariaLabel={image.alt} flush>
      <img src={image.url} alt={image.alt} loading="lazy" />
      <div className="image-caption">
        <div>
          <strong>{title}</strong>
          {detail && <span>{detail}</span>}
        </div>
        <div>
          <strong>{image.source}</strong>
          <span>{image.photographer ?? "Bildquelle"}</span>
        </div>
      </div>
    </TileFrame>
  );
}

export function NatureImageTile(props: Omit<ImageTileProps, "category" | "label">) {
  return <ImageTile {...props} category="nature" label="Naturbild" />;
}

export function CarImageTile(props: Omit<ImageTileProps, "category" | "label">) {
  return <ImageTile {...props} category="car" label="Autobild" />;
}

export function SpaceImageTile(props: Omit<ImageTileProps, "category" | "label">) {
  return <ImageTile {...props} category="space" label="Weltraumbild" />;
}
