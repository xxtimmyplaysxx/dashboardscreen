import type { TextSnippet, TileSize } from "../../types/content";
import { TileFrame } from "./TileFrame";

export function FactTile({ size, facts, index }: { size: TileSize; facts: TextSnippet[]; index: number }) {
  const fact = facts[index % facts.length];
  return (
    <TileFrame size={size} className="text-feature-tile" ariaLabel="Fakt des Tages">
      <p className="eyebrow">Fakt des Tages</p>
      <blockquote>{fact.text}</blockquote>
    </TileFrame>
  );
}
