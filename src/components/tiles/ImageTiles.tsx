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
    nature: ["Natur", "Berge", "Seen", "Wälder", "Meer", "Schnee", "Winter", "Sonnen"],
    car: ["Porsche", "Sportwagen", "Autos", "Motorsport", "Fahrzeuge", "Motorräder"],
    space: ["Weltraum", "Planeten", "Galaxien", "Nebel"]
  }[category];
  const filtered = images.filter((image) => keywords.some((word) => image.category.toLowerCase().includes(word.toLowerCase())));
  const pool = filtered.length ? filtered : images;
  return pool.length ? pool[index % pool.length] : undefined;
}

function ImageTile({ size, images, index, category, label }: ImageTileProps) {
  const image = pickImage(images, category, index);
  if (!image) {
    return (
      <TileFrame size={size} className="tile-muted">
        <p className="eyebrow">{label}</p>
        <h2 className="tile-title-small">Bilder konnten nicht geladen werden</h2>
      </TileFrame>
    );
  }

  return (
    <TileFrame size={size} className="image-tile" ariaLabel={image.alt} flush>
      <img src={image.url} alt={image.alt} loading="lazy" />
      <div className="image-caption">
        <span>{image.category}</span>
        <span>{[image.source, image.photographer].filter(Boolean).join(" · ")}</span>
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
