import type { TileSize } from "../../types/content";
import { TileFrame } from "./TileFrame";

export function LoadingTile({ size = "medium" }: { size?: TileSize }) {
  return (
    <TileFrame size={size} className="tile-loading" ariaLabel="Inhalt wird geladen">
      <div className="skeleton-line skeleton-wide" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-short" />
    </TileFrame>
  );
}
