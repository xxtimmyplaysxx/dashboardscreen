import type { ReactNode } from "react";
import type { DashboardTile } from "../types/dashboard";
import { LayoutCanvas } from "./LayoutCanvas";

export function BalancedGridLayout({ tiles, renderTile }: { tiles: DashboardTile[]; renderTile: (tile: DashboardTile) => ReactNode }) {
  return <LayoutCanvas layout="balanced-grid" tiles={tiles} renderTile={renderTile} />;
}
