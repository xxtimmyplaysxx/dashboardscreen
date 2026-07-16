import type { ReactNode } from "react";
import type { DashboardTile, LayoutTemplate } from "../types/dashboard";
import { LAYOUT_DEFINITIONS } from "./layoutDefinitions";

interface LayoutCanvasProps {
  layout: LayoutTemplate;
  tiles: DashboardTile[];
  renderTile: (tile: DashboardTile) => ReactNode;
}

export function LayoutCanvas({ layout, tiles, renderTile }: LayoutCanvasProps) {
  const definition = LAYOUT_DEFINITIONS[layout];
  const tileMap = new Map(tiles.map((tile) => [tile.id, tile]));

  return (
    <div className={`dashboard-layout layout-${layout}`}>
      {definition.slots.map((slot) => {
        const tile = tileMap.get(slot.id) ?? tiles[0];
        return (
          <div className={`tile-slot ${slot.className}`} key={slot.id}>
            {tile ? renderTile(tile) : null}
          </div>
        );
      })}
    </div>
  );
}
