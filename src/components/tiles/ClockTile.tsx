import { formatDate, formatTime, greetingFor } from "../../utils/date";
import type { TileSize } from "../../types/content";
import { useNow } from "../../hooks/useNow";
import { TileFrame } from "./TileFrame";

interface ClockTileProps {
  size: TileSize;
  userName?: string;
  withDate?: boolean;
  withGreeting?: boolean;
}

export function ClockTile({ size, userName = "", withDate = false, withGreeting = false }: ClockTileProps) {
  const now = useNow();
  return (
    <TileFrame size={size} className="clock-tile" ariaLabel="Uhrzeit">
      {withGreeting && <p className="eyebrow">{greetingFor(now, userName)}</p>}
      <time className="clock-time" dateTime={now.toISOString()}>
        {formatTime(now)}
      </time>
      {withDate && <p className="clock-date">{formatDate(now)}</p>}
    </TileFrame>
  );
}
