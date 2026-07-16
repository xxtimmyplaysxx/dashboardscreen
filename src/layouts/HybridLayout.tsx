import type { ReactNode } from "react";
import type { DashboardTile } from "../types/dashboard";
import { LayoutCanvas } from "./LayoutCanvas";

export function HybridLayout({ tiles, renderTile }: { tiles: DashboardTile[]; renderTile: (tile: DashboardTile) => ReactNode }) {
  return <LayoutCanvas layout="hybrid" tiles={tiles} renderTile={renderTile} />;
}
