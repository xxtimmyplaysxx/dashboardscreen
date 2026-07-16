import type { TileSize } from "../../types/content";
import { TileFrame } from "./TileFrame";

export function ErrorTile({ message, size = "medium" }: { message: string; size?: TileSize }) {
  return (
    <TileFrame size={size} className="tile-muted" ariaLabel={message}>
      <p className="eyebrow">Hinweis</p>
      <h2 className="tile-title-small">{message}</h2>
    </TileFrame>
  );
}
