import { useNow } from "../../hooks/useNow";
import { formatDate, formatShortDate } from "../../utils/date";
import type { TileSize } from "../../types/content";
import { TileFrame } from "./TileFrame";

export function DateTile({ size }: { size: TileSize }) {
  const now = useNow(60000);
  return (
    <TileFrame size={size} className="date-tile" ariaLabel="Datum">
      <p className="eyebrow">Heute</p>
      <h2 className="tile-title">{size === "small" ? formatShortDate(now) : formatDate(now)}</h2>
    </TileFrame>
  );
}
