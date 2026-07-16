import { useNow } from "../../hooks/useNow";
import { greetingFor } from "../../utils/date";
import type { TileSize } from "../../types/content";
import { TileFrame } from "./TileFrame";

export function GreetingTile({ size, userName }: { size: TileSize; userName: string }) {
  const now = useNow(60000);
  return (
    <TileFrame size={size} className="greeting-tile" ariaLabel="Persönliche Begrüssung">
      <p className="eyebrow">Willkommen</p>
      <h2 className="tile-title">{greetingFor(now, userName)}</h2>
      {size !== "small" && <p className="tile-copy">Dein Dashboard ist bereit für den Tag.</p>}
    </TileFrame>
  );
}
