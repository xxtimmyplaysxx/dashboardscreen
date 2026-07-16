import type { TextSnippet, TileSize } from "../../types/content";
import { TileFrame } from "./TileFrame";

export function QuoteTile({ size, quotes, index }: { size: TileSize; quotes: TextSnippet[]; index: number }) {
  const quote = quotes[index % quotes.length];
  return (
    <TileFrame size={size} className="text-feature-tile" ariaLabel="Zitat">
      <p className="eyebrow">Zitat</p>
      <blockquote>{quote.text}</blockquote>
      {quote.author && <cite>{quote.author}</cite>}
    </TileFrame>
  );
}
