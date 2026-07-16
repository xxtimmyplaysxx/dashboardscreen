import type { ReactNode } from "react";
import type { TileSize } from "../../types/content";

interface TileFrameProps {
  children: ReactNode;
  size: TileSize;
  className?: string;
  ariaLabel?: string;
  flush?: boolean;
}

export function TileFrame({ children, size, className = "", ariaLabel, flush = false }: TileFrameProps) {
  return (
    <section className={`tile tile-${size} ${flush ? "tile-flush" : ""} ${className}`} aria-label={ariaLabel}>
      {children}
    </section>
  );
}
